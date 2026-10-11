# QA #18 — errores técnicos de nueve lecciones

Vehículo: Chrome headless por CDP, con la rama (`048c074`) en `:8000` y `main` en `:8001` (`python3 -m http.server`). Es un PR de contenido: la verdad del texto la comprobó la review contra fuentes, y aquí se comprueba que las lecciones corregidas se pintan bien en la app.

| Criterio | Resultado | Evidencia |
|---|---|---|
| 1-2. Puntos corregidos o anotados con su fuente | ✅ criterio editorial: tabla con fuentes en el PR; la review fresca abrió las fuentes | comentario de review del PR |
| 3. Ningún check ni pregunta contradice el texto | ✅ los checks reescritos (`c6b01a7`, `cdb7fae`) se pintan con su texto nuevo | `lecciones.txt` |
| 4. `validar.js` en verde e índice regenerado | ✅ criterio técnico: sin errores, 61 avisos | gates del PR |
| No regresión de render | ✅ las 9 cargan con 0 errores de consola, todo enlace del índice tiene su `h2`, los bloques de los lenguajes que resalta `syntax.js` están resaltados (Python no se resalta, igual que en `main`), y a 1280 px ningún desborde nuevo (`sql-joins` +1 px ya en `main`; `go-testing` de +8 a 0) | `lecciones.txt`, `ancho-1280-*.txt`, capturas |
