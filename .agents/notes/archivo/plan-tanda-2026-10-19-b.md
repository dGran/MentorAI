# Tanda 2026-10-19 (b): restos de la review de la tanda anterior (#187, #188)

Estado: **cerrada** el 2026-10-19. Veredicto: entraron los 2 issues, las dos reviews frescas aprobaron
a la primera y el backlog queda vacío. Producción de `v96` a `v98`.

## 1. Estado de partida (medido 2026-10-19)

- `main` en `dc99e25`, limpio, 0 PRs abiertos. Producción en `v96`.
- `validar.js` sin errores ni avisos; `node --test` 126/126.
- Examen `sistemas-distribuidos` (`.agents/tasks/tanda-2026-10-19/sesgo.js`): 23 preguntas, la
  correcta es la más larga en 4 (17,4 %), puesto dominante tras la más larga el 4.º con un 39,1 %, 0
  con pista de forma. `q912412` hoy tiene la correcta empatada como la más larga (77/77/73/76).
- Issues `OPEN`, en `Backlog`, P3, `fix`, recién creados con `/spec`, sin bloqueantes, asignados al
  lanzar. Los dos defectos siguen en `main` (`go-a-produccion` l. 329 y 349; `quizzes.js` l. 394).

## 2. Línea de no colisión

Un único coordinador. #187 toca `go-a-produccion.html` y `manifest.js`; #188 toca `quizzes.js`. Los
dos tocan `sw.js` (`VERSION`) y quizá el índice: se publican en serie y el segundo sube a `v98`.

## 3. Orden

#187 y después #188. Cada uno: implement → review fresca por subagente en worktree → QA (lección o
examen por http y `file://`, 320 y 1280 px) → deploy.

## 4. Límites

Cambio mínimo. En #188, solo el texto de las opciones de `q912412`: ni `id`, ni `a`, ni orden, y las
tres métricas de sesgo del examen no empeoran.

## 5. Criterio de parada

Primer rojo sin arreglo evidente; un criterio inviable; cualquier decisión de producto; borrar
contenido.

## 6. Decidido por el usuario al lanzar (2026-10-19)

- Alcance: «1, luego 2» (primero estos restos, después la auditoría de accesibilidad).
- Automerge: «Sí, igual que antes (Recomendado)».

## 7. Cierre (2026-10-19)

| Issue | PR | Merge | Shell | Verificación |
|---|---|---|---|---|
| #187 `go-a-produccion` | #189 | `e5e8db3` | `v97` | El handler copiado de la lección en `golang:1.27`: 200 y 503 con `Content-Type: application/json` |
| #188 `q912412` | #190 | `3d90fd4` | `v98` | Sesgo del examen: puesto 1 de longitud 4 → 3, dominante 39,1 % sin cambio, 0 pistas de forma |

**Lecciones:**
- El examen de un curso no está en `curso.html`: se monta en la **última lección** del curso
  (`quiz.js`, `findEntry`). Su QA va a `tutorials/<última>.html#quiz`.
- `validar.js` cuenta como «la más larga» solo la estricta; un empate no suma. Medir el puesto con
  `puestoPorLongitud` (empates incluidos) y decir cuál de las dos cifras se da.
