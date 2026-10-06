# QA issue #3

Vehículo ui: marcar regex como completada en la lección, exportar el perfil desde perfil.html, desmarcarla en la lección e importar el fichero exportado dos veces. Servidor :8000, Chromium 1280x900.

| Run | Fase | SHA | Resultado | Evidencia |
|---|---|---|---|---|
| 01 | reproduce | 400f800 | tras importar dos veces vuelve a «Completado» (`academia-progress` = ["regex"]) | runs/01-reproduce-400f800/ |
| 02 | verify | 1fbe8b7 | sigue «Marcar como completado» (`academia-progress` = []) | runs/02-verify-1fbe8b7/ |

Alta posterior a baja, subrayados, lectura, export v1, empates y purga: técnicos, 26 tests node:test (12+4 fallan sin el fix).
Veredicto: aprobado.
