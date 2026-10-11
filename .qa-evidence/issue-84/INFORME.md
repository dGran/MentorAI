# QA #84 — buscador del inicio

Vehículo: Chrome headless por CDP contra la rama `48c8869` en `:8000`, tecleando «indice» carácter a carácter.

| Criterio | Resultado | Evidencia |
|---|---|---|
| 1. Primer resultado visible sin scroll | ✅ 1280×900: y = 630-866 · 1024×768: 470-704 · 375×812: 516-741. A 320×640 asoma (508-732), fuera de los anchos del criterio | `visibilidad-y-orden.txt`, `busqueda-*.png` |
| 2. «Índice» en el título primero | ✅ «Índices compuestos…», «Índices y B-tree…», luego el resto | `visibilidad-y-orden.txt` |
| 3. `file://` y sin conexión | ✅ `verificar-offline.js` (buscador full-text sin servidor) | gates |
| 4. Test con `node:test` | ✅ 92/92 | gates |
