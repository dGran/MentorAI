# QA #25, bloque 3: longitudes, puestos y forma

Vehículo: Chrome headless por CDP contra la rama `55a3949` en `:8000`, más los medidores.

| Criterio | Resultado | Evidencia |
|---|---|---|
| La correcta deja de ser la más larga | ✅ entre el 13 y el 31 % (examen) y el 20 y el 28 % (checks); validador sin avisos | `longitud-y-puesto.txt` |
| Ningún puesto de longitud domina | ✅ como mucho, un 45,0 % exacto (ia-por-dentro, checks) | `longitud-y-puesto.txt` |
| La forma no delata la correcta | ✅ 0 de 216 preguntas | `forma.txt` |
| Historial de repaso intacto | ✅ 159 reescritas; ids, `a`, `q`, `w` y orden intactos | `estructura.txt` |
| OOMKilled corregido | ✅ check `cdda617` pintado y corregido; el reto de práctica de la ficha k8s-para-devs habla del kubelet y no de «resucitar» | `navegador.txt`, `check-cdda617.png`, `practica-oomkilled.png` |
| Examen | ✅ k8s-desplegar-tu-app con 10 preguntas; 0 errores de consola | `navegador.txt`, `examen.png` |

Gates: `validar.js` sin errores · `node --test` 107/107 · `verificar-offline.js` verde.
