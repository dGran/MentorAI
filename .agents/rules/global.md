# Academia — Reglas del proyecto

Plataforma visual de tutoriales técnicos en HTML estático, pensada para crecer
tutorial a tutorial, iterando el contenido con IA. Estas reglas se cargan en
cada sesión: capturan lo propio del proyecto. Los estándares de código generales
viven en § Convenciones base y no se duplican aquí.

Antes de escribir código, lee `~/.agent-flow/rules/engineering-discipline.md`.

## Convenciones base

Base: `~/.agent-flow/stacks/general/rules.md`, `~/.agent-flow/stacks/ux/rules.md` y
`~/.agent-flow/stacks/js-ts/rules.md` (núcleo, PWA y pruebas de interfaz; el proyecto es JavaScript sin
TypeScript ni React, así que las normas de TS, RX y ST no aplican).
Léela antes de escribir código por primera vez en la sesión. **El proyecto
manda**: estas reglas y las excepciones de abajo prevalecen sobre la base, y un
conflicto se resuelve a favor del proyecto sin reportarlo como hallazgo.

Excepciones (lo que la arquitectura de abajo resuelve de otra forma):

- **G-10** no aplica: no hay clases ni contenedor. Cada módulo es un IIFE que
  cuelga de `window.MentorAI`, y las referencias entre módulos van por
  `MentorAI.X` en runtime (§ Frontend).
- **G-20 y JS-10**: el runner es `node:test` sin dependencias (`scripts/tests/`) más
  `scripts/validar.js`; los dos corren en CI (`validar.yml`). `verificar-offline.js` es la
  comprobación de la PWA (JS-20).
- **JS-05, JS-07 y JS-08** no aplican: sin npm no hay linter ni lockfile, y las páginas no hacen
  peticiones HTTP (`file://` manda, § Arquitectura); el único `fetch` es el del service worker.
- **JS-09**: Node solo se usa en CI; la versión se fija en `validar.yml`, sin `.nvmrc`.

**js-ts, JS-04**: los datos en `localStorage` se leen y escriben con `MentorAI.readJson`,
`MentorAI.writeJson` (devuelve si pudo escribir) y `MentorAI.removeKey`, de `storage.js`, que envuelven
cada acceso en `try/catch` (#31). Quedan fuera, con su propio `try/catch`, el tema (`core.js`, string,
no JSON), el recorrido de claves del export (`perfil.js`) y el script del tema en línea de cada página.

**G-03** (sin comentarios) aplica. Los comentarios que ya hay, cabeceras de sección
incluidas, son **deuda**: no se añaden nuevos, y quien
toca un bloque retira los de ese bloque cuando el naming lo permite (en un commit `refactor` aparte si
el diff crece). No se limpian en bloque fuera de un issue propio.

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
- **Sincronización opcional entre dispositivos** (`assets/js/modules/sync.js`):
  gist secreto de GitHub por usuario con token clásico scope `gist`. Es
  oportunista: sin token o sin red la app es idéntica a la de siempre. El
  token (`academia-sync`) **no viaja en el export** (`NO_VIAJAN` en
  `perfil.js`) y la fusión al bajar reutiliza `Perfil.importar`.
- **Un curso nuevo lleva sus mini-retos** en `tutorials/practica.js`
  («Ponlo en práctica», 2-3 por curso, ejecutables en la máquina del lector,
  con la solución explicando el porqué). El validador avisa si un curso queda
  sin retos.

## Frontend (`assets/js/modules/`)

- El JS está partido en un fichero por responsabilidad dentro de
  `assets/js/modules/`, cada uno su propio IIFE sin dependencias que cuelga lo
  suyo de `window.MentorAI`: `core.js` (tema, progreso, scrollspy, copiar, año, `basePath`),
  `storage.js` (`readJson`/`writeJson`/`removeKey`, `Bookmarks`/`Progress`/`Reading`), `catalog.js` (`Catalog`),
  `courses.js` (`Courses`), `paths.js` (`Paths`, rutas de aprendizaje),
  `home.js` (dashboard + buscador del index),
  `syntax.js` (`SyntaxHighlighter`), `practica.js` (retos), `sync.js` (gist),
  `tutorial.js` (mejoras de la página de tutorial) e `init.js` (arranque, va el
  **último** en cada página). Las funciones de arranque se exponen en
  `MentorAI.*` para que `init.js` las orqueste. Mantener esa forma: un módulo
  nuevo = un fichero nuevo + su `<script>` antes de `init.js` en cada página.
- Referencias entre módulos siempre vía `MentorAI.X` (se resuelven en runtime,
  no importa el orden de carga salvo que `init.js` sea el último).
- **Comentarios:** ninguno nuevo, tampoco cabeceras de sección (G-03, § Convenciones
  base). Las cabeceras `/* ---------- X ---------- */` que quedan son deuda: si un
  fichero necesita navegación, pártelo en módulos con nombre.
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
- **El trabajo se gestiona con el flujo de agent-flow** (§ Flujo de trabajo)
  desde el 2026-10-06. `estado.md` sigue siendo el retrato del proyecto; el
  detalle de cada tarea vive en su issue.
- Ante tandas continuadas, iteración hasta verificación o workflow dinámico, lee
  `~/.agent-flow/skills/_shared/workflow-routing.md` y carga las skills indicadas
  aunque el usuario no use comandos slash.

## Flujo de trabajo (GitHub)

- **Repo**: `dGran/MentorAI` · **Tablero**: [Project 6 de dGran](https://github.com/users/dGran/projects/6)
  (enlazado al repo). Las tareas son **issues** de este repo.

### El estado vive en el tablero; los labels dicen el tipo

Seis estados, en el campo `Status` del Project y **en ningún otro sitio**:

```
Backlog → In Progress → Code Review → QA → Ready for prod → Done
```

- **No hay labels de estado.** Un issue que no está en el tablero no tiene
  estado: `/spec` lo añade al crearlo.
- **Labels = tipo**: `feat`, `fix`, `refactor`, `test`, `chore`, `docs` (uno por
  issue), más `skip-qa` y `blocked-external`. **`Priority`** (P0–P3) es un campo
  del tablero.
- Las tareas de contenido (lecciones, cursos, retos) también son issues; se
  implementan con la skill `/tutorial` dentro de `/implement`. Los cursos nuevos
  son épicas para `/implement-epic`.

### Lo que las skills preguntan si no está escrito aquí

- **Estrategia de merge**: squash. Un issue = un commit en `main`, que mantiene
  el historial lineal que el repo ha tenido siempre.
- **Commit de evidencias de QA**: revertir antes de mergear. `.qa-evidence/` está
  en el `.gitignore`, así que el commit necesita `git add -f`.
- **Dónde corre la app en local**: `python3 -m http.server 8000` desde la raíz →
  `http://localhost:8000/`. El service worker y el offline solo funcionan por
  http; el resto también se comprueba abriendo `index.html` por `file://`, que es
  invariante. No hay API.
- **Gate de calidad**: `node scripts/validar.js` y `node scripts/verificar-offline.js`
  (los mismos que corre CI en cada push y PR).
- **Cómo se despliega**: GitHub Pages (build legacy desde `main`, raíz), automático
  al mergear. Si el cambio toca `sw.js` o el shell, subir `VERSION`.
- **Desfase main↔producción**: no aplica, el despliegue es automático post-merge.
- **Qué puede observar `/deploy-watch`**: el SHA desplegado con
  `gh api repos/dGran/MentorAI/pages/builds/latest` y la web en
  https://dgran.github.io/MentorAI/. Solo HTTP: no hay logs ni métricas, así que
  no permite afirmar ausencia de regresiones.
- **Réplicas locales**: no se usan.

## Planes abiertos

La auditoría del 2026-10-06 (`.agents/notes/auditoria-2026-10-06.md`) está
volcada al tablero como issues; el backlog vive allí.

Decisiones tomadas que **no se reabren sin motivo nuevo**: no hay autoría desde
la app, no hay tutor con IA (rompería el `file://` y el offline), y el uso es
individual (nada de `author` ni features de grupo). El detalle y el porqué, en
`.agents/notes/estado.md`.
