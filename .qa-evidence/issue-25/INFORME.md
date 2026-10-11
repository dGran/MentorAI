# QA #25, bloque 5: longitudes, puestos y forma

Vehículo: Chrome headless por CDP contra la rama `0fda883` en `:8000`, más los medidores.

| Criterio | Resultado | Evidencia |
|---|---|---|
| La correcta deja de ser la más larga | ✅ entre el 8 y el 25 % (antes, 61-100 %) | `longitud-y-puesto.txt` |
| Ningún puesto de longitud domina | ✅ como mucho, un 45,0 % exacto (terminal-linux, checks) | `longitud-y-puesto.txt` |
| La forma no delata la correcta | ✅ 1 de 165 (`cb4f4f9`, de contenido) | `forma.txt` |
| Historial de repaso intacto | ✅ 141 reescritas; ids, `a`, `q` y orden intactos; 2 `w` | `estructura.txt` |
| Se pinta y corrige igual | ✅ check `c4d8533` (Strategy) y examen de patrones-diseno; 0 errores de consola | `navegador.txt`, `check-c4d8533.png`, `examen.png` |

Gates: `validar.js` sin errores · `node --test` 107/107 · `verificar-offline.js` verde.
