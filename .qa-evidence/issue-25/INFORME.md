# QA #25, bloque 2: longitudes, puestos y forma

Vehículo: Chrome headless por CDP contra la rama `671e2eb` en `:8000`, más los medidores de longitud, puesto y forma.

| Criterio | Resultado | Evidencia |
|---|---|---|
| La correcta deja de ser la más larga | ✅ entre el 13 y el 25 % en los cuatro cursos (examen y checks) | `longitud-y-puesto.txt` |
| Ningún puesto de longitud domina | ✅ como mucho, un 44 % | `longitud-y-puesto.txt` |
| Ratio larga/corta ≤ 2 | ✅ máxima 1,97 | `longitud-y-puesto.txt` |
| La forma no delata la correcta | ✅ 0 de 152 preguntas | `forma.txt` |
| Historial de repaso intacto | ✅ 1.164 preguntas: mismos ids, `a` y orden; 137 reescritas, 0 `q` y 1 `w` (`c3053ea`) | `estructura.txt` |
| Se pinta y corrige igual | ✅ check `c7368c5` de `maq-cpu`, con la correcta marcada al pulsarla; examen de la-maquina con 12 preguntas; 0 errores de consola | `navegador.txt`, `check-c7368c5.png`, `examen.png` |
| Validador | ✅ sin errores; 0 avisos en los cuatro cursos | `validar.txt` |

Gates: `node --test` 107/107 · `verificar-offline.js` verde.
