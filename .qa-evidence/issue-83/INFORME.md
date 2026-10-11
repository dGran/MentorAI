# QA #83 — ancho de línea y `<main>`

Vehículo: Chrome headless por CDP contra la rama `327e461` en `:8000`.

| Criterio | Resultado | Evidencia |
|---|---|---|
| 1. ≤ 75 caracteres por línea | ✅ máximo por bloque: párrafos 68-70, listas 51-67, callouts 62-74 | `c1-caracteres-por-linea.txt` |
| 2. Un único `<main>`, y validador | ✅ 1 `main` por página; el skip link lleva el foco a `MAIN#contenido` | `c2-skip-link-y-main.txt` |
| 3. No regresión del TOC a 375 | ✅ y = 770 de 812, igual que en `main` | `c3-toc-375.txt` |
| 4. Sin scroll horizontal | ✅ `verificar-offline.js`: 666 vistas | gates del PR |
