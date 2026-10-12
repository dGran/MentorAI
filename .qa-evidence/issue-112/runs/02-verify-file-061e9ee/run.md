# Run 02-verify-file-061e9ee — verify

- Fecha: 2026-10-12T23:25:53+02:00
- Commit: 061e9ee
- Rama/base: fix/112-ancla-cuando → main
- Entorno: file:///home/davidgran/.projects/MentorAI (invariante file://) · Chrome headless 1280×800, perfil nuevo (sin service worker previo)
- Vehículo: ui
- Resultado: verificado
- Exit/status: 0, sin errores de consola

## Esperado
En `big-o`, `sql-joins` y `transacciones-acid`, el `#` de «Cuándo aplicarlo» está oculto (opacidad 0), aparece al pasar el ratón (1) y al pulsarlo la URL queda en `#cuando`.
## Observado
Opacidad 0 → 1 con hover y `location.hash = "#cuando"` tras el clic en las tres; el TOC sigue enlazando a `#cuando`. Ver `assets/criterio-05-medidas.json`.
## Comando
`../../command.sh <salida> <base>`
## Evidencias
- `assets/criterio-05-<lección>-hover.png` — el título con el `#` visible bajo el ratón.
- `assets/criterio-05-medidas.json` — opacidad antes/durante, href, hash tras el clic y errores de consola.
## No probado
Las otras 40 lecciones en navegador: su HTML es el mismo (lo comprueba el script de migración y la review).
