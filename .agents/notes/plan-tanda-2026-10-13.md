# Tanda 2026-10-13 — #131, #132 y auditoría de vigencia del contenido

Estado: **abierta**.

## 1. Estado de partida (medido 2026-10-13)

- `main` en `a9cd105`, limpio, 0 PRs abiertos, `check-board.sh --project 6` → exit 0. Producción en `v70`.
- `validar.js` sin errores ni avisos; `node --test` 114/114. Sin `/smoke`: la red visual es
  `verificar-offline.js`.
- Catálogo: 344 tutoriales · 36 cursos · 7 rutas · 577 preguntas · 814 checks · 108 retos.
- Issues: `OPEN`, `Backlog`, sin asignar, sin rama ni PR, sin bloqueantes ni `blocked-external`.

| Issue | Reproduce hoy |
|---|---|
| #131 id de modelo | `claude-opus-5` sin sufijo en `ia-llamar-a-un-llm` (×2), `ia-structured-output` e `ia-streaming`; las lecciones de #38 usan `claude-opus-5-5` |
| #132 salidas PHPUnit | `phpunit-data-providers` cita `with data set #2` / `with data set "…"`, formato anterior a PHPUnit 12.5 |

## 2. Línea de no colisión

Un único agente coordinador, sin otros tracks. #131 y #132 no comparten fichero. La auditoría es de solo
lectura sobre `main` y escribe sus informes en el scratchpad; no toca el repo. Ficheros compartidos
(`manifest.js` por `reviewed`, índice de búsqueda, `sw.js`): `git pull` antes de cada issue y `VERSION`
= la de `main` + 1 al publicar. `verificar-offline.js` nunca en paralelo.

## 3. Orden

1. **Auditoría de vigencia**, lanzada en segundo plano al principio: 7 subagentes de solo lectura, uno
   por grupo de cursos, buscan afirmaciones que dependen del tiempo (versiones, ids, flags, salidas,
   APIs deprecadas, valores por defecto) y solo reportan lo **confirmado** contra fuente oficial o
   ejecución en Docker. Quedan fuera las lecciones con `reviewed` ≥ 2026-10-12 (revisadas contra
   fuentes en la tanda anterior).
2. **#131** y **#132**, mientras corre la auditoría, con el flujo completo.
3. **Hallazgos de la auditoría → issues propuestos al usuario** (agrupados por curso, contrastados con
   el backlog). **No se crean ni se implementan sin su visto bueno**: es alcance nuevo.

## 4. Límites y fuera de la tanda

- #131: solo el id y lo que dependa de él en esas cuatro lecciones; la revisión de frescura completa de
  los cursos de IA la cubre la auditoría.
- #132: las salidas del curso `phpunit` (el issue lo amplía a todo el curso si hay más).
- La auditoría no reescribe nada: produce hallazgos.

## 5. Criterio de parada

Primer rojo sin arreglo evidente; un criterio de aceptación inviable o falso (se comenta y se para);
cualquier decisión de producto o de norma; borrar contenido no acordado.

## 6. Decidido por el usuario al lanzar (2026-10-13)

- Alcance: «#131 + #132 y auditoría (Recomendado)».
- Automerge: «Sí, igual que antes (Recomendado)» — lo que pase review fresca, QA y CI se mergea, en loop
  y sin pausas.
