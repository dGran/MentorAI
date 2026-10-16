# Tanda 2026-10-16: lecciones de curso sin pregunta de examen (#173-#177)

Estado: **lanzada** el 2026-10-16 («continúa», tras el informe de preparación).

## 1. Estado de partida (medido 2026-10-16)

- `main` en `a2a0605`, limpio, 0 PRs abiertos, tablero sano. Producción en `v90`.
- `validar.js` sin errores ni avisos; `node --test` 120/120. Sin `/smoke`: la red visual es
  `verificar-offline.js`.
- Todas las preguntas de examen llevan `lesson` (577 de 577), así que la cobertura se mide sin leer:
  **19 de 331 lecciones de curso no son el `lesson` de ninguna pregunta del examen de su curso**.
  Medición: `node .agents/tasks/examenes/medir.js .` (gitignored). Go, Python y Rust tienen además el
  examen más corto por lección del catálogo (18 preguntas para 21 lecciones; mediana: 2 por lección).
- Issues, todos `OPEN`, en `Backlog`, P3, sin asignar, sin rama ni PR:

| Issue | Exámenes | Lecciones sin pregunta | Tipo |
|---|---|---|---|
| #173 | `go` | 6 | `feat` |
| #174 | `python`, `rust` | 3 + 3 | `feat` |
| #175 | `sql-aplicado`, `sistemas-distribuidos` | 2 + 2 | `feat` |
| #176 | `terminal-linux`, `programar-con-ia`, `fundamentos` | 1 + 1 + 1 | `feat` |
| #177 | aviso en `validar.js` | — | `chore`, bloqueado por #173-#176 (`blocked_by` declarado) |

## 2. Línea de no colisión

Un único coordinador, sin otros tracks. Los cuatro issues de contenido tocan `tutorials/quizzes.js`,
pero **cada uno en exámenes distintos** (bloques disjuntos del fichero), y `quiz-summary.js`, que se
regenera. Implementación en paralelo en worktrees `../MentorAI-N`; publicación **en serie**,
recomponiendo con el parche 3-way de `tanda-2026-10-16/preparar.sh`. Si el 3-way choca, se resuelve
a mano conservando los dos lados (como en la tanda anterior) y la serie sigue. `verificar-offline.js`
solo lo ejecuta el coordinador. **Con 4 subagentes, GraphQL aguanta; aun así los encargos piden REST**
(trampa de `estado.md`).

## 3. Orden

1. **Implementar #173-#176** con `prompt-examenes.md`, en paralelo. Cada pregunta se contrasta con
   la lección y con la fuente oficial o Docker; si la lección está mal, se corrige y sube `reviewed`.
2. **Review fresca** por PR con `prompt-review-examenes.md`: lo primero, que cada pregunta sea cierta
   y tenga una sola correcta; después, que no se delate y que evalúe lo central de la lección.
3. **Publicación en serie** con `tanda-2026-10-16/cerrar-serie.sh`: recompone, `quiz-summary.js`,
   índice, `VERSION` +1, gates, QA con `qa-examen.js` por http y `file://` (el examen pinta el nuevo
   total y las preguntas nuevas; respondiendo bien todas da el máximo; 320 px; consola), CI, merge
   squash, Pages y Done.
4. **#177 al final**: aviso en `validar.js` con excepciones en constante con nombre, test, regla en
   CLAUDE.md y la skill `tutorial`. Código: review fresca, gates y `skip-qa` documentado.

## 4. Límites y fuera de la tanda

- Solo preguntas nuevas: ninguna pregunta existente cambia (`id`, `a`, opciones ni orden), aunque se
  vea mejorable (se apunta para un issue aparte). La nota de corte no se toca: es el 70 % del total.
- Corregir una lección solo si la pregunta destapa un error; cambio mínimo.
- No se iguala el número de preguntas por lección entre cursos: el criterio es cobertura (toda
  lección de curso con al menos una pregunta), no tamaño.

## 5. Criterio de parada

Primer rojo sin arreglo evidente (PR abierto con diagnóstico; se sigue con el siguiente issue
independiente; #177 no arranca con un issue de contenido sin cerrar); un criterio inviable o falso
(se comenta en el issue, no se reinterpreta); un 3-way que no se resuelve conservando los dos lados;
cualquier decisión de producto o de norma (p. ej. convertir el aviso en ERROR o cambiar la nota de
corte); borrar contenido.

## 6. Decidido por el usuario al preparar (2026-10-16)

- Tema: «Exámenes cortos (Recomendado)».
- Alcance: «Las 19, 4 issues (Recomendado)».
- Validador: «Sí, como aviso (Recomendado)».
- Automerge: «Sí, igual que antes (Recomendado)». Lo que pase review fresca, QA y CI se mergea sin
  pausa.
