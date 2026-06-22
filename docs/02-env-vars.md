# 02 — Variáveis de ambiente

## Contexto

A app precisa de configuração que **muda por ambiente** (URL e chave
do Supabase para dev, staging, produção)

- Não commitar valores reais
- Falhar cedo se algo faltar (e não no meio da app a correr)
- Tipagem em todos os usos
- Um lugar único que documenta o que é preciso

## Decisão

Quatro peças trabalham em conjunto:

| Ficheiro            | Papel                                                          |
| ------------------- | -------------------------------------------------------------- |
| `.env.example`      | Template versionado com nomes (sem valores)                    |
| `.env.local`        | Valores reais — **gitignored** (via `*.local` no `.gitignore`) |
| `src/vite-env.d.ts` | Tipagem TypeScript de `import.meta.env`                        |
| `src/lib/env.ts`    | Validação runtime + ponto único de acesso                      |

Regra de uso: importar `env` de `@/lib/env`, nunca `import.meta.env`
diretamente.

```ts
// ❌ Em qualquer parte da app
const url = import.meta.env.VITE_SUPABASE_URL!;

// ✅
import { env } from '@/lib/env';
const url = env.SUPABASE_URL;
```

## Porquê

### Porquê o prefixo `VITE_`

O Vite só expõe ao código cliente variáveis com o prefixo `VITE_`.
Tudo o resto fica fora do bundle. Isto é **uma proteção contra
acidentes**, evita que uma `DATABASE_PASSWORD` apareça no JavaScript
servido ao browser.

**Tudo o que tem `VITE_` é público**. Aparece no bundle
final, visível em DevTools. Apenas valores que podem ser conhecidos
pelo cliente (ex.: URL do Supabase, anon key). Nunca service-role
keys, secrets de Stripe, tokens de admin, etc.

### Porquê validar em runtime se já temos tipagem

O TypeScript acredita no que o `.d.ts` declara. Se declararmos que
`VITE_SUPABASE_URL` é `string`, o compilador aceita — mesmo que em
runtime venha `undefined` por o `.env.local` estar incompleto.

Sem `env.ts`, o erro só aparece quando algum código tenta usar o
valor e rebenta com algo críptico ("Failed to construct URL: Invalid
URL"). Com `env.ts`, a app falha imediatamente no arranque com:

```
[env] Variável "VITE_SUPABASE_URL" em falta. Copia .env.example
para .env.local e preenche o valor.
```

Isto é o **fail-fast** clássico: erros junto da causa, não 5 stack
traces depois.

### Porquê não usar uma lib (zod, envalid)

Para 2-3 variáveis, um `required()` de 10 linhas chega. Se um dia
forem 20 variáveis com tipos variados (número, boolean, enum),
migra-se para `zod`:

```ts
import { z } from 'zod';

const Env = z.object({
    VITE_SUPABASE_URL: z.string().url(),
    VITE_SUPABASE_ANON_KEY: z.string().min(20),
    VITE_MAX_UPLOAD_MB: z.coerce.number().default(10),
});

export const env = Env.parse(import.meta.env);
```

Princípio: introduz a lib quando o ganho justifica, não antes.

### `.env` vs `.env.local` vs `.env.development`

Vite carrega múltiplos ficheiros, com precedência:

1. `.env.local` — sempre carregado, **ignorado por git**
2. `.env.development.local` / `.env.production.local` — específicos
   de modo, ignorados por git
3. `.env.development` / `.env.production` — específicos de modo,
   **commitados** (defaults partilhados)
4. `.env` — base, commitado

Convenção que seguimos:

- `.env.example` — versionado, **só nomes**, com comentários
- `.env.local` — cópia da máquina de cada developer, **gitignored**

Não usamos `.env` (commitado) porque não temos defaults úteis para
partilhar — todas as variáveis são secretas-mas-públicas e dependem
do projeto Supabase de cada um.

## Como replicar noutro projeto

1. Criar `.env.example` com os nomes das variáveis e comentários a
   explicar onde obter cada valor.
2. Garantir que `*.local` está no `.gitignore` (já vem por defeito
   no template Vite).
3. Criar `src/vite-env.d.ts` com `interface ImportMetaEnv`.
4. Criar `src/lib/env.ts` com a função `required()`. Para cada nova
   variável, adicionar uma linha no objeto `env`.
5. **Lint rule opcional**: bloquear `import.meta.env` fora de
   `src/lib/env.ts` via ESLint `no-restricted-syntax` se quiseres
   forçar a convenção.

## Pitfalls comuns

- **Esquecer o prefixo `VITE_`** — a variável existe no `.env` mas
  é `undefined` no código. Vite ignora silenciosamente.
- **Reiniciar o dev server** depois de mexer no `.env.local` — Vite
  só lê estes ficheiros no arranque.
- **Commitar `.env`** sem `.local` — o `.gitignore` por defeito só
  apanha `*.local`. Se criares `.env` com valores reais, fica
  versionado. Mantém-te sempre em `.env.local`.

## Referências

- [Vite — Env Variables and Modes](https://vitejs.dev/guide/env-and-mode)
- [The Twelve-Factor App — Config](https://12factor.net/config)
