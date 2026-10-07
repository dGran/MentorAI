# QA funcional — issue #31 (refactor de helpers compartidos)

Objetivo: demostrar que el refactor no cambia nada observable. Las mismas acciones de usuario sobre `main` y sobre la rama tienen que dar el mismo DOM, el mismo `localStorage` y 0 errores.

Entorno:
- `python3 -m http.server`: `main` en :8001 desde un worktree, la rama en :8000.
- Chromium headless con `Math.random` sembrado (semilla 42), para que el barajado de opciones sea el mismo en las dos ramas.
- Fechas y porcentaje de lectura normalizados.

Comando: `node command.mjs <base> <assets>`.

Recorrido:
1. Contestar los 3 checks de `ag-qa-con-evidencias`.
2. Enviar las 17 preguntas del examen en `ag-el-metodo-que-aprende`.
3. Ficha del curso: estado del examen, que ahora pasa por `MentorAI.Quiz.resultOf`.
4. `repaso.html`, `perfil.html` y una lección con código: enlaces del menú, enlace offline y resaltado.
5. Buscador del inicio con «precarga»: el fragmento con `<mark>`.
6. Service worker real en un contexto aparte: `scope` y script.

| Run | Commit | Resultado |
|---|---|---|
| 01-reproduce | 00a51d9 (main) | Línea base |
| 02-verify | 1ed54b8 (rama) | Idéntico salvo 3 líneas (`diff-main-rama.txt`): `repaso.html` → `./repaso.html` y `perfil.html` → `./perfil.html`, que resuelven a la misma URL, y el puerto del servidor en el `scope` del worker. `localStorage`: mismas claves y mismos valores (checks, quiz, repaso con 20 entradas, lectura). 0 errores de consola en las dos |

Capturas revisadas: `checks.png` (check contestado, con correcta, fallo y explicación).

No probado: la apertura por `file://`. La condición de `basePath()` es la misma de antes.

Veredicto: **aprobado, sin cambio de comportamiento**.
