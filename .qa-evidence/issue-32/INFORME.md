# QA #32 — deuda de CSS (refactor)

Vehículo: Chrome headless por CDP, `file://`, con la rama `5d93a8a` frente a `main`. El criterio funcional de un refactor es que nada cambie.

| Comprobación | Resultado | Evidencia |
|---|---|---|
| Geometría de todos los elementos de los 300 tutoriales a 1280 px | ✅ 300/300 idénticas | `geometria-1280.txt` |
| Colores computados (color, fondo, borde, gradiente y sombra) en 4 páginas y los dos temas | ✅ idénticos | `colores-computados.txt` |
| Criterios estáticos (0 literales, 0 `transition: all`, selectores muertos, `orientation`) | ✅ verificados en la review | review del PR |
