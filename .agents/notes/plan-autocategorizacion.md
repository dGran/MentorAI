# Plan — Auto-categorización con IA (fase 2)

Estado: **pendiente**. Hoy las `categories` de un tutorial las teclea el usuario
en el modal del compositor (campo "Categoría", con datalist de las existentes).
La idea: que **Claude proponga** las categorías al generar, reutilizando las que
ya existen y creando una nueva solo si ninguna encaja.

## Decisiones ya tomadas

- El catálogo ya es dinámico: los chips y conteos salen de las `categories` del
  manifest (`Catalog` en `main.js`). Añadir una categoría nueva = usarla; el chip
  aparece solo. Para nombre bonito está `CATEGORY_LABELS`, pero el
  auto-capitalizado ya es aceptable como defecto.
- El modelo **ya devuelve** `categories` en su JSON; hoy el servidor las
  sobrescribe con la del formulario. El cambio es dejar mandar al modelo cuando
  el usuario no especifica.

## Diseño técnico

- En `buildPrompt` (`server/bridge.js`), pasar al modelo la **lista de
  categorías existentes** (derivada del manifest) e instruir:
  "Clasifica el tutorial con 1-3 categorías. Reutiliza las existentes siempre que
  encajen: [lista]. Crea una nueva SOLO si ninguna sirve, en kebab-case y en
  singular." Así se evita la proliferación de sinónimos.
- En `handleGenerate`: si el `category` del formulario viene **vacío**, usar
  `model.categories`; si viene con valor, respetarlo (override manual gana).
- **Sanitizar** siempre lo que entre al manifest: `slugify` cada categoría,
  minúsculas, dedupe, descartar vacías.
- UI: el campo "Categoría" del compositor pasa a **opcional**, con ayuda
  "déjalo vacío para que lo decida Claude".

## Pasos

1. `buildPrompt`: inyectar categorías existentes + reglas de clasificación.
2. `handleGenerate`: rama "form.category vacío → categorías del modelo".
3. Helper `sanitizeCategories(list)` (slugify + dedupe + filtrar vacías).
4. Front (`index.html` + `initComposer`): categoría opcional, texto de ayuda.
5. Opcional: extender también a `handleRefine` si se quiere re-clasificar al
   refinar (por defecto, refinar **no** cambia categorías salvo petición).

## Archivos

`server/bridge.js`, `index.html`, `assets/js/main.js`.

## Criterios de aceptación

- Generar sin categoría produce categorías coherentes y **reutiliza** las
  existentes cuando aplica (no crea sinónimos de las que ya hay).
- Generar con categoría explícita sigue respetándola.
- Las categorías guardadas están saneadas (slug, sin duplicados) y el chip
  correspondiente aparece bien en el catálogo.

## Riesgos / notas

- El modelo puede inventar categorías redundantes pese a la lista → mitigar con
  el prompt (pasar las existentes, pedir reutilizar) y, si hace falta, un repaso
  manual de chips. Si se vuelve un problema, evaluar un paso de "merge" que mapee
  sinónimos a una categoría canónica.
- Mantener el límite de 1-3 categorías por tutorial para que los filtros sigan
  siendo útiles (si todo cae en muchas categorías, el filtro pierde sentido).
