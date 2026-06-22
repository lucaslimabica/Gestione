# 03 — React Query provider

## Contexto

A app vai ler e escrever dados em Supabase (e potencialmente outras
APIs). Há dois tipos de estado a gerir:

| Tipo             | Quem é dono           | Exemplo                                   |
| ---------------- | --------------------- | ----------------------------------------- |
| **Client state** | A app no browser      | sidebar aberta/fechada, tema, form a meio |
| **Server state** | O servidor (Supabase) | lista de tarefas, perfil do utilizador    |

Tratá-los da mesma forma é um erro clássico. Server state tem
problemas específicos que client state não tem:

- Pode ficar **stale** (alguém mudou no servidor enquanto o teu
  browser dormia)
- Precisa de **cache** (não queres refetch a cada navegação)
- Precisa de **deduplicação** (3 componentes a pedir o mesmo dado =
  1 chamada de rede)
- Precisa de **invalidação** (depois de criar uma tarefa, a lista
  tem de atualizar)
- Tem **estados** (loading, error, success) que se repetem em
  todo o lado

Resolver isto à mão (`useEffect` + `useState` + flag de loading)
funciona, mas reinventas a mesma roda em cada componente.

## Decisão

Usamos **TanStack Query** (antes "React Query") como camada de
sincronização entre o servidor e a UI:

- Um único `QueryClient` global (`src/lib/queryClient.ts`)
- Um `<QueryClientProvider>` no topo da árvore (`src/main.tsx`)
- `<ReactQueryDevtools>` ao lado, dev-only automaticamente

Configuração atual:

```ts
new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1 * 60 * 1000, // 1 min
            gcTime: 5 * 60 * 1000, // 5 min
            retry: 1,
        },
    },
});
```

## Modelo mental

A peça mental mais importante: **o cache do React Query é um
snapshot do servidor, não a fonte de verdade**. A fonte de verdade
continua a ser o Supabase. O cache só existe para:

1. Mostrar dados imediatamente em vez de esperar pela rede
2. Evitar pedir o mesmo duas vezes
3. Saber quando vale a pena ir buscar de novo

Quando algo muda no servidor (uma mutation), tu **invalidas** a key
correspondente — não escreves manualmente no cache. O React Query
trata do refetch.

```
                ┌──────────────┐
                │   Supabase   │  ← fonte de verdade
                └──────┬───────┘
                       │
              fetch    │   invalidate
                       ▼
                ┌──────────────┐
                │ Query cache  │  ← snapshot local
                └──────┬───────┘
                       │
                       ▼
                ┌──────────────┐
                │  Componentes │  ← consomem via useQuery
                └──────────────┘
```

## Opções por defeito — porquê estes valores

### `staleTime: 1 minuto`

Tempo até o React Query considerar os dados "stale" (passíveis de
refetch automático).

- `0` (default) → refetch a cada mount, cada foco de janela, cada
  reconnect. Conservador mas barulhento.
- `1 min` → 60s de tranquilidade antes de a app começar a
  re-validar em background.
- `Infinity` → nunca refetch sozinho. Bom para dados que só mudam
  por mutation.

1 minuto é o nosso meio-termo conservador. Subimos quando virmos
que um endpoint específico não muda quase nunca, descemos quando
queremos quase real-time.

### `gcTime: 5 minutos`

Antes chamava-se `cacheTime`. É **diferente** de `staleTime`:

- `staleTime` — quando re-pedir
- `gcTime` — quando esquecer (libertar memória) se ninguém estiver
  a usar a query

Se uma query fica sem componentes a observá-la, fica em modo
"inactive" e o timer de `gcTime` começa. No fim, o cache é
descartado.

5 min cobre o caso típico de "utilizador volta a uma página onde
esteve há pouco" — vê os dados em cache e ao mesmo tempo o React
Query faz refetch em background se estiverem stale.

### `retry: 1`

Default é 3. Em dev, 3 retries em cima de um erro é só ruído na
consola. 1 chega. Em produção podes querer voltar a 3 com backoff
exponencial (já é o default da biblioteca).

### Opções que NÃO mexemos (defaults aceites)

| Opção                  | Default | Porquê manter                                    |
| ---------------------- | ------- | ------------------------------------------------ |
| `refetchOnWindowFocus` | `true`  | Útil — utilizador volta ao tab, vê dados frescos |
| `refetchOnReconnect`   | `true`  | Útil — após perda de rede, re-valida             |
| `refetchOnMount`       | `true`  | Útil — montar componente verifica se está stale  |

Estes três combinados é que tornam o React Query "mágico". Não
desligar sem motivo.

## Como NÃO usar

### ❌ Pôr server state no Zustand

```ts
// Errado
const useTasks = create((set) => ({
    tasks: [],
    fetchTasks: async () => {
        const { data } = await supabase.from('tasks').select();
        set({ tasks: data });
    },
}));
```

Isto é reinventar metade do React Query, mal. Sem cache TTL, sem
deduplicação, sem invalidação, sem refetch em foco. Server state
vai sempre para o React Query.

Zustand fica para **client state** (UI, preferências, forms longos).

### ❌ `useEffect` + `fetch` manual

```ts
// Errado
useEffect(() => {
  setLoading(true)
  fetch('/api/tasks').then(...).finally(() => setLoading(false))
}, [])
```

Mesmo problema: estás a reinventar caching, loading state,
cancellation, error handling. Usa `useQuery`.

### ❌ Escrever no cache à mão depois de uma mutation

```ts
// Quase sempre errado
queryClient.setQueryData(['tasks'], (old) => [...old, newTask]);
```

Funciona, mas é frágil — duplicas a lógica do servidor no cliente.
A regra é **invalidar e deixar refetch**:

```ts
queryClient.invalidateQueries({ queryKey: ['tasks'] });
```

Otimismo de UI (`setQueryData` antes de a request acabar) só vale
a pena para casos específicos de UX — não como default.

## DevTools

`@tanstack/react-query-devtools` adiciona um botão flutuante no canto
da página em dev. Mostra:

- Todas as queries activas, com o seu estado (fresh, fetching, stale,
  inactive)
- O conteúdo do cache de cada uma
- Botões para forçar refetch / invalidate / remove

Importante: o bundle de produção **não inclui** as DevTools — o
package é tree-shakeable e o módulo importado é um stub vazio em
produção.

## Padrões para o futuro

Quando uma feature precisar de dados:

```ts
// features/tasks/api.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

const tasksKey = ['tasks'] as const;

export function useTasks() {
    return useQuery({
        queryKey: tasksKey,
        queryFn: async () => {
            const { data, error } = await supabase.from('tasks').select();
            if (error) throw error;
            return data;
        },
    });
}

export function useCreateTask() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (input: NewTask) => {
            const { error } = await supabase.from('tasks').insert(input);
            if (error) throw error;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: tasksKey }),
    });
}
```

**Convenções a manter:**

- Query keys como arrays tipados (`['tasks', userId]`), nunca strings
- Cada feature tem o seu `api.ts` que exporta hooks (`useTasks`,
  `useCreateTask`)
- `queryFn` faz `throw` em erro — o React Query trata
- Mutations invalidam keys no `onSuccess`

## Como replicar noutro projeto

1. `npm i @tanstack/react-query`
2. `npm i -D @tanstack/react-query-devtools`
3. Criar `src/lib/queryClient.ts` com a instância única
4. Envolver `<App />` com `<QueryClientProvider>` em `src/main.tsx`
5. Adicionar `<ReactQueryDevtools />` ao lado (mesmo provider)
6. Em cada feature, criar `features/<x>/api.ts` com os hooks

## Referências

- [TanStack Query — Overview](https://tanstack.com/query/latest/docs/framework/react/overview)
- [TanStack Query — Important Defaults](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults)
- [Practical React Query — Dominik (TkDodo)](https://tkdodo.eu/blog/practical-react-query)
- [Effective React Query Keys — Dominik](https://tkdodo.eu/blog/effective-react-query-keys)
