# QA issue #112 — ancla del h2 «Cuándo aplicarlo»

Objetivo: el criterio 5 (hover muestra el `#` y enlaza a `#cuando`) contra la app servida y por `file://`. Los criterios 1-4 son técnicos y se verificaron en implement y review (`validar.js` exit 0, `node --test` 114/114, comparación del texto visible de las 43).

| Run | Fase | SHA | Vehículo | Resultado | Evidencia |
|---|---|---|---|---|---|
| 01 | verify | 061e9ee | ui (http) | verificado | runs/01-verify-061e9ee/ |
| 02 | verify | 061e9ee | ui (file://) | verificado | runs/02-verify-file-061e9ee/ |

Veredicto: verificado. Residuos: ninguno (perfil de Chrome borrado en `finally`). Repetir: `.qa-evidence/issue-112/command.sh <salida> [base]`.
