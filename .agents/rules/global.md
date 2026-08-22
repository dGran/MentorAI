# Academia — Reglas del proyecto

Plataforma visual de tutoriales técnicos en HTML estático, pensada para crecer
tutorial a tutorial, iterando el contenido con IA. Estas reglas se cargan en
cada sesión: capturan lo propio del proyecto. Los estándares de código generales
(clean code, no `else`, booleanos `is/has/should`, etc.) ya llegan por la config
global del agente y no se duplican aquí.

## Arquitectura — invariantes que no se rompen

- **Sin build, sin dependencias, sin servidor obligatorio.** `index.html` abre
  con doble clic (`file://`) y funciona, incluso offline. Cualquier propuesta que
  exija un bundler, un framework o un paquete npm está fuera de alcance salvo que
  el usuario lo apruebe explícitamente.
- **`file://` manda.** Nada de `fetch` de ficheros `.json`: CORS lo bloquea al
  abrir por `file://`. Los datos se cargan como `.js` que asignan a un global
  (`tutorials/manifest.js` → `window.ACADEMIA_TUTORIALS`). Cualquier dato nuevo
  sigue ese patrón: un `.js` que setea `window.X`, incluido con `<script>` antes
  de los módulos de `assets/js/modules/`. Si un dato pesa demasiado para cargarlo
  siempre —el índice de búsqueda son 1,6 MB— se **inyecta el `<script>` bajo
  demanda**, que sí funciona por `file://` (ver `assets/js/modules/search.js`).
- **Una vista = una página.** Inicio (`index.html`), Rutas (`rutas.html`), Cursos
  (`cursos.html`) y Artículos (`articulos.html`) son páginas HTML reales con
  navegación por `<a href>`, **no** pestañas conmutadas por JS sobre una sola
  página (eso provocaba el destello del inicio en cada recarga). Cada
  `init*`/módulo hace early-return si su contenedor no está, así el mismo bundle
  de JS sirve para todas las páginas.
- **Tres capas de organización, cada una referencia a la de abajo por slug, sin
  duplicar:** el **manifest** (`tutorials/manifest.js`) es la verdad de cada
  pieza; los **cursos** (`tutorials/courses.js` → `window.MENTORAI_COURSES`)
  ordenan lecciones en módulos; las **rutas** (`tutorials/paths.js` →
  `window.MENTORAI_PATHS`) ordenan cursos y artículos (pasos mixtos
  `{type:"course"|"article", ref:slug}`) hacia un objetivo. Las rutas se pintan
  en `rutas.html` (`#paths`) y como tarjetas en el inicio (`#home-paths`) vía
  `assets/js/modules/paths.js`. **Al añadir un tutorial o curso nuevo, revisar
  las rutas existentes en `paths.js` para ver si encaja en alguna y ampliarla**
  (igual que se revisa si un tutorial entra en un curso).
- **`tutorials/manifest.js` es la única fuente de verdad del catálogo.** La
  portada no se edita a mano: `index.html` solo tiene contenedores vacíos
  (`#filters`, `#cards`, `#cards-empty`) y el módulo `Catalog`
  (`assets/js/modules/catalog.js`) los rellena. Añadir/cambiar un tutorial =
  tocar su `.html` y su entrada en el manifest, nunca el HTML del catálogo.
- **Las categorías se auto-catalogan.** Los chips de filtro y sus conteos salen
  de las `categories` del manifest. Categoría nueva → chip automático; nombre
  bonito opcional en `CATEGORY_LABELS` (`assets/js/modules/catalog.js`).
- **Todo en design tokens.** Colores, espacios y radios son variables CSS en
  `:root` / `[data-theme]`. Cambiar marca o paleta es tocar tokens, no recorrer
  el CSS. Tema claro/oscuro con `data-theme` en `<html>`, persistido en
  `localStorage` y aplicado antes del render para evitar parpadeo.
- **Resaltado de sintaxis propio y offline** (`SyntaxHighlighter`,
  `assets/js/modules/syntax.js`):
  una pasada con regex combinado por lenguaje (`php`/`bash`/`ini`). Dentro de los
  `<code data-lang=...>` hay que escapar `<`, `>` y `&` (`&lt;?php`).
- **El puente (`server/bridge.js`) es opcional.** Añade generar y refinar
  tutoriales con `claude -p` headless (usa la sesión de Claude Code, **sin API
  key**). Regla de oro: **el servidor escribe los ficheros**, no Claude (evita
  prompts de permisos y mantiene el control). Node puro, sin dependencias.

## Convenciones de contenido

- Un tutorial = `tutorials/<slug>.html` + una entrada en `manifest.js`. El slug
  es el nombre del fichero.
- Se parte de `tutorials/_PLANTILLA.html`, que reúne el vocabulario de
  componentes: callouts (`--info/--tip/--warning/--danger`), diagramas en CSS
  puro (`.diagram .flow`), comparativas (`.compare`), tablas, `.keypoints`,
  bloques de código.
- Cada `<h2 id="...">` debe tener un `id` que coincida con su enlace en el TOC:
  de ahí dependen el scrollspy y el resaltado del índice.
- Persistencia de usuario (tema, marcadores y futuros resaltados): siempre
  `localStorage`, claves con prefijo `academia-`. Uso individual, sin login.
- **Un curso nuevo lleva sus mini-retos** en `tutorials/practica.js`
  («Ponlo en práctica», 2-3 por curso, ejecutables en la máquina del lector,
  con la solución explicando el porqué). El validador avisa si un curso queda
  sin retos.

## Frontend (`assets/js/modules/`)

- El JS está partido en un fichero por responsabilidad dentro de
  `assets/js/modules/`, cada uno su propio IIFE sin dependencias que cuelga lo
  suyo de `window.MentorAI`: `core.js` (tema, progreso, scrollspy, copiar, año),
  `storage.js` (`Bookmarks`/`Progress`/`Reading`), `catalog.js` (`Catalog`),
  `courses.js` (`Courses`), `paths.js` (`Paths`, rutas de aprendizaje),
  `home.js` (dashboard + buscador del index),
  `syntax.js` (`SyntaxHighlighter`), `bridge.js` (compositor/refinador),
  `tutorial.js` (mejoras de la página de tutorial) e `init.js` (arranque, va el
  **último** en cada página). Las funciones de arranque se exponen en
  `MentorAI.*` para que `init.js` las orqueste. Mantener esa forma: un módulo
  nuevo = un fichero nuevo + su `<script>` antes de `init.js` en cada página.
- Referencias entre módulos siempre vía `MentorAI.X` (se resuelven en runtime,
  no importa el orden de carga salvo que `init.js` sea el último).
- **Comentarios:** el estándar global es "sin comentarios". Convención propia de
  este repo: se conservan las **cabeceras de sección** `/* ---------- X ---------- */`
  como navegación del fichero (es la estructura del archivo), pero **nada de
  comentarios explicativos dentro de las funciones**: el naming se explica solo.
  No introducir comentarios nuevos de prosa.
- Escapado: cualquier dato del manifest que se inyecta como HTML pasa por
  `escapeHtml`. Las búsquedas normalizan sin acentos ni mayúsculas (`normalize`).

## Mantenimiento y continuidad

- Editar reglas y skills **solo** en `.agents/` (las herramientas las leen por
  symlink: `AGENTS.md` y `CLAUDE.md` apuntan aquí; `.claude/skills` → `.agents/skills`).
- **Al inicio de sesión:** leer `.agents/notes/estado.md`, y **solo eso**. Está
  escrito para leerse entero: dónde está el proyecto, qué queda, qué decisiones
  no se reabren y qué trampas ya nos mordieron. Lo cerrado vive en
  `.agents/notes/archivo/` y no hace falta abrirlo salvo para responder «¿por qué
  esto es así?».
- **Al cerrar una unidad de trabajo:** actualizar `estado.md` — qué se hizo, qué
  quedó a medias, decisiones y porqué. Si emerge una convención, va a este
  fichero de rules. Si el trabajo tenía un plan propio, se cierra su note
  poniendo el veredicto **al principio** y se mueve a `archivo/`.
- **`estado.md` no crece sin límite.** Es un retrato del presente, no un diario:
  lo que envejece se archiva. Ya pasó una vez —llegó a 106 KB y 50 secciones, dos
  de ellas afirmando ser «la más reciente»— y se partió el 2026-08-01.
- **Decisión deliberada:** este proyecto **no usa** el flujo `spec → implement →
  review → qa → deploy` ni tablero de GitHub; no lo necesita. No proponer
  `/new-project`. La continuidad vive en `.agents/notes/` y basta.

## Planes abiertos

**Ninguno.** A 2026-08-01 los 16 planes están cerrados y archivados en
`.agents/notes/archivo/`, junto con las tres colas de ideas, ya consumidas.

El norte del proyecto está cumplido: **272 tutoriales, 28 cursos y 7 rutas**;
`el-grado-que-no-hiciste` son 23 cursos y ningún curso queda fuera de una ruta.
«Ponlo en práctica» se cerró el 2026-08-22: todos los cursos tienen sus retos en
`tutorials/practica.js`. El 2026-08-22 se añadieron también los cursos
`claude-code` (11 lecciones) y `construir-con-ia` (4), ordenados con
`programar-con-ia` en la ruta nueva `ingenieria-con-ia`. No queda nada
pendiente.

Decisiones tomadas que **no se reabren sin motivo nuevo**: no hay autoría desde
la app, no hay tutor con IA (rompería el `file://` y el offline), no hay tablero
de tareas, y el uso es individual (nada de `author` ni features de grupo). El
detalle y el porqué, en `.agents/notes/estado.md`.
