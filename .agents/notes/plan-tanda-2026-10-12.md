# Tanda 2026-10-12 — vaciar el backlog: cursos #35-#38, huecos #92-#100 y deuda de estructura

Estado: **preparada, sin lanzar**. Contrato escrito el 2026-10-12; nada tocado todavía.

## 1. Estado de partida (medido 2026-10-12)

- `main` en `496d0af`, limpio, 0 PRs abiertos, `check-board.sh --project 6` → exit 0. Producción en `v57`
  (Pages construido sobre `496d0af`). CI «Validar catálogo» verde sobre `496d0af` (incluye
  `verificar-offline.js`, 666 vistas móviles).
- `validar.js` sin errores, 1 aviso (33 lecciones sin «Cuándo aplicarlo»); `node --test` 112/112.
  Sin `/smoke` configurado: la red visual es `verificar-offline.js` (scroll horizontal a 320/375 px).
- Catálogo: 300 tutoriales · 32 cursos · 7 rutas · 494 preguntas de examen · 682 checks · 95 retos.
- Issues de la tanda: `OPEN`, `Backlog`, sin asignar, sin rama remota ni PR, sin `blocked-external`.
  Bloqueantes abiertos: solo los creados hoy (#113 ← #112, #114 ← #113), que se respetan en el orden.

| Issue | Reproduce hoy |
|---|---|
| #112 ancla | 43 `h2 id="cuando"` sin `<a class="anchor">`, uno por lección (los demás `h2` la tienen) |
| #113 / #114 | 15 + 18 lecciones en el aviso de «Cuándo aplicarlo» de `validar.js` |
| #35 seguridad | 0 lecciones `sec-*` en `tutorials/`; las 8 están redactadas en `.agents/tasks/35-seguridad-backend/borradores/` |
| #36 PHP moderno | sin curso de lenguaje PHP (`php-a-fondo` son 6 artículos de runtime) |
| #37 concurrencia BBDD | sin curso entre `sql-aplicado` y distribuidos |
| #38 RAG y seguridad LLM | `pgvector`: 0 ficheros; inyección de prompt solo en 2 |
| #92 oficio | sin curso de code review, ADR, estimación, legacy |
| #93 testing | `Infection` y Playwright: 1 fichero en total |
| #94 Messenger | **parcial**: `sd-dlq-y-reproceso` ya cubre `retry_strategy`, `failure_transport` y `messenger:failed`; `workers-php` nombra `messenger:consume`. `/refine` recorta a lo que falta (punta a punta, transports, `stop-workers`) |
| #95 OpenTelemetry | 4 menciones de pasada, ninguna instrumentación |
| #96 git avanzado | `bisect` y `worktree`: 0 ficheros |
| #97 fechas | `DateTimeImmutable` en 4 ficheros, de pasada; zonas horarias sin lección |
| #98 full-text | `FULLTEXT`/`tsvector`: 0 ficheros |
| #99 feature flags | solo nombradas en `despliegue-continuo` |
| #100 JSONB | `JSONB`: 0 ficheros |

## 2. Línea de no colisión

Sin otros tracks ni otras personas: un único agente coordinador, en serie. Ficheros compartidos por
casi todos los issues, con `git pull` + rebase antes de cada uno y justo antes de mergear:

- `tutorials/manifest.js`, `checks.js`, `quizzes.js`, `quiz-summary.js`, `courses.js`, `paths.js`,
  `practica.js` e índice de búsqueda: los regenera/edita cada issue de contenido.
- `sw.js`/`VERSION`: todo issue que toca datos del shell sube `VERSION` = la de `main` + 1 **al rebasar
  justo antes de mergear** (trampa de `estado.md`). #112, #113 y #114 no tocan shell: `sw.js` intacto.
- Solapes de fichero entre issues: #113 ↔ #96 (`git-*`) y #99 (`despliegue-continuo`); #114 ↔ #93
  (`tipos-de-test`, `tdd-ciclo`); #98 ↔ #100 (índice GIN: la segunda enlaza a la primera); #37 ↔ #100 y
  #98 (`sql-aplicado`). Se resuelven por el orden de abajo y el `git pull` previo.
- `verificar-offline.js` (puertos 8899/9336) nunca en paralelo; `ss -ltnp` y `readlink /proc/<pid>/cwd`
  antes de levantar un servidor (hay un `http.server` en 8000 sobre este repo). Chrome headless con
  perfil fuera de `/tmp` y limpieza en `finally`.

## 3. Orden por demostrabilidad

El contenido nuevo no tiene prueba mecánica de verdad: la red es `validar.js` (estructura, plantilla,
enlaces, sesgo de opciones como ERROR), los tests, `verificar-offline.js` y la **review fresca contra
fuentes**, que es la que caza los errores de contenido (trampa de `estado.md`). Por eso primero lo que
añade red y después el contenido, en el orden que fijó el usuario:

1. **#112** — ancla en 43 `h2` por script (texto visible comprobado) + regla ERROR en `validar.js` con
   test. Añade red: toda sección nueva de la tanda nace vigilada.
2. **#35** — integrar los 8 borradores (un PR, pasos en `STATE.md`) y contrastar en la review los datos
   que los autores pusieron de memoria (lista en `STATE.md`).
3. **#36** → **#37** — cursos completos por `/implement-epic` dentro del loop, partidos en PRs por fase
   como #34 (CHARTER/MAP/STATE en `.agents/tasks/<n>-<slug>/`).
4. **#38** — ampliación de `construir-con-ia`, un PR; tema volátil: fuentes oficiales y `reviewed`.
5. **#113** → **#114** — «Cuándo aplicarlo»; #114 pasa el aviso a ERROR.
6. **#93, #94, #95, #96, #97, #98, #99, #100** — un PR cada uno (#93 puede partirse en el refinado).
7. **#92** — curso de oficio, `/implement-epic`, el último.

## 4. Límites y fuera de la tanda

- Cada issue pasa las cinco fases: `/refine` → `/implement` (contenido con `/tutorial`) → `/review`
  con subagente de contexto fresco → `/qa-funcional` con evidencias → `/deploy`. Un PR por issue o por
  fase de épica; squash; evidencias de QA en commit propio revertido antes del merge.
- Contenido: cada lección parte de `_PLANTILLA.html`, con entradilla, «Cuándo aplicarlo» y errores
  típicos; checks y examen con el criterio de opciones (ERROR por curso); retos ejecutables; minutos con
  el criterio ≥ 60 palabras/min de prosa. Los autores delegados listan lo que pusieron de memoria y la
  review lo contrasta con la fuente.
- No se reescriben preguntas existentes salvo que el issue lo pida; si se hace, `id`, `a` y orden
  intactos.
- Decisiones del tipo «entra en el curso X o como artículo» (#36, #94, #98): las decide el agente con
  su porqué en el PR, como en la tanda c (#33).

| Fuera | Motivo |
|---|---|
| Revisión de frescura de los cursos de IA | Rutina fijada para feb-mar 2027 (`estado.md`) |
| Cambios de diseño, tokens o nuevas funciones de la app | No hay issue; la tanda es de contenido y estructura |

## 5. Criterio de parada

- Primer rojo sin arreglo evidente: PR abierto con diagnóstico y salto al siguiente **solo si es
  independiente** (#113 y #114 no lo son entre sí ni de #112; las fases de una épica tampoco).
- Criterio de aceptación inviable o falso → comentario en el issue y se salta; no se reinterpreta.
- Decisión de producto o de diseño fuera de lo que § 4 deja al agente → se anota la pregunta en el
  issue y se sigue con lo independiente.
- Un dato de contenido que no se puede contrastar con una fuente → no entra; se anota en el PR.
- Borrar una lección, pregunta o reto no acordado aquí → para.
- Límite secundario de GraphQL: comentarios, PRs y merges por REST; tablero por cola con reintentos.
- Límites del loop: 5 intentos por nodo, 80 ciclos, sin tope de tiempo. Estado fino en
  `.agents/tasks/tanda-2026-10-12/workflow.md`.

## 6. Decidido por el usuario al lanzar

> «¿Qué alcance tiene la tanda?» → **«Orden pactado, épicas en loop (Recomendado)»**: #35 → #36 → #37 →
> #38 con `/implement-epic` dentro del loop, luego #93-#100 de un PR cada uno y #92 al final.
>
> «¿Mantengo el modo de lanzamiento de las tandas anteriores?» → **«Sí, igual que antes
> (Recomendado)»**: automerge y despliegue de lo que pase review fresca, QA y CI, con capturas enlazadas
> en cada PR para repaso a posteriori; sin límite de tiempo, todo en loop sin pausas.
>
> «Deuda sin issue (33 lecciones sin «Cuándo aplicarlo», 43 `h2` sin ancla)» → **«Crear issues y
> meterlas (Recomendado)»**: creadas #112 (P2), #113 y #114 (P3), encadenadas.
>
> Confirmación del contrato → **«Sí, créalas y escribe el contrato (Recomendado)»**: preparada, no lanzada.

## Registro

_(vacío: se rellena al ejecutar)_
