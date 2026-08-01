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
- **Al inicio de sesión:** leer `.agents/notes/estado.md` y los `plan-*.md` para
  retomar lo en curso.
- **Al cerrar una unidad de trabajo:** volcar a una note el estado (qué se hizo,
  qué quedó a medias, decisiones y porqué, siguiente paso). Si emerge una
  convención, va a este fichero de rules, no a una note.
- **Decisión deliberada:** este proyecto **no usa** el flujo `spec → implement →
  review → qa → deploy` ni tablero de GitHub; no lo necesita. No proponer
  `/new-project`. La continuidad vive en `.agents/notes/` y basta.

## Planes abiertos

Detalle en `.agents/notes/`. **Norte del proyecto** (ver `plan-carrera-completa.md`):
llegar a ser "como una carrera universitaria" que dé la base formal que el usuario
(backend autodidacta) no tuvo — temario completo y coherente, no tutoriales sueltos.
Estado a 2026-08-01: **257 tutoriales, 26 cursos, 6 rutas**. Los cinco frentes del
orden original están cerrados **y también los 4 cursos aprobados el 2026-07-06**
(`sistemas-distribuidos`, `cache-y-rendimiento`, `infraestructura` y
`protocolos-y-tiempo-real`). Con eso, el norte del proyecto está cubierto:
`el-grado-que-no-hiciste` son 23 cursos y ningún curso queda fuera de una ruta.

**Cerrados, no reabrir** (la note de cada uno lo registra): `plan-diseno-y-calidad`,
`plan-practica-backend`, `plan-testing-y-observabilidad`, `plan-curso-go`,
`plan-curso-rust`, `plan-curriculum-fundamentos`, `plan-home-dashboard`, y los tres
de la auditoría de producto del 2026-07-31 (`plan-ia-en-la-app`, `plan-offline-real`,
`plan-evaluaciones`).

Pendiente de verdad, por orden de peso:

- `plan-huecos-versatilidad.md` — sus cuatro cursos están publicados; queda solo
  la idea **«Ponlo en práctica»**: mini-retos al cierre de cada curso.
- `plan-multiusuario.md` — parcial. A1 (validador) hecho como `scripts/validar.js`
  + CI; C superado por `plan-offline-real`. A2 y A4 quedaron sin sentido al
  descartarse la autoría desde la app. Quedan A3 (`author`), B (export/import de
  progreso) y D (features de grupo).
- **Decisión abierta**: el **tutor por lección** con IA (estudio, no autoría) de
  `plan-ia-en-la-app.md`, condicionado al hábito real de lectura. Si se hace,
  proxy fino en Vercel, nunca la clave en el navegador.
- **Verificación manual pendiente**: el flujo «Descargar toda la academia» en un
  navegador real contra la URL de Pages (headless no activa el service worker).
  Checklist al final de `plan-offline-real.md`.

Fase 2 (infraestructura):
- `plan-buscador-fulltext.md` — **CERRADO 2026-08-01**: índice generado por
  `scripts/generar-indice.js`, carga perezosa al escribir en un buscador.
- `plan-resaltado-texto.md` — subrayar texto dentro de los tutoriales.
- `plan-autocategorizacion.md` — que la IA proponga las categorías al generar.
