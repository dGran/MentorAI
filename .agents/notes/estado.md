# Estado — Academia (plataforma de formación)

## Qué es
Plataforma visual de tutoriales técnicos en HTML estático (sin build, sin
servidor, sin dependencias). Objetivo: ir **añadiendo tutoriales iterados con
IA**, cada uno como una página en `tutorials/`, enlazada desde el catálogo
`index.html`.

## Hecho (2026-06-21)
- Sistema de diseño completo: `assets/css/styles.css` (design tokens, tema
  claro/oscuro, componentes: cards, callouts, diagramas de flujo CSS, compare,
  tablas, code-block, keypoints).
- `assets/js/main.js`: tema persistente, barra de progreso, scrollspy del TOC,
  botón copiar código, filtros del catálogo y **resaltador de sintaxis propio**
  (offline, soporta php/bash/ini, una sola pasada con regex combinado).
- `index.html`: catálogo con hero, filtros y tarjetas (OPcache + 2 placeholders).
- `tutorials/opcache.html`: primer tutorial, completo y profundo.
- `tutorials/_PLANTILLA.html` + `README.md`: para crear nuevos sin fricción.

## Tutoriales publicados (2026-06-21)
- `opcache.html` — primer tutorial.
- `inyeccion-dependencias.html` — DI en PHP (constructor, interfaces/DIP,
  contenedor/PSR-11, testing con fakes, errores comunes). Categorías
  `["php","arquitectura"]` → estrenó el chip **Arquitectura**. Creado a mano
  siguiendo la skill `/tutorial` y el estilo de opcache.
- `rabbitmq.html` — RabbitMQ a fondo (Avanzado, 18 min). Modelo
  productor→exchange→cola→consumidor, tipos de exchange (direct/fanout/topic/
  headers + default exchange), propiedades de cola (durable/exclusive/auto-delete),
  durabilidad real = cola durable + mensaje persistente + publisher confirms,
  acks/prefetch (at-least-once + idempotencia), DLX+TTL para reintentos con
  backoff y cola de fallidos, tipos de cola classic/quorum/stream. 4 bloques php
  (php-amqplib). Categorías `["infra","mensajeria"]` → estrenó el chip
  **Mensajería** (label nuevo en `CATEGORY_LABELS`) y sumó al chip
  **Infraestructura**. Es el `featured` actual (se quitó el de
  inyeccion-dependencias para tener un solo "Nuevo"). Enlaza con opcache en la
  tutorial-nav.

## Currículum de fundamentos (2026-06-21) — EN CURSO
Plan completo en `plan-curriculum-fundamentos.md` (7 pilares, 22 tutoriales,
orden lógico bottom-up, arranque por Representación de datos, ejemplos PHP+SQL).
- Publicado **P1.1 `bits-y-bytes.html`** (Intermedio, 13 min): bit→byte, binario,
  hex, operaciones bit a bit, máscaras/flags de permisos, errores. 4 bloques php.
  Categoría `["representacion"]` → estrenó el chip **Representación de datos**
  (label nuevo en `CATEGORY_LABELS`). Es el `featured` actual (se quitó de
  rabbitmq). Relacionado → opcache.
- Publicado **P1.2 `texto-unicode.html`** (Intermedio, 14 min): ASCII, páginas de
  código, Unicode (code points), UTF-8 (1–4 bytes, autosync), bytes vs caracteres
  (`mb_*`), utf8 vs utf8mb4 en MySQL, mojibake. 3 bloques php. Mismo chip
  `representacion` (ahora 2). Es el `featured` actual. tutorial-nav enlaza con
  bits-y-bytes (anterior).
- Publicado **P1.3 `numeros-flotantes.html`** (Intermedio, 15 min): enteros de
  tamaño fijo y rangos, complemento a dos, overflow (wraparound vs promoción a
  float en PHP; INT/BIGINT en BBDD), IEEE-754 (signo/exponente/mantisa), por qué
  `0.1+0.2 !== 0.3`, dinero nunca en float (céntimos/BCMath/DECIMAL). 3 bloques
  php. Chip `representacion` ahora 3. Es el `featured` actual. **Pilar 1 COMPLETO.**
- Iniciado **Pilar 2 — Datos y algoritmos**. Publicado **P2.1 `big-o.html`**
  (Intermedio, 14 min): qué mide Big-O, leer la notación (constantes/peor caso),
  clases O(1)→O(2ⁿ) con tablas (incl. pasos para n=1M), ejemplos PHP (O(1) vs
  O(n), búsqueda binaria), el O(n²) escondido (in_array en bucle, N+1),
  tiempo vs memoria. 3 bloques php. Estrenó el chip **Algoritmos** (label nuevo
  en `CATEGORY_LABELS`). Es el `featured` actual.
- Publicado **P2.2 `estructuras-datos.html`** (Intermedio, 15 min): elegir por la
  operación que domina; array, lista enlazada (con el matiz de localidad de
  caché), hashmap/set, árbol (puente a B-tree/índices), grafo (lista de
  adyacencia); chuleta de costes Big-O; el array de PHP como mapa ordenado. 3
  bloques php. Chip `algoritmos` ahora 2. Es el `featured` actual.
- Publicado **P2.3 `hashing.html`** (Intermedio, 14 min): clave→posición (calcular,
  no buscar), función hash (determinista/uniforme/rápida) + módulo, colisiones
  (encadenamiento vs direccionamiento abierto), factor de carga 0,75 + rehashing
  (O(n) puntual, O(1) amortizado), O(1) medio vs O(n) peor + hash flooding (DoS,
  por qué se aleatoriza el hash), usos (dedup/sharding/checksums/cachés). Callout
  hash de tabla ≠ hash criptográfico (puente al pilar 7). 2 bloques php (bucketIndex
  con crc32%capacidad; mini tabla hash con encadenamiento por referencia). Chip
  `algoritmos` ahora 3. Es el `featured` actual. **Pilar 2 COMPLETO.**
- **Highlighter SQL añadido** (`SyntaxHighlighter.LANGUAGES.sql` en main.js):
  comentarios `--`/`/* */`, strings con comilla simple, keywords en MAYÚSCULA
  (el motor comparte un único flag `gm` sin `i`, así que el SQL de los tutoriales
  se escribe con keywords en mayúscula), funciones `nombre(` y números. Probado con
  muestra: tokeniza keywords/strings/números/funciones OK.
- Iniciado y **completado Pilar 3 — Bases de datos** (chip `bbdd` = "Bases de
  datos", ya existía en CATEGORY_LABELS; ahora 3). Los tres con `icon: "database"`
  y ejemplos SQL:
  - **P3.1 `indices-btree.html`** (Intermedio, 15 min): full scan O(n) vs índice
    O(log n), anatomía del B-tree (ancho y poco profundo, hojas enlazadas para
    rangos/ORDER BY), leer un EXPLAIN (tabla de `type`: ALL→eq_ref), índices
    compuestos y regla del prefijo izquierdo, cuándo NO se usa (función sobre la
    columna = no sargable, LIKE '%x', baja cardinalidad), el índice no es gratis
    (penaliza escrituras). 3 bloques sql.
  - **P3.2 `transacciones-acid.html`** (Avanzado, 16 min): el problema (transferencia
    a dos pasos), ACID (tabla letra→garantía→qué evita), BEGIN/COMMIT/ROLLBACK,
    anomalías (dirty/non-repeatable/phantom), niveles de aislamiento (tabla
    nivel×anomalía; nota InnoDB evita fantasmas en REPEATABLE READ), locks +
    FOR UPDATE, deadlocks (antídoto: bloquear en orden consistente), pesimista vs
    optimista. 3 bloques sql.
  - **P3.3 `modelado-relacional.html`** (Intermedio, 14 min): regla madre "cada
    hecho en un sitio", claves primaria/foránea (+ natural vs surrogate), relaciones
    1:N y N:M (tabla intermedia, diagrama), normalización 1FN→3FN sin dogma (tabla
    de preguntas prácticas), cuándo desnormalizar a propósito (compare + warning de
    optimización prematura). 3 bloques sql. Es el `featured` actual.
- Subido a GitHub: repo privado **dGran/MentorAI** (git init + primer commit con
  todo; symlinks AGENTS.md/CLAUDE.md/.claude/skills versionados como symlink).
  `.gitignore` mínimo (cruft SO, .idea/.vscode, temporales).
- Siguiente en la ruta: **Pilar 4 — El sistema por debajo** (`procesos-hilos`,
  `concurrencia`, `async-event-loop`, `memoria`). Sin dep. de highlighter (PHP +
  pseudocódigo; ojo: PHP flojo en hilos → ejemplos mixtos).

## Cómo añadir un tutorial
Ver README.md → "Añadir un tutorial nuevo" (copiar plantilla, rellenar, añadir
tarjeta en index.html con `data-categories`).

## Catálogo auto-generado (2026-06-21)
- `tutorials/manifest.js` (`window.ACADEMIA_TUTORIALS`) es la única fuente de
  verdad del catálogo. `index.html` solo tiene contenedores `#filters` y
  `#cards` vacíos; el módulo `Catalog` en `main.js` los rellena: chips con
  conteo por categoría (auto-clasificación), tarjetas, stat de publicados.
- Añadir tutorial = crear .html desde plantilla + 1 entrada en manifest.js.
  Categorías nuevas → chip automático; nombre bonito en `CATEGORY_LABELS`.

## Puente local con Claude (2026-06-21) — HECHO
El usuario eligió la opción B. Implementado y probado E2E:
- `server/bridge.js` (Node puro, sin deps): sirve el sitio estático + expone
  `POST /api/generate` en el mismo puerto (PORT=4321 por defecto).
- Ejecuta `claude -p --output-format json` por stdin (usa la sesión de Claude
  Code, SIN API key de Anthropic). Le pasa _PLANTILLA.html y opcache.html como
  referencia de estilo. Claude devuelve JSON {slug,title,description,topic,
  categories,tags,icon,html}; el SERVIDOR escribe tutorials/<slug>.html y añade
  la entrada al manifest (evita prompts de permisos).
- UI: botón "Añadir tutorial" + modal (#composer) en index.html; lógica en
  `initComposer()` de main.js. En file:// avisa de arrancar el puente.
- Env: PORT, CLAUDE_BIN (def "claude"), CLAUDE_MODEL.
- Probado con un `claude` falso: genera, escribe fichero y actualiza manifest OK.
  Artefactos de prueba limpiados; manifest con 3 entradas reales.

Pendiente real de probar: una generación con el `claude` de verdad (no se hizo
para no gastar cuota). Si falla el parseo, revisar extractModelJson.

## Refinar tutoriales (2026-06-21) — HECHO
Botón «Refinar» en cada tarjeta publicada (`.card__refine`, generado en
`buildCard` de main.js). Abre el modal `#refiner` (un solo textarea de
instrucciones). `initRefiner()` postea a `POST /api/refine` con
`{slug, instructions}`.
- `server/bridge.js`: `handleRefine` lee el .html actual, lo pasa a Claude con
  `buildRefinePrompt` (reescribe SOBRE la base, no desde cero), sobrescribe el
  fichero y mergea en sitio los metadatos cambiados (title/description/topic/
  icon/tags/minutes) vía `loadManifest`/`saveManifest` (preservan la cabecera).
- Guardas: existencia del fichero + `filePath.startsWith(ROOT)` (path traversal),
  entrada presente en el manifest, HTML válido (incluye `<!DOCTYPE`).
- Probado E2E con un `claude` falso: refina opcache, sobrescribe el .html y
  actualiza title/tags/minutes del manifest. Artefactos restaurados/limpiados.
- Modales refactorizados: `createModalController(id)` + `requestTutorial(url,
  payload, controller, submitBtn)` los comparten compositor y refinador.

## Buscador + favoritos (2026-06-21) — HECHO
- Buscador del catálogo: input `#catalog-search` en `index.html`; en `main.js`
  el módulo `Catalog` filtra por texto sobre `data-search` (title + description
  + tags + topic + categories + level, normalizado sin acentos vía
  `normalize()` con `[̀-ͯ]`). Se combina con el filtro de chip activo
  (estado compartido `{filter, query}` + `applyFilters`). Empty-state
  `#cards-empty` cuando no hay coincidencias.
- Favoritos: módulo `Bookmarks` (localStorage key `academia-bookmarks`, array de
  slugs). Botón estrella `.card__bookmark` en cada tarjeta publicada; chip
  especial «Guardados» (`data-filter="saved"`) con conteo en vivo. Solo
  publicados (marcar un "próximamente" no tiene sentido).
- Alcance elegido por el usuario: buscador SOLO metadatos (full-text con el
  bridge queda para fase 2) y marcado SOLO favoritos de tarjeta (subrayar texto
  dentro del tutorial queda pendiente; ojo: chocaría con el refinado, que
  reescribe el HTML → anclar resaltados por texto, no por offset).
- Probado con stub DOM+localStorage: chips, búsqueda (incl. sin acento),
  empty-state, toggle de favorito, contador en vivo, filtro Guardados y
  persistencia. OK.

## Estructura de agentes (2026-06-21) — HECHO
Proyecto con scaffold `.agents/` siguiendo la convención del flujo:
- `.agents/rules/global.md`: reglas propias del repo (invariantes de
  arquitectura, file://, manifest como fuente de verdad, convención de
  comentarios, mantenimiento). NO duplica los estándares globales.
- `.agents/skills/tutorial/SKILL.md`: skill de proyecto para crear/refinar un
  tutorial (caminos puente vs manual + checklist de calidad bloqueante).
- `.agents/notes/`: este `estado.md` + un `plan-*.md` por feature pendiente.
- Symlinks: `AGENTS.md` y `CLAUDE.md` → `.agents/rules/global.md`;
  `.claude/skills` → `.agents/skills`. Así rules y skill se cargan en cada sesión.
- Decisión del usuario: NO se usa el flujo GitHub (spec/implement/...); no hace
  falta. No proponer `/new-project`.

## Planes pendientes (detalle en notes)
- `plan-curriculum-fundamentos.md` — currículum de fundamentos CS para backend
  autodidacta (7 pilares). **Decidido:** arrancar por el pilar Bases de datos,
  ejemplos PHP+SQL/bash. Dep. técnica: añadir `sql` al highlighter antes del 1er
  tutorial. Siguiente: highlighter SQL → `indices-btree.html`.
- `plan-buscador-fulltext.md` — búsqueda dentro del contenido (índice por el puente).
- `plan-resaltado-texto.md` — subrayar texto dentro de los tutoriales.
- `plan-autocategorizacion.md` — que la IA proponga las categorías al generar.

## Siguiente paso sugerido
Cuando se pida otro tutorial, los placeholders del catálogo apuntan a "Preload
en PHP" y "Redis como caché". Reusar la plantilla y el vocabulario de
componentes ya definido.

## Notas técnicas
- Para añadir un lenguaje al resaltado: ampliar `LANGUAGES` en `main.js`.
- Escapar `<`, `>`, `&` dentro de los `<code data-lang=...>` (ej. `&lt;?php`).
