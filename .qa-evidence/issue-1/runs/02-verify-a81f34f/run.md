# Run 02 — verificado
- Fecha: 2026-10-06T19:14:28+02:00
- Commit: a81f34f
- Entorno: python3 -m http.server 8000, Chromium headless 1280x900, SW bloqueado
- Vehículo: ui
- Resultado: verificado
## Esperado
Ninguna .mini-card__desc de Novedades, Destacados ni resultados de «docker» con solo dígitos; los fragmentos de contenido se mantienen.
## Comando
`../../command.sh <dir>`
## Evidencias
- `assets/salida.json` — textos de cada estantería y recuentos de la búsqueda.
- `assets/novedades.png`, `assets/destacados.png`, `assets/busqueda-docker.png` — capturas abiertas: en reproduce las tarjetas 2-4 muestran «1», «2», «3»; en verify la descripción.
## No probado
Otros términos de búsqueda.
