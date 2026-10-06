# QA issue #23 — curso «La IA por dentro»

Vehículo ui: servidor :8000, Chromium a 1280 claro y 375 oscuro.

| Run | Fase | SHA | Resultado | Evidencia |
|---|---|---|---|---|
| 01 | reproduce | 16ac627 | el curso no existe («No encontramos ese curso»), lección 404, la ruta no lo incluye | runs/01-reproduce-16ac627/assets/salida.json |
| 02 | verify | 20e3ebf | 5 lecciones: TOC íntegro, 4 checks cada una, navegación dentro del curso y «Fin del curso → Haz el examen» en la última; examen de 16; ficha con 5 lecciones, examen y 3 retos; ruta con el curso; 0 errores de consola; sin scroll horizontal a 375 | runs/02-verify-20e3ebf/assets/ |

Veredicto: aprobado.
