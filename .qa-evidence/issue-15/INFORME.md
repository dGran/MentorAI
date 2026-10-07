# QA funcional — issue #15 (scroll horizontal a 320 y 375 px)

Entorno: `python3 -m http.server`, con `main` (fd9b167) en :8001 desde un worktree y la rama en :8000. Chromium con el service worker bloqueado. Comando: `node command.mjs <base> <assets>`.

La run de verificación se hizo sobre c7dcab3. Los commits posteriores (cc0c5d7 y siguientes) solo endurecen el paso de `verificar-offline.js`; el CSS no cambia.

| Medida | main | rama |
|---|---|---|
| Vistas con desborde: `articulos.html` y los 32 cursos, a 320 y 375 px | **31 de 66** (articulos +20; `cache-y-rendimiento` +197, `infraestructura` +246…) | **0 de 66** |
| Capturas de página completa a 1280 px: index, articulos, cursos, rutas y curso clean-code | hash de referencia | **idénticas** (mismo hash en las 5) |
| Retos de `clean-code` a 375 px | texto cortado por la derecha; la sección es más ancha que la pantalla | el texto parte línea; el código hace scroll dentro de su caja |

Capturas revisadas: `practica-clean-code-375.png` de las dos runs.

En CI, `verificar-offline.js` incluye ahora el paso «sin scroll horizontal a 320 y 375 px»:
- antes del arreglo: rojo;
- después: verde, 66 vistas;
- con una vista sin pintar: rojo.

Veredicto: **aprobado**.
