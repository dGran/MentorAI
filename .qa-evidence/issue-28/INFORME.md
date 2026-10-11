# QA #28 — enlaces entre lecciones básicas y avanzadas

Vehículo: Chrome headless por CDP contra la rama `17dd4cd` en `:8000`. Se pulsa cada enlace y se comprueba la página de destino.

| Criterio | Resultado | Evidencia |
|---|---|---|
| 1. Las 5 parejas en ambos sentidos | ✅ los 10 enlaces llevan al `h1` esperado; también `numeros-flotantes#overflow` y `cc-mcp#seguridad` | `enlaces-seguidos.txt` |
| 2. Piezas sin enlace entrante < 120 | ✅ 200 en `main` → 83 en la rama | `conteo-main.txt`, `conteo-rama.txt` |
| 3. Referencias en texto plano convertidas | ✅ ~110; la review comprobó los 188 destinos | review del PR |
| 4. `validar.js` en verde | ✅ criterio técnico: sin errores | gates del PR |

0 errores de consola.
