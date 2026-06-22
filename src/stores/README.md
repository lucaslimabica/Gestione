# stores/

Stores **Zustand globais** — state cliente que precisa de ser
partilhado entre features sem prop drilling.

Exemplos típicos:

- `uiStore.ts` — sidebar aberta, tema, modais globais
- `preferencesStore.ts` — preferências do utilizador persistidas

## Quando NÃO usar uma store

- **Server state** (dados do Supabase) → usa React Query, não Zustand
- **State local de um componente** → `useState`
- **State só de uma feature** → `features/<x>/` (pode ser um store
  Zustand local à feature)
