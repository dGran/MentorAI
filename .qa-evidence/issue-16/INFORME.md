# QA #16 — contraste y foco

Vehículo: la matriz `scripts/contraste.js` (sobre el CSS de la rama `fad9c39` y el de `main`) y Chrome headless por CDP contra la rama en `:8000`, en los temas claro y oscuro.

| Criterio | Resultado | Evidencia |
|---|---|---|
| 1. `--text-muted` ≥ 4,5 en las 4 superficies, en los dos temas | ✅ claro 4,66-5,50 · oscuro 4,68-5,90 (en `main`, 3,97-4,42 en claro) | `c1-c2-c3-matriz-rama.txt`, `c1-c2-c3-matriz-main.txt` |
| 2. Texto sobre el gradiente de marca ≥ 4,5 en los dos temas | ✅ 4,66-4,93 (la review lo midió también en el chip activo y en el nodo final del `.flow`) | matriz |
| 3. `--focus-ring` y `:focus-visible` de 2 px y ≥ 3:1; ningún `outline: none` | ✅ 25 elementos enfocados con Tab en el inicio y en cada tema: 0 sin anillo. El buscador lo muestra en claro y en oscuro | `c2-c3-navegador.txt`, `c3-foco-buscador-{light,dark}.png` |
| 4. Script de la matriz | ✅ 46 pares en la rama, todos ✓; en `main`, 20 ✗ | matriz |

0 errores de consola.
