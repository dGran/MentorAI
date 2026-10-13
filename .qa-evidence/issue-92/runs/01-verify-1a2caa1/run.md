# Run 01-verify-1a2caa1 — verify

- Fecha: 2026-10-13T10:13:04+02:00
- Commit: 1a2caa1
- Rama/base: feat/92-oficio → main
- Entorno: http://localhost:8000 (python3 -m http.server 8000 desde la raíz de la rama) · Chrome headless, perfil nuevo
- Vehículo: ui
- Resultado: verificado
- Exit/status: 0

## Esperado
Tarjeta del curso en Cursos con su nivel; ficha con sus módulos y lecciones; los retos al final de la ficha; checks en cada lección con «Cuándo aplicarlo» anclado; el examen en la lección que lo carga; el curso en sus rutas tras el paso acordado; sin scroll horizontal a 320 px; 0 errores de consola.
## Observado
tarjeta Intermedio; 2 módulos; 6 lecciones; retos 3/3; checks por lección 3·3·3·3·3·3; examen 18 en of-aterrizar-en-legacy; rutas el-grado-que-no-hiciste tras protocolos-y-tiempo-real; 320 px: ancho 320; errores de consola 0
## Comando
`../../command.sh <salida> <base>`
## Evidencias
- `assets/criterio-01-ficha-del-curso.png` — ficha con título, nivel, rutas y primer módulo.
- `assets/criterio-01-examen.png` — cabecera del examen y primeras preguntas.
- `assets/criterio-01-leccion-320px.png` — una lección a 320 px.
- `assets/medidas.json` — todas las cifras.
## No probado
Corrección del examen al responder (lógica existente con tests).
