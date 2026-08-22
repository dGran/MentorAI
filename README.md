# MentorAI

Una carrera de backend en HTML estático: **272 tutoriales, 28 cursos y 7 rutas**
de aprendizaje, pensados para dar la base formal que uno se salta cuando aprende
a programar por su cuenta.

Sin build, sin dependencias, sin servidor. Abres `index.html` con doble clic y
funciona, incluso sin conexión.

## Las tres capas

Cada capa referencia a la de abajo por _slug_, sin duplicar contenido:

| Capa | Fichero | Qué es |
| --- | --- | --- |
| **Rutas** | `tutorials/paths.js` | Ordenan cursos y artículos hacia un objetivo |
| **Cursos** | `tutorials/courses.js` | Ordenan lecciones en módulos |
| **Manifiesto** | `tutorials/manifest.js` | La verdad de cada pieza: la fuente del catálogo |

El catálogo es **auto-generado**. `articulos.html` solo tiene contenedores
vacíos; los filtros, los conteos y las tarjetas los construye
`assets/js/modules/catalog.js` leyendo el manifiesto. Nunca se edita el HTML del
catálogo a mano.

## Estructura

```
mentorai/
├── index.html            Inicio: dashboard, buscador y rutas
├── rutas.html            Itinerarios completos
├── cursos.html           Cursos, y curso.html?slug=... para cada ficha
├── articulos.html        Catálogo con filtros y buscador
├── repaso.html           Repaso espaciado, subrayados y tus datos
├── offline.html          Descargar la academia para leerla sin red
├── sw.js                 Service worker (shell + contenido descargado)
├── tutorials/
│   ├── manifest.js       Fuente de verdad del catálogo
│   ├── courses.js        paths.js  quizzes.js  checks.js  practica.js
│   ├── search-index.js   Índice full-text (GENERADO)
│   ├── _PLANTILLA.html   Punto de partida de cada tutorial
│   └── <slug>.html       Un tutorial = una página
├── assets/
│   ├── css/styles.css    Sistema de diseño (tokens + componentes)
│   ├── fonts/            Autoalojadas, subconjunto latino
│   └── js/modules/       Un fichero por responsabilidad; init.js arranca
└── scripts/              Herramientas de mantenimiento (Node puro)
```

## Cómo verlo

```bash
# opción 1: doble clic en index.html

# opción 2: servido, idéntico a producción
python3 -m http.server 8000   # http://localhost:8000
```

El service worker y la descarga offline **solo funcionan por http(s)**, no por
`file://`. Por `file://` todo lo demás sí, incluido leer sin conexión.

## Herramientas

```bash
node scripts/validar.js            # valida el catálogo entero
node scripts/generar-indice.js     # regenera el índice de búsqueda
node scripts/verificar-offline.js  # comprueba el modo offline de verdad
```

`validar.js` corre también en CI (`.github/workflows/validar.yml`). Comprueba
slugs y `href`, ficheros que faltan, referencias rotas de cursos y rutas, `<`
sin escapar dentro de `<code>`, que el índice de búsqueda esté al día, y el
**sesgo de posición** de las respuestas correctas — por curso y en total, porque
un curso nuevo mal repartido se diluye en el conjunto.

`verificar-offline.js` monta el sitio bajo un subdirectorio como hace GitHub
Pages, descarga toda la academia, **apaga el servidor** y comprueba que sigue
funcionando. Apagar el servidor es la única forma honesta de probarlo: emular
«offline» desde las herramientas del navegador no afecta a las peticiones del
service worker. También corre en CI: los runners de GitHub traen Chrome.

## Añadir un tutorial

Se escribe a mano, en una sesión de Claude Code con la skill `/tutorial`
(`.agents/skills/tutorial/`). Tres pasos:

1. `cp tutorials/_PLANTILLA.html tutorials/<slug>.html` y rellenar. Cada
   `<h2 id="...">` necesita su enlace en el `.toc__list`: de ahí dependen el
   scrollspy y el índice. Y toda lección lleva una sección
   **«Cuándo aplicarlo»** (`id="cuando"`).
2. Añadir la entrada al array de `tutorials/manifest.js`:

   ```js
   {
     slug: "preload",
     title: "Preload: precargar clases al arrancar PHP",
     description: "Resumen de una o dos frases.",
     href: "tutorials/preload.html",
     categories: ["php", "rendimiento"],  // el chip del filtro aparece solo
     topic: "PHP",
     tags: ["PHP", "Rendimiento"],
     level: "Avanzado",
     minutes: 12,
     icon: "signal",       // bolt | signal | database | shield | code | default
     status: "published",  // o "soon" para una tarjeta «Próximamente»
     date: "2026-06-25",   // ordena el catálogo
   }
   ```

3. `node scripts/generar-indice.js && node scripts/validar.js`

Al publicar algo nuevo conviene mirar si encaja en algún curso de `courses.js` y
en alguna ruta de `paths.js`. Hoy **ningún curso queda fuera de una ruta**.

## Qué sabe hacer

- **Buscar dentro del contenido.** El índice full-text (1,6 MB) no se carga con
  la página: se inyecta la primera vez que escribes en un buscador. Los
  resultados del inicio muestran el fragmento con la coincidencia resaltada.
- **Leer sin conexión.** Descarga toda la academia desde `offline.html` y
  funciona en un avión, con el buscador incluido.
- **Evaluarse.** Examen por curso, comprobaciones de dos o tres preguntas al
  final de cada lección, examen final de ruta y **repaso espaciado** que devuelve
  las preguntas falladas a intervalos crecientes.
- **Ponerlo en práctica.** Cada curso cierra con dos o tres mini-retos para
  ejecutar en tu máquina (`tutorials/practica.js`), con la solución plegada y
  un marcador de hechos.
- **Subrayar.** Selecciona texto en un tutorial y queda guardado; todo lo
  subrayado se reúne en `repaso.html`.
- **Llevarte tu progreso.** Exporta un fichero e impórtalo en otro dispositivo:
  se **fusiona**, no reemplaza. Y opcionalmente, **sincronización automática**
  entre tus dispositivos vía un gist secreto de tu cuenta de GitHub (token
  clásico con scope `gist`, se configura en `repaso.html`): cada persona usa su
  cuenta, sin backend ni login, y sin red todo sigue funcionando igual.

Todo se guarda en `localStorage` con el prefijo `academia-`. Uso individual, sin
cuentas ni servidor.

## Componentes

Están todos en `_PLANTILLA.html` para copiar y pegar:

| Componente | Clase base | Variantes |
| --- | --- | --- |
| Aviso / callout | `.callout` | `--info` `--tip` `--warning` `--danger` |
| Bloque de código | `.code-block` | `data-lang="php\|bash\|…"` |
| Diagrama de flujo | `.diagram .flow` | nodos `--start` `--end` |
| Comparativa | `.compare` | columnas `--good` `--bad` |
| Tabla | `.table-wrap` | — |
| Resumen final | `.keypoints` | — |

**Resaltado de código:** el resaltador propio (`assets/js/modules/syntax.js`)
conoce `php`, `bash`, `ini`, `sql`, `yaml`, `rust`, `go` y `redis`. Dentro de un
`<code data-lang>` hay que escapar `<`, `>` y `&` (`&lt;?php`); el validador lo
comprueba porque un `<` suelto se come el resto del bloque.

## Decisiones de diseño

- **Sin dependencias ni build.** Máxima portabilidad y cero mantenimiento. Las
  fuentes están autoalojadas, así que no hay peticiones a terceros ni fallo si no
  hay red.
- **`file://` manda.** Nada de `fetch` a ficheros `.json`: CORS lo bloquea al
  abrir por `file://`. Los datos se cargan como `.js` que asignan a un global.
  Lo que pesa demasiado para cargarlo siempre se inyecta como `<script>` bajo
  demanda, que sí funciona por `file://`.
- **Una vista = una página.** Páginas HTML reales con `<a href>`, no pestañas
  conmutadas por JS. Cada módulo hace early-return si su contenedor no está.
- **Todo en design tokens.** Cambiar la marca o la paleta es tocar variables CSS,
  no recorrer el CSS. Tema claro/oscuro aplicado antes del render para evitar el
  parpadeo.
- **Diagramas en CSS puro.** Sin imágenes ni librerías: escalan y respetan el
  tema solos.

## Cómo se mantiene

Las reglas del proyecto y la memoria entre sesiones viven en `.agents/`:
`rules/global.md` (invariantes y convenciones), `skills/tutorial/` (cómo se
escribe un tutorial) y `notes/` (estado y decisiones tomadas, con lo cerrado en
`notes/archivo/`). `AGENTS.md` y `CLAUDE.md` son enlaces a las reglas.
