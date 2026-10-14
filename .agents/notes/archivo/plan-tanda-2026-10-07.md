# Tanda 2026-10-07 — red de seguridad y deuda técnica sin decisiones

Estado: **cerrada**. Los 6 issues están mergeados, desplegados (`v33`) y en Done. La revisión fresca cazó un bloqueante real, una pérdida de progreso en el sync, que se arregló antes del merge. Hay 2 issues nuevos: #69 y #70.

## 1. Estado de partida (medido 07:59 +02:00)

- `main` en `e587828`, limpio, 0 PRs abiertos, `check-board.sh --project 6` → exit 0.
- `validar.js` sin errores, 61 avisos (300 tutoriales · 32 cursos · 464 preguntas · 682 checks · 95 retos); `node --test` 32/32. Producción en `v28`.
- Ramas remotas vivas: solo las de trabajo ya mergeado; ninguna de los issues de la tanda.
- Issues de la tanda: `OPEN`, `Backlog`, sin asignar, sin rama, sin PR, sin bloqueantes abiertos. Reproducción contra `main` de hoy:

| Issue | Reproduce hoy |
|---|---|
| #58 limpieza de verificar-offline | `limpiar()` ya espera al `exit` de Chrome con tope de 5 s (criterio 2 cumplido), pero un `rmSync` que lanza llega al `catch` de `main()` → exit 2 con todo verde (criterio 1 abierto) |
| #31 deuda de código | 3 `escapeHtml` locales (`quiz.js:23`, `exams.js:19`, `syntax.js:16`) + `escapeAttr` (`tutorial-nav.js:14`); `readJson`/`writeJson` sin exponer y ~8 `JSON.parse` a mano; `exams.js:38` lee la clave de Quiz; `highlights.js:389` parchea otro módulo; 4 `else`; sin tests de SRS ni `fragmento` |
| #29 sync | `per_page=100` sin paginar (`sync.js:67`), `keepalive` sin tope (`:117`), JSON indentado (`:123`), `ultimoSubido` antes del PATCH (`:202`), sin flag de exclusión (`:130`), input sin `<label>` (`:321`), error sin `role="alert"` (`:316`), cuota tragada (`perfil.js:41-44`) |
| #13 cabeceras | 5 variantes de `<header>` y 4 de `<footer>` en `tutorials/*.html`; `python-async-await` pinta 2 `.nav__burger` (`initMobileNav` no es idempotente, `core.js:230-236`) |
| #30 SW y arranque | `refreshShell` recarga fuentes (~336 KB) en cada arranque; `activate` borra cachés ajenas; `init.js` sin aislar; script del tema sin `try/catch` en 309/309 HTML; `search.js:43-45` memoriza la carga fallida |
| #15 scroll horizontal | #68 | `628d27a` | sin bloqueantes; menores aplicados: el paso de CI exige vistas pintadas y la emulación se restablece en `finally`; desborde de ~100 tutoriales → issue nuevo | 66 vistas a 320/375: 31 → 0 desbordes; escritorio idéntico píxel a píxel; producción en `v33` |
| #15 scroll horizontal | 31 combinaciones vista×ancho desbordan: `articulos` +20 px a 320; 16 cursos a 320 (clean-code +442) y 14 a 375 |

## 2. Línea de no colisión

Sin otros tracks ni otras personas. Solapes internos, todos en serie y con `git pull` + rebase antes de cada issue:

- `perfil.js`: #31 (`readJson`/`writeJson`) y #29 (`escribirJson` y la cuota) → #31 primero.
- Los ~309 HTML: #13 (header/footer) y #30 (script del tema en `<head>`) → #13 primero.
- `sw.js`: solo #30 sube `VERSION` (main+1 fijado al rebasar). #15 toca `styles.css`, que es shell → también sube `VERSION`; se fija al rebasar, nunca copiando `sw.js` de `main`.
- `scripts/verificar-offline.js`: #58, #30 y #15 (si su comprobación de desborde va ahí) → en ese orden.

## 3. Orden por demostrabilidad

1. **#58** — `skip-qa`. Que CI no dé rojos falsos es la red que necesitan todos los demás.
2. **#31** — añade tests de SRS y `fragmento` a `node --test`; refactor sin cambio de comportamiento, cubierto por validar, tests y verificar-offline.
3. **#29** — `node:test`+`vm` ya cubre sync y fusión de perfil; los tests nuevos van antes que el cambio. Toca datos de usuario: el riesgo más alto, por eso con red completa delante.
4. **#13** — mecánico y masivo, pero construye su propia red: `validar.js` falla ante una cabecera divergente.
5. **#30** — red parcial (`verificar-offline.js` + caso con `localStorage` bloqueado y throw forzado medidos en QA).
6. **#15** — el menos cubierto hoy: solo Playwright local. Su criterio 3 crea la comprobación de desborde (un paso en `verificar-offline.js` vía CDP, que no necesita npm). Cierra la tanda.

## 4. Límites y fuera de la tanda

Límites dentro de la tanda:

- **#58**: solo el criterio 1 y 3 (el 2 ya se cumple; se anota en el refine).
- **#31**: fuera la «mezcla de idiomas» (criterio ambiguo, no está en los checks de aceptación); el resto entra entero.
- **#29**: el «intervalo configurado» se toma como una constante con nombre en `sync.js` con el valor que decida el usuario (sección 6); si no lo decide, entra todo #29 menos ese criterio, que queda anotado.
- **#13**: el criterio de `core.js:225-229` se refina a `230-236`.
- **#15**: el criterio «30 slugs» se refina a «todos los cursos» (hoy 32).

| Fuera | Motivo |
|---|---|
| #14 reiniciar progreso | Decisión de producto: confirmación o deshacer |
| #16 contraste y foco | Decisión de paleta: llegar a 4,5 en oscuro cambia `--brand`/`--brand-2` (botón a 2,72) |
| #17 accesibilidad de checks y exámenes | Bloqueado por #16 |
| #18 errores de nueve lecciones | Editorial con fuentes externas; sin red mecánica. Mejor como repaso de contenido aparte (como #60) |
| #22 orientación en el inicio | Decisión de producto: rutas recomendadas, métricas, exámenes |
| #25 sesgo de longitud | Decisión de criterio editorial (curso piloto) y L: 6-10 PRs |
| #26 carga bajo demanda | Criterio de < 300 KB inviable tal cual + decisión de diseño |
| #27 rutas y cursos navegables | Decisión de diseño (plegado, filtro en URL) |
| #28 enlaces básico ↔ avanzado | Decisión de contenido y cifra base que no se reproduce |
| #32 deuda de CSS | Bloqueado por #17 |
| #33 deuda de contenido | Decisiones de contenido, orden de rutas y niveles |
| #34-#38 | Épicas de curso: `/implement-epic` |
| #39 | Paraguas de catálogo, sin tarea concreta |

Precedentes que se respetan: lo excluido en las tandas del 2026-10-06 sigue excluido.

## 5. Criterio de parada

- Primer rojo sin arreglo evidente: PR abierto con diagnóstico y salto al siguiente **solo si es independiente** (#58→#31→#29 y #13→#30 son cadenas por fichero; #15 es independiente).
- Criterio inviable o falso → comentario en el issue y se salta; no se reinterpreta.
- Cualquier decisión de producto, diseño o paleta que aparezca → pregunta anotada y se sigue con lo independiente.
- **#29 y #31**: cualquier pérdida o cambio de datos guardados del usuario (`localStorage`, gist) en los tests o el QA → para la tanda.
- **#13 y #30**: un cambio visible en la cabecera o el tema de una página fuera de lo que piden → para ese issue.
- Borrar algo no acordado aquí → para.
- Gate de checks siempre en un paso propio que corta la ejecución; nunca encadenado al merge.
- `verificar-offline.js` nunca en paralelo (puertos fijos), tampoco en los revisores.
- Límites del loop: 5 intentos por nodo, 30 ciclos, 120 minutos.

## 6. Decidido por el usuario al lanzar

> «¿Cómo la lanzo?» → **«Lanzar con automerge (Recomendado)»**: se mergea lo que pase review fresca, QA y gate de checks, con las evidencias enlazadas en cada PR para repasarlas después.
>
> «#29: ¿qué intervalo?» → **«30 segundos (Recomendado)»**.

## Registro

| Issue | PR | Merge | Review (subagente, contexto fresco) | QA |
|---|---|---|---|---|
| #58 limpieza de verificar-offline | #63 | `00a51d9` | sin bloqueantes; menor aplicado: solo se ignora `ESRCH` al terminar procesos | skip-qa documentado: borrado roto simulado → exit 0 con aviso (main: exit 2); fallo real → exit 1, también con el borrado roto |
| #31 helpers compartidos | #64 | `1a14535` | sin bloqueantes (equivalencia función por función + guion idéntico en navegador); menores: `Quiz?.resultOf`, línea en blanco | main vs rama con `Math.random` sembrado: mismo `localStorage` y DOM, 0 errores; solo `./` en dos enlaces; producción en `v29` |
| #29 sync robusto | #65 | `6dd39b0` | **1 bloqueante aceptado**: con el throttle, la subida al salir de una página que no sincronizó pisaba el gist sin fusionar → solo sube si la página sincronizó; segunda ronda limpia | main vs rama con la API simulada: sin duplicar el gist, 0 peticiones en el intervalo, import y cuota visibles, sin pisar al otro dispositivo; producción en `v30` |
| #13 cabeceras únicas | #66 | `ac4d78b` | sin bloqueantes; efectos visibles del pie y tooltip declarados en el PR; drawer estático muerto de python/rust → issue nuevo al cierre | 301 tutoriales main vs rama: 42 → 0 páginas con dos hamburguesas, 21 → 0 sin año, nav idéntico; producción en `v31` |
| #30 SW y arranque | #67 | `65e605a` | sin bloqueantes; menor aplicado: quitar el `<script>` del índice si falla | arranque del worker 1.755 KB → 0 B (304); `otra-app` sobrevive; throw en init no tumba SW ni sync; tema sin destello con `localStorage` bloqueado; búsqueda reintenta; Pages envía ETag; producción en `v32` |

### Desviaciones del contrato

- **#29: el arreglo pedido abría una vía de pérdida de datos.** Con el throttle, una página que se saltaba la sync al cargar subía al salir su progreso local sobre el gist sin fusionarlo. La revisión fresca lo reprodujo. Se arregló antes del merge (solo sube al salir si esa página sincronizó) y una segunda ronda de revisión confirmó el cierre.
- **#29 destapó la causa de fondo del coste del sync.** `exportadoEn` hacía que todo export pareciera distinto. Entró en el mismo PR porque es lo que el criterio 1 pedía arreglar.
- **El QA midió dos veces un servidor equivocado** (un `http.server` viejo en el mismo puerto). Se detectó por resultados incoherentes y se repitió. Va como trampa a `estado.md`.

### Lecciones

- La revisión fresca rinde más donde hay datos de usuario: en #29 encontró lo que los tests escritos por el autor no cubrían. Para los PRs de sync y perfil, pedir siempre al revisor que busque caminos de pérdida de datos.
- Un throttle cambia qué estado tiene una página: todo lo que asumía «esta página ya sincronizó» tiene que volver a comprobarse.
- Antes de citar una cifra del QA, comprobar qué está midiendo. Los «0 bytes» de main salieron de un servidor mal escrito y solo se vio porque en main no podía salir 0.

### Lo que la tanda destapó

| Issue nuevo | Prioridad | De dónde sale |
|---|---|---|
| #69 Retirar el drawer estático muerto de las páginas de Python y Rust | P2 | Review de #66: enlaces invisibles alcanzables con el teclado en 42 páginas |
| #70 Eliminar el scroll horizontal de los tutoriales a 320 y 375 px | P1 (bloqueado por #15, ya cerrado) | Review de #68: unos 104 tutoriales desbordan a 320 px |

### Preguntas que esperan al usuario

Las que dejan fuera a los issues de la sección 4, sin cambios: confirmación o deshacer al reiniciar (#14), la paleta para el contraste en oscuro (#16, que bloquea #17 y este a #32), qué recomendar en el inicio (#22), el criterio del distractor en #25 y el diseño de rutas y cursos (#27).

### Backlog al cerrar

- **P1 (6):** #14, #16, #17, #18, #22 y #70. Tomables sin decisión: #18 (repaso editorial con fuentes) y #70.
- **P2 (12):** #25-#28, #32-#38 y #69. Tomable sin decisión: #69.
- **P3 (1):** #39.

Gates en `main` 628d27a: `validar.js` sin errores (61 avisos); `node --test` 63/63; `verificar-offline.js` 17/17 en CI.
