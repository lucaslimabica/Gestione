# hooks/

Custom hooks **partilhados entre features**.

Exemplos típicos: `useDebounce`, `useLocalStorage`, `useMediaQuery`.

## Regra de promoção

Hooks específicos de uma feature vivem em `features/<x>/hooks/`. Só
promove para cá quando duas ou mais features precisarem do mesmo.
