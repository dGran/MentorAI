# Tanda 2026-10-14 (b): enlaces de entrada a las lecciones huérfanas (#157-#164)

Estado: **cerrada** el 2026-10-15. Veredicto: entraron los 8 issues. Las 75 lecciones huérfanas
reciben 122 enlaces de entrada sin ninguna excepción (`medir.js` → 0), y `validar.js` avisa desde
#164 de cualquier huérfana nueva; sale sin errores y sin avisos. Producción de `v83` a `v90`.

## 1. Estado de partida (medido 2026-10-14)

- `main` en `5a643e6`, limpio, 0 PRs abiertos, `check-board.sh --project 6` con exit 0. Producción en `v83`.
- `validar.js` sin errores ni avisos; `node --test` 114/114. Sin `/smoke`: la red visual es
  `verificar-offline.js`.
- **75 de 344 lecciones no reciben ningún enlace desde el cuerpo de otra lección** (el `tutorial-nav`
  del pie no cuenta: es «llegar por el curso»). Medición reproducible:
  `node .agents/tasks/enlaces-entrada/medir.js .` (gitignored).
- Issues, todos `OPEN`, en `Backlog`, P3, sin asignar, sin rama ni PR:

| Issue | Área | Huérfanas | Tipo |
|---|---|---|---|
| #157 | Python | 11 | `refactor` |
| #158 | Rust | 8 | `refactor` |
| #159 | Go | 8 | `refactor` |
| #160 | Linux, infraestructura, k8s, la-maquina | 13 | `refactor` |
| #161 | caché, distribuidos, seguridad, protocolos, SQL, concurrencia en BD, acceso a datos | 18 | `refactor` |
| #162 | patrones, SOLID, framework, hexagonal, DI, PHPUnit, preload, Unicode | 9 | `refactor` |
| #163 | método con agentes, Claude Code, construir con IA | 8 | `refactor` |
| #164 | aviso en `validar.js` | — | `chore`, bloqueado por #157-#163 (`blocked_by` declarado) |

## 2. Línea de no colisión

Un único coordinador, sin otros tracks. Los siete issues de contenido **sí se solapan a nivel de
fichero**: una lección de origen puede recibir enlaces de varias áreas. Se implementan en paralelo en
worktrees `../MentorAI-N` y se publican **en serie**, recomponiendo cada rama sobre `main` con el
parche 3-way de `tanda-2026-10-14/preparar.sh`; si el 3-way choca, ese issue se rehace sobre `main`
y la serie sigue con el siguiente. `verificar-offline.js` lo ejecuta solo el coordinador.

## 3. Orden

1. **Implementar #157-#163** con `prompt-enlaces.md`: subagentes en paralelo, cada uno en su
   worktree, sin commit. Salida en `resultado-N.json` con los pares exactos y las excepciones.
2. **Review fresca** por PR con `prompt-review-enlaces.md` (comprueba que el origen trata el tema, que
   el `href` y el ancla existen y que no se tocó otro texto, y busca frase para cada excepción).
3. **Publicación en serie** con `tanda-2026-10-14/cerrar-serie.sh`: recompone sobre `main`, índice,
   `VERSION` +1, gates, QA con `qa-enlaces.js` (por http y por `file://`: el enlace está en el cuerpo,
   fuera de pie/TOC/código, y el **clic llega** al destino y a su ancla; 320 px; consola), CI, merge
   squash, Pages, Done. `reviewed` **no** se sube: añadir un enlace no es revisar la lección.
4. **#164 al final**, cuando las huérfanas estén a cero salvo las excepciones justificadas en los PRs:
   aviso en `validar.js` con la lista de excepciones en una constante con nombre, test en
   `scripts/tests/`, y la regla en CLAUDE.md y en la skill `tutorial`. Es código: `/implement`
   normal, review fresca y gates; `validar.js` debe quedar sin errores **y sin avisos**.

## 4. Límites y fuera de la tanda

- Solo se añaden `<a href>` en frases existentes; como mucho una aposición corta si no hay fragmento
  enlazable. Ningún otro cambio de texto, aunque se vea un error (se apunta para un issue nuevo).
- Sin enlaces en código, TOC, hero ni `tutorial-nav`. Máximo 2 enlaces nuevos por lección de origen
  y por issue.
- Una huérfana sin frase natural **no se fuerza**: pasa a excepción justificada.
- Los 13 artículos sueltos (sin curso) solo entran si son huérfanos (hoy, `preload`).

## 5. Criterio de parada

Primer rojo sin arreglo evidente (PR abierto con el diagnóstico y se sigue con el siguiente issue
independiente; #164 no arranca con un issue de contenido sin cerrar); un criterio inviable o falso
(se comenta en el issue, no se reinterpreta); un 3-way que no aplica dos veces seguidas; cualquier
decisión de producto o de norma (p. ej. convertir el aviso en ERROR); borrar contenido.

## 6. Decidido por el usuario al preparar (2026-10-14)

- Tema: «Enlaces de entrada (Recomendado)».
- Issues: «Crear los 7 (Recomendado)».
- Validador: «Sí, como aviso (Recomendado)».
- Automerge: «Sí, igual que antes (Recomendado)». Lo que pase review fresca, QA y CI se mergea sin
  pausa.

## 7. Cierre (2026-10-15)

| Issue | PR | Merge | Shell | Enlaces | Review fresca |
|---|---|---|---|---|---|
| #159 Go | #167 | `a9a7be9` | `v84` | 13 | aprobado |
| #160 plataforma | #168 | `e3b2855` | `v85` | 21 | aprobado |
| #157 Python | #165 | `9578ca0` | `v86` | 15 | 1: enlace tangencial en una tabla de comandos, retirado |
| #158 Rust | #166 | `98c8d80` | `v87` | 16 | 2: un enlace tangencial movido a `rust-ownership#for`, un ancla añadida |
| #161 backend | #169 | `ebbc712` | `v88` | 28 | 2: `sd-transacciones-distribuidas` solo tenía el de la lección anterior (+`sd-outbox`); un texto de enlace que prometía otra lección |
| #162 diseño | #170 | `965dc39` | `v89` | 15 | 1: enlace desde la lección anterior, que duplicaba el pie (movido a `framework-ciclo-http`) |
| #163 IA | #171 | `92d21d8` | `v90` | 14 | 2 anclas más precisas |
| #164 aviso | #172 | `805b929` | — | — | aprobado con 3 menores (texto del aviso, regla más exacta, `new Set()`) |

- **Método:** 7 implementadores en paralelo con `prompt-enlaces.md`, 7 revisores frescos con
  `prompt-review-enlaces.md`, publicación en serie con `tanda-2026-10-14/`. QA nueva
  (`qa-enlaces.js`): hace **clic** en cada enlace nuevo y comprueba que llega al destino y al ancla, por
  http y por `file://`. `reviewed` no se tocó.
- **Lecciones:**
  - Siete subagentes con `gh` en paralelo agotaron el límite de **GraphQL** (5000/h compartido): fallaron
    `gh pr list` y `gh project`. Las ramas ya estaban subidas; los PRs se crearon por REST, y
    `abrir-pr.sh` busca ya el PR por REST. A los revisores se les pidió solo REST.
  - El 3-way chocó una vez: `rust-tipos-y-variables` recibía enlaces de Rust y de diseño en dos
    párrafos contiguos. Se resolvió a mano conservando los dos y la serie siguió.
  - Un implementador escribió las entradas `qa` con `.html`; se normalizaron antes de la QA. El
    formato va fijado en el encargo para la próxima.
  - Lo que más cazó la review: enlaces desde la **lección anterior del mismo curso** (duplican el pie)
    y enlaces tangenciales; anclas genéricas donde había una sección exacta.
- **Norma:** la regla nueva va en `rules/global.md` (§ Convenciones de contenido) y en la skill
  `tutorial`, con #164.
- Ningún issue nuevo. Backlog vacío.
