# QA #25 (piloto «fundamentos»)

Vehículo: Chrome headless por CDP contra la rama `8cbbc16` en `:8000`. Es un PR de contenido: su corrección la revisaron dos rondas de review. El QA comprueba que las preguntas se pintan y se corrigen en la app.

| Comprobación | Resultado | Evidencia |
|---|---|---|
| Los checks de una lección del curso (`bits-y-bytes`) se pintan y se corrigen con el texto nuevo | ✅ veredicto con la correcta nueva («Vuelve a 0: se desborda…»), etiquetas y foco | `check-y-examen.txt`, `check-fallado.png` |
| El examen del curso (en `owasp`) corrige las 20 preguntas | ✅ 40 etiquetas (2 por pregunta) y resultado con foco | `check-y-examen.txt`, `examen-corregido.png` |
| Sesgo (correcta estrictamente la más larga) | ✅ checks 7/45, examen 2/20 (antes 45/45 y 15/20) | `sesgo.txt` |
| Errores de consola | ✅ 0 | `check-y-examen.txt` |
