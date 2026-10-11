# QA #70 — scroll horizontal en tutoriales

Vehículo: Chrome headless por CDP. Para 1 y 3, la rama (`756bfd5`) se sirvió en `:8000` y `main` en `:8001` con `python3 -m http.server`, comprobando el `cwd` de cada servidor. Para 4 se compararon los dos árboles por `file://`. No escribe datos.

| Criterio | Resultado | Evidencia |
|---|---|---|
| 1. 0 desbordes a 320/375 en los 300 tutoriales | ✅ rama: 0 y 0 · `main`: 103 y 88 | `c1-desbordes-rama.txt`, `c1-desbordes-main.txt` |
| 2. `verificar-offline.js` recorre los tutoriales y falla si desbordan | ✅ rama: `✓ 666 vistas`, exit 0 · mismo verificador contra `main`: `✗ … inf-tls +134px …`, exit 1 | `c2-verificar-offline-rama.txt`, `c2-verificar-offline-main.txt` |
| 3. Tablas con scroll en su contenedor | ✅ a 320 px, página sin desborde y `.table-wrap` con `overflow-x: auto` y `scrollWidth` > `clientWidth` (419/278, 506/278, 403/278) | `c3-tablas-rama.txt`, `c3-*-320-tabla.png` |
| 4. 1280 px sin cambios | ✅ geometría de todos los elementos con `Math.random` sembrado: 287/300 idénticas. Las 13 distintas son las páginas de tablas recién envueltas (criterio 3) | `c4-geometria-1280.txt` |
