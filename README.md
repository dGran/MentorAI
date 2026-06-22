# Academia

Plataforma visual de formación técnica: una colección de tutoriales profundos
pero fáciles de leer, pensada para ir **creciendo tutorial a tutorial**.

Son ficheros HTML estáticos: no hay build, ni servidor, ni dependencias. Abres
`index.html` en el navegador y funciona, incluso offline.

## Estructura

```
elearning/
├── index.html               # Inicio: dashboard + buscador
├── cursos.html              # Cursos: colecciones temáticas
├── articulos.html           # Artículos: catálogo con filtros
├── tutorials/
│   ├── opcache.html         # Un tutorial = una página
│   └── _PLANTILLA.html      # Plantilla para crear nuevos (no se enlaza)
├── assets/
│   ├── css/styles.css       # Sistema de diseño (tokens + componentes)
│   └── js/modules/          # JS por responsabilidad (core, catalog, home… init.js arranca)
└── README.md
```

## Cómo verlo

Abre `index.html` con doble clic, o sírvelo para una experiencia idéntica a
producción:

```bash
python3 -m http.server 8000
# luego abre http://localhost:8000
```

## Añadir un tutorial nuevo

El catálogo es **auto-generado**: la portada lee `tutorials/manifest.js` y
construye sola los filtros (con su conteo) y las tarjetas. No se edita
`index.html` nunca.

Dos pasos:

1. **Copia la plantilla** a un nombre con _slug_ descriptivo y rellena el
   contenido (`<title>`, hero, índice `.toc__list` y secciones). Cada
   `<h2 id="...">` debe tener un `id` que coincida con su enlace en el TOC; así
   funcionan el scrollspy y el resaltado del índice.

   ```bash
   cp tutorials/_PLANTILLA.html tutorials/preload.html
   ```

2. **Añade una entrada** al array de `tutorials/manifest.js`:

   ```js
   {
     slug: "preload",
     title: "Preload: precargar clases al arrancar PHP",
     description: "Resumen de una o dos frases.",
     href: "tutorials/preload.html",
     categories: ["php", "rendimiento"], // genera/clasifica los filtros solo
     topic: "PHP",
     tags: ["PHP", "Rendimiento"],
     level: "Avanzado",
     minutes: 12,
     icon: "signal",          // bolt | signal | database | shield | code | default
     status: "published",     // o "soon" para una tarjeta "Próximamente"
     date: "2026-06-25",      // ordena el catálogo (más nuevo arriba)
     featured: true            // muestra la insignia "Nuevo"
   }
   ```

   **Las categorías se auto-catalogan**: si usas una categoría nueva, su chip
   (con conteo) aparece solo en los filtros. Para que salga con nombre bonito en
   vez de capitalizado, añádela al mapa `CATEGORY_LABELS` de
   `assets/js/modules/catalog.js`.

## Generar tutoriales desde la web (puente local)

La web puede pedirle un tutorial nuevo a Claude **sin API key**, reutilizando tu
sesión de Claude Code. Lo hace un servidor local que sirve el sitio y expone
`/api/generate`:

```bash
node server/bridge.js
# abre http://localhost:4321
```

Pulsa **«Añadir tutorial»**, indica tema, categoría, nivel y minutos, y dale a
generar. El flujo:

1. El servidor ejecuta `claude -p` en modo headless (tu login, sin API key) y le
   pasa la plantilla y el tutorial de OPcache como referencia de estilo.
2. Claude devuelve un JSON con el HTML y los metadatos.
3. **El servidor** escribe `tutorials/<slug>.html` y añade la entrada al
   manifiesto. La web recarga y el tutorial ya aparece catalogado.

Que el servidor escriba los ficheros (en vez de Claude) evita prompts de
permisos y mantiene el control de qué se crea y dónde.

### Refinar un tutorial existente

Cada tarjeta publicada tiene un botón **«Refinar»**. Lo pulsas, escribes qué
quieres cambiar o añadir («añade una sección sobre el _hit rate_», «aclara el
diagrama del ciclo de petición»…) y Claude reescribe la página **sobre el
contenido actual**, no desde cero. El servidor sobrescribe `tutorials/<slug>.html`
y actualiza en sitio los metadatos del manifiesto (título, descripción, tags,
minutos) si han cambiado. Endpoint: `POST /api/refine` con `{slug, instructions}`.

Variables de entorno: `PORT` (4321), `CLAUDE_BIN` (`claude`), `CLAUDE_MODEL`.

> Abierto como `file://` (doble clic), el catálogo y los tutoriales funcionan,
> pero el botón «Añadir tutorial» necesita el puente arrancado.

## Buscar y guardar

El catálogo tiene un **buscador** instantáneo que filtra las tarjetas por
título, descripción, tags, tema y categoría (sin distinguir mayúsculas ni
acentos). Se combina con los filtros por categoría: puedes buscar dentro de una
categoría ya filtrada.

Cada tutorial publicado tiene una **estrella** para guardarlo como favorito. Los
marcadores se guardan en `localStorage` (uso individual, sin servidor ni login)
y el chip **«Guardados»** los reúne con su conteo en vivo.

## Componentes disponibles

Todos están listos en `_PLANTILLA.html` para copiar y pegar:

| Componente            | Clase base        | Variantes                                  |
| --------------------- | ----------------- | ------------------------------------------ |
| Aviso / callout       | `.callout`        | `--info` `--tip` `--warning` `--danger`    |
| Bloque de código      | `.code-block`     | `data-lang="php\|bash\|ini"`               |
| Diagrama de flujo     | `.diagram .flow`  | nodos `--start` `--end` `--cache` `--miss` |
| Comparativa 2 columnas| `.compare`        | columnas `--good` `--bad`                  |
| Tabla                 | `.table-wrap`     | —                                          |
| Resumen final         | `.keypoints`      | —                                          |

### Resaltado de código

Pon el lenguaje en el `<code>` con `data-lang`. El resaltador
(`assets/js/modules/syntax.js`) soporta `php`, `bash` e `ini`. Recuerda escapar
`<`, `>` y `&` en el HTML (`&lt;?php`, por ejemplo). Para añadir otro lenguaje,
amplía el objeto `LANGUAGES` en `assets/js/modules/syntax.js`.

## Decisiones de diseño

- **Sin dependencias ni build**: máxima portabilidad y cero mantenimiento. Las
  fuentes vienen de Google Fonts vía `<link>`, con _fallback_ al sistema si no
  hay red.
- **Tema claro/oscuro** con `data-theme` en `<html>`, persistido en
  `localStorage` y aplicado antes del render para evitar parpadeo.
- **Todo en design tokens** (variables CSS en `:root`): cambiar la marca o la
  paleta es tocar un puñado de variables, no recorrer el CSS.
- **Diagramas en CSS puro**: sin imágenes ni librerías; escalan y respetan el
  tema automáticamente.
