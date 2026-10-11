# QA #25, bloque 6 (cierre): longitudes, puestos y forma; las reglas pasan a error

Vehículo: Chrome headless por CDP contra la rama `edc4f18` en `:8000`, más los medidores y una mutación de los umbrales.

| Criterio de #25 | Resultado | Evidencia |
|---|---|---|
| Todos los cursos por debajo del umbral | ✅ `validar.js` sin errores en todo el catálogo; la correcta es la más larga en el 17 % de los exámenes y el 21 % de los checks | `validar.txt`, `longitud-y-puesto.txt` |
| El umbral pasa de aviso a error | ✅ longitud, puesto y forma dan ERROR; con los umbrales bajados, exit 1 (111 + 47 + 1 errores) | `mutacion-umbrales.txt` |
| Explicaciones `w` correctas | ✅ 4 `w` corregidas o ajustadas (`q671446`, `c119fb2`, `c3787bb`, `c59ed1c`); el resto sin cambios | `estructura.txt` |
| Ids sin cambios: historial de repaso intacto | ✅ 1.164 preguntas: mismos ids, `a`, `q` y orden; 173 reescritas | `estructura.txt` |
| La forma no delata la correcta | ✅ 0 marcadas en los nueve cursos | `forma.txt` |
| Se pinta y corrige igual | ✅ check `c119fb2` (regex, artículo suelto) y examen de acceso-a-datos con 12 preguntas; 0 errores de consola | `navegador.txt`, `check-c119fb2.png`, `examen.png` |

Gates: `node --test` 107/107 · `verificar-offline.js` verde.
