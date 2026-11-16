# Run 01 — verify

- Fecha: 2026-11-16
- Commit: 1f1d558 (rama refactor/202-motor-de-busqueda) frente a main 60d09ca publicado en GitHub Pages (v103)
- Entorno: rama servida con `python3 -m http.server 8123` en 127.0.0.1; la misma rama por `file://`; main en https://dgran.github.io/MentorAI/ (perfil de Chrome nuevo, sin service worker previo)
- Vehículo: ui (Playwright 1.62.1, Chromium 1234 headless, 1280×900)
- Resultado: verificado
- Exit/status: `command.sh` exit 0

## Esperado
El buscador del inicio devuelve los mismos resultados, en el mismo orden, en `main` y en la rama, y la rama funciona por `file://` sin errores de consola.

## Observado
Las 6 consultas («supabase», «rls», «indice», «docker compose», «arbol equilibrado», «kubernetes») dan listas de `href` idénticas en el mismo orden en main, en la rama por HTTP y en la rama por file:// (21, 18, 71, 40, 1 y 14 resultados). Cero errores de consola en las tres. Detalle completo en `assets/comparacion.json`.

## Comando
`../../command.sh`

## Evidencias
- `assets/comparacion.json` — las listas de resultados de las tres variantes por consulta y los errores de consola (vacíos).
- `assets/rama-supabase.png` — la rama por HTTP: ruta y curso primero, luego artículos; «21 coincidencias · 2 entre rutas y cursos · 2 dentro del contenido».
- `assets/file-arbol-equilibrado.png` — la rama por file://: la única coincidencia está en el contenido y sale con el fragmento y «arbol» resaltado (el índice se carga bajo demanda también por file://).
- `assets/main-*.png`, `assets/rama-*.png`, `assets/file-*.png` — una captura por consulta y variante.

## No probado
- El modo sin conexión con el service worker: lo cubre `verificar-offline.js` (CI `offline` en verde en 1f1d558; en local 20/20 en el HEAD anterior, mismo código de producción).
