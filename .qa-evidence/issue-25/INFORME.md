# QA #25, bloque 4: longitudes, puestos y forma

Vehículo: Chrome headless por CDP contra la rama `71f394a` en `:8000`, más los medidores.

| Criterio | Resultado | Evidencia |
|---|---|---|
| La correcta deja de ser la más larga | ✅ 17 % en los tres exámenes y 19-21 % en los checks (antes, 83-98 %) | `longitud-y-puesto.txt` |
| Ningún puesto de longitud domina | ✅ como mucho, un 43 % | `longitud-y-puesto.txt` |
| La forma no delata la correcta | ✅ 0 de 168 preguntas | `forma.txt` |
| Historial de repaso intacto | ✅ 162 reescritas; ids, `a`, `q` y orden intactos; 6 `w` corregidas | `estructura.txt` |
| Cargo.lock corregido | ✅ el check `ce2ff68` se pinta y corrige; la lección sirve el texto «desde 2023» | `navegador.txt`, `check-ce2ff68.png` |
| Examen | ✅ rust con 12 preguntas; 0 errores de consola | `navegador.txt`, `examen.png` |

Gates: `validar.js` sin errores · `node --test` 107/107 · `verificar-offline.js` verde.
