# 01 — Estrutura de pastas

## Contexto

Com apenas `App.tsx` e `main.tsx` na raiz de `src/`, o projeto não
escala. Antes de adicionar routing, auth e features, é preciso decidir
**onde cada tipo de código vai viver**.

## Decisão

Adotamos uma estrutura **feature-first com camadas partilhadas**:

```
src/
├── assets/         # Imagens, SVGs estáticos importados via bundler
├── components/     # Componentes UI reutilizáveis e agnósticos de domínio
│                   #   ex.: <Button>, <Modal>, <Input>
├── features/       # Código agrupado por domínio de negócio
│   └── <feature>/  #   cada feature pode ter:
│       ├── components/   # componentes só dessa feature
│       ├── hooks/        # hooks só dessa feature
│       ├── api.ts        # chamadas Supabase / React Query da feature
│       └── types.ts      # tipos do domínio
├── hooks/          # Hooks partilhados entre features (ex.: useDebounce)
├── lib/            # Clientes e configuração de libs externas
│                   #   ex.: supabase.ts, queryClient.ts
├── routes/         # Componentes de página + configuração do router
├── stores/         # Stores Zustand globais (UI, preferências, etc.)
├── App.tsx         # Root component (providers + router outlet)
├── main.tsx        # Entry point (mount React)
└── index.css       # Estilos globais + @import tailwind
```

## Porquê

### Feature-first em vez de type-first

A alternativa clássica é organizar **por tipo**:

```
src/
├── components/   # todos os componentes da app
├── hooks/        # todos os hooks
├── api/          # todas as chamadas a backend
```

Funciona em apps pequenas, mas em apps reais cria três problemas:

1. **Acoplamento invisível** — ver onde uma feature começa e acaba
   exige procurar em N pastas.
2. **Refactor doloroso** — mover/remover uma feature obriga a caçar
   ficheiros espalhados.
3. **Conflito de nomes** — `useUser` em `hooks/` pode pertencer a auth,
   a admin, ou às duas.

Feature-first inverte isto: o que muda junto, vive junto.

### Mas mantemos `components/`, `hooks/`, `lib/` partilhados

Nem tudo é de uma feature. Um `<Button>` ou um `useDebounce` são
verdadeiramente transversais. Esses ficam nas pastas top-level.

**Regra prática**: começa por colocar dentro de `features/<x>/`. Se
descobrires que uma segunda feature precisa do mesmo, **só então**
promove para o top-level.

### `lib/` vs `utils/`

Escolhemos `lib/` para **configuração de dependências externas**
(cliente Supabase, QueryClient). Se aparecer código utilitário puro
(formatadores, helpers), criamos `utils/` mais tarde — não cabe em
`lib/`.

### `routes/` separado de `features/`

Uma página normalmente **compõe** features, não é uma feature em si.
Manter `routes/` separado deixa claro:

- `routes/Dashboard.tsx` → orquestra
- `features/tasks/`, `features/projects/` → fornecem o conteúdo

## Como replicar noutro projeto

1. Criar a árvore de pastas vazia.
2. Adicionar um `README.md` curto em cada uma a explicar o propósito
   (impede que se torne dump de ficheiros aleatórios).
3. Não criar `features/<x>/` em branco — criar quando aparece a
   primeira feature real. Pastas vazias só ruído.
4. Manter o alias `@/*` → `src/*` para imports absolutos consistentes
   (ver config do TypeScript + Vite + ESLint).

## Referências

- [Bulletproof React — folder structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)
- [Kent C. Dodds — Colocation](https://kentcdodds.com/blog/colocation)
