# QA #34, fase 1: contenido del curso de Python

Vehículo: Chrome headless por CDP contra la rama en `:8000` (run `02-verify-43a3e46`).

| Criterio de #34 | Resultado | Evidencia |
|---|---|---|
| Cada lección tiene «Cuándo aplicarlo» enlazado en el índice | ✅ 21/21 | `criterios-por-leccion.txt`, `cuando-aplicarlo.png` |
| Al menos un callout de errores típicos | ✅ 21/21 (15 nuevos, colocados al final de la sección anterior) | `criterios-por-leccion.txt`, `errores-tipicos.png` |
| Minutos realistas (≥ 60 palabras/min de prosa) y hero igual que el manifest | ✅ 21/21; solo `python-funciones` baja de 11 a 10 | `criterios-por-leccion.txt` |
| Examen ≥ 18 con ≥ 30 % de escenario | ✅ 18 preguntas, 6 de escenario (33 %); la más larga en el 17 %, puesto dominante en el 39 %, 0 pistas de forma | `examen-python.txt` |
| Se pinta sin romper la plantilla | ✅ 42 vistas (1280 y 375): 0 `<pre>` sueltos, 0 callouts sin cuerpo, sin scroll horizontal y 0 errores de consola | `python-21-lecciones.txt` |
| Validador | ✅ sin errores; aviso de «Cuándo aplicarlo» de 96 a 75 lecciones | `validar.txt` |

Gates: `node --test` 112/112 · `verificar-offline.js` verde.
