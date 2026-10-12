# Run 02-verify-file-6860970 — verify

- Fecha: 2026-10-12T23:43:10+02:00
- Commit: 6860970
- Rama/base: feat/35-seguridad-backend → main
- Entorno: file:///home/davidgran/.projects/MentorAI (invariante file://)
- Vehículo: ui
- Resultado: verificado
- Exit/status: 0

## Esperado
Tarjeta del curso en Cursos (Intermedio); ficha con 4 módulos y las 8 lecciones; los 3 retos al final de la ficha; 3 checks en cada lección; examen de 16 preguntas en la última; el curso tras apis-rest en las dos rutas; sin scroll horizontal a 320 px; 0 errores de consola.
## Observado
Todo lo esperado; cifras en `assets/medidas.json` (módulos 4, enlaces 8, retos 3, checks 3×8, examen 16 en sec-logging-seguro, rutas con anterior `apis-rest`, ancho 320 = viewport, consola 0).
## Comando
`../../command.sh <salida> <base>`
## Evidencias
- `assets/criterio-01-ficha-del-curso.png` — ficha con título, nivel, «En las rutas» y el primer módulo.
- `assets/criterio-01-examen.png` — «Pon a prueba lo aprendido», 16 preguntas, mínimo 12/16.
- `assets/criterio-01-leccion-320px.png` — lección a 320 px sin desborde.
- `assets/medidas.json` — todas las cifras.
## No probado
Corrección del examen al responder (lógica ya existente y con tests).
