# QA issue #35 — curso «Seguridad aplicada al backend»

Objetivo: comprobar contra la app servida (http y file://) que el curso aparece completo, que sus checks, examen y retos cargan, que entra en las rutas tras apis-rest, y que los retos hacen lo que dicen.

| Run | Fase | SHA | Vehículo | Resultado | Evidencia |
|---|---|---|---|---|---|
| 01 | verify | 6860970 | ui (http) | verificado | runs/01-verify-6860970/ |
| 02 | verify | 6860970 | ui (file://) | verificado | runs/02-verify-file-6860970/ |
| 03 | verify | 6860970 | cli | verificado | runs/03-verify-retos-6860970/ |

Veredicto: verificado. Residuos: ninguno (perfiles de Chrome borrados en finally; servidor php -S parado). Repetir: `.qa-evidence/issue-35/command.sh <salida> [base]`.
