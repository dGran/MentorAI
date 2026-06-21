# Plan — Buscador full-text (fase 2)

Estado: **pendiente**. Hoy el buscador (`#catalog-search`) filtra solo por
metadatos (`data-search` = title + description + tags + topic + categories +
level). Esto cubre el "no encuentro el tutorial de X". El full-text busca
**dentro del cuerpo** de cada tutorial.

## Decisiones ya tomadas

- Alcance elegido por el usuario: metadatos ahora, full-text como fase 2.
- Restricción dura: en `file://` no se puede `fetch` un `.json` (CORS). El índice
  se sirve como `tutorials/search-index.js` que asigna `window.ACADEMIA_SEARCH`,
  cargado con `<script>` en `index.html` antes de `manifest.js`/`main.js`.
- Lo genera **el puente**, no a mano (coherente con que el servidor escribe los
  ficheros). Debe poder reconstruirse entero desde `tutorials/*.html`.

## Diseño técnico

- Estructura del índice: objeto por slug → texto plano del cuerpo, normalizado.
  ```js
  window.ACADEMIA_SEARCH = {
    "opcache": { text: "que es opcache como funciona la cache de opcodes ..." }
  };
  ```
  Texto = innerText aproximado: quitar `<script>/<style>`, los `<pre>/<code>`
  (opcional: indexar code aparte con menos peso), colapsar tags y espacios,
  pasar por la misma `normalize()` del front (minúsculas, sin acentos).
- Búsqueda: substring sobre ese texto. Reutilizar `Catalog.matchesQuery`: si
  existe `window.ACADEMIA_SEARCH[slug]`, ampliar el match a
  `metadata.indexOf(q) !== -1 || cuerpo.indexOf(q) !== -1`. Sin invertir el
  índice al principio; basta substring (pocos tutoriales).
- Fase b opcional: resaltar un snippet de contexto donde cae el match.

## Pasos

1. En `server/bridge.js`, función `extractPlainText(html)` (strip de `<script>`,
   `<style>`, `<pre>`/`<code>`, tags → espacios, colapsar, normalizar).
2. Función `buildSearchIndex()` que recorre las entradas del manifest, lee cada
   `tutorials/<slug>.html` y compone el objeto.
3. `saveSearchIndex()` que escribe `tutorials/search-index.js` con el prefijo
   `window.ACADEMIA_SEARCH = ` + JSON + `;` (mismo estilo que `saveManifest`).
4. Llamar a la regeneración al final de `handleGenerate` y `handleRefine`.
5. Script de reconstrucción manual reutilizable (`node server/bridge.js --reindex`
   o `server/build-search-index.js`) por si se editan tutoriales a mano.
6. `index.html`: `<script src="tutorials/search-index.js"></script>` antes de
   `main.js` (tolerar que no exista todavía: `window.ACADEMIA_SEARCH || {}`).
7. `assets/js/main.js`: `Catalog.matchesQuery` usa el índice si está cargado.

## Archivos

`server/bridge.js`, `tutorials/search-index.js` (generado, **no** editar a mano),
`index.html`, `assets/js/main.js`. Posible `server/build-search-index.js`.

## Criterios de aceptación

- Buscar una palabra que solo aparece en el cuerpo de un tutorial lo encuentra.
- Sigue funcionando con doble clic (`file://`).
- El índice se regenera solo al generar/refinar y hay forma de reconstruirlo a
  mano tras una edición manual.
- Cero dependencias nuevas; el front degrada bien si el índice no existe.

## Riesgos / notas

- Índice desincronizado si se edita un `.html` a mano → mitiga el comando de
  reindex; documentarlo en el README y en la skill `tutorial`.
- Tamaño: indexar solo texto plano (sin HTML) mantiene el fichero pequeño.
- Si algún día crece mucho, evaluar índice invertido o partir por tutorial.
