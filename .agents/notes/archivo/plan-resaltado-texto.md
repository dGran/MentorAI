# Plan — Resaltar/subrayar texto en los tutoriales (fase 2)

Estado: **CERRADO 2026-08-01. Implementado y verificado en navegador.**

Ficheros: `assets/js/modules/highlights.js`, `MentorAI.Highlights` en
`storage.js`, estilos en `styles.css`, sección nueva en `repaso.html`.

## Dónde se desvió del plan

- **Se usó la CSS Custom Highlight API como principal, no `<mark>`.** El plan
  proponía empezar por `<mark>` por compatibilidad, pero `surroundContents` falla
  justo en el caso normal: subrayar una frase que cruza un `<code>` o un
  `<strong>`. La prueba en navegador seleccionó un fragmento que cruzaba **7
  nodos de texto** y funcionó. La API no toca el DOM, así que tampoco choca con
  el resaltador de sintaxis. Si el navegador no la soporta, el módulo hace
  early-return y no pasa nada.
- **El contador de subrayados se crea al vuelo** dentro del `.toc`, en vez de
  añadir un `<span>` a 257 ficheros.
- **Índice de slugs con subrayados** (`academia-highlights-index`) además de la
  clave por tutorial, para que la página de repaso no recorra todo
  `localStorage`.
- **Se añadió la página de repaso**, que el plan no pedía: subrayar sin poder
  ver después lo subrayado es media funcionalidad. Están agrupados por tutorial
  y cada fragmento enlaza a su sección con ancla.

## Verificado en Chrome headless

Seleccionar cruzando etiquetas → popover «Subrayar» → guardado con
`seccion=doble-escritura nth=1` → pintado → **sobrevive a repintar desde cero**
(equivalente a recargar) → «Quitar» lo borra y limpia el índice. Y en
`repaso.html`, dos grupos con sus títulos del manifest y enlaces con ancla
correcta.

## Lo que sigue siendo cierto del plan

El anclaje por sección + texto + nº de ocurrencia significa que **si un tutorial
se reescribe y ese texto desaparece, el subrayado se pierde**. Es esperado: el
contador lo dice («N ya no encajan con el texto») en vez de fallar en silencio.

---

## Plan original (para referencia)

Hoy hay favoritos a nivel de tarjeta (`Bookmarks` en
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
