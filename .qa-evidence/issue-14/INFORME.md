# QA #14 — deshacer al reiniciar el progreso

Vehículo: Chrome headless por CDP contra la rama `ea0cf4c` servida en `:8000` (`python3 -m http.server`, comprobado su `cwd`). Los datos se siembran en el `localStorage` de un perfil temporal de Chrome: no toca datos reales.

| Criterio | Resultado | Evidencia |
|---|---|---|
| 1. Reiniciar el curso borra y ofrece «Deshacer» ~8 s; deshacer restaura `academia-progress` y `academia-reading` exactos | ✅ restaurado carácter a carácter; sin deshacer, a los 8,6 s el aviso se cierra y el borrado se mantiene; el hover pausa la cuenta | `c1-c2-curso-y-leccion.txt`, `c1-pausa-hover.txt`, `c1-curso-aviso-deshacer.png` |
| 2. La lección, igual y con peso secundario | ✅ restaurado exacto, repinta «Completado · 100 %». Doble clic + Enter desde el teclado restauran exacto. Sin progreso no se ofrece. «Reiniciar» transparente y en `--text-muted` | `c1-c2-curso-y-leccion.txt`, `c2-doble-clic-teclado-320.txt`, `c2-leccion-acciones.png`, `c2-leccion-aviso-deshacer.png` |
| 3. El aviso se anuncia | ✅ mensaje en `role="status"`, con el foco en «Deshacer» | `c1-c2-curso-y-leccion.txt`, `c3-aviso-320.png` |

Errores de consola: 0.
