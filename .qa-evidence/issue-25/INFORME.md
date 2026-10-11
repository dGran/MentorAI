# QA #25, bloque 1 — longitudes, puestos y forma

Vehículo: Chrome headless por CDP contra la rama `b1a066e` en `:8000`, más los medidores de longitud, puesto y forma.

| Criterio | Resultado | Evidencia |
|---|---|---|
| La correcta deja de ser la más larga | ✅ protocolos 17/20 %, infraestructura 17/20 %, sistemas distribuidos 15/21 %, fundamentos 14/18 % (examen/checks) | `longitud-y-puesto.txt` |
| Ningún puesto de longitud domina | ✅ como mucho, un 43 % | `longitud-y-puesto.txt` |
| Ratio larga/corta ≤ 2 | ✅ máxima 2,00 (`qae0980`, «4/8/16/10») | `longitud-y-puesto.txt` |
| La forma no delata la correcta | ✅ 0 de 258 preguntas en tres cursos y 1 de 74 en fundamentos, por debajo del 10 % | `forma.txt` |
| Historial de repaso intacto | ✅ 1.164 preguntas: mismos ids, `a` y orden; 188 reescritas; `q` solo en `c3ffa94` | `estructura.txt` |
| Se pinta y corrige igual | ✅ check `c3ffa94` con el enunciado nuevo, «81» como distractor y la correcta marcada al pulsarla; examen de sistemas distribuidos con 20 preguntas; 0 errores de consola | `navegador.txt`, `check-c3ffa94.png`, `examen.png` |
| Validador | ✅ sin errores; 0 avisos en los cuatro cursos | `validar.txt` |

Gates: `node --test` 107/107 · `verificar-offline.js` verde.
