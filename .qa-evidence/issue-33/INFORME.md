# QA #33 — rutas, niveles y preguntas de escenario

Vehículo: Chrome headless por CDP contra la rama `ce8b9fc` en `:8000`, con `localStorage` vacío.

| Criterio | Resultado | Evidencia |
|---|---|---|
| Piezas fuera de ruta | ✅ `jerga` abre backend-cimientos; `regex` tras terminal-linux; `redis-a-fondo` y `rabbitmq` tras cache-y-rendimiento | `pintado.txt`, `rutas.png` |
| Resumen de backend-cimientos | ✅ «El arranque corto…» | `pintado.txt` |
| Niveles por primera lección | ✅ los 11 cursos medidos con su nivel nuevo en `cursos.html`; chips 8/15/9 | `pintado.txt` |
| Orden de testing | ✅ tipos-de-test → tdd-ciclo → test-doubles → tests-que-no-estorban, en la ficha y en la navegación de cada lección | `pintado.txt`, `navegacion-testing.txt` |
| Módulo renombrado | ✅ «Sistemas distribuidos y caché» | `pintado.txt` |
| Escenario ≥ 30 % | ✅ fundamentos 29 preguntas (9 nuevas), Go 18 (6), SOLID 18 (3) | `pintado.txt`, `estructura-preguntas.txt` |
| Historial de repaso intacto | ✅ 464 existentes idénticas, 0 cambiadas, 18 nuevas | `estructura-preguntas.txt` |
| Hash flooding corregido | ✅ texto nuevo en `hashing.html` | `pintado.txt` |
| Sin errores de consola | ✅ 0 | `pintado.txt` |

Gates: `validar.js` sin errores (59 avisos), `node --test` 100/100, `verificar-offline.js` verde.
