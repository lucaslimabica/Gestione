# Documentação — Appendix

Cada documento descreve **uma decisão arquitetural**, pela ordem em
que foi tomada. A intenção é dupla:

1. **Histórico** — saber porque é que algo está como está
2. **Template** — copiar para futuras apps sem ter de redescobrir

## Convenção

Cada documento segue a mesma estrutura:

- **Contexto** — o problema
- **Decisão** — o que foi feito
- **Porquê** — alternativas consideradas e razão da escolha
- **Como replicar** — passos para usar isto noutro projeto
- **Referências** — links relevantes

## Índice

| #   | Documento                                       | Estado |
| --- | ----------------------------------------------- | ------ |
| 01  | [Estrutura de pastas](./01-folder-structure.md) | ✅     |
| 02  | [Variáveis de ambiente](./02-env-vars.md)       | ✅     |
| 03  | [React Query provider](./03-react-query.md)     | ✅     |
| 04  | [Cliente Supabase](./04-supabase-client.md)     | ✅     |
| 05  | [Routing (React Router v7)](./05-routing.md)    | ✅     |
| 06  | Layout shell                                    | ⏳     |
| 07  | Autenticação — sessão                           | ⏳     |
| 08  | Autenticação — páginas                          | ⏳     |
| 09  | Rotas protegidas                                | ⏳     |
| 10  | Zustand stores                                  | ⏳     |
| 11  | Feature end-to-end (exemplo)                    | ⏳     |

## Decisões de base (já tomadas antes destes docs)

Estas ficaram registadas implicitamente no `package.json` e configs:

- **Vite** em vez de Next.js — app puramente client-side, sem SSR
- **Tailwind v4** com plugin Vite — sem ficheiro `tailwind.config.js`,
  configuração via CSS (`@theme`)
- **ESLint 10 flat config** — `eslint-plugin-import-x` em vez do
  `eslint-plugin-import` (este último ainda não suporta ESLint 10)
- **Alias `@/*`** apontando para `src/*` — definido em `tsconfig.app.json`
  e `vite.config.ts`, validado pelo ESLint via
  `eslint-import-resolver-typescript`
