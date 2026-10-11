# Tanda 2026-10-11 (c) — paraguas del catálogo, deuda de contenido y sesgo de longitud

Estado: **en curso**.

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
