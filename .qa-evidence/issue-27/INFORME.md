# QA #27 — Rutas y Cursos navegables

Vehículo: Chrome headless por CDP contra la rama `d05eb1c` servida por http en `:8000`. Por http aparecen los envoltorios `.course-card-wrap` con el botón de offline; por `file://` no.

| Criterio | Resultado | Evidencia |
|---|---|---|
| 1. Rutas plegadas con anclas, < 2.000 px a 1280 | ✅ 1.895 px, 7 `<details>`; `#ruta-x` abre la suya; el `summary` funciona con teclado; tras repintar, las abiertas siguen abiertas | `c1-c4-navegacion.txt`, `rutas-plegadas.png`, `repintados-y-miga.txt` |
| 2. Ruta y «paso N de M» en la ficha | ✅ Git: «El grado… paso 13 de 26» y «Construir un servicio paso 1 de 12» | `c1-c4-navegacion.txt`, `ficha-git-rutas.png` |
| 3. Filtro por nivel en cursos | ✅ visibilidad real (alto renderizado) de tarjetas, envoltorios y botones: 32 / 2 / 18 / 12 según el nivel, también tras un repintado como el del sync | `c3-filtro-visibilidad-real.txt`, `cursos-filtro-principiante.png` |
| 4. Miga Inicio › Curso › lección; categoría del artículo enlazada y filtrada | ✅ | `c1-c4-navegacion.txt`, `repintados-y-miga.txt` |
