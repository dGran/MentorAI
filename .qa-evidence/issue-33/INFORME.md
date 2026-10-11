# QA #33 (parcial) — preguntas discutibles, cifras y reviewed

Vehículo: Chrome headless por CDP contra la rama `65cb3f5` en `:8000`.

| Criterio (parte que entra) | Resultado | Evidencia |
|---|---|---|
| 4 preguntas precisas | ✅ el check `c5da2af` se pinta con su texto nuevo; `rest-vs-rpc-vs-graphql` menciona GET y *persisted queries*; `cr-invalidacion` dice «acota la obsolescencia» (2) y ya no «correcto por construcción» (0). La corrección técnica la comprobó la review | `comprobaciones.txt`, `cr-invalidacion.png` |
| `reviewed` | ✅ criterio técnico: el validador acepta las 38 fechas y rechaza formato inválido, días imposibles, fechas anteriores a `date` y fechas futuras | review del PR |
| Cifras al día | ✅ `offline.html` dice «Son 309 páginas, unos 9 MB»; el resto, por `grep` (PR) | `comprobaciones.txt` |

0 errores de consola.
