# Tanda 2026-10-13 — #131, #132 y auditoría de vigencia del contenido

Estado: **cerrada** (2026-10-13). Entraron #131, #132 y los 9 issues de la auditoría de vigencia (#135-#143): 11 PRs (#133, #134, #144-#152), cada uno con review fresca, QA con evidencias y despliegue. Producción de `v70` a `v81`. 80 lecciones corregidas contra fuente o Docker. Queda #153 (P3, restos fuera de alcance).

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

## Enmienda 1 (2026-10-13): la auditoría entra en la tanda

La auditoría confirmó 101 hallazgos en 296 lecciones (31 falsos, 70 desfasados, más 6 errores no temporales
que cazó de paso), cada uno con fuente oficial o ejecución en Docker. Decidido por el usuario, verbatim:
«Crear los 9 y meterlos (Recomendado)». Mismo automerge que en § 6.

| Issue | Área | Prioridad |
|---|---|---|
| #135 | Go y Rust (toolchain `golang:1.23` / `rust:1.80`) | P2 |
| #136 | Python, fundamentos y la máquina | P2 |
| #137 | Linux, systemd, nginx y TLS | P2 |
| #138 | Docker, CI, Kubernetes y git | P2 |
| #139 | Symfony y DBAL (framework-por-dentro, phpunit) | P2 |
| #140 | Observabilidad | P2 |
| #141 | Claude Code e IA | P2 |
| #142 | Protocolos, REST, Redis, RabbitMQ, extensiones PHP | P3 |
| #143 | Diseño y distribuidos | P3 |

Mecánica: los 9 se implementan en paralelo, cada uno en su worktree, por subagentes que solo tocan los
`.html` de sus lecciones y sus preguntas en `checks.js`/`quizzes.js`. No comparten lecciones. Cada PR
pasa una review con contexto fresco, que vuelve a contrastar con la fuente o a ejecutar en Docker. La
publicación es en serie: rebase, `reviewed`, índice, `VERSION` +1, gates, QA y merge.

## Cierre (2026-10-13)

| Issue | PR | Merge | Shell | Review |
|---|---|---|---|---|
| #131 id de modelo | #133 | `a8d25d5` | v71 | 2 hallazgos (pausa del razonamiento antes del primer token; «razona siempre» solo en Opus 5.5) |
| #132 salidas PHPUnit | #134 | `f99265d` | v72 | aprobado |
| #140 observabilidad | #144 | `799818a` | v73 | aprobado |
| #139 Symfony y DBAL | #146 | `1d26690` | v74 | aprobado |
| #137 Linux y nginx | #150 | `b93ba9e` | v75 | aprobado |
| #143 diseño | #145 | `a41a4b0` | v76 | 1 (objetos lazy nativos solo desde Symfony 7.4) |
| #141 Claude Code e IA | #147 | `35289c3` | v77 | 2 (descripción del catálogo del modo plan; la GitHub App de la acción) |
| #135 Go y Rust | #148 | `43e17ec` | v78 | 1 (reto de Docker con `golang:1.23`) |
| #136 Python | #149 | `8d29088` | v79 | 3 (pregunta de syscalls, `__fields__` deprecado, GIL por build) |
| #142 protocolos | #152 | `9b270b8` | v80 | aprobado |
| #138 despliegue | #151 | `f26d8a9` | v81 | 2 (`upload-artifact@v4` en Node 20; el otro ya lo cubría #147) |

- **Auditoría:** 7 subagentes de solo lectura, 296 lecciones, 101 hallazgos confirmados con fuente
  o Docker. Los implementadores **reconfirmaron cada arreglo antes de escribirlo** y en 6 casos el
  arreglo propuesto también estaba mal (DSN de DBAL 4, PIE sin `unzip`, `COPY composer` sin `unzip`,
  `ZREVRANK` no deprecado, `uv init --no-package`, `cargo-watch` → watchexec y no bacon).
- **Reviews:** 12 errores más cazados en 11 PRs, casi todos en frases vecinas que el cambio dejaba
  contradictorias (descripción del catálogo, preguntas, otras lecciones del curso).

**Lecciones:**
- Un subagente que revisa no ejecuta `verificar-offline.js`: los puertos 8899/9336 son fijos y chocó con
  el del coordinador (los dos dieron rojo y el suyo quedó colgado). Lo cubren CI y la publicación.
- Las entradas de QA «texto nuevo | texto viejo» se escriben en una línea y sobre el texto de la prosa
  o del código, no sobre etiquetas con `text-transform` (`innerText` las devuelve en mayúsculas).
- La QA de resaltado solo vale para los lenguajes que `syntax.js` conoce: `python`, `proto` o
  `promql` salen en plano en `main` desde siempre.
- Un arreglo de review que toca `manifest.js` necesita su propio mecanismo cuando el coordinador
  regenera ese fichero al rebasar (`manifest-<issue>.json` con pares exactos).
- Con N PRs paralelos sobre `manifest.js`, `sw.js` y el índice, recomponer cada rama sobre `main`
  justo antes de mergear (parche 3-way del contenido + regenerar) evita conflictos sin coste.
- Docker Hub corta a ~100 descargas (429) con 9 agentes en paralelo: reutilizar imágenes locales.

**Backlog:** #153 (P3, `fix`): restos fuera de alcance (PECL en tres lecciones, tamaños de imagen de
Go y Python, `lib/pq`, `syslog`, ratio de php-fpm, nombre «docker-compose»).
