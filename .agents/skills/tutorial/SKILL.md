---
name: tutorial
description: Crea o refina un tutorial de la Academia respetando el sistema de diseño, el manifiesto como fuente de verdad y las restricciones file://. Usar al añadir un tutorial nuevo a mano, al refinar uno existente, o al revisar la calidad de uno antes de publicarlo. No es para tocar el catálogo (se auto-genera) ni el sistema de diseño.
---

# Tutorial — Autoría y refinado

Codifica la tarea recurrente del proyecto: meter contenido nuevo o mejorar el
existente sin romper las invariantes (ver `.agents/rules/global.md`). Hay dos
caminos; elige según el caso.

## Camino A — Generación asistida (puente)

Si el bridge está disponible y quieres un borrador rápido:

1. `node server/bridge.js` y abre `http://localhost:4321`.
2. **Añadir tutorial** (genera) o **Refinar** sobre una tarjeta (mejora sobre la
   base actual). El servidor escribe el `.html` y actualiza el manifest solo.
3. Revisa el resultado con el **checklist de calidad** de abajo: la IA acierta el
   esqueleto, pero el escapado de código y los `id` del TOC hay que verificarlos.

## Camino B — Autoría manual

1. Copia la plantilla a un slug descriptivo:
   `cp tutorials/_PLANTILLA.html tutorials/<slug>.html`.
2. Rellena `<title>`, hero, índice (`.toc__list`) y secciones reutilizando el
   vocabulario de componentes (callouts, `.diagram .flow`, `.compare`, tablas,
   `.keypoints`, code-blocks). No inventes clases nuevas: si falta un componente,
   es una decisión de diseño aparte, no parte del tutorial.
3. Añade la entrada al array de `tutorials/manifest.js` (un objeto; campos
   documentados en la cabecera del fichero). El orden del catálogo sale de
   `date`; `status: "soon"` lo deja como "Próximamente".

## Estructura de un buen tutorial

Sigue el patrón de `tutorials/opcache.html` (referencia de estilo y profundidad):
analogía/intro que enganche → el problema y su "por qué" → el concepto → cómo
funciona por dentro (con diagrama si aporta) → configurarlo/usarlo bien → errores
típicos → cómo medir/monitorizar → `.keypoints` de cierre → `tutorial-nav`.
Profundo pero entendible: del "por qué" antes que del "cómo".

## Checklist de calidad (bloqueante antes de publicar)

- **Escapado en código:** dentro de `<code data-lang="php|bash|ini">`, los `<`,
  `>` y `&` van escapados (`&lt;?php`). Es el error más fácil de colar.
- **IDs del TOC:** cada `<h2 id="x">` tiene su enlace `#x` en `.toc__list`. Sin
  esto, scrollspy y resaltado del índice no funcionan.
- **Lenguajes soportados:** si el código usa un lenguaje que el resaltador no
  conoce (solo `php`/`bash`/`ini`), o lo añades a `LANGUAGES` en `main.js`, o lo
  dejas sin `data-lang`. No lo dejes mal resaltado.
- **Entrada en manifest coherente:** `slug` = nombre del fichero; `href`
  correcto; `categories` reutilizando las existentes cuando encajen (mira los
  chips actuales) y creando una nueva solo si hace falta; `icon` de la lista
  válida (`bolt|signal|database|shield|code|default`); `minutes` realista.
- **Funciona en `file://`:** abre el `.html` con doble clic y comprueba tema,
  copiar código, TOC y resaltado sin servidor.
- **Tono y formato:** sin muros de texto; apóyate en callouts y diagramas; voz
  directa, en español.

## Refinar (sobre contenido existente)

- Refinar **parte de la base actual**, no reescribe desde cero: conserva lo que
  funciona y aplica solo lo pedido.
- Tras refinar, revisa el mismo checklist (sobre todo escapado e `id`s) y
  actualiza en el manifest lo que haya cambiado de verdad (título, descripción,
  tags, minutos). El puente ya lo hace; en manual, hazlo tú.
- Ojo si en el futuro hay resaltados de usuario (`plan-resaltado-texto.md`):
  refinar reescribe el HTML y puede dejar resaltados huérfanos. Es esperado.

## Fuera de alcance

- El catálogo (filtros, tarjetas, conteos): se auto-genera del manifest, no se
  toca a mano.
- El sistema de diseño (`styles.css`) y los módulos de `main.js`: son
  infraestructura; cambiarlos es otra tarea, no "un tutorial".
