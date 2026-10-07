# QA funcional — issue #29 (sync y import)

Entorno:
- `python3 -m http.server`: `main` en :8001 desde un worktree, la rama en :8000.
- Chromium headless con el service worker bloqueado.
- La API de GitHub se simula con `page.route`: 100 gists ajenos en la página 1 y el propio en la 2, más GET y PATCH del gist guardando lo subido.
- La cuota llena se simula con un `setItem` que lanza `QuotaExceededError` para `academia-progress`.

Comando: `node command.mjs <base> <assets>`.

| Escenario | main (d3d0394) | rama (4e59f55; 5b50601 solo añade un test) |
|---|---|---|
| Panel sin conectar: `<label>` del token | 0 | 1 |
| «Conectar» con el campo vacío | no pasa nada | «Pega primero tu token de GitHub.», visible y con `role="alert"` |
| Conectar con el gist en la página 2 | `GET /gists?per_page=100` y **`POST /gists`: duplica el gist** | page=1, page=2, encuentra `gist-propio` y no crea nada |
| 4 navegaciones justo después de conectar | 4 GET | **0 peticiones** (intervalo de 30 s) |
| Importar un fichero | aviso invisible (`renderPage` lo borra) | «Importado y fusionado. +2 tutoriales completados» |
| Importar con la cuota llena | ningún aviso | «No queda espacio en este navegador…», con la clase de error |
| Otro dispositivo en el gist; local distinto; última sync hace 5 s; navegar | GET+PATCH en cada página: fusiona | **0 peticiones**: el gist queda intacto, sin pisar nada; lo local se sube en la siguiente sync |
| Lo mismo con la última sync hace 60 s | GET+PATCH en cada página | **1 GET + 1 PATCH**: el gist y lo local tienen los dos progresos |
| Errores de consola | 0 | 0 |

Capturas revisadas: `panel-conectar-vacio.png`, `importar-ok.png` e `importar-sin-espacio.png`.

No probado: la API real de GitHub (todo simulado), un lector de pantalla real y el límite real de `keepalive` en el navegador (lo cubren los tests unitarios por tamaño de cuerpo).

Veredicto: **aprobado**.
