# QA issue #9

Vehículo ui: las 269 lecciones publicadas de los 30 cursos en :8000, Chromium 1280x900, leyendo los enlaces Anterior/Siguiente de `.route-nav`.

| Run | Fase | SHA | Resultado | Evidencia |
|---|---|---|---|---|
| 01 | reproduce | b9af26e | 58 enlaces cruzan a otro curso; maq-cpu con «Anterior: OWASP»; maq-sockets-e-io con «Siguiente: El ciclo TDD» | runs/01-reproduce-b9af26e/ |
| 02 | verify | 183d369 | 0 cruces; maq-cpu sin Anterior; maq-sockets-e-io «Fin del curso → Haz el examen» (#quiz) | runs/02-verify-183d369/ |

Vecina exacta en las 269, #quiz presente en las 30 últimas y caso «soon» simulado: verificados por el review.
Veredicto: aprobado.
