# QA #26 — carga bajo demanda de quizzes, checks y práctica

Vehículo: Chrome headless por CDP contra la rama `6e3b471` en `:8000` y `main` (`5a5a750`) en `:8001`. El peso es la suma de `decodedBodySize` de los `.js` de la página.

| Criterio | Resultado | Evidencia |
|---|---|---|
| 1. Las 4 páginas índice no cargan `quizzes.js`, `checks.js` ni `practica.js` | ✅ index, rutas, cursos y artículos: 1.073 → 425 KB, solo `quiz-summary.js` (2 KB) | `pesos-y-ui-*.txt` |
| 2. La lección los inyecta bajo demanda | ✅ `sql-joins`: 425 KB al cargar, 695 KB con los checks al acercarse al final; `redis-cache`: 425 KB. La lección del examen (`git-deshacer`) carga checks y quizzes al momento: 965 KB | `leccion-*.txt` |
| 3. Lo que depende de los datos se ve igual que en `main` | ✅ 32 insignias en Cursos, 32 exámenes en el inicio, 6 paneles en Rutas, 33 retos en la ficha del curso, checks 2/3 y examen de 10 en las lecciones, «Repaso (1)» | `pesos-y-ui-*.txt`, `leccion-*.txt` |
| 4. Examen de ruta | ✅ `quizzes.js` no está al abrir Rutas y llega al pulsar: 12 preguntas, sin errores | `examen-de-ruta-rama.txt` |
| 5. Anclas | ✅ `#quiz` y `#check` aterrizan a 90 px con los datos ya pintados; el botón «Hecho» de la lección del examen sale bloqueado. Un ancla a una sección que ya existe no carga datos y aterriza igual que `main` (180 px) | `anclas-rama.txt` |
| 6. Datos del usuario | ✅ Mismas claves y formato de `localStorage` (review ronda 2); «Repaso (1)» se conserva | review |
| 7. `file://` y sin conexión | ✅ Inyección de `<script>`, sin `fetch`. `verificar-offline.js`: «checks cargados bajo demanda sin red» | gates |

Observado: con un service worker antiguo instalado, la primera visita sirve el HTML cacheado (con los `<script>` de datos de antes) y lo revalida; desde la siguiente ya llega el nuevo. Es el comportamiento de siempre al subir `VERSION`.

Limitación aceptada (C3 de la review): resaltados y audio leen el DOM al cargar y no ven el texto de los checks inyectados después.

Gates: `validar.js` sin errores (59 avisos), `node --test` 99/99, `contraste.js` verde, `verificar-offline.js` verde.
