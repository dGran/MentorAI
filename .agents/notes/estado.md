# Estado — Academia (plataforma de formación)

## Despliegue (2026-06-21)
- Repo: `github.com/dGran/MentorAI` (rama `main`), **público**.
- Hosting: **GitHub Pages** (Deploy from branch `main` / root) →
  `https://dgran.github.io/MentorAI/`. Gratis por ser público.
- **PWA instalable**: `manifest.webmanifest` (display standalone) + iconos en
  `assets/icons/` + metas Apple en `index.html`. Las metas/manifest están **solo
  en index.html** (define el scope); si iOS sale a Safari al navegar tutoriales,
  replicar las metas en los 21 `tutorials/*.html`.
- Estado de usuario (tema, marcadores, progreso, "seguir viendo") es `localStorage`
  **por dispositivo**: no sincroniza móvil↔escritorio. Decisión consciente (sin
  login/servidor). Si molesta, primer paso sería export/import manual (no backend).

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

## Object Calisthenics + Conceptos de IA (2026-06-27) — HECHO (sin commit)
Dos añadidos sueltos pedidos por el usuario tras la cola de arquitectura.
Catálogo: **50 publicados**. `featured` movido de cqrs-event-sourcing →
`object-calisthenics`.
- **`object-calisthenics.html`** (artículo suelto, `["arquitectura"]`, topic
  "Diseño y arquitectura", Int, 16m, icon code): las 9 reglas de Jeff Bay /
  Keyvan Akbary agrupadas en 4 familias (flujo: 1 nivel indent + sin else; tipos:
  envolver primitivos + colecciones de primera clase; acoplamiento: 1 punto por
  línea/Demeter + sin getters/setters; tamaño: no abreviar + entidades pequeñas +
  2 variables de instancia). Marco "es una kata, no dogma de producción". Cruza
  ddd-tactico e inyeccion-dependencias. 2 php. NO va en curso (artículo).
- **`conceptos-ia.html`** (lección, `["ia"]`, topic "Programar con IA", Princ,
  15m, icon signal): mapa del ecosistema — LLM, prompt/tokens/ventana de contexto,
  herramientas (tool/function calling), agente, **MCP** (Model Context Protocol,
  estándar abierto de Anthropic; analogía USB-C; tools=qué, MCP=cómo), **RAG** +
  embeddings, fine-tuning vs contexto. Sin bloques con data-lang (conceptual).
  **Añadido como PRIMERA lección del curso `programar-con-ia`** (antes de
  como-piensa-un-llm) en courses.js. Cruza como-piensa-un-llm y flujo-con-agentes.
  (Se consultó la skill `claude-api` para precisión sobre MCP/agente/LLM.)
- Verificado: node --check, escapado (0 crudos), TOC↔h2, cruce (1 featured, 0
  huérfanas, 39 lecciones), render headless (0 errores JS, tutorial-actions
  inyectado en ambos).

## Plan abierto — Testing a fondo + Observabilidad (2026-06-27)
Detalle en `plan-testing-y-observabilidad.md`. El usuario notó que el bloque
testing quedó conceptual y propuso PHPUnit a fondo + monitoring (Sentry/Grafana/
Loki). Decidido (AskUserQuestion): **dos cursos de testing separados** (renombrar
el actual a "TDD y fundamentos" + nuevo "PHPUnit a fondo", 6 lecciones) y un curso
**"Observabilidad y monitoring"** completo (Sentry + Grafana/Loki/LogQL +
Prometheus/PromQL, 9 lecciones en módulos). 15 tutoriales nuevos, 1 categoría nueva
`observabilidad`. **Plan dejado en notas; pendiente OK del usuario para la autoría.**

## Plan abierto — SOLID + Clean Code (2026-06-27)
Detalle en `plan-diseno-y-calidad.md`. El usuario pidió un curso de SOLID (cada
principio con ejemplos claros) y "algo de clean code". Decidido (AskUserQuestion):
SOLID **curso propio** (7 lecciones: intro + SRP/OCP/LSP/ISP/DIP + cierre), con la
**lección DIP breve** que remite a `inyeccion-dependencias` (sigue suelto). Clean
Code propuesto como **curso propio** (6 lecciones: intro, nombres, funciones,
comentarios, errores, code smells+refactoring) — **confirmado aparte**, no
agrupado con SOLID. Tercer curso `di-contenedores`: reutiliza el artículo existente
`inyeccion-dependencias` como lección 1 + nuevo `contenedor-di` denso (container
por dentro: autowiring/reflexión, lazy, compilado, ciclo de vida, memoria y GC en
long-running). `inyeccion-dependencias` deja de ser artículo suelto. Reusan
`arquitectura`/`php`. Cuarto curso `oop` (Programación orientada a objetos, 6
lecciones: clases-y-objetos/encapsulación, herencia, polimorfismo, interfaces,
clases-abstractas, tipos-de-clases-php) — fundamento que va ANTES de SOLID; el
usuario destacó interés en interfaces, abstract y los tipos de clases PHP. Posible
chip nuevo `oop`. **20 tutoriales nuevos, 4 cursos. Pendiente OK del usuario.**

## Rutas de aprendizaje + progreso de lectura (2026-06-27) — HECHO (sin commit)
Tres cosas pedidas por el usuario.
- **Progreso de lectura en la página de tutorial.** `tutorial.js`
  `buildReadingProgress(slug)`: barra + "X% leído" bajo las acciones, en TODOS los
  tutoriales (artículos y lecciones). Toma el % guardado de `Reading.get`, sube
  con el scroll y, al pulsar **Marcar como completado**, salta a **100%**; al
  **Reiniciar**, vuelve a 0. (Sustituye al efímero "% del curso" que se probó
  antes, que no aplicaba a artículos sueltos.)
- **Rutas de aprendizaje (nueva capa por encima de cursos).** Itinerarios que
  ordenan cursos y artículos hacia un objetivo. Pasos mixtos
  `{type:"course"|"article", ref:slug}`. Datos en `tutorials/paths.js`
  (`window.MENTORAI_PATHS`), módulo `assets/js/modules/paths.js` (`MentorAI.Paths`
  con `render()` → `rutas.html#paths` y `renderHome()` → `index #home-paths`).
  Página nueva **`rutas.html`** + navbar "Rutas" en index/cursos/articulos/curso +
  sección con tarjetas y enlace en el inicio (`#rutas-home`). `init.js` llama
  `Paths.render()`/`Paths.renderHome()`. CSS `.path*`/`.path-card*` +
  `.step--course`/`.step__kind`/`.step__marker--icon`. 3 rutas iniciales:
  `php-a-fondo` (6 artículos), `diseno-oo` (2 artículos + curso arquitectura),
  `backend-cimientos` (3 cursos). Progreso de ruta = items completados (lecciones
  de cursos + artículos) / publicados.
- **Regla nueva en `.agents/rules/global.md`:** tres capas (manifest → cursos →
  rutas), y **al añadir tutorial/curso revisar `paths.js` para encajarlo en una
  ruta**. `paths.js` añadido al listado de módulos del Frontend.
- Verificado: `node --check`, cruce paths×cursos×manifest (0 refs inválidas),
  render headless de rutas.html (3 rutas, pasos mixtos, 0 errores JS) e index
  (3 tarjetas de ruta), captura visual OK.
- **PENDIENTE**: navbar "Rutas" NO está en los 50 tutoriales (solo en las 4 vistas
  + rutas); añadirla por sed si se quiere consistencia total. El fix del % y las
  rutas esperan commit.

## Curso OOP publicado + fixes UI (2026-06-27) — HECHO (sin commit)
Arranque de la autoría del `plan-diseno-y-calidad.md`. Catálogo: **56 publicados**.
Orden global aprobado: **OOP → SOLID → Clean Code → DI+contenedores → PHPUnit →
Observabilidad**. Empezado el primero.
- **Curso `oop`** (6 lecciones, primer curso en courses.js, va antes de SOLID).
  Categoría nueva **`oop`** (label "Orientación a objetos" en CATEGORY_LABELS,
  decisión del usuario por AskUserQuestion: chip propio, no reusar php/arquitectura).
  topic "Orientación a objetos", icon code, autoría manual con `compare`:
  - `oop-clases-y-objetos` (Princ, 13m): qué resuelve la OOP, clase vs objeto,
    estado+comportamiento, instanciar, `$this`, constructor (promoción + readonly),
    encapsulación (public/protected/private; "un getter público no es encapsular").
    Es el `featured` actual (movido de object-calisthenics).
  - `herencia` (Int, 14m): extends, parent::, sobrescribir, jerarquías frágiles +
    explosión de subclases, herencia vs composición (preferir composición).
  - `polimorfismo` (Int, 14m): mismo mensaje/distinta respuesta, el switch por tipo
    que crece → interfaz Forma, type hints como contrato, sustituibilidad (puente LSP).
  - `interfaces` (Int, 13m): contrato (qué no cómo), implements, programar contra
    interfaces (repo MySQL vs memoria), implementar varias (puente ISP), vs herencia.
  - `clases-abstractas` (Int, 13m): abstract, métodos abstractos, template method
    (importar final), abstracta vs interfaz + tabla + cómo decidir.
  - `tipos-de-clases-php` (Int, 15m): final/interface/abstract/trait/enum/readonly/
    anónimas + tabla de decisión. Cierra remitiendo a SOLID.
- **CSS global (fix UI pedido por el usuario):** `.breadcrumb` → scroll horizontal
  (flex-wrap:nowrap + overflow-x:auto + white-space:nowrap + scrollbar oculto, `> *`
  flex-shrink:0); `.tutorial-meta span` → `white-space:nowrap` (los "X min de lectura"
  / "Nivel X" ya no rompen en 2 líneas). Afecta a TODAS las páginas de tutorial.
- **paths.js:** curso `oop` añadido como **primer paso de la ruta `diseno-oo`**
  (regla: revisar paths al añadir contenido).
- Verificado: node --check (manifest/courses/paths/catalog), script python (0 chars
  crudos en code-blocks, balance <code>, TOC↔h2, 0 U+FFFD) → 0 problemas; cruce
  courses×paths×manifest (56 entradas, 1 featured=oop-clases-y-objetos, curso oop 6/6
  lecciones, ruta diseno-oo 4 pasos OK); render headless de interfaces.html (0 errores
  JS, tutorial-actions + route-nav de curso inyectados, highlighter tokeniza).
- **PENDIENTE**: (1) **6 enlaces internos a lecciones de SOLID que aún NO existen**
  (solid-introduccion, ocp-abierto-cerrado, lsp-sustitucion-liskov×2,
  isp-segregacion-interfaces, dip-inversion-dependencias) — están en callouts de
  herencia/polimorfismo/interfaces/tipos-de-clases-php; **se cierran al escribir el
  curso SOLID** (siguiente del plan). (2) Nada commiteado. (3) Sigue el resto del plan:
  SOLID (7) → Clean Code (6) → di-contenedores (1 nuevo) → PHPUnit/Observabilidad.

## Curso SOLID publicado (2026-06-27) — HECHO (commit+push)
Segundo curso del `plan-diseno-y-calidad.md`. Catálogo: **63 publicados**.
- **Curso `solid`** (7 lecciones, segundo curso en courses.js tras oop). Categoría
  **`arquitectura`** (reusada, no chip nuevo). topic "Principios SOLID", icon code,
  ejemplos PHP en `compare` (mal→bien). featured movido de oop-clases-y-objetos →
  `solid-introduccion`.
  - `solid-introduccion` (Int, 13m): qué es SOLID (Robert C. Martin), tabla de las 5
    letras, hilo común (cohesión/acoplamiento), se refuerzan, no es checklist.
  - `srp-responsabilidad-unica` (Int, 13m): una razón=un actor, god class factura
    (calcula+persiste+imprime)→3 clases, cohesión no microclases.
  - `ocp-abierto-cerrado` (Int, 14m): switch por método de pago que crece →
    interfaz+estrategia, regla de los tres, match sobre enum cerrado no viola OCP.
  - `lsp-sustitucion-liskov` (Avz, 14m): cuadrado/rectángulo, pre/postcondiciones,
    herencia que miente (lanza en método heredado), salida = interfaces hermanas.
  - `isp-segregacion-interfaces` (Int, 13m): Multifuncion gorda con throw NoSoportado
    → Impresora/Escaner/Fax, el cliente define la interfaz, ISP abarata test doubles.
  - `dip-inversion-dependencias` (Int, 12m, breve): alto/bajo nivel + abstracción,
    qué se invierte, la interfaz la posee el alto nivel; remite a
    inyeccion-dependencias y hexagonal.
  - `solid-en-conjunto` (Avz, 13m): la cadena O→I→L→D→S, los 5 en una historia
    (pedido+notificación), sobre-ingeniería, cuándo NO forzar; remite a clean-code y tdd.
- **paths.js:** curso `solid` añadido tras `oop` en la ruta `diseno-oo`
  (oop → solid → object-calisthenics → inyeccion-dependencias → diseno-y-arquitectura).
- **Cierra los 6 enlaces pendientes de OOP** (las lecciones OOP cruzaban a slugs SOLID
  que ahora existen). Verificado: node --check, escapado/TOC↔h2/balance (0 problemas),
  cruces (63 entradas, 1 featured=solid-introduccion, curso solid 7/7, 0 duplicados,
  ruta OK), render headless de lsp (0 errores JS, route-nav+route-related inyectados,
  tokens) y de cursos.html (cursos "Programación orientada a objetos" y "Principios
  SOLID" visibles).
- **PENDIENTE**: queda **1 enlace a `clean-code-intro.html`** (en solid-en-conjunto),
  que cierra el **curso Clean Code** (siguiente del plan: 6 lecciones). Después:
  `di-contenedores` (1 nuevo: contenedor-di + reusar inyeccion-dependencias) y el frente
  testing/observabilidad (PHPUnit 6 + Observabilidad 9).

## Curso Clean Code publicado (2026-06-27) — HECHO (commit+push pendiente de confirmar)
Tercer curso del `plan-diseno-y-calidad.md`. Catálogo: **69 publicados**.
- **Curso `clean-code`** (6 lecciones, tercer curso en courses.js tras solid).
  Categoría **`arquitectura`** (reusada). topic "Clean Code", icon code, ejemplos PHP
  en `compare`. featured movido de solid-introduccion → `clean-code-intro`.
  - `clean-code-intro` (Int, 13m): se lee 10× más de lo que se escribe, qué es código
    limpio, coste del código sucio (deuda diaria), regla del boy scout.
  - `nombres` (Int, 13m): revelar intención, evitar desinformación, pronunciables/
    buscables (no números mágicos), no abreviar, booleanos is/has/should.
  - `funciones-limpias` (Int, 14m): una sola cosa, un nivel de abstracción, pocos args
    (no flags), sin efectos secundarios (CQS), early return.
  - `comentarios` (Int, 12m): el comentario como disculpa, comentarios que mienten,
    código comentado=basura, suplir mal nombre, cuándo sí (porqué no qué); cita la
    convención del repo.
  - `manejo-errores` (Int, 13m): excepciones vs códigos, específicas (Logic/Runtime),
    no null (tipo nullable explícito), fail fast (validar en constructor), separar
    lógica de manejo, no tragarse excepciones.
  - `code-smells-refactoring` (Avz, 15m): catálogo de smells (tabla), refactorizar=
    cambiar forma sin comportamiento, extraer método + reemplazar condicional por
    polimorfismo, NO refactorizar sin tests (pasos pequeños, verde entre cada uno).
- **paths.js:** curso `clean-code` añadido tras `solid` en la ruta `diseno-oo`
  (oop → solid → clean-code → object-calisthenics → inyeccion-dependencias →
  diseno-y-arquitectura).
- **Cierra el último enlace pendiente** (solid-en-conjunto → clean-code-intro).
  Verificado: node --check, escapado/TOC↔h2/balance (0 problemas), cruces (69 entradas,
  1 featured=clean-code-intro, curso 6/6, 0 duplicados, ruta OK), **0 enlaces colgando**
  en los 19 tutoriales OOP+SOLID+CleanCode, render headless de funciones-limpias (0
  errores JS, route-nav inyectada) y cursos.html (curso Clean Code visible).
- **PENDIENTE del plan-diseno-y-calidad**: solo queda `di-contenedores` (curso de 2
  lecciones: reusar `inyeccion-dependencias` como lección + `contenedor-di` NUEVO, denso:
  autowiring/reflexión, ciclo de vida, compilado vs runtime, memoria/GC). Implica que
  inyeccion-dependencias deja de ser artículo suelto. Después, frente
  testing/observabilidad (plan-testing-y-observabilidad.md): PHPUnit (6) + Observabilidad (9).

## Curso DI y contenedores — plan-diseno-y-calidad COMPLETO (2026-06-27) — HECHO (commit+push)
Cuarto y último curso del `plan-diseno-y-calidad.md`. **El plan queda cerrado.**
Catálogo: **70 publicados**.
- **Curso `di-contenedores`** (2 lecciones, cuarto curso en courses.js tras clean-code).
  Avanzado, icon code:
  - `inyeccion-dependencias` (YA EXISTÍA, era artículo suelto) — **ahora es lección 1
    del curso, NO se reescribió**. Deja de aparecer en Artículos (Catalog excluye
    lessonSlugs); recibe course-nav inyectada. Verificado en headless.
  - `contenedor-di` (NUEVO, Avz, 18m, `["php","arquitectura"]`, topic "Inyección de
    dependencias"): el contenedor por dentro. Secciones: qué resuelve (definiciones +
    PSR-11), autowiring por reflexión (con Container mínimo didáctico + ReflectionClass),
    detección de ciclos (marcar lo que se construye, DependenciaCircular), ciclo de vida
    (shared/singleton vs factory, lazy services con proxies + diagrama), compilado vs
    runtime (Symfony compila a PHP plano / Laravel runtime), memoria y GC (FPM=request,
    arena Zend "gratis" → memoria-php; long-running Swoole/RoadRunner/Octane = persiste →
    fugas y filtración de estado entre usuarios, reinicio cada N), service locator como
    antipatrón. Cruza inyeccion-dependencias, php-fpm, memoria-php, workers-php, srp.
    featured movido de clean-code-intro → contenedor-di.
- **paths.js:** la ruta `diseno-oo` sustituye el paso `article:inyeccion-dependencias`
  por `course:di-contenedores`. Ruta final: oop → solid → clean-code →
  object-calisthenics → di-contenedores → diseno-y-arquitectura (6 pasos).
- Verificado: node --check, escapado/TOC↔h2/balance (0), cruces (70 entradas, 1
  featured=contenedor-di, curso 2/2, inyeccion-dependencias ahora es lección, ruta OK),
  0 enlaces colgando, render headless de contenedor-di (0 errores JS, route-nav) e
  inyeccion-dependencias (route-nav inyectada), articulos.html (0 ocurrencias de ambas
  = bien excluidas), cursos.html (curso DI visible).

## ESTADO GLOBAL tras esta sesión (2026-06-27)
**4 cursos nuevos publicados y pusheados** (commits 96c403f OOP, da3c958 SOLID,
ba97345 Clean Code, + DI). **20 tutoriales nuevos** (6 OOP + 7 SOLID + 6 Clean Code +
1 contenedor-di) → `plan-diseno-y-calidad.md` **COMPLETO**. Catálogo 50→70 publicados,
de 4 a **8 cursos**. Fixes UI: breadcrumb scroll horizontal + tutorial-meta nowrap.
- **PENDIENTE (único frente de contenido restante):** `plan-testing-y-observabilidad.md`
  — curso `phpunit` (6 lecciones, + renombrar el curso `testing` actual a "TDD y
  fundamentos") y curso `observabilidad` (9 lecciones: Sentry + Grafana/Loki/LogQL +
  Prometheus/PromQL; 1 categoría nueva `observabilidad`; PromQL/LogQL/YAML sin data-lang).
  **15 tutoriales.**
- **Fase 2 (infraestructura, sin tocar):** plan-buscador-fulltext, plan-resaltado-texto,
  plan-autocategorizacion.

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

## Pilar 4 — El sistema por debajo (2026-06-21) — COMPLETO
Categoría `sistemas` (label nuevo en `CATEGORY_LABELS`: "El sistema por debajo"),
icon `code`, 4 tutoriales. Catálogo: 16 publicados, 2 soon.
- **P4.1 `procesos-hilos.html`** (Intermedio, 14 min): programa/proceso/hilo,
  aislamiento del proceso (`pcntl_fork`, copia de memoria), hilos comparten
  montón/globales pero cada uno su pila, tabla comparten/no, por qué PHP-FPM es
  multiproceso (worker por petición, estado fuera → Redis/BBDD), coste creación
  + cambio de contexto. 1 php + 1 bash.
- **P4.2 `concurrencia.html`** (Avanzado, 15 min): race condition (read-modify-
  write, lost update con diagrama), sección crítica + mutex, atomicidad, en PHP
  vía BBDD/Redis (`UPDATE … SET stock = stock - 1 WHERE … AND stock > 0`,
  `SELECT … FOR UPDATE`), deadlock + orden de bloqueo consistente. 1 php + 2 sql.
- **P4.3 `async-event-loop.html`** (Avanzado, 14 min): I/O-bound vs CPU-bound, un
  hilo por conexión no escala, event loop por dentro (pseudocódigo sin data-lang),
  I/O no bloqueante + callbacks/promesas, cuándo brilla / no bloquear el loop,
  PHP-FPM síncrono vs Swoole/ReactPHP. 1 php + 1 bloque pseudocódigo (sin
  data-lang, sin resaltar a propósito).
- **P4.4 `memoria.html`** (Intermedio, 15 min): stack (LIFO, rápido, pila por
  hilo, overflow) vs heap (dinámico, fugas), tabla, memoria virtual (páginas,
  aislamiento, swap), caché de CPU + localidad de referencia (líneas de 64B,
  array contiguo vs lista enlazada), en PHP `memory_limit` + copy-on-write +
  streaming. 1 php. Es el `featured` actual (se quitó de procesos-hilos).
Verificado todo: `node --check`, escapado (script python, 0 crudos), TOC↔h2,
derivación de catálogo + roadmap (chip sistemas=4, ruta encadena
procesos→concurrencia→async→memoria→opcache, related correcto).

## Pilar 5 — Cómo viaja un dato (redes) (2026-06-21) — COMPLETO
Categoría `redes` (label nuevo en `CATEGORY_LABELS`: "Cómo viaja un dato", igual
criterio que `sistemas` = el topic del pilar), icon `signal`, topic "Cómo viaja
un dato", 3 tutoriales. Catálogo: 19 publicados, 2 soon.
- **P5.1 `url-a-fondo.html`** (Intermedio, 14 min): el viaje de pulsar Enter a ver
  la página. Anatomía de la URL, DNS (recursivo/raíz/TLD/autoritativo, caché),
  handshake TCP, TLS (cert + clave de sesión), petición HTTP final, errores por
  eslabón. ids TOC: idea, anatomia, dns, tcp, tls, http, errores, resumen. 2 bash
  (dig, curl -v).
- **P5.2 `http-a-fondo.html`** (Intermedio, 16 min): protocolo de texto. Anatomía
  petición/respuesta, métodos (seguros/idempotentes), status reales, caché por
  cabeceras (Cache-Control/ETag), sin estado (cookies vs tokens), errores. ids:
  idea, mensaje, metodos, status, cache, estado, errores, resumen. 1 bloque sin
  data-lang (HTTP crudo, no lo resalta el highlighter; `&lt;!DOCTYPE…` escapado).
- **P5.3 `tcp-ip.html`** (Avanzado, 15 min): el cartero fiable sobre red no
  fiable. Capas TCP/IP, IP+puerto, handshake de 3 pasos, fiabilidad (números de
  secuencia, ACK, retransmisión, ventana/control de flujo), por qué "se queda
  colgado" (SYN sin respuesta, firewall que descarta, puerto cerrado). ids: idea,
  capas, ip, puertos, handshake, fiabilidad, colgado, resumen. 2 bash (ss, nc).
  Es el `featured` actual (se quitó de memoria).
Verificado todo: `node --check` manifest + main.js, escapado (script python, 0
crudos en los 3), TOC↔h2, stub de catálogo+roadmap (featured=1 → tcp-ip, chip
redes=3, ruta encadena url-a-fondo→http-a-fondo→tcp-ip→opcache).

## Rebrand + interfaz (2026-06-21) — HECHO
- **Renombrado Academia → MentorAI** en toda la UI (títulos, brand mark `A`→`M`,
  favicon, footer, breadcrumbs). Case-sensitive: se conservan las claves
  funcionales `academia-*` de `localStorage` y el global `ACADEMIA_TUTORIALS`
  (API interna; no se tocan).
- **Ruta de aprendizaje (plan de carrera).** Nueva fuente de orden:
  `tutorials/roadmap.js` → `window.MENTORAI_ROADMAP` (8 pilares con `steps` que
  referencian slugs del manifest). Mismo patrón file:// (`.js` que setea global,
  `<script>` antes de `main.js`). El manifest sigue siendo la verdad de cada
  tutorial; el roadmap solo aporta secuencia.
- **Home con conmutador de vistas** (`.view-toggle`, `data-view=catalog|roadmap`):
  Catálogo (lo de siempre) vs Ruta. Módulo `Roadmap` en `main.js` cruza
  roadmap × manifest × `Progress` y pinta pilares con barra de progreso; cada
  paso = enlace (publicado) / "Próximamente" (soon) / "Planificado" (no existe).
  `initViewToggle()` alterna los `[data-view-panel]`.
- **Progreso de lectura.** Módulo `Progress` (`localStorage` `academia-progress`,
  array de slugs completados), misma forma que `Bookmarks`. Alimenta la ruta.
- **Página de tutorial enriquecida por JS** (`initTutorialPage`, slug del
  filename, **sin editar los 14 HTML a mano**): botón **Escuchar** (Web Speech
  nativo, voz `es`, play/stop; offline, file://), botón **Marcar como completado**
  (toggle `Progress`), y **navegación de ruta** (anterior/siguiente = vecinos
  publicados en la secuencia global del roadmap + "Más en este pilar"); oculta la
  `.tutorial-nav` manual cuando el tutorial está en el roadmap.
- CSS nuevo en `styles.css` (todo con tokens): `.view-toggle*`, `.roadmap`/
  `.pillar*`/`.steps`/`.step*`, `.tutorial-actions`/`.tutorial-action*`,
  `.route-nav*`/`.route-related*` + responsive.
- Decisiones del usuario: audio = **Web Speech nativo** (no TTS neural, rompería
  file://); ruta = **sección en la home** (no página aparte).
- **Repo GitHub privado `MentorAI`** ya creado (acción de cara afuera). Regla
  fijada: crear/borrar repos y `push` se **confirman explícitamente** antes de
  lanzarlos, no se infieren de una pregunta.

## Vaciado de la cola de tutoriales (2026-06-22) — COMPLETO
Sesión de autoría autónoma ("subir todos los tutoriales en cola hasta el límite
de sesión"). Se vaciaron las dos colas de ideas + el placeholder `preload`.
Catálogo: **27 publicados, 0 soon**. Commits LOCALES (sin push, por la regla de
acciones de cara afuera). Tres commits: `da8c04f` (PHP por dentro), `8a1c29f`
(Redis), `d94ae3d` (jerga), `c5dc1ad` (preload).
- **Bloque "PHP por dentro"** (`ideas-php-por-dentro.md`, ya consumido) — nueva
  categoría `runtime` (label "PHP por dentro" en CATEGORY_LABELS), combinada con
  `php`; topic "PHP por dentro". 4 tutoriales, todos `date: 2026-06-22`:
  - `extensiones-php.html` (Intermedio, 13 min, icon code): extensión = módulo C
    (.so/.dll), core vs PECL, `extension=` vs `zend_extension=`, orden de
    conf.d/, `php -m`, CLI vs FPM, tabla de imprescindibles, FPM es un SAPI no
    una extensión, instalar (apt + docker-php-ext). Enlaza php-fpm.
  - `php-fpm.html` (Avanzado, 16 min, icon bolt): SAPI = Server API,
    `php_sapi_name()`, tabla CLI/CGI/mod_php/FPM, FastCGI, ciclo (RINIT/RSHUTDOWN),
    pm static/dynamic/ondemand, www.conf, dimensionar max_children (RAM ÷ memoria
    por worker), shared-nothing. Enlaza extensiones (prev) y memoria-php (next).
  - `memoria-php.html` (Avanzado, 16 min, icon code): arena de Zend MM por request
    (emalloc/efree), memory_limit por request, zval, refcounting, copy-on-write,
    recolector de ciclos, gc_collect_cycles, streaming/generators. Enlaza memoria
    (fundamentos), php-fpm (prev), workers-php (next).
  - `workers-php.html` (Avanzado, 15 min, icon bolt): los dos sentidos de worker
    (FPM vs cola), queue:work/messenger:consume, supervisor.conf, Swoole/RoadRunner
    long-running, fugas de memoria, reinicio por --max-jobs/--max-time. Enlaza
    memoria-php (prev).
- **Bloque Redis** (`ideas-tutoriales.md`, parte) — `date: 2026-06-22`:
  - `redis-a-fondo.html` (categorías `["infra","bbdd"]`, icon database): single-
    thread/in-memory, strings/INCR, listas/BRPOP, sets/zsets, hashes,
    bitmaps/HLL/streams/pubsub, TTL, naming con `:`, MULTI vs pipeline, RDB vs AOF.
    **Añadido lexer `redis` a LANGUAGES** en main.js (comandos en MAYÚSCULA). Usa
    `data-lang="redis"` y `data-lang="php"`. Enlaza concurrencia y redis-cache.
  - `redis-cache.html` (cierra el placeholder soon; `["infra","rendimiento"]`,
    icon database, Intermedio, 15 min): cache-aside, TTL obligatorio, invalidar
    borrando (no reescribir), tolerancia a obsolescencia, los tres fallos
    (penetration/avalanche/breakdown) + cache stampede y su lock SET NX. Enlaza
    redis-a-fondo (prev).
- **jerga.html** (`ideas-tutoriales.md`, parte) — nueva categoría `cultura`
  (label "Cultura dev"); topic "Cultura dev", Principiante, 14 min, icon code,
  sin bloques de código (glosario en tablas). Términos por tema:
  ejecución (parsear/runtime/deploy/rollback), errores (bug/edge case/race
  condition/memory leak/flaky), flujo git (merge/rebase/PR/deuda técnica), datos
  (payload/endpoint/idempotente/latencia), cultura (yak shaving/bikeshedding/
  rubber duck). Callout "stack overflow" → memoria.html. Sin prev/next (categoría
  suelta): ambos enlaces a la portada.
- **preload.html** (placeholder soon → publicado; `["php","rendimiento"]`, topic
  "PHP", icon signal, Avanzado, 12 min): el paso siguiente a OPcache. OPcache
  cachea opcodes pero la clase aún se carga/enlaza por proceso; preload
  (PHP 7.4+) deja clases enlazadas en memoria al arrancar FPM. Fichero de preload
  (opcache_compile_file vs require_once), opcache.preload/preload_user, la gran
  pega (congela el código → restart, no reload; técnica de prod no de dev),
  Symfony lo genera / Laravel via Octane. Enlaza opcache (prev) y php-fpm (next);
  se actualizó la tutorial-nav de `opcache.html` (apuntaba a "próximamente").
- Verificación por tanda: `node --check`, TOC↔h2 id, balance `<code`/`</code>`,
  escapado y render headless (memoria-php, redis-a-fondo, preload revisados en
  PNG: highlighting OK). Se movió el badge `featured` de tcp-ip a los nuevos.
- **roadmap.js NO tocado**: `preload` (pilar monográficos) y `redis-cache` (pilar
  distribuidos) ya estaban referenciados; ahora resuelven a publicado. Los demás
  tutoriales nuevos no están en ningún pilar del roadmap (quedan solo en catálogo);
  encajarlos en la ruta es una tarea aparte si se quiere.

## Pilares 6 y 7 — currículum COMPLETO (2026-06-22)
Se cerró el `plan-curriculum-fundamentos.md`: **22/22 tutoriales**. Faltaban 5
(redis-cache P6.3 ya estaba del vaciado de cola). Commit LOCAL `86e7c37`
("Completa el currículum: pilares 6 y 7"). Catálogo: **32 publicados, 0 soon**.
- **Pilar 6 — Sistemas distribuidos** (`distribuidos`, label nuevo "Sistemas
  distribuidos" en CATEGORY_LABELS), icon `signal`:
  - `idempotencia.html` (Avanzado, 15 min, `["distribuidos","mensajeria"]`): la red
    miente (lost-request vs lost-response), operación idempotente, at-most/at-least/
    exactly-once, por qué gana at-least-once + idempotencia, clave de idempotencia
    del productor, implementación con constraint UNIQUE (`processed_operations` +
    INSERT IGNORE + rowCount), errores (check-then-act, efecto externo no
    transaccional, tabla de claves sin poda). Cruza rabbitmq, concurrencia.
  - `cap-consistencia.html` (Avanzado, 15 min, `["distribuidos"]`): por qué replicar,
    las tres letras CAP, "elegir 2 de 3 está mal — P pasa, eliges C vs A en partición",
    CP vs AP, consistencia eventual + resolución de conflictos (LWW/merge/CRDT),
    quórum R+W>N, PACELC, decidir por dato. Sin código. Cruza url-a-fondo,
    idempotencia, redis-cache.
- **Pilar 7 — Seguridad de fundamentos** (`seguridad`, ya existía), icon `shield`:
  - `hashing-vs-cifrado.html` (Intermedio, 14 min): cifrado (reversible) vs hashing
    (un sentido), simétrico/asimétrico, propiedades del hash cripto, por qué las
    contraseñas se hashean no se cifran, sal + por qué MD5/SHA fallan (rápidos,
    rainbow), bcrypt/argon2id, PHP PasswordService (password_hash ARGON2ID, verify,
    needs_rehash). Cruza url-a-fondo, hashing.
  - `autenticacion.html` (Intermedio, 16 min): authN vs authZ, HTTP sin estado,
    sesiones por cookie (HttpOnly/Secure/SameSite), JWT (header.payload.firma),
    firmado≠cifrado, sesión vs JWT (la revocación es la pega del JWT → access+refresh),
    OAuth2 = autorización delegada, OIDC = "entrar con Google". Cruza http-a-fondo.
  - `owasp.html` (Intermedio, 16 min): OWASP Top 10, raíz común (fiarse del input),
    inyección SQL (concat vulnerable vs prepared), XSS (escapar la salida por
    contexto + CSP), CSRF (token + SameSite), principios transversales. Es el
    `featured` actual (se quitó de los 7 anteriores → un solo "Nuevo"). Cruza
    autenticacion.
- Verificación: `node --check`, TOC↔h2, balance `<code`/`</code>`, escapado (se
  corrigió un `->` crudo en el bloque bash de autenticacion → `-&gt;`), render
  headless. `roadmap.js` NO tocado: los 5 slugs ya estaban referenciados en los
  pilares `distribuidos` y `seguridad`; ahora resuelven a publicado.

## Cola siguiente — Testing, IA y arquitectura (2026-06-22)
Análisis previo encolado en `cola-arquitectura-y-practica.md` (pedido del usuario:
TDD, programar con IA, hexagonal, DDD, CQRS, "con previo análisis para ver cuántos
salen"). Resultado: **16 tutoriales** (rango 14-18). TDD=4 (`testing`), Programar
con IA=4 (`ia`), Hexagonal=2 (`arquitectura`), DDD=4 (`arquitectura`), CQRS=2
(`arquitectura`). 2 chips nuevos: `testing`, `ia`. Orden sugerido: TDD e IA
(transversales) → hexagonal → DDD → CQRS. ✅ **CONSUMIDA** → ver sección siguiente.

## Cola arquitectura y práctica — COMPLETA (2026-06-26) — SIN COMMIT
Sesión de autoría autónoma ("ataca toda la cola sin parar"). Escritos y publicados
los **16 tutoriales** de `cola-arquitectura-y-practica.md`. Catálogo: **48
publicados, 0 soon** (eran 32). Autoría manual (no se usó el puente) siguiendo
`/tutorial` y el patrón de `owasp.html`. Todos `date: 2026-06-26`, `featured`
movido de owasp → `cqrs-event-sourcing`.
- **Bloque TDD** (`testing`, topic "Testing", icon code): `tdd-ciclo` (Int, 14m,
  rojo-verde-refactor, baby steps, ejemplo PHPUnit, triangulación), `tipos-de-test`
  (Int, 14m, pirámide unit/integración/e2e, cono de helado), `test-doubles` (Int,
  14m, dummy/stub/spy/mock/fake, estado vs comportamiento, no mockear lo ajeno),
  `tests-que-no-estorban` (Avz, 15m, comportamiento≠implementación, FIRST, frágiles,
  cobertura engañosa). Ejemplos PHP/PHPUnit con `data-lang="php"`.
- **Bloque IA** (`ia`, topic "Programar con IA", icon signal): `como-piensa-un-llm`
  (Princ, 14m, tokens/ventana/predicción, alucinaciones), `prompting-para-codigo`
  (Int, 14m, contexto/específico/few-shot/iterar), `flujo-con-agentes` (Int, 15m,
  agentes, plan-implementar-revisar, contexto del repo), `criterio-y-riesgos` (Int,
  15m, revisar, seguridad/secretos/licencias, deuda, tests como red). Bloques de
  prompt SIN `data-lang` (no se resaltan a propósito).
- **Bloque arquitectura** (`arquitectura`, topic "Diseño y arquitectura", icon
  code): `hexagonal` (Avz, 16m, puertos/adaptadores, driving/driven, DIP),
  `hexagonal-en-php` (Avz, 16m, carpetas por capa, 1 puerto 2 adaptadores, test
  aislado), `ddd-que-es` (Int, 14m, lenguaje ubicuo, no es "más capas", cuándo no),
  `ddd-estrategico` (Avz, 15m, bounded context, subdominios core/soporte/genérico,
  context map), `ddd-tactico` (Avz, 16m, value object/entidad/agregado/repositorio/
  servicio/factory; agregado≠tabla), `eventos-de-dominio` (Avz, 15m, hecho en
  pasado, consistencia entre agregados, puente a mensajería+idempotencia), `cqrs`
  (Avz, 15m, comando vs query, niveles, cuándo NO), `cqrs-event-sourcing` (Avz, 16m,
  event store append-only, rehidratar, proyecciones, trade-offs). Ejemplos PHP.
- **Catálogo/cursos**: `CATEGORY_LABELS` += `arquitectura`/`testing`/`ia`
  (catalog.js). 3 cursos nuevos en `courses.js`: `testing` (4 lecciones planas),
  `programar-con-ia` (4 planas), `diseno-y-arquitectura` (3 módulos: hexagonal/DDD/
  CQRS, 8 lecciones). `inyeccion-dependencias` sigue como artículo suelto.
- **Cruces internos**: TDD↔inyeccion-dependencias; IA↔owasp/tdd; hexagonal↔
  inyeccion-dependencias/test-doubles; ddd-tactico↔modelado-relacional; eventos↔
  rabbitmq/idempotencia/cap-consistencia; cqrs↔cap-consistencia/eventos.
- **Verificado**: `node --check` (manifest/courses/catalog); script python (balance
  `<code>`, 0 `<`/`>` crudos en data-lang, TOC↔h2 id, 0 U+FFFD) → 0 problemas;
  cruce courses×manifest (1 featured, 0 duplicados, 0 lecciones huérfanas, 38
  referenciadas, 10 artículos sueltos); render headless google-chrome de 3
  tutoriales (highlighter tokeniza, tutorial-actions inyectado, 0 errores JS),
  articulos/cursos (4 course-cards) y curso.html?slug=diseno-y-arquitectura (3
  módulos). Nota de diseño: los 16 NO aparecen en Artículos (son lecciones de
  curso; la vista los excluye). Por eso en Artículos solo sale el chip Arquitectura
  (vía `inyeccion-dependencias`), no Testing ni IA.
- **PENDIENTE**: nada commiteado (19 ficheros: 3 mod + 16 nuevos). Espera OK del
  usuario para commit/push (regla de acciones de cara afuera).

## Cursos + Artículos (infraestructura) (2026-06-22) — HECHO (pusheado: 602ba2f, a580a2f)
Cambio de modelo de contenido pedido por el usuario: dos tipos de primera clase,
**artículo** (pieza suelta) y **curso** (colección con módulos→lecciones).
Decisiones: fusionar (una sola taxonomía, `roadmap.js`→`courses.js`, se elimina la
vista "Ruta"); artículo y lección **disjuntos** (Artículos solo muestra piezas que
no son de ningún curso); detalle de curso en **página dedicada** `curso.html?slug=`
auto-generada; monográficos (opcache/preload/inyeccion-dependencias/rabbitmq) →
artículos sueltos. Plan aprobado en `~/.claude/plans/quirky-weaving-backus.md`.
Esta tanda es **solo infraestructura**, NO incluye escribir los 16 tutoriales de la
cola (siguen en `cola-arquitectura-y-practica.md`, ahora serán cursos).
- **`tutorials/courses.js`** (`window.MENTORAI_COURSES`) sustituye a `roadmap.js`
  (eliminado). Un curso: `{slug,title,summary,level,icon,modules:[{title,summary,
  lessons:[slug]}]}` o `lessons` plano (módulo único). Único curso por ahora:
  `fundamentos` (los 7 pilares del roadmap → 7 módulos, 22 lecciones). Referencia
  slugs, no duplica metadatos (manifest sigue siendo la verdad).
- **main.js**: módulo `Roadmap`→`Courses` (tarjetas de curso en `#courses` +
  `renderCoursePage()` que lee `?slug=`); `buildPillar`→`buildModule`,
  `buildStep`→`buildLesson`. `Catalog.render` filtra a artículos (excluye
  `Courses.lessonSlugs()`); stat de publicados cuenta TODO (`all`). `Home`:
  `renderRoute`→curso en marcha (`pendingCourse`). `initViewToggle` vistas
  home/courses/catalog. Route-nav: `roadmapSequence`→`courseSequence`
  (cursos→módulos→lecciones), crumb "Curso · módulo" enlaza a `../curso.html?slug=`;
  artículo suelto = sin course-nav (conserva su nav manual). Nuevo
  `Courses.renderCoursePage()` en el arranque.
- **index.html**: view-toggle Inicio/Cursos/Artículos; panel `#roadmap`→`#courses`;
  textos (navbar "Contenido", "Artículos", "Añadir artículo", hero, stat
  "Publicados"); `<script>` roadmap.js→courses.js.
- **curso.html** (NUEVO, raíz): plantilla única; navbar/footer como index;
  `<div id="course">` que rellena `renderCoursePage`. Carga manifest+courses+main.
- **styles.css**: `.courses` (grid), `.course-card*`, `.course-hero*`,
  `.course-modules`, `.course-empty`. Reutiliza `.pillar`/`.steps`/`.step` para
  módulos/lecciones (sin renombrar).
- **33 tutoriales** (`tutorials/*.html`): `sed` cambió `roadmap.js`→`courses.js` en
  los `<script>` y el navbar "Tutoriales"→"Contenido".
- Verificado: `node --check` main.js; script node que cruza courses×manifest (0
  slugs huérfanos, 22 lecciones, **10 artículos sueltos**: jerga, extensiones-php,
  php-fpm, memoria-php, workers-php, redis-a-fondo, rabbitmq, inyeccion-dependencias,
  opcache, preload); render headless de index (3 vistas, Novedades/Destacados),
  curso.html?slug=fundamentos (hero + 7 módulos) y una lección (course-nav inyectada,
  crumb enlaza al curso, siguiente=texto-unicode). PNGs en /tmp/mentorai_shots.
- **Pendiente al retomar**: (1) `.agents/rules/global.md` añadir invariante
  cursos+artículos; (2) actualizar `cola-arquitectura-y-practica.md` y
  `plan-curriculum-fundamentos.md` para hablar de cursos; (3) revisar vistas
  Cursos/Artículos en navegador real (el screenshot solo capturó la vista Inicio por
  defecto); (4) cuando se escriban los 16 tutoriales de la cola, crear sus cursos en
  courses.js. (El detalle del back-link pegado al eyebrow ya está resuelto en a580a2f.)

## Reinicio de progreso + barra flotante de audio (2026-06-22) — HECHO (pusheado: cb77e2b)
Tres mejoras de UX pedidas por el usuario.
- **Botón "Reiniciar progreso"** en la página de curso (`curso.html`). Decisión:
  **por curso** (resetea solo las lecciones de ese curso) y borra **completadas +
  "seguir viendo"** (no toca favoritos). En main.js: `Progress.remove(slugs)` y
  `Reading.clear(slugs)` nuevos; `renderCoursePage` ahora envuelve el pintado en una
  función `render()` reentrante, muestra el botón solo si `stats.done>0` y al click
  hace remove+clear y re-renderiza. CSS `.course-hero__reset` (hover en `--danger`).
- **Barra flotante de audio** (`.audio-bar`, fixed abajo centrada) al pulsar
  "Escuchar": ya no se pierde con el scroll. Pausa/reanudar **reales** con
  `speechSynthesis.pause()`/`.resume()` (antes el re-pulsar hacía cancel+reencolar y
  reiniciaba). `buildAudioButton` reescrito: panel con botón toggle (Pausa/Reanudar),
  barra+%, y botón cerrar (stop). `PAUSE_SVG` nuevo.
- **% de locución** en el panel: `totalChars`=suma de longitudes de los chunks;
  `onboundary` actualiza `currentChars=event.charIndex`, `onend` acumula
  `completedChars`; % = (completed+current)/total. Al acabar el último chunk, `stop()`
  cierra el panel.
- Verificado: `node --check` OK; render headless de curso.html (sin progreso → sin
  botón; con localStorage sembrado → "2/22 completadas" + botón "Reiniciar progreso" +
  lecciones marcadas done) y de una lección (botón "Escuchar" inyectado). El
  pause/resume y el % no se prueban headless (requieren TTS real), pero la lógica
  parsea y el cableado está verificado.

## Inicio/Cursos/Artículos = páginas reales + buscador en Inicio + fix overflow (2026-06-22) — HECHO (sin commit)
Tres cosas en una tanda, pedidas por el usuario (frustrado: "no nos hemos
entendido", "main.js +2000 loc").
- **Fix overflow móvil del artículo** (era lo de "rota completamente"): NO era la
  barra de audio. El grid `.tutorial-layout` en `@media(max-width:900px)` usaba
  `grid-template-columns: 1fr` (= `minmax(auto,1fr)`); el `auto` dejaba que los
  `<pre>` de código estiraran la columna (~602px) dentro de un contenedor de
  ~445px → scroll horizontal de página. Fix: `minmax(0, 1fr)`. Verificado con
  probe headless: `scrollW(485) < vw(500)` → sin overflow (la tabla queda en su
  `.table-wrap` con scroll propio, correcto).
- **Tabs → páginas independientes** (era el "destello" al recargar: el toggle JS
  arrancaba siempre en Inicio). Decidido con el usuario: navegación en la **navbar**
  (no control segmentado); **hero solo en Inicio**. Ahora:
  - `index.html` = Inicio: hero + buscador + dashboard (`#home-results` + shelves
    continue/new/popular/route) + "Sobre". Sin `.view-toggle`, sin paneles
    catálogo/cursos, sin modales.
  - `cursos.html` (NUEVO) = `.page-header` + `#courses`.
  - `articulos.html` (NUEVO) = `.section__head` (título + "Añadir artículo" +
    búsqueda + `#filters`) + `#subfilters` + `#cards` + `#cards-empty` + los dos
    modales (composer/refiner). El "Añadir artículo" vive aquí.
  - Navbar unificada en las 3 + curso.html + **los 33 tutoriales**: `Inicio /
    Cursos / Artículos` con `.is-active` por página. (En tutoriales era 1 link
    "Contenido"→index#catalogo; perl+python para arreglar el byte latin-1 de "í".)
  - Funciona porque cada módulo (`Catalog/Courses/Home/initComposer/initRefiner`)
    ya hace early-return si falta su contenedor → cada página corre solo lo suyo.
- **Buscador prominente en Inicio** (petición extra, UX): input grande en el hero
  (`#home-search`). Búsqueda instantánea (`input`) sobre TODO el contenido
  publicado (artículos + lecciones) por title/description/topic/categories/tags
  (normalizado sin acentos). Con query: oculta las shelves y pinta `#home-results`
  (mini-cards reutilizadas); vacío: re-render del dashboard. Implementado dentro
  del módulo `Home` (refactor: `render` pasa a función nombrada; expone
  `render` + `initSearch`). Verificado: "redis" → 2 coincidencias, shelves ocultas.
- **main.js cambios**: eliminado `initViewToggle` (los tabs ya no existen; el
  `[data-view-jump]` tampoco se usaba) → sustituido por `initHeroStat()` (fija el
  stat "Publicados" del hero, que antes dependía de `Catalog.render`, ahora ausente
  en Inicio). `DOMContentLoaded`: +`Home.initSearch()` +`initHeroStat()`,
  -`initViewToggle()`.
- **CSS nuevo**: `.hero-search*`, `.home-results`, `.page-header*`,
  `.nav__link.is-active`; quitado `display:none` de `.nav__link` en ≤900 (ahora es
  la navegación principal, debe verse en móvil) + ajuste navbar en ≤560. La CSS de
  `.view-toggle` queda **muerta** (sin uso) pero no se borró.
- Verificado headless: index/cursos/articulos (1100px) + index móvil (sin overflow)
  + tutorial móvil (fix) + búsqueda. PNGs en /tmp.

## Partir main.js en módulos (2026-06-22) — HECHO (sin commit)
El usuario señaló con alarma "main.js +2000 loc" y eligió "un fichero por módulo".
- **`assets/js/main.js` (2365 LOC) ELIMINADO** y partido en `assets/js/modules/`,
  cada fichero su propio IIFE que cuelga lo suyo de `window.MentorAI` (NO ES ES
  modules: `import/export` muere por CORS en `file://`; el namespace resuelve las
  refs cruzadas en runtime, así el orden de carga no importa salvo init.js):
  `core.js` (tema, progreso lectura, scrollspy, copiar, año + `applyTheme` temprano),
  `storage.js` (Bookmarks/Progress/Reading), `catalog.js` (Catalog + CATEGORY_LABELS),
  `courses.js` (Courses), `home.js` (dashboard + buscador + initHeroStat),
  `syntax.js` (SyntaxHighlighter + LANGUAGES), `bridge.js` (compositor/refinador),
  `tutorial.js` (initTutorialPage + currentTutorialSlug), `init.js` (arranque, **último**).
- Las funciones de arranque (initTheme, initReadingProgress, initScrollSpy,
  initCopyButtons, initYear, initHeroStat, initComposer, initRefiner,
  initTutorialPage) se exponen en `MentorAI.*`; `init.js` las orquesta en
  DOMContentLoaded igual que antes.
- **38 HTML actualizados** (index/cursos/articulos/curso + 33 tutoriales incl.
  _PLANTILLA): el `<script src=".../main.js">` único → los 9 `<script>` en orden,
  init.js el último. Prefijo `assets/js/modules/` en raíz, `../assets/js/modules/`
  en tutoriales.
- **server/bridge.js**: 2 líneas de prompt que decían `../assets/js/main.js` →
  `../assets/js/modules/*.js`. La plantilla que se inyecta (`_PLANTILLA.html`) ya
  trae los scripts correctos.
- **Docs actualizados**: `.agents/rules/global.md` (sección "Frontend
  (assets/js/modules/)" reescrita + nueva invariante "Una vista = una página" +
  refs main.js→módulo concreto), README.md (árbol + refs), SKILL.md (refs LANGUAGES
  → syntax.js).
- Verificado: `node --check` en los 9 módulos + bridge.js (todo OK); render headless
  (--dump-dom) de index (9 card-titles en shelves + 10 shelf), articulos (10 cards +
  21 chips), cursos (8 course-cards), curso.html?slug=fundamentos (10 module), opcache
  (tutorial-actions inyectado + tokens tok-* del highlighter); 0 errores JS
  (uncaught/ReferenceError/TypeError) en index/articulos/cursos/curso/2 tutoriales.
- **PENDIENTE**: (1) Nada commiteado aún (todo el bloque "páginas reales + buscador
  + overflow + split" espera OK del usuario para commit/push). (2) La CSS de
  `.view-toggle` sigue **muerta** (sin uso) pero no se borró.

## Planes pendientes (detalle en notes)
- `plan-curriculum-fundamentos.md` — currículum de fundamentos CS para backend
  autodidacta (7 pilares). **Decidido:** arrancar por el pilar Bases de datos,
  ejemplos PHP+SQL/bash. Dep. técnica: añadir `sql` al highlighter antes del 1er
  tutorial. Siguiente: highlighter SQL → `indices-btree.html`.
- `plan-buscador-fulltext.md` — búsqueda dentro del contenido (índice por el puente).
- `plan-resaltado-texto.md` — subrayar texto dentro de los tutoriales.
- `plan-autocategorizacion.md` — que la IA proponga las categorías al generar.

## Siguiente paso sugerido (actualizado 2026-06-27)
Estado del sitio: **50 tutoriales publicados, 4 cursos** (fundamentos, testing,
programar-con-ia, diseno-y-arquitectura), **3 rutas de aprendizaje** (php-a-fondo,
diseno-oo, backend-cimientos). Todo **pusheado** a `origin/main` (último push tras
montar rutas + progreso de lectura). Repo: `github.com/dGran/MentorAI`, Pages en
`dgran.github.io/MentorAI/`.

**PENDIENTE PRINCIPAL — autoría de 35 tutoriales planificados (2 planes):**
- `plan-diseno-y-calidad.md` — **20 tutoriales / 4 cursos**: `oop` (6),
  `solid` (7), `clean-code` (6), `di-contenedores` (1 nuevo + reusa
  inyeccion-dependencias). Orden: **OOP → SOLID → Clean Code → DI+contenedores**.
- `plan-testing-y-observabilidad.md` — **15 tutoriales / 2 cursos**: `phpunit`
  (6, + renombrar el curso testing actual a "TDD y fundamentos"), `observabilidad`
  (9, con Prometheus/PromQL + Loki/LogQL + Sentry + Grafana).
- Orden global sugerido y aprobado en estructura: OOP → SOLID → Clean Code →
  DI+contenedores → PHPUnit → Observabilidad. **El usuario ya dio OK a la
  estructura; falta arrancar la autoría.** Todo es PHP salvo PromQL/LogQL/YAML
  (que van sin `data-lang`).

**PENDIENTES MENORES:**
- Los 50 tutoriales + _PLANTILLA YA cargan `paths.js` (dato+módulo) y `init.js`
  es defensivo (`if (MentorAI.Paths)`) — se arregló un bug que hacía desaparecer
  los botones de acción por `TypeError`. Lo único que falta: el **enlace "Rutas"
  en la navbar de los tutoriales** (solo cosmético; está en las 5 vistas). Añadir
  por sed cuando se quiera consistencia total.
- Script opcional `server/recalcular-minutos.js` (los `minutes` del manifest son
  manuales; el usuario lo dejó como opcional).
- **Al escribir cada tutorial/curso nuevo: revisar `tutorials/paths.js` para
  encajarlo en una ruta** (regla en global.md).

**PLANES DE FASE 2 (sin tocar):** `plan-buscador-fulltext.md`,
`plan-resaltado-texto.md`, `plan-autocategorizacion.md`.

## Notas técnicas
- Para añadir un lenguaje al resaltado: ampliar `LANGUAGES` en
  `assets/js/modules/syntax.js`.
- Escapar `<`, `>`, `&` dentro de los `<code data-lang=...>` (ej. `&lt;?php`).
- El JS vive en `assets/js/modules/` (un fichero por módulo, namespace
  `window.MentorAI`, `init.js` el último). `main.js` ya no existe.
