# 04 — Cliente Supabase

## Contexto

A app fala com Supabase para tudo o que é persistência: auth,
tabelas, storage. Precisamos de:

- Um **único cliente** partilhado em todo o lado (várias instâncias
  desincronizam o estado de auth e duplicam listeners)
- **Tipagem** do schema — sem ela, `.from('cards').select()` devolve
  `any[]` e perdemos a maior vantagem do TypeScript
- Um pipeline para **regenerar tipos** sempre que o schema muda
- **Zero configuração no código** — tudo o que muda entre máquinas/
  projetos vive no `.env.local`. Clonar o template = `cp .env.example
.env.local`, preencher, e arrancar

## Decisão

Quatro peças:

| Ficheiro                           | Papel                                                    |
| ---------------------------------- | -------------------------------------------------------- |
| `src/lib/supabase.ts`              | Singleton tipado, ponto único de import                  |
| `src/lib/database.types.ts`        | Tipos do schema, **gerados automaticamente**             |
| `scripts/gen-db-types.mjs`         | Script Node que invoca o CLI Supabase lendo `.env.local` |
| `package.json` (script `db:types`) | Atalho — `npm run db:types`                              |

Regra de uso:

```ts
// ❌ Em qualquer parte da app
const client = createClient(url, key);

// ✅
import { supabase } from '@/lib/supabase';
```

## Modelo mental do Supabase

Não é uma "API REST tradicional" desenhada à mão. É o teu Postgres
exposto por dois serviços:

| Camada        | O que faz                                                                     |
| ------------- | ----------------------------------------------------------------------------- |
| **PostgREST** | Traduz HTTP em SQL. `supabase.from('cards').select()` → `SELECT * FROM cards` |
| **GoTrue**    | Auth — emite JWTs, gere sessões, magic links, OAuth                           |
| **Storage**   | Ficheiros (S3-compatible API)                                                 |
| **Realtime**  | Subscriptions a alterações em tabelas via WebSocket                           |

O cliente JS é um wrapper conveniente sobre estas APIs HTTP. Tudo o
que fazes via `supabase.from(...)` acaba como SQL no teu Postgres.
Isto tem uma consequência crítica:

## RLS é a tua segurança — leva isto a sério

A **publishable key** (antes "anon key") é desenhada para ser pública.
Aparece no bundle, em DevTools, em network requests. Qualquer pessoa
pode pegar nela.

> Se a única coisa que protege a tua DB é "ninguém sabe a key",
> não tens segurança nenhuma.

O que te protege é **Row Level Security (RLS)** — políticas SQL no
servidor que decidem se cada linha pode ser lida/escrita pelo
utilizador atual.

Política típica para uma tabela `cards`:

```sql
-- Activar RLS na tabela
alter table cards enable row level security;

-- Só vês os teus próprios cards
create policy "cards_select_own"
on cards for select
to authenticated
using (auth.uid() = owner_id);

-- Só podes criar cards com o teu próprio owner_id
create policy "cards_insert_own"
on cards for insert
to authenticated
with check (auth.uid() = owner_id);
```

Sem políticas activadas, **qualquer pessoa lê/escreve tudo**. O CLI
mostra um aviso quando criar uma tabela sem RLS — não ignores.

### Anon/Publishable key vs Service role/Secret key

| Key                                | Visibilidade         | Bypassa RLS | Onde usar                 |
| ---------------------------------- | -------------------- | ----------- | ------------------------- |
| Publishable (`sb_publishable_...`) | Pública, no bundle   | ❌          | Cliente (este projeto)    |
| Secret (`sb_secret_...`)           | **Nunca** ao cliente | ✅          | Servidor / edge functions |

A secret key passa por cima de **toda** a RLS. Se vazar, a tua DB
está nua. Por isso esta app **nunca a toca** — só a publishable.

## Fluxo JWT (em três passos)

```
1. supabase.auth.signInWithPassword({ email, password })
   ↓
2. Supabase devolve um JWT, o cliente guarda em localStorage
   ↓
3. Cada request seguinte vai com Authorization: Bearer <jwt>.
   PostgREST passa o JWT ao Postgres, que expõe auth.uid() às
   políticas RLS.
```

Tudo o que falamos em RLS depende deste `auth.uid()`. Sem login,
`auth.uid()` é `null` e qualquer política `using (auth.uid() = ...)`
falha — bloqueia o acesso. É assim que se cria a separação por
utilizador.

## Tipos gerados — porquê e como

A `Database` type em `src/lib/database.types.ts` é gerada por:

```
supabase gen types typescript --project-id <ID> --schema public
```

Quando passamos `<Database>` ao `createClient`, ganhamos:

```ts
// Antes (sem tipos): data é any[], sem autocomplete
const { data } = await supabase.from('cards').select();

// Depois: data é Card[] inferido do schema
const { data } = await supabase.from('cards').select('id, title, stage_id');
//                                                    ^ autocomplete dos colunas
//                                                      reais da tabela
```

Os tipos cobrem `Row`, `Insert` (campos opcionais marcados),
`Update` (tudo opcional), e enums.

### Pipeline self-sufficient

O script `scripts/gen-db-types.mjs`:

1. Lê `SUPABASE_PROJECT_ID` de `.env.local`
2. Falha logo se a variável não existir (mensagem clara)
3. Chama o CLI e redirecciona output para `src/lib/database.types.ts`

Comando único, igual em qualquer máquina e qualquer projeto que use
este template:

```
npm run db:types
```

Quando deves correr:

- Depois de criar/alterar/apagar uma tabela
- Depois de adicionar/remover colunas
- Depois de mudar policies que afectam tipos retornados
- Em dúvida — é instantâneo e idempotente

## Auth options explícitas

```ts
createClient<Database>(url, key, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
    },
});
```

Os três são `true` por defeito — tornamos explícitos para servir de
**documentação executável**:

- `persistSession` — JWT guardado em `localStorage` sobrevive a refresh
- `autoRefreshToken` — antes do JWT expirar (~1h), o cliente troca
  por outro novo silenciosamente
- `detectSessionInUrl` — depois de magic link / OAuth, o token vem
  no hash do URL; este flag faz com que seja extraído e armazenado

## Quando usar `supabase` directo vs via React Query

| Caso                                   | Como                                                        |
| -------------------------------------- | ----------------------------------------------------------- |
| **Auth** (signIn, signOut, getSession) | Directo: `supabase.auth.signInWithPassword(...)`            |
| **Subscribe a auth changes**           | Directo: `supabase.auth.onAuthStateChange(...)`             |
| **Ler dados de tabelas**               | Via React Query: `useQuery` dentro de `features/<x>/api.ts` |
| **Escrever em tabelas**                | Via React Query: `useMutation` com `invalidateQueries`      |
| **Realtime subscriptions**             | Directo no `useEffect`, mas considerar wrapper futuro       |

Server state (dados de tabelas) precisa de cache, dedup, invalidação
— é trabalho do React Query (ver doc 03). Auth é state de sessão,
diferente de dados — vai directo.

## Como replicar noutro projeto

1. `npm i @supabase/supabase-js`
2. `npm i -D dotenv supabase` (CLI como devDep evita global install)
3. Criar projeto no Supabase, ir a Settings → API e copiar URL +
   publishable key. Settings → General para o Reference ID.
4. Preencher `.env.local`:
    ```
    VITE_SUPABASE_URL=...
    VITE_SUPABASE_PUBLISHABLE_KEY=...
    SUPABASE_PROJECT_ID=...
    ```
5. `npx supabase login` (uma vez por máquina, autentica o CLI)
6. Copiar `scripts/gen-db-types.mjs` para o novo projeto
7. Adicionar script no `package.json`:
    ```json
    "db:types": "node scripts/gen-db-types.mjs"
    ```
8. `npm run db:types` para gerar `src/lib/database.types.ts`
9. Copiar `src/lib/supabase.ts` e `src/lib/env.ts` deste projeto
10. **Activar RLS em todas as tabelas e escrever políticas** — não
    deixar para depois

## Pitfalls

- **Esquecer RLS** — DB exposta ao mundo via publishable key
- **Pôr secret key em variável `VITE_`** — vai para o bundle. Game
  over. Secret key nunca deve sequer existir neste projeto
- **Criar `createClient` em mais que um sítio** — auth state e
  listeners ficam desalinhados
- **Não regenerar tipos depois de mexer no schema** — TypeScript
  continua a achar que está tudo bem enquanto a app rebenta em
  runtime
- **Commitar valores reais em `.env.example`** — quem clonar o
  template herda o teu projeto Supabase por omissão. Manter
  placeholders só

## Referências

- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security guide](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Auth — JWT flow](https://supabase.com/docs/guides/auth/sessions)
- [Generating Types from your Database](https://supabase.com/docs/guides/api/rest/generating-types)
- [API Keys: publishable vs secret](https://supabase.com/docs/guides/api/api-keys)
