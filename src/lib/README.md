# lib/

**Configuração de dependências externas**: clientes inicializados,
providers, instâncias singleton.

Conteúdo atual:

- `supabase.ts` — cliente Supabase configurado com env vars
- `queryClient.ts` — instância `QueryClient` do TanStack Query

## O que NÃO vai aqui

- Funções utilitárias puras (formatters, helpers) → `utils/` quando
  aparecerem
- Tipos de domínio → ficam na feature respectiva
- Hooks → `hooks/` (ou `features/<x>/hooks/`)
