# QA #17 — checks y exámenes accesibles

Vehículo: Chrome headless por CDP contra la rama `622759b` en `:8000`, con interacción por teclado (Tab y Enter), y la matriz `scripts/contraste.js`.

| Criterio | Resultado | Evidencia |
|---|---|---|
| 1. Icono y texto en la opción correcta y en la elegida | ✅ «Tu respuesta (wrong)» y «Correcto (correct)»; 2 etiquetas por pregunta en el examen, también tras reenvíos | `c1-c2-check-y-examen.txt`, `check-fallado.png`, `examen-corregido.png` |
| 2. Región `role="status"` con veredicto y explicación | ✅ en los checks, un solo anuncio. En el examen, el aviso de incompleto es `role="alert"` y el resultado se anuncia al enfocarlo | `c1-c2-check-y-examen.txt` |
| 3. El foco no cae al `body` | ✅ check: se queda en la opción (`aria-disabled`); examen incompleto: va a la primera pregunta sin responder; examen completo: va a `#quiz-result` | `c3-foco-y-reenvios.txt` |
| 4. Colores de tokens `--success`/`--danger` (y `-soft`/`-text`); sin parches de oscuro | ✅ matriz con todos los pares en ✓ | `c4-matriz.txt` |
