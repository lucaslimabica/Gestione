# 05 — Routing (React Router v7)

## Contexto

A app tem várias páginas (home, customers, processes, settings, ...)
e precisa de routing client-side. Três decisões abertas no arranque:

- **Data router** (`createBrowserRouter`) vs **declarative**
  (`<BrowserRouter>` + `<Routes>`)?
- Configuração **centralizada** num só ficheiro vs **descentralizada**
  por feature?
- **Eager** (tudo no bundle inicial) ou **lazy** (cada rota carregada
  on-demand)?

## Decisão

Quatro escolhas, todas documentadas neste doc:

| Eixo                 | Escolha                                 | Razão curta                                                   |
| -------------------- | --------------------------------------- | ------------------------------------------------------------- |
| API                  | **Data router** (`createBrowserRouter`) | Error boundary por rota, lazy nativo, mais expressivo         |
| Data layer das rotas | **Sem loaders/actions**                 | React Query é a única fonte de server state                   |
| Topologia            | **Descentralizada por feature**         | Cada feature exporta as suas rotas; o router global só agrega |
| Code splitting       | **Lazy em todas as rotas**              | Bundle inicial não cresce com o número de páginas             |

## Anatomia dos ficheiros

| Ficheiro                            | Papel                                                             |
| ----------------------------------- | ----------------------------------------------------------------- |
| `src/routes/routes.tsx`             | Agregador global — chama `createBrowserRouter` e exporta `router` |
| `src/routes/RootLayout.tsx`         | Componente da rota raiz; renderiza `<Outlet />` (futuro shell)    |
| `src/routes/Home.tsx`               | Página `/`                                                        |
| `src/routes/NotFound.tsx`           | Página catch-all `*`                                              |
| `src/routes/RouteErrorBoundary.tsx` | `errorElement` global do subtree                                  |
| `src/features/<x>/routes.tsx`       | Config de rotas da feature (`RouteObject[]`)                      |
| `src/features/<x>/routes/`          | Componentes de página da feature                                  |
| `src/main.tsx`                      | Substitui `<App />` por `<RouterProvider router={router} />`      |

## Modelo mental

```
                <RouterProvider router={router} />
                              │
                              ▼
                       matches URL against config
                              │
                              ▼
                       <RootLayout />            ← parent route element
                              │
                       renders <Outlet />
                              │
                              ▼
                  matched child route component  ← Home, CustomersListPage, ...
```

`<Outlet />` é o "buraco" no layout pai onde o React Router insere o
componente da rota filha. É como um `{children}` mas controlado pelo
router em vez de pelo pai.

## Data Router vs Declarative — porquê data

|                         | Data Router                          | Declarative                          |
| ----------------------- | ------------------------------------ | ------------------------------------ |
| Config                  | Objeto único (`createBrowserRouter`) | JSX espalhado pela árvore            |
| Error boundary por rota | ✅ nativo (`errorElement`)           | ❌ tens de wrappar manualmente       |
| Lazy loading            | ✅ campo `lazy` em cada rota         | Precisa de `React.lazy` + `Suspense` |
| Loaders/actions         | ✅ disponíveis                       | ❌                                   |
| Setup inicial           | Mais ceremónia                       | Mais simples                         |

A ceremónia extra paga-se uma vez no `routes.tsx` e já não voltas a
mexer. As features depois exportam só `RouteObject[]` — fica mais
limpo que `<Route>` JSX espalhado.

## Loaders/actions — porque NÃO os usamos

O data router permite servir dados via `loader`:

```ts
// O que NÃO fazemos:
{
  path: 'customers',
  loader: async () => {
    const { data } = await supabase.from('customers').select()
    return data
  },
  Component: CustomersListPage,
}
```

Isto competiria com o React Query como fonte de server state. Dois
problemas:

1. **Duplicação de cache** — o loader devolve dados, o React Query
   também os pode buscar e fica com versão diferente em cache.
2. **Perdes refetch on focus, invalidação, deduplicação** — features
   que o React Query traz e o loader não.

Decisão: **routes só fazem routing**. Componentes pedem dados aos
hooks de `features/<x>/api.ts` (React Query). Single source of truth
para server state.

## Descentralização — porquê

Alinha com a regra do doc 01 ("o que muda junto, vive junto"):

```tsx
// src/features/customers/routes.tsx
export const customersRoutes: RouteObject[] = [
    {
        path: 'customers',
        lazy: async () => {
            const { CustomersListPage } =
                await import('@/features/customers/routes/CustomersListPage');
            return { Component: CustomersListPage };
        },
    },
];
```

```tsx
// src/routes/routes.tsx
import { customersRoutes } from '@/features/customers/routes';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        errorElement: <RouteErrorBoundary />,
        children: [
            { index: true, lazy: homeLazy },
            ...customersRoutes, // ← uma linha por feature
            { path: '*', lazy: notFoundLazy },
        ],
    },
]);
```

Adicionar feature = uma linha. Apagar feature = apagar pasta + remover
a linha. O `routes.tsx` global cresce só com **secções top-level**
(raras) — não com cada página nova.

## Lazy loading — porquê desde o dia 1

```ts
lazy: async () => {
    const { Home } = await import('@/routes/Home');
    return { Component: Home };
};
```

Vantagens:

- **Bundle inicial enxuto** — só vai o que precisas para a página atual
- **Code splitting automático** — o Vite cria um chunk por `import()`
  dinâmico
- **Mesmo padrão em todas as rotas** — não é "lazy nas grandes, eager
  nas pequenas"; é sempre lazy, sem decisão a tomar

Custo zero hoje (não há rotas grandes), benefício gratuito amanhã.

## Named exports — porque são (quase) obrigatórios para lazy

Com named exports a desestruturação é directa:

```ts
const { Home } = await import('@/routes/Home');
return { Component: Home };
```

Com default exports terias:

```ts
const Home = (await import('@/routes/Home')).default;
return { Component: Home };
```

Funciona, mas é mais feio e ambíguo. Razões extra para named:

1. **Refactor**: renomear o componente no editor actualiza todos os
   imports. Default exports não têm nome canónico — cada importador
   pode chamar diferente.
2. **Tipos consistentes**: `import type { Home }` vs `import type Home`.
3. **Autocomplete fiável**: o IDE sugere o nome real.

**Convenção do projeto**: componentes de rota são sempre named exports.

## Error boundary — o que apanha e o que não

`RouteErrorBoundary` apanha:

- Erros lançados durante o `import()` dinâmico do `lazy`
- Erros lançados pelo componente da rota durante render
- (Se usássemos loaders/actions) erros desses

**NÃO** apanha:

- Erros em event handlers (`onClick`, `onSubmit`) — precisam try/catch
- Erros em `useEffect` / async dentro de componentes — idem
- Erros do React Query — esses chegam ao componente via `query.error`
  e tratam-se localmente

Para erros que escapam ao router, ainda podes envolver subtree em
`<ErrorBoundary>` (lib externa, ex.: `react-error-boundary`). Não temos
isso instalado ainda — adicionar quando aparecer a necessidade.

## Convenções deste projeto

- **Agregador global** em `src/routes/routes.tsx`. Export: `router`.
- **Cada feature** com um par:
    - `features/<x>/routes.tsx` — config (`RouteObject[]`)
    - `features/<x>/routes/` — componentes de página (ficheiros tipo
      `XListPage.tsx`, `XDetailPage.tsx`)
- **Named exports** em todos os componentes de rota
- **Lazy em todas as rotas**, mesmo as pequenas
- **404 (`path: '*'`) sempre por último** no array de children
- **Não usar loaders/actions** — dados vêm dos hooks da feature

## Adicionar uma nova feature ao router

Sequência completa para uma feature "invoices":

```bash
mkdir -p src/features/invoices/routes
```

```tsx
// src/features/invoices/routes/InvoicesListPage.tsx
export function InvoicesListPage() {
    return <div>Invoices</div>;
}
```

```tsx
// src/features/invoices/routes.tsx
import type { RouteObject } from 'react-router-dom';

export const invoicesRoutes: RouteObject[] = [
    {
        path: 'invoices',
        lazy: async () => {
            const { InvoicesListPage } =
                await import('@/features/invoices/routes/InvoicesListPage');
            return { Component: InvoicesListPage };
        },
    },
];
```

```tsx
// src/routes/routes.tsx — adicionar 2 linhas
import { invoicesRoutes } from '@/features/invoices/routes'
// ...
children: [
  // ...
  ...invoicesRoutes,    // ← aqui
  { path: '*', ... },
],
```

Pronto. Visita `/invoices` no browser.

## Pitfalls comuns

- **`<a href="/customers">` em vez de `<Link to="/customers">`** —
  causa full reload da página. Sempre `<Link>` (ou `<NavLink>` se
  quiseres estado activo).
- **Esquecer `errorElement`** — erros tornam-se silenciosos ou
  rebentam o ecrã todo em vez de mostrarem fallback.
- **Default export numa página com `lazy`** — funciona se
  desestruturares `.default` mas é feio. Manter named.
- **Importar página eager só por causa de um tipo** — usa
  `import type { ... }` para tipos, mantém `lazy` para o componente.
- **404 (`path: '*'`) no meio do array** — o matcher escolhe a
  primeira correspondência. `*` matcha tudo, por isso tem de ser
  o último.
- **Adicionar `customersRoutes` ao array de cima sem `...`** —
  ficaria como entrada única em vez de espalhar as suas rotas. O
  spread é obrigatório.

## Como replicar noutro projeto

1. `npm i react-router-dom` (v7+)
2. Criar `src/routes/` com:
    - `routes.tsx` (agregador, exporta `router`)
    - `RootLayout.tsx` (com `<Outlet />`)
    - `Home.tsx`, `NotFound.tsx`, `RouteErrorBoundary.tsx`
3. Em `src/main.tsx`, substituir `<App />` por
   `<RouterProvider router={router} />`
4. Apagar `App.tsx` e `App.css` (o RootLayout substitui-os)
5. Para cada feature: criar `features/<x>/routes.tsx` +
   `features/<x>/routes/<X>Page.tsx`
6. Espalhar `...<x>Routes` no `routes.tsx` global
7. Trocar `<a>` por `<Link>` em todo o lado onde há navegação interna

## Referências

- [React Router v7 — `createBrowserRouter`](https://reactrouter.com/en/main/routers/create-browser-router)
- [React Router v7 — `errorElement`](https://reactrouter.com/en/main/route/error-element)
- [React Router v7 — Lazy Loading](https://reactrouter.com/en/main/route/lazy)
- [Kent C. Dodds — "Why I love React Router v6+"](https://kentcdodds.com/blog/how-to-react-router-loader)
