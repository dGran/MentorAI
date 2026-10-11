# QA #34, fase 0: estructura de la plantilla en las 63 lecciones

Vehículo: Chrome headless por CDP contra la rama en `:8000` y `main` en `:8001`. Run `01-verify-b15f4f3`; las lecciones no cambian en los commits posteriores, que solo tocan la regla del validador y sus tests.

| Criterio | Resultado | Evidencia |
|---|---|---|
| Acciones del tutorial inyectadas por el JS (antes, muertas en Python y Rust) | ✅ 63/63, con «Proponer mejora» y la barra de lectura | `rama-63-lecciones.txt`, `python-decoradores-rama.png` frente a `-main.png` |
| Sin duplicados en la miga ni en el botón del índice | ✅ 1 enlace al curso y 1 botón en las 63 (en `main`, 2 y 2 en Python y Rust) | `rama-63-lecciones.txt`, `main-3-lecciones.txt` |
| Índice «En esta página», `h2` con ancla y keypoints de la plantilla | ✅ 63/63 | `rama-63-lecciones.txt` |
| Sin `<pre>` sueltos ni callouts sin cuerpo | ✅ 0 en las 126 vistas | `rama-63-lecciones.txt` |
| Sin scroll horizontal a 1280 y 375 px | ✅ 126/126 | `rama-63-lecciones.txt` |
| Sin errores de consola | ✅ 0 | `rama-63-lecciones.txt` |
| Texto del artículo intacto | ✅ comprobado por el script en cada fichero y por la review en las 63 | PR |

Gates: `validar.js` sin errores (1 aviso: «Cuándo aplicarlo», que es la fase siguiente) · `node --test` 112/112 · `verificar-offline.js` verde.
