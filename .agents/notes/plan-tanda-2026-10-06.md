# Tanda 2026-10-06 — los P0 de la auditoría

Estado: **en curso**. Contrato escrito antes de tocar código; el cierre se añade al final.

## 1. Estado de partida (medido 2026-10-06 19:00 +02:00)

- `main` en `429ff1b`, working tree limpio, sin PRs abiertos ni ramas aparte.
- `~/.agent-flow/scripts/check-board.sh --project 6` → exit 0, sin hallazgos.
- `node scripts/validar.js` → «Sin errores» (282 tutoriales · 30 cursos · 7 rutas · 431 preguntas de
  examen · 622 checks · 88 retos).
- `node scripts/verificar-offline.js` → «Offline verificado de extremo a extremo», exit 0.
- No hay tests de lógica (`scripts/tests/` no existe) ni `/smoke` configurado.
- Issues (todos `OPEN`, `Backlog`, sin asignar, sin rama ni PR, sin `blocked-external`):

| Issue | Bloqueantes abiertos | Reproduce hoy |
|---|---|---|
| #1 tarjetas «1, 2, 3» | — | sí: `home.js:130,141` `map(miniCardHtml)` |
| #2 fusión pisa local | — | sí: `node repro-fusion.js` → `{"passed":false,"bestScore":40}` |
| #3 borrados resucitan | #2 | sí: misma repro → `["regex"]` |
| #4 caché offline por VERSION | — | sí: `sw.js:17` `CONTENT` lleva `VERSION` |
| #5 «Guardado» sin descarga | #4 | sí: `sw.js` emite `SAVE_DONE` sin contar fallos |
| #6 Perfil fuera del drawer | — | sí: `core.js:198` `PAGES` sin perfil |
| #7 exit codes de hooks | — | sí: `cc-hooks-y-permisos.html:222` |
| #8 retos y experimento | — | sí: `du -ah` lista directorios; `maq-cpu` 81/73 ms vs 86/341 ms |

## 2. Línea de no colisión

No hay otros tracks vivos (0 PRs, 0 issues `In Progress`). Solapes internos a nivel de fichero:
`perfil.js` (#2, #3), `sw.js` + `offline.js` (#4, #5, #6), `practica.js` (#8). Van en secuencia, con
`git pull` de `main` antes de cada rama.

## 3. Orden por demostrabilidad

Los gates del proyecto son `validar.js` (estructura y contenido) y `verificar-offline.js` (offline real);
no hay tests de lógica ni regresión visual. Primero lo que construye red:

1. **#2** — crea `scripts/tests/` con `node:test` en CI: red para la fusión.
2. **#3** — se apoya en esa red (entra solo si #2 se mergea en esta tanda).
3. **#1** — una línea, verificable con Playwright.
4. **#6** — añade un check al validador.
5. **#4** — `verificar-offline.js` lo cubre.
6. **#5** — entra solo si #4 se mergea en esta tanda.
7. **#8** — contenido, verificable ejecutando las soluciones.
8. **#7** — contenido volátil: exige contrastar con la documentación actual de Claude Code.

## 4. Límites y fuera de la tanda

- Entra el alcance completo de cada issue. Nada de los P1/P2 se cuela, aunque se toque el mismo fichero
  (p. ej. #29 sync robusto, #30 SW resiliente, #12 drawer accesible).
- Precedentes respetados: sin build ni dependencias (los tests usan solo `node:test` y `vm`); `file://`
  manda; al tocar `sw.js` o el shell se sube `VERSION`.

| Fuera | Motivo |
|---|---|
| P1 y siguientes | Fuera del encargo («con los P0») |

## 5. Criterio de parada

Además del primer rojo sin arreglo evidente (PR abierto con diagnóstico, y saltar solo a un issue
independiente):

- un criterio de aceptación inviable o falso → comentario en el issue y se salta;
- una decisión de producto, diseño o norma → se anota la pregunta y se sigue con lo independiente;
- borrar algo no acordado aquí;
- límites del loop: 5 intentos por nodo, 20 ciclos, **60 minutos** (valores por defecto anunciados; al
  agotarse se pausa y se pregunta si se amplía).

## 6. Decidido por el usuario al lanzar

> «¿Autorizas automerge (squash a main, que despliega en Pages) de cada PR de la tanda que pase review
> con contexto fresco, QA y los gates?» → **«Sí, todos los P0 (Recomendado)»**

Mitigación: cada PR enlaza las evidencias de QA por SHA (capturas y salidas) para repaso a posteriori.
Review con subagente de contexto fresco (issue + diff + rules, sin la conversación de implementación).
