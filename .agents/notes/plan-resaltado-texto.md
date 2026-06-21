# Plan — Resaltar/subrayar texto en los tutoriales (fase 2)

Estado: **pendiente**. Hoy hay favoritos a nivel de tarjeta (`Bookmarks` en
`main.js`). Esto es el siguiente nivel: seleccionar texto **dentro** de un
tutorial y resaltarlo, persistente y por usuario.

## Decisiones ya tomadas

- Uso individual → `localStorage`, sin servidor ni login. Clave por tutorial:
  `academia-highlights:<slug>` → array de resaltados.
- **Conflicto conocido con el refinado:** refinar reescribe el HTML del
  tutorial, así que anclar por offset del DOM se rompería siempre. Se ancla por
  **texto + sección + nº de ocurrencia**, no por posición. Si un refinado borra
  ese texto, el resaltado se pierde: es esperado, no es un bug.

## Modelo de datos

```js
// localStorage["academia-highlights:opcache"]
[
  { sectionId: "que-es", text: "memoria compartida", nth: 1, note: "" }
]
```
- `sectionId`: el `id` del `<h2>` de la sección que contiene la selección (el
  contenedor estable y semántico que ya existe por el TOC).
- `text`: el texto exacto seleccionado.
- `nth`: nº de ocurrencia de ese texto dentro de la sección (1-based), para
  desambiguar repeticiones.
- `note`: opcional, para una nota asociada más adelante.

## Técnica de pintado

- Preferente: **CSS Custom Highlight API** (`Range` + `CSS.highlights` +
  `::highlight()`), no muta el DOM → no choca con el resaltador de sintaxis ni
  con el refinado. Fallback si no hay soporte: envolver en `<mark>` vía
  `Range.surroundContents`.
- Decisión de arranque: empezar por `<mark>` (más compatible y permite click
  para quitar/anotar). Migrar a Custom Highlight API si el `<mark>` da problemas
  con selecciones que cruzan nodos.
- **Excluir** `<pre>`/`<code>`: no se resalta dentro de bloques de código (el
  highlighter de sintaxis ya manda ahí).

## Flujo

1. Solo en páginas de tutorial: el módulo (`initHighlights()` en `main.js`, que
   ya se carga en los tutoriales) actúa únicamente si encuentra el contenedor de
   contenido del artículo.
2. Al soltar una selección no vacía dentro del contenido → mini-popover flotante
   junto a la selección: **Resaltar** / **Cancelar**.
3. Al resaltar: localizar `sectionId` (el `<h2>` previo) y `nth`, pintar, y
   persistir el objeto.
4. Al cargar la página: por cada resaltado guardado, buscar en su sección la
   `nth` ocurrencia del `text` y pintarla. Los que ya no encajan (refinado los
   borró) se descartan y se avisa con un contador discreto ("N resaltados ya no
   encajan").
5. Click sobre un resaltado → quitar (y borrar de `localStorage`).

## Pasos

1. Marcar/identificar el contenedor de contenido del tutorial (clase existente o
   añadir un `data-` en la plantilla y en los tutoriales actuales).
2. Captura de selección + popover (sin librerías).
3. Resolver `sectionId` + `nth` desde un `Range`.
4. Pintar (mark/Custom Highlight) + persistir.
5. Re-aplicar al cargar; descartar huérfanos con aviso.
6. Quitar resaltado.

## Archivos

`assets/js/main.js` (módulo `initHighlights`), `assets/css/styles.css` (estilo
del resaltado y del popover), `tutorials/_PLANTILLA.html` + tutoriales existentes
si hace falta marcar el contenedor de contenido.

## Criterios de aceptación

- Resaltar un fragmento persiste tras recargar (`file://` incluido).
- Sobrevive a un refinado que **no** toca ese texto; si lo toca, se descarta con
  aviso, sin romper la página.
- No resalta dentro de bloques de código ni rompe el resaltador de sintaxis.
- Se puede quitar un resaltado.

## Riesgos / notas

- Selecciones que cruzan varios elementos: `Range.surroundContents` falla si la
  selección cruza fronteras de nodo. Mitigar limitando a selección dentro de un
  mismo bloque, o migrando a Custom Highlight API (que sí pinta rangos
  complejos). Documentar la limitación elegida.
- Interacción con el scrollspy/TOC: el resaltado no debe alterar los `id` de las
  secciones.
