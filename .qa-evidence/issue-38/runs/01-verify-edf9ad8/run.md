# Run 01-verify-edf9ad8 — verify

- Fecha: 2026-10-13T08:18:46+02:00
- Commit: edf9ad8
- Rama/base: feat/38-rag-y-seguridad-llm → main
- Entorno: http://localhost:8000 (python3 -m http.server 8000 desde la raíz de la rama) · Chrome headless, perfil nuevo
- Vehículo: ui
- Resultado: verificado
- Exit/status: 0

## Esperado
Tarjeta del curso en Cursos con su nivel; ficha con sus módulos y lecciones; los retos al final de la ficha; checks en cada lección con «Cuándo aplicarlo» anclado; el examen en la lección que lo carga; el curso en sus rutas tras el paso acordado; sin scroll horizontal a 320 px; 0 errores de consola.
## Observado
tarjeta Avanzado; 1 módulos; 7 lecciones; retos 4/4; checks por lección 4·3·4·4·3·3·3; examen 16 en ia-agente-en-producto; rutas ingenieria-con-ia tras claude-code; 320 px: ancho 320; errores de consola 0
## Comando
`../../command.sh <salida> <base>`
## Evidencias
- `assets/criterio-01-ficha-del-curso.png` — ficha con título, nivel, rutas y primer módulo.
- `assets/criterio-01-examen.png` — cabecera del examen y primeras preguntas.
- `assets/criterio-01-leccion-320px.png` — una lección a 320 px.
- `assets/medidas.json` — todas las cifras.
## No probado
Corrección del examen al responder (lógica existente con tests).
