# Run 02-verify-file-938ed1d — verify

- Fecha: 2026-10-13T00:16:58+02:00
- Commit: 938ed1d
- Rama/base: feat/37-concurrencia-en-bd → main
- Entorno: file:///home/davidgran/.projects/MentorAI (invariante file://) · Chrome headless, perfil nuevo
- Vehículo: ui
- Resultado: verificado
- Exit/status: 0

## Esperado
Tarjeta del curso en Cursos con su nivel; ficha con sus módulos y lecciones; los retos al final de la ficha; checks en cada lección con «Cuándo aplicarlo» anclado; el examen en la lección que lo carga; el curso en sus rutas tras el paso acordado; sin scroll horizontal a 320 px; 0 errores de consola.
## Observado
tarjeta Avanzado; 2 módulos; 6 lecciones; retos 3/3; checks por lección 3·3·3·3·3·3; examen 16 en bd-explain-comparado; rutas el-grado-que-no-hiciste tras sql-aplicado, construir-un-servicio tras sql-aplicado; 320 px: ancho 320; errores de consola 0
## Comando
`../../command.sh <salida> <base>`
## Evidencias
- `assets/criterio-01-ficha-del-curso.png` — ficha con título, nivel, rutas y primer módulo.
- `assets/criterio-01-examen.png` — cabecera del examen y primeras preguntas.
- `assets/criterio-01-leccion-320px.png` — una lección a 320 px.
- `assets/medidas.json` — todas las cifras.
## No probado
Corrección del examen al responder (lógica existente con tests).
