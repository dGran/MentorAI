# QA issue #10

Vehículo ui: index.html en :8000 con localStorage sembrado, Chromium 1280x900.

| Run | Fase | SHA | Resultado | Evidencia |
|---|---|---|---|---|
| 01 | reproduce | 11906fc | siempre «Caché y rendimiento 0 / 15» | runs/01-reproduce-11906fc/assets/salida.json |
| 02 | verify | 4d74cae | sin progreso oculto; la-maquina 2/5 → lección 3; gana el más reciente (lectura o marcado) | runs/02-verify-4d74cae/assets/ |

Render del inicio, peor caso (282 lecturas, 150 hechas), media de 20: main 3,4 ms, rama 5,8 ms.
Veredicto: aprobado.
