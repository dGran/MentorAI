# QA #77 — desbordes y solapes en escritorio

Vehículo: Chrome headless por CDP, `file://`, con la rama `3dd1b98` frente a `main`.

| Criterio | Resultado | Evidencia |
|---|---|---|
| 1. `sql-joins` sin scroll a 1280 | ✅ y, con la ampliación, **0 de 300** tutoriales con scroll a 1280 (en `main`, 38) | `c3-1280-rama.txt`, `c3-1280-main.txt`, `compare-sql-joins-1280.png` |
| 2. El `.flow` de `alerting` sin solapes | ✅ etiquetas como fila de texto centrada; 0 solapes en las 240 páginas con `.compare`/`.flow` | `flow-antiguo-alerting-1280.png` |
| 3. (Enmendado) 0 desbordes a 1280/375/320 y contenido dentro de su caja | ✅ 0/0/0; la plantilla actual no cambia (verificado por la review en 240 páginas) | `c3-*.txt`, `callout-antiguo-1280-{main,rama}.png` |
