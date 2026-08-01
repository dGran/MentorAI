# Plan — Buscador full-text (fase 2)

Estado: **CERRADO 2026-08-01. Implementado y verificado en navegador.**

El plan estuvo bloqueado un año por una razón que dejó de existir: decía que el
índice «lo genera el puente», y el puente se borró el 2026-07-31. Lo genera
`scripts/generar-indice.js`, igual que `scripts/validar.js` valida el catálogo.

## Lo que se hizo, y en qué se desvió del plan

- **Generador**: `scripts/generar-indice.js` escribe `tutorials/search-index.js`
  (`window.MENTORAI_SEARCH`, no `ACADEMIA_SEARCH`: se sigue el prefijo de los
  globales nuevos). 257 tutoriales, **1,6 MB**.
- **Sí se indexa el código**, al contrario de lo que sugería el plan. Buscar
  `hash_equals` o `X-Accel-Buffering` es justo lo que se hace cuando te topas con
  el problema en el trabajo.
- **Carga perezosa, que el plan no contemplaba**: 1,6 MB en cada visita era
  demasiado para algo que se usa de vez en cuando. `assets/js/modules/search.js`
  inyecta el `<script>` la primera vez que escribes en un buscador — y sí,
  **inyectar un `<script>` funciona por `file://`**, a diferencia de `fetch`.
  Verificado antes de construir nada sobre esa suposición.
- **Fragmento con la coincidencia resaltada** en los resultados del inicio
  (`.mini-card__desc--match` con `<mark>`). El texto indexado va normalizado, así
  que el fragmento sale sin acentos: es un extracto para ubicarte, no el texto.
- **Las dos superficies lo usan**: el buscador del inicio (`home.js`) y el filtro
  del catálogo (`catalog-filters.js`), a través de `MentorAI.Search`.
- **Offline**: `search.js` va al shell del service worker (VERSION → v6) y el
  índice entra en «descargar toda la academia», para poder buscar sin red.
- **El riesgo que anotaba el plan —índice desincronizado— lo cubre el
  validador**: `generar-indice.js --comprobar` sale con 1 si está desfasado, y
  `validar.js` lo llama. Verificado tocando el índice y tocando un tutorial.

## Comprobado en Chrome headless

- Visitar el inicio **no** carga el índice (`MENTORAI_SEARCH` sigue sin definir).
- Buscar «manada atronadora» lo carga y devuelve 3 tutoriales con su fragmento.
- En Artículos, «opcodes» y «sapi» encuentran artículos por su cuerpo; «token de
  barrera» devuelve 0, que es correcto: esa lección es de curso y no está en ese
  catálogo.

## Lo que queda si algún día crece

Hoy la búsqueda es `includes()` sobre 1,6 MB, que en un portátil es instantáneo.
Si el catálogo se dobla, tocaría índice invertido o partirlo por tutorial. No
antes: medir primero.

---

## Plan original (para referencia)

Hoy el buscador (`#catalog-search`) filtra solo por
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
