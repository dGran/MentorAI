# Tanda 2026-10-11 (c) — paraguas del catálogo, deuda de contenido y sesgo de longitud

Estado: **cerrada**. Entraron los 3 issues: #39 desglosado en #92-#100, #33 en #101 y #25 en 6 bloques (#102-#107). Desplegado hasta `v54`. Las tres reglas sobre las opciones (longitud, puesto de longitud y forma) son ERROR en `validar.js`, y el catálogo entero las cumple.

## 1. Estado de partida (medido 2026-10-11, tras cerrar la tanda b)

- `main` en `22aadbe`, limpio, 0 PRs abiertos, `check-board.sh --project 6` → exit 0. Producción en `v47`.
- `validar.js` sin errores, 59 avisos; `node --test` 99/99; `contraste.js` verde; `verificar-offline.js` verde (666 vistas móviles y checks bajo demanda sin red).
- Issues de la tanda: `OPEN`, `Backlog`, sin asignar, sin PR abierto, sin `blocked-external` ni bloqueantes abiertos (#25 dependía de #19 y #20, cerrados).

| Issue | Reproduce hoy |
|---|---|
| #39 paraguas | 9 huecos sin issue propio ni descarte anotado |
| #33 (lo que queda) | `testing` pone `tdd-ciclo` antes de `tipos-de-test`; curso `phpunit` Avanzado y su primera lección Intermedio; `redis-cache` en el módulo «Sistemas distribuidos» de `fundamentos`; `rabbitmq`, `redis-a-fondo`, `regex` y `jerga` fuera de toda ruta; `python-docker` Principiante en un curso Intermedio; 3 lecciones `*-entorno-docker` casi gemelas; `backend-cimientos` se describe como «el camino completo» con 3 pasos; exámenes de fundamentos (20), Go (12) y SOLID (15) sin el 30 % de escenario |
| #25 (resto) | con la correcta como la más larga: ~880 de ~1.000 preguntas en 29 cursos (el piloto «fundamentos» ya está por debajo) |

## 2. Línea de no colisión

Sin otros tracks ni otras personas. Solapes internos, en serie y con `git pull` + rebase antes de cada issue:

- `tutorials/quizzes.js`: #33 (preguntas nuevas de escenario en fundamentos, Go y SOLID) antes que los bloques de #25. Las preguntas nuevas nacen con el criterio del piloto, para que ningún bloque las reescriba.
- `tutorials/checks.js`: solo #25, bloque a bloque.
- `tutorials/paths.js`, `courses.js` y `manifest.js` (niveles): solo #33.
- `tutorials/quiz-summary.js`: se regenera en #33 (cambian los totales); los bloques de #25 no cambian totales.
- `sw.js`/`VERSION`: todos tocan datos del shell; `VERSION` = `main` + 1 al rebasar justo antes de mergear.

## 3. Orden por demostrabilidad

1. **#39.** Sin código: un issue completo por hueco (como `/spec`), al tablero en Backlog, y se cierra el paraguas.
2. **#33.** Rutas, cursos y niveles: los mide `validar.js` (referencias y niveles) y el QA en `rutas.html` y `cursos.html`. Preguntas de escenario nuevas con ids nuevos: `validar.js` mide sesgo de posición y de longitud. Si el PR crece, se parte en el refinado (rutas y niveles / preguntas).
3. **#25, bloques 1-6.** Cada bloque se mide con `validar.js` (sesgo por curso) y no cambia `id`, `a`, `q`, el número de opciones ni su orden (lo comprueba un diff de estructura en el QA). El bloque 6 pasa el umbral de aviso a **error** y cierra el issue.
   - B1: protocolos-y-tiempo-real, infraestructura, sistemas-distribuidos (~160).
   - B2: cache-y-rendimiento, observabilidad, la-maquina, diseno-y-arquitectura (~140).
   - B3: claude-code, construir-con-ia, programar-con-ia, k8s-para-devs (~120).
   - B4: go, python, rust (~150).
   - B5: patrones-diseno, terminal-linux, solid, phpunit, clean-code, docker (~140).
   - B6: oop, acceso-a-datos, apis-rest, testing, ci-cd, sql-aplicado, di-contenedores, git, framework-por-dentro (~150) + umbral a error.

**Enmienda (2026-10-11, al medir B1):** igualar longitudes con la regla de «la más larga» deja la correcta como la **segunda** más larga en el 56-87 % de las preguntas: un truco nuevo. `validar.js` gana la regla «ningún puesto de longitud distinto del 1.º pasa del 45 %» por examen y por checks de cada curso, y el objetivo de cada bloque pasa a ser la más larga en un 10-25 % con los puestos repartidos. La regla destapa tres cursos que ya cumplían la antigua: `fundamentos` (piloto, 48-49 %) entra en B1, y `ia-por-dentro` y `metodo-con-agentes` (56-71 %) entran en B3.

**Segunda enmienda (review de #102):** al igualar longitudes, la correcta quedaba con otra forma (telegráfica, «X; Y», o sin el «Porque…» de los distractores). `validar.js` gana el aviso «la forma delata la correcta» (más del 10 % de un examen o de los checks de un curso; las de sí/no no cuentan). La salida de cada bloque exige los tres avisos a 0 en sus cursos. En checks de 3 opciones, «la más corta» puede llegar al 40 % justo: es aritmética, no caben los otros topes. Los `artículos sueltos` (checks sin curso) entran en B6 por la regla de forma.

Después de la tanda, en el mismo loop: **#34** por `/implement-epic`, un curso por PR (decisión del usuario, § 6).

## 4. Límites y fuera de la tanda

- **#33.** Lo decide el agente con su porqué escrito en el issue y en el PR, y la review fresca lo contrasta (§ 6). No se borra ninguna lección ni pregunta: las gemelas se diferencian o se documentan como decisión, y las preguntas de memorización se quedan; se **añaden** las de escenario con ids nuevos, así el historial de repaso no se toca.
- **#25.** El criterio del piloto (refinado de #25): distractor plausible, la opción más larga como mucho el doble que la más corta, la correcta no sistemáticamente la más corta. No cambian `id`, `a`, `q`, el número de opciones ni su orden. Las explicaciones `w` se revisan para que sigan siendo correctas.
- Propuestas de reescritura en subagentes de solo lectura, con pares exactos `antes → después` que aplica el agente principal (precedente de #28 y #88).

| Fuera | Motivo |
|---|---|
| #34 | Épica: `/implement-epic` tras la tanda |
| #35-#38 | Épicas de curso: después de #34 |
| Los 9 issues que salen de #39 | Se crean en esta tanda; se implementan en otra |

## 5. Criterio de parada

- Primer rojo sin arreglo evidente: PR abierto con diagnóstico y salto al siguiente **solo si es independiente**. Los bloques de #25 son independientes entre sí, salvo B6 (umbral a error), que exige los cinco anteriores en `main`.
- Criterio inviable o falso → comentario en el issue y se salta; no se reinterpreta.
- Cualquier cambio de `id`, `a` u orden de opciones en una pregunta existente → para el bloque (pérdida del historial de repaso).
- Una pregunta cuya respuesta correcta resulte discutible al reescribir → se anota en el PR y se corrige con fuente, no se adivina.
- Borrar algo no acordado aquí → para.
- Gate de checks siempre en un paso propio; `verificar-offline.js` nunca en paralelo; `ss -ltnp` antes de levantar un servidor.
- Límites del loop: 5 intentos por nodo, 60 ciclos, sin tope de tiempo.

## 6. Decidido por el usuario al lanzar

> Modo de lanzamiento, vigente desde la tanda b: «Automerge, sin límite de tiempo (Recomendado)», «tenemos que dejar el backlog vacio, en cuanto termines la tanda preparas otra» y «todo en loop, sin pausas». Se mergea lo que pase review fresca, QA y CI, con evidencias en cada PR.
>
> «#25: ¿qué alcance?» → **«Todos + umbral a error (Recomendado)»**.
>
> «#33: ¿cómo lo decido?» → **«Criterio propio documentado (Recomendado)»**.
>
> «#39: ¿qué hago con él?» → **«Issue por hueco (Recomendado)»**.
>
> «Épicas: ¿entran en el loop?» → **«#34 tras la tanda (Recomendado)»**.

## Registro

| Issue | PR | Merge | Review (subagente, contexto fresco) | QA |
|---|---|---|---|---|
| #39 paraguas | — | — | sin código: desglosado en #92-#100 (issue por hueco), cerrado | — |
| #33 (lo que queda) | #101 | `95f5a9a` | **2 rondas.** Ronda 1: alta (la lección `hashing` y la pregunta afirmaban que PHP aleatoriza el hash; sus arrays usan DJBX33A sin semilla) y media (con la regla de la mayoría, cursos «de cero» quedaban en Intermedio) → la regla pasa a «nivel de la primera lección». Ronda 2: media (`q4732e0`, la correcta era la más larga por un carácter) | 18 preguntas de escenario (fundamentos 31 %, Go 33 %, SOLID 33 %); 464 existentes idénticas; rutas, niveles y orden de `testing` en `rutas.html`/`cursos.html`; producción en `v48` |
| #25 bloque 1 | #102 | `7fc8d2e` | **3 rondas.** Ronda 1: media (la correcta en otra forma que los distractores: telegráfica o sin el «Porque…») → regla de forma en `validar.js`. Ronda 2: media (4 pistas que el detector no veía: «Porque»/«Para» mezclados) → conectores agrupados. Ronda 3: aprobado | 4 cursos a 0 avisos; regla de puesto destapada al medir (2.º puesto al 56-87 %); producción en `v49` |
| #25 bloque 2 | #103 | `d5fa803` | **2 rondas.** Ronda 1: media (`c3d8d0a`, distractor defendible) y retoques de forma y gramática. Ronda 2: aprobado | 4 cursos a 0 avisos; producción en `v50` |
| #25 bloque 3 | #104 | `c9d0dfa` | **2 rondas** (y una pre-revisión de contenido sobre la simulación). Pre-revisión: alta (OOMKilled: «el Deployment lo repone»; es el kubelet). Ronda 1: media (el reto de práctica repetía el error). Ronda 2: aprobado | 6 cursos a 0 avisos; producción en `v51` |
| #25 bloque 4 | #105 | `b80a7f2` | **2 rondas** (y pre-revisión). Pre-revisión: media (`Cargo.lock`: la guía cambió en 2023). Ronda 1: medias de redacción (`ce2ff68` sin antecedente, `ca64513` con un distractor cierto). Ronda 2: aprobado | 3 cursos a 0 avisos; producción en `v52` |
| #25 bloque 5 | #106 | `6c457a4` | **2 rondas** (y pre-revisión). Ronda 1: medias (`tagged_locator` hacía defendible «Service Locator»; los eventos del kernel con `stopPropagation()` se leían como cadena). Ronda 2: aprobado | 6 cursos a 0 avisos; producción en `v53` |
| #25 bloque 6 | #107 | `9b8b382` | **3 rondas** (y pre-revisión). Pre-revisión: altas (`q671446`, `flush()` sí envuelve su transacción; `q6aabb1`, `readonly`). Ronda 1: medias (`c119fb2`, `q0443d4`). Ronda 2: aprobado con candidato (enum: el error es en ejecución). Ronda 3: aprobado (matiz aplicado) | las tres reglas pasan a ERROR; catálogo entero sin errores; mutación con umbrales bajados → exit 1; producción en `v54`. **#25 cerrado** |

## Cierre

| Issue | Estado | Producción |
|---|---|---|
| #39 | Done (desglosado en #92-#100) | — |
| #33 | Done | `v48` |
| #25 | Done | `v49`-`v54` |

Gates al cierre (`main` en `9b8b382`): `validar.js` sin errores y **1 aviso** (59 al empezar; el que queda es «Cuándo aplicarlo», de #34), con las reglas de longitud, puesto y forma como ERROR. `node --test` 107/107 (99 al empezar). `verificar-offline.js` en verde. La correcta es la más larga en el 17 % de las 482 preguntas de examen (79 %) y en el 21 % de los 682 checks (80 %).

**Lecciones:**
- **Arreglar un sesgo mecánico crea el siguiente.** Al igualar longitudes, la correcta quedó como la segunda más larga en el 56-87 % de las preguntas, y luego con otra forma (telegráfica o sin el conector). Cada regla nueva del validador destapó la siguiente. Se mide el truco entero (puesto y forma), no solo el que motivó el issue → reglas en `validar.js`.
- **La regla nueva destapa lo que «nació medido».** `fundamentos`, `ia-por-dentro` y `metodo-con-agentes` cumplían la regla antigua y no la nueva.
- **Una pre-revisión de contenido sobre la simulación del estado final** (copia del repo con todos los bloques aplicados) cazó las altas (OOMKilled, `Cargo.lock`, `flush()`, `readonly`) antes de abrir cada PR. Las reviews del PR encontraron después menos y más leve.
- **El redondeo esconde el umbral.** Un 45,2 % redondeado a 45 % pasaba; el validador compara sin redondear y los medidores también.
- **Con 3 opciones, los topes no caben a la vez** en grupos pequeños (10-15 checks): se admite la más corta al 40 %, porque es aritmética.
- **Reescribir distractores destapa errores de las lecciones**: hash flooding en PHP, OOMKilled, `Cargo.lock`, `flush()` y bytes de Go. Cada reescritura de preguntas lleva lectura de la lección.

**Issues nuevos:** #92-#100 (de #39).

**Preguntas que esperan al usuario:** ninguna. Repaso a posteriori de lo decidido con «criterio propio documentado» en #33: la regla de nivel por primera lección (9 cursos cambian), rutas y gemelas.

**Backlog:** #34 (siguiente, por `/implement-epic`), #35-#38 (épicas de curso) y #92-#100 (huecos, P3).
