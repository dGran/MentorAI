# Tanda 2026-10-11 — accesibilidad móvil, carga y repaso de contenido

Estado: **cerrada**. De los 7 issues, entraron 6, todos mergeados, desplegados (`v37`) y verificados en producción: #69, #70, #14, #18, #28 y #33 (en parte). **#26 se quedó fuera** por tamaño y riesgo, con todo lo medido en sus comentarios. Las revisiones frescas cazaron 6 bloqueantes reales y todos se arreglaron antes del merge: 1 en #70, 2 en #14, 1 en la ronda 2 de #70 y 2 en #28. Issues nuevos: #77 y #78.

## 1. Estado de partida (medido 04:40 +02:00)

- `main` en `dc712ef`, limpio, 0 PRs abiertos, `check-board.sh --project 6` → exit 0. Producción en `v33`.
- `validar.js` sin errores, 61 avisos (300 tutoriales · 32 cursos); `node --test` 63/63; `verificar-offline.js` verde (66 vistas móviles, 1 m 26 s).
- Ramas remotas vivas: solo las de trabajo ya mergeado; ninguna de los issues de la tanda.
- Issues de la tanda: `OPEN`, `Backlog`, sin asignar, sin rama, sin PR, 0 bloqueantes abiertos (#26 dependía de #19, cerrado), sin `blocked-external`. Reproducción contra `main` de hoy:

| Issue | Reproduce hoy |
|---|---|
| #69 drawer estático muerto | 42 `tutorials/*.html` con `.nav-drawer` escrito en el HTML |
| #70 scroll horizontal en tutoriales | barrido CDP por `file://` de los 300: 103 desbordan a 320 px y 88 a 375 px; peores `go-a-produccion` (+1058), `go-tipos-y-variables` (+970), `python-entorno-docker` (+870) |
| #14 reiniciar progreso | `courses.js` borra `Progress` y `Reading` del curso sin confirmar ni deshacer |
| #26 carga bajo demanda | una lección carga 1.080 KB de JS: `quizzes.js` 277, `checks.js` 273, `manifest.js` 177, `practica.js` 116 |
| #33 deuda de contenido | pendiente de medir en el refine (preguntas y cifras citadas) |
| #28 enlaces básico ↔ avanzado | pendiente de medir en el refine (la cifra base de 197 no se reprodujo en la tanda del 07-10) |
| #18 errores de nueve lecciones | muestreados en `main`: `CancelledError` en `python-async-await`, «no es determinista» en `rust-ownership`, `USING (cliente_id)` en `sql-joins`, 12.000 vs 10.000 en `opcache`, DynamoDB en `cap-consistencia`, «casi siempre» en `k8s-objetos`, 0 `stop_reason` y errata «seria» en `ia-llamar-a-un-llm`, «0.3 ns/op» sin `b.Loop` en `go-testing` |

## 2. Línea de no colisión

Sin otros tracks ni otras personas. Solapes internos, todos en serie y con `git pull` + rebase antes de cada issue:

- `scripts/validar.js`: #69 (regla del drawer), #70 (regla de `.table-wrap`), #33 (campo `reviewed`) → en ese orden.
- `scripts/verificar-offline.js`: #70 (tutoriales en el paso de desborde) y #26 (si la carga bajo demanda necesita comprobación offline) → #70 primero.
- `tutorials/*.html`: #69 (drawer), #70 (`.table-wrap`), #26 (`<script>` de datos), #33, #28 y #18 (cuerpos) → hunks distintos, en serie.
- `tutorials/quizzes.js`, `checks.js`, `manifest.js`: #26 (cómo se cargan), #33 (preguntas y `reviewed`), #18 (preguntas de las nueve lecciones) → #26 primero.
- `sw.js`/`VERSION`: #70, #14 y #26 tocan shell → cada uno fija `VERSION` = la de `main` + 1 **al rebasar justo antes de mergear**; quien no toque shell deja `sw.js` sin cambios en la rama.

## 3. Orden por demostrabilidad

1. **#69** — mecánico; construye su propia red: `validar.js` da ERROR ante un drawer escrito en el HTML.
2. **#70** — construye la red que hoy falta: el paso de desborde de `verificar-offline.js` recorre los tutoriales. Escritorio comparado píxel a píxel con `main`.
3. **#14** — lógica de datos del usuario; tests `node:test` de deshacer antes del cambio, QA en navegador.
4. **#26** — refactor sin cambio de comportamiento, cubierto por `validar.js`, `node --test` y `verificar-offline.js` (ya con los tutoriales de #70). Toca el SW.
5. **#33 parcial** — `reviewed` entra con su regla en el validador; las cifras se comprueban con `grep`; las 4 preguntas contra fuentes.
6. **#28 limitado** — `validar.js` caza enlaces rotos; el conteo de enlaces entrantes va como script en el PR.
7. **#18** — editorial, sin red mecánica de la verdad del texto: solo la revisión fresca contra fuentes oficiales. Cierra la tanda.

## 4. Límites y fuera de la tanda

Límites dentro de la tanda (decididos por el usuario, § 6):

- **#14**: patrón «deshacer» (~8 s, `role="status"`), no confirmación. Restaura `academia-progress` y `academia-reading` exactamente.
- **#26**: el criterio «< 300 KB» se refina a: las 4 páginas índice no cargan `quizzes.js`, `checks.js` ni `practica.js`, y una lección los inyecta bajo demanda (objetivo medido ~415 KB, desde 1.080). El manifest sigue cargándose siempre.
- **#28**: entran las 5 parejas del criterio 1 y la conversión a enlace de las referencias en texto plano encontradas; la cifra objetivo del criterio 2 se recalcula en el refine sobre el conteo de hoy.
- **#33**: entran las 4 preguntas discutibles, las cifras caducadas (`grep`) y el campo `reviewed` (manifest + validador, cursos de IA). Fuera: orden de rutas, niveles, lecciones gemelas y el ≥ 30 % de preguntas de escenario → quedan en el issue, que no se cierra.
- **#18**: un solo PR con un commit por lección; cada punto «verificar» contrastado con documentación oficial actual y la fuente citada en el PR.

| Fuera | Motivo |
|---|---|
| #16 contraste y foco | Decisión de paleta |
| #17 accesibilidad de checks y exámenes | Bloqueado por #16 |
| #22 orientación en el inicio | Decisión de producto |
| #25 sesgo de longitud | Criterio editorial y L: 6-10 PRs |
| #27 rutas y cursos navegables | Decisión de diseño |
| #32 deuda de CSS | Bloqueado por #17 |
| #34-#38 | Épicas de curso: `/implement-epic` |
| #39 | Paraguas de catálogo, sin tarea concreta |

Precedentes: lo excluido el 07-10 sigue excluido salvo #14, #18, #26, #28 y #33, que el usuario metió hoy con los límites de arriba.

## 5. Criterio de parada

- Primer rojo sin arreglo evidente: PR abierto con diagnóstico y salto al siguiente **solo si es independiente** (#69→#70 y #26→#33→#18 son cadenas por fichero; #14 y #28 son independientes).
- Criterio inviable o falso → comentario en el issue y se salta; no se reinterpreta.
- Cualquier decisión de producto, diseño o paleta nueva → pregunta anotada y se sigue con lo independiente.
- **#14 y #26**: cualquier pérdida o cambio de datos guardados del usuario en tests o QA → para la tanda.
- **#69 y #70**: un cambio visible en escritorio (1280 px) fuera de lo pedido → para ese issue.
- **#18, #28 y #33**: un dato que no se pueda contrastar en fuente oficial no se cambia; se anota en el PR.
- Borrar algo no acordado aquí → para.
- Gate de checks siempre en un paso propio que corta la ejecución; nunca encadenado al merge.
- `verificar-offline.js` nunca en paralelo (puertos fijos), tampoco en los revisores. Antes de levantar un `http.server`, `ss -ltnp`.
- Límites del loop: 5 intentos por nodo, 45 ciclos, 360 minutos.

## 6. Decidido por el usuario al lanzar

> «¿Metemos #18 en la tanda?» → **«Dentro, al final»**.
>
> «¿Cómo lanzo la tanda?» → **«Automerge (Recomendado)»**: se mergea lo que pase review con subagente fresco, QA y gates de CI, con evidencias enlazadas en cada PR para repasar después.
>
> «no podemos añadir nada más a la tanda?» → **«#14 reiniciar progreso, #26 carga bajo demanda, #28 enlaces, limitado, #33 parcial»**.
>
> «#14: ¿qué patrón?» → **«Deshacer ~8 s (Recomendado)»**.

## Registro

| Issue | PR | Merge | Review (subagente, contexto fresco) | QA |
|---|---|---|---|---|
| #69 drawer estático muerto | #71 | `bcfddd4` | sin bloqueantes. Menor aplicado: la regex también caza clases extra y comillas simples. Descartado: falso positivo con la marca como ejemplo de código. CSS `.nav-drawer__footer`/`__theme` sin uso → anotado en #32 | 375 px, rama frente a `main`: drawers en el DOM 2/2 → 1/1, paradas de Tab invisibles 7 → 0, hamburguesa y Esc correctos; producción sin drawers escritos |
| #70 scroll horizontal en tutoriales | #72 | `faef479` | **2 rondas.** Ronda 1: bloqueante aceptado, `.prose { overflow-wrap: anywhere }` aplastaba tablas y partía palabras (1957 a 320 px) → `anywhere` solo en flex items con tokens largos y `break-word` en `.prose`; menores aplicados: vista sin pintar = fallo, regex de tablas con `i`, literal con nombre. Ronda 2: etiquetas de `.flow__arrow` partidas letra a letra → `overflow-wrap: normal` | http, rama frente a `main`: desbordes 103/88 → 0/0; verificador nuevo verde en la rama (666 vistas) y rojo contra `main`; tablas con scroll en su contenedor; 287/300 idénticas a 1280 (las 13 distintas son las tablas envueltas); producción en `v34` |

### Desviaciones del contrato

- **Orden (07:20).** Lo que queda pasa de #26 → #33 → #28 → #18 a **#18 → #33 → #28 → #26**. Motivo: el refine de #26 midió que las páginas índice necesitan el total y la nota de corte de cada examen (`exams.js`, `examen-ruta.js`), así que sin `quizzes.js` hace falta un resumen generado con su propia comprobación en el validador. Es el issue de más riesgo y tamaño, y con ~3 h de presupuesto va al final: si se agota el tiempo, queda pendiente él y no tres issues de contenido. Ninguno de los adelantados depende de la red de #26.
| #14 deshacer al reiniciar el progreso | #73 | `6fe2481` | **2 rondas.** Ronda 1: 2 bloqueantes aceptados. (1) La lectura deshecha se perdía en la siguiente sync si había scroll entre reiniciar y deshacer → se registra el alta de toda entrada restaurada que difiera de la actual (test nuevo). (2) Un doble clic en «Reiniciar» anulaba el deshacer → sin progreso no se reinicia. Menores aplicados: foco en «Deshacer» y aviso con el ancho disponible a 320 px. Ronda 2: aprobado; menores aplicados: pausa solo con hover (antes podía quedar abierto sin límite) y el aviso por encima de la barra de audio. Límite asumido: deshacer pisa una acción hecha durante los 8 s | http, datos sembrados: curso y lección restauran exacto; doble clic y teclado correctos; cierre a los 8 s con el foco al `h1`; producción en `v35` |
| #18 errores técnicos de nueve lecciones | #74 | `7435a87` | sin bloqueantes: el revisor abrió cada fuente oficial. 4 menores aplicados (`Rc` frente a «no cuenta referencias», «como mínimo» en opcache, DynamoDB no expone R/W, *free-threaded* experimental en 3.13). Desviación: `quizzes.js`/`checks.js` son shell y se me pasó `VERSION` hasta el final del PR → `v36` | las 9 cargan sin errores, el índice apunta a `h2` reales, los checks reescritos se pintan y no hay desborde nuevo a 1280 px; investigación con fuentes delegada a un subagente de solo lectura; producción en `v36` |
| #33 deuda de contenido (parcial) | #75 | `3912b38` | aprobado; menores aplicados: días imposibles (`2026-06-31`) y «futuro» medido en UTC en `validarRevision`, «unos 9 MB» medido (no 10), cifras del README. Deuda declarada: `validar.js` sin tests | check y lecciones con el texto nuevo, `offline.html` con «309 páginas, unos 9 MB»; producción en `v37`. **El issue sigue abierto** en Backlog con lo editorial |
- **#26 fuera de la tanda (08:15).** Al refinarlo apareció un consumidor más, el contador «Repaso (N)» del menú, que hace crecer el resumen generado. Con ~2,5 h de presupuesto no cabía con review y QA serios. Lo medido está en sus dos comentarios.
- **#18 subió `VERSION` al final del PR.** `quizzes.js` y `checks.js` son shell, y no lo tuve en cuenta hasta preparar #33. Antes de mergear, `v36` = main + 1.
- **#33 entra en parte**, por decisión del usuario. El issue vuelve a Backlog sin asignar, con lo editorial pendiente escrito en él.
- **El refine y la investigación de #18 y la propuesta de enlaces de #28 se delegaron** en subagentes de solo lectura. Devolvieron pares exactos (antes → después) que apliqué yo con un script que falla si el «antes» no aparece una sola vez. Las ediciones de producción siguieron siendo del agente principal.
- **Una ronda de reviews en paralelo con la implementación del issue siguiente.** Cada rama siguió saliendo de `main`, rebasada justo antes de su merge.

## Cierre

| Issue | Estado | Producción |
|---|---|---|
| #69 | Done | `v33` (sin shell) |
| #70 | Done | `v34` |
| #14 | Done | `v35` |
| #18 | Done | `v36` |
| #33 (en parte) | Backlog, con lo editorial pendiente | `v37` |
| #28 | Done | `v37` (sin shell) |
| #26 | Backlog, fuera por tamaño | — |

Gates al cierre (`main` en `2aea342`): `validar.js` sin errores (61 avisos, los mismos que al empezar), `node --test` 68/68 (63 al empezar) y `verificar-offline.js` en verde con 666 vistas móviles (66 al empezar).

**Lecciones:**
- `overflow-wrap: anywhere` en un contenedor aplasta tablas y botones → trampa en `estado.md`.
- Los datos de preguntas son shell y su cambio sube `VERSION` → trampa en `estado.md`, y propuesta de rule para el usuario (abajo).
- La revisión fresca encontró bloqueantes en 3 de los 6 PRs: una pérdida de datos con el sync (#14), un aplastamiento de tablas (#70) y enlaces a un tema inexistente (#28). Ninguno lo cazaba un gate mecánico.
- Delegar la investigación contra fuentes (#18) y la propuesta masiva de cambios (#28) en subagentes de solo lectura, con pares exactos que aplica el principal, ahorró el grueso del tiempo de contenido sin ceder las ediciones.

**Rule aplicada el 2026-10-11 a petición del usuario:** en «Cómo se despliega», cambiar «Si el cambio toca `sw.js` o el shell, subir `VERSION`» por «… o el shell (módulos, CSS y los datos `tutorials/manifest.js`, `quizzes.js` y `checks.js`), subir `VERSION`».

**Issues nuevos:** #77 (desborde y solape en escritorio que ya estaban en `main`) y #78 (tests de `validar.js`).

**Preguntas que esperan al usuario:** ninguna nueva. Siguen #16, #22, #25, #27 y lo que queda de #33.
