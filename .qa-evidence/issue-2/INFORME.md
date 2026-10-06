# QA issue #2 — fusión sin pisar el progreso local

Objetivo: importar un perfil desde perfil.html no debe pisar un examen aprobado ni retos hechos en local.

| Run | Fase | SHA | Vehículo | Resultado | Evidencia |
|---|---|---|---|---|---|
| 01 | reproduce | 9358b78 | ui | reproducido: quiz queda passed:false bestScore:40; ruta best:9; práctica pierde git/0 y docker | runs/01-reproduce-9358b78/assets/salida.json |
| 02 | verify | 85c4f66 | ui | verificado: quiz passed:true bestScore:90 attempts:3; ruta passed:true best:18; práctica unida | runs/02-verify-85c4f66/assets/salida.json |

Veredicto: aprobado. Criterio 4 (tests en CI) es técnico: job `tests` del PR en verde.
Residuos: ninguno (localStorage del perfil efímero de Playwright).
Repetir: `.qa-evidence/issue-2/command.sh <dir>` con el servidor en :8000.
