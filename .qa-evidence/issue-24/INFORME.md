# QA funcional — issue #24 (curso metodo-con-agentes)

Objetivo: el curso existe y se puede recorrer de verdad en la aplicación servida, con lecciones, examen, checks, retos, ruta y enlace desde `cc-flujo-de-equipo`.

Entorno: `python3 -m http.server` (main en :8001 desde un worktree, rama en :8000), Chromium headless con el service worker bloqueado, 1280 px en tema claro y 375 px en oscuro. Comando: `node command.mjs <base> <assets> reproduce|verify`.

| Run | Commit | Resultado |
|---|---|---|
| 01-reproduce | 59504a4 (main) | Ni curso, ni retos, ni enlace desde la ruta o el callout: el curso no existe |
| 02-verify | 1959f24 (rama) | 13 lecciones con TOC íntegro, «Cuándo aplicarlo» y 3 checks cada una; navegación encadenada hasta «Fin del curso → Haz el examen del curso»; ficha con 4 módulos y 3 retos; examen de 17; ruta y callout enlazan; 0 errores de consola; sin scroll horizontal a 375 |

Capturas revisadas a mano antes de citarlas: la ficha del curso completa, una lección a 1280 px y otra a 375 px en oscuro.

No probado: el modo offline (lo cubre `verificar-offline.js` en CI) y la apertura por `file://` (la arquitectura no cambia: solo datos y HTML con el esqueleto de siempre).

Veredicto: **aprobado**.
