# QA funcional — issue #13 (cabeceras y pies únicos)

Entorno:
- `python3 -m http.server`: `main` (0f46b09) en :8001 desde un worktree, la rama (49475f2) en :8000.
- Chromium a 375 px con el service worker bloqueado.

Comando: `node command.mjs <base> <assets> <repo>`. Recorre **los 301 tutoriales**.

| Medida | main | rama |
|---|---|---|
| Páginas con ≠ 1 `.nav__burger` | **42** (`python-*`, `rust-*`: 2 cada una) | **0** |
| Páginas sin año en el pie | **21** (`go-*`) | **0** |
| Páginas con el nav distinto del canónico (Inicio, Rutas, Cursos, Artículos, Repaso, Perfil, Sin conexión) | 0 | 0 |
| Abrir la hamburguesa en `python-a-produccion` | el primer botón (el estático) no abre nada (`aria-expanded` nulo) | `aria-expanded="true"`, drawer con los enlaces |
| Errores de consola | 0 | 0 |

Capturas revisadas:
- `01-reproduce/python-cabecera-375.png`: dos hamburguesas.
- `02-verify/python-drawer-375.png`: el drawer abierto.
- `02-verify/go-pie.png`: «© 2026 · Hecho para leer con gusto».

No probado: la apertura por `file://`. Solo cambian bloques HTML estáticos y un guard en `core.js`.

Veredicto: **aprobado**.
