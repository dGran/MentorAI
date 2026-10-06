# Tanda 2026-10-06 — los P0 de la auditoría

Estado: **en curso, segunda parte** (20:29 → 21:29). La primera parte se pausó a las 19:49 con 6 de 8 P0 en producción. Registro al final.

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

## Registro (19:00 → 19:49)

| Issue | PR | Merge | Review (subagente, contexto fresco) | QA |
|---|---|---|---|---|
| #2 fusión sin pisar | #40 | `92a8960` | aprobado; 2 menores arreglados (valor corrupto, test de la rama por defecto) | 4/4, reproducido en main |
| #1 descripciones | #41 | `9ebafa6` | aprobado; misma causa en el buscador incluida | 2/2, reproducido en main |
| #6 Perfil en drawer | #42 | `2bcaaff` | aprobado; el check detecta también entradas que sobran | 3/3, reproducido en main |
| #8 retos y experimento | #44 | `27a85ec` | aprobado; cifra «4×» suavizada a «entre dos y cuatro» | 5/5, reproducido en main |
| #4 caché offline | #43 | `2e69254` | **bloqueante**: la caché sin versión congelaba lo guardado → network-first con timeout de 3 s; dos rondas de delta | 3/3, verificador ampliado (15 checks) |
| #7 hooks y deny | #45 | `ef963b4` | **cambios pedidos**: el issue afirmaba algo falso sobre `deny` (enmienda en #7) | 4/4, reproducido en main |

Cada merge se verificó en Pages (build del SHA, `sw.js` con su `VERSION`, contenido nuevo servido). Producción en `v18`.

**Fuera por tiempo:** #3 (lápidas en el sync, M) y #5 («Guardado» honesto, S). Ya no tienen bloqueantes.

### Desviaciones del contrato

- **Tablero sin GraphQL de ~19:15 a ~19:45.** Un límite secundario de GitHub bloqueó GraphQL (el contador decía 5000 libres). PRs, comentarios, merges y asignaciones se hicieron por REST. El gate de `/deploy` «Status = Ready for prod» se sustituyó por su evidencia (comentarios de review y QA aprobados, checks verdes, PR `clean`). Los movimientos pendientes se aplicaron al volver GraphQL. Causa probable: `gh project field-list` dos veces por movimiento, más los subagentes.
- **Un PR se abrió con `verificar-offline.js` en rojo** (#41). Era la colisión de puertos con el revisor; repetido en serie, verde.

### Lecciones

- `VERSION` colisiona en silencio entre PRs paralelos → trampa en `estado.md`.
- `verificar-offline.js` no admite ejecuciones simultáneas → trampa en `estado.md`.
- Los datos de documentación volátil se contrastan en la fuente primaria → trampa en `estado.md`.
- Review con subagente de contexto fresco: encontró 1 bloqueante real (#43) y 1 error de contenido heredado del issue (#45). Ninguno lo habría visto quien escribió el código.
- Propuesta para agent-flow (no aplicada): los ids de `Status` y `Priority` se leen una vez por sesión, no en cada movimiento. El preflight dice «nunca se asumen», pero leerlos dos veces por movimiento agotó GraphQL.

### Estado del backlog

P0 restantes: #3 y #5, en Backlog y tomables. P1 a P3, sin tocar.

## Ampliación (20:29)

> «¿Amplío otros 60 minutos para cerrar el #3 y el #5, con el mismo automerge?» → **«si amplia»**

Mismo contrato: automerge de lo que pase review con contexto fresco, QA y gates. Límite nuevo: 21:29. Orden: #5 (S, construye sobre #4) y luego #3 (M, construye sobre los tests de #2). Ficheros disjuntos (`sw.js`/`offline.js` frente a `perfil.js`/`storage.js`), así que pueden solaparse en fases distintas; `VERSION` se fija al rebasar antes de cada merge.
