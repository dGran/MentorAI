# Tanda 2026-10-19: dos correcciones de contenido (#183, #184)

Estado: **cerrada** el 2026-10-19. Veredicto: entraron los 2 issues, el backlog queda vacío.
Producción de `v94` a `v96`. La review fresca cazó un error del implementador (`reviewed` en la
entrada equivocada) y CI otro de zona horaria; los dos se corrigieron antes del merge.

## 1. Estado de partida (medido 2026-10-19)

- `main` en `cd93d0d`, limpio, 0 PRs abiertos, `check-board.sh --project 6` sin hallazgos.
  Producción en `v94`.
- `validar.js` sin errores ni avisos; `node --test` 126/126. Sin `/smoke`: la red visual es
  `verificar-offline.js`.
- El backlog entero son estos dos issues, los dos `OPEN`, en `Backlog`, P3, `fix`, sin asignar, sin
  rama ni PR y con 0 bloqueantes abiertos:

| Issue | Lección | El defecto sigue en `main` |
|---|---|---|
| #183 | `go-a-produccion` | sí: `/health` hace el ping a la BD (l. 341-349) y `/ready` solo responde; el keypoint (l. 485) dice lo mismo al revés que el callout de errores (l. 426); `// Métricas en formato Prometheus` sobre `expvar.Handler()` (l. 355) |
| #184 | `sd-falacias` | sí: `'timeout' => self::TIMEOUT_LECTURA` (l. 363) y el callout «Dos timeouts, no uno» lo explica como espera de la respuesta ya conectado; `q912412` se apoya en ese callout |

## 2. Línea de no colisión

Un único coordinador, sin otros tracks. Las lecciones son disjuntas. Ficheros que pueden compartir:
`tutorials/quizzes.js`/`checks.js` (bloques distintos), `tutorials/manifest.js` (`reviewed`, entradas
distintas), el índice de búsqueda y `VERSION` de `sw.js`, que se regeneran o suben en serie. Se
publican en serie, con `git pull` antes de cada rama.

## 3. Orden

Los dos son contenido sin test que lo cubra; la red es ejecutar el código (Docker) y la fuente oficial.
1. **#183**: ejecutar el ejemplo en `golang` (Docker) con `curl` a `/health`, `/ready` y `/metrics`;
   corregir ejemplo, keypoint y comentario de `expvar` contra pkg.go.dev/expvar.
2. **#184**: contrastar con *Request Options* de Guzzle y ejecutarlo en Docker contra un servidor
   lento; corregir ejemplo y callout, y revisar `q912412` y los checks.

Por issue: refine → implement → review fresca por subagente (sin el contexto de implementación) →
QA (la lección pinta por http y `file://`, 320 px, consola limpia) → deploy (squash, Pages, Done).

## 4. Límites y fuera de la tanda

- Solo lo que dice cada issue; cambio mínimo en la lección. Una pregunta existente que hubiera que
  ajustar conserva `id`, `a` y el orden de las opciones.
- Otros errores que aparezcan en la lección se corrigen solo si son de la misma afirmación; el resto
  va a un issue nuevo.
- Fuera: nada; el backlog son estos dos.

## 5. Criterio de parada

Primer rojo sin arreglo evidente (PR abierto con diagnóstico y se sigue con el otro, que es
independiente); un criterio inviable o falso (se comenta en el issue, no se reinterpreta); cualquier
decisión de producto o de norma; borrar contenido no acordado.

## 6. Decidido por el usuario al lanzar (2026-10-19)

- Alcance: los dos issues del backlog («vamos a crear una tanda con todo lo que podamos incluir»).
- Automerge: «Sí, igual que antes (Recomendado)». Lo que pase review fresca, QA y CI se mergea sin
  pausa.

## 7. Cierre (2026-10-19)

| Issue | PR | Merge | Shell | Review fresca | Verificación |
|---|---|---|---|---|---|
| #183 `go-a-produccion` | #185 | `dcb57b1` | `v95` | APROBADO a la primera; 2 sugerencias previas al PR, fuera de alcance | Docker go1.27.2: con la BD caída, `/health` 200 y `/ready` 503; `/debug/vars` JSON |
| #184 `sd-falacias` | #186 | `a8241f2` | `v96` | CAMBIOS → APROBADO (`reviewed` en `python-docker`) | Docker Guzzle 7.16.0: `timeout` corta a los 3 s con bytes llegando; `read_timeout` sin `stream` no actúa |

QA de los dos: la lección por http y `file://` a 320 y 1280 px, con los textos nuevos presentes, sin
desborde y con la consola limpia (`.agents/tasks/tanda-2026-10-19/qa-leccion.js`). Las evidencias se
commitearon en la rama y se revirtieron antes del squash.

**Lecciones** (las dos van a «Trampas» de `estado.md`):
- `validar.js` compara `reviewed` en UTC: la fecha local tras medianoche da ERROR en CI.
- No todas las entradas del manifest tienen `reviewed`: editar por búsqueda desde el slug cae en la
  entrada siguiente.
- Las herramientas de `.agents/tasks/` que `estado.md` describía no estaban en este clon; se
  rehicieron `qa-leccion.js` y `board.sh`.

**Fuera, sin issue** (sugerencias de review, previas al PR y menores): en `go-a-produccion`,
`http.Error` envía `text/plain` con cuerpo JSON en el 503, y «Dos endpoints» precede a tres rutas;
en `q912412`, las opciones aún dicen «respuesta» con el enunciado en «total» (siguen siendo ciertas).

**Backlog:** vacío. Siguiente trabajo previsto: la revisión de frescura de abril de 2027.
