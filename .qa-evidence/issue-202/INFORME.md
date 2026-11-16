# QA issue #202 — extraer el motor de búsqueda del inicio

**Objetivo:** comprobar en la app real que el refactor no cambia el buscador del inicio.
**Esperado:** mismos resultados y orden que `main`, por HTTP y por `file://`, sin errores.
**Alcance:** buscador del inicio (`#home-search`); el resto de criterios son técnicos (gates).

| Run | Fase | SHA | Vehículo | Resultado | Evidencia |
|---|---|---|---|---|---|
| 01 | verify | 1f1d558 | ui | verificado | `runs/01-verify-1f1d558/` |

**Veredicto:** aprobado. Criterios técnicos verificados con gates: `validar.js` limpio, `node --test` 143/143, CI `tests`/`validar`/`offline` en verde en 1f1d558.
**Residuos locales:** ninguno (servidor parado por `trap`, perfil de Chrome borrado en `finally`).
**Repetir:** `.qa-evidence/issue-202/command.sh` desde la raíz del repo (necesita Playwright en `$HOME/pw-qa/node_modules` o `PLAYWRIGHT_ROOT`).
