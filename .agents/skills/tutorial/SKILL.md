---
name: tutorial
description: Crea o refina un tutorial de la Academia respetando el sistema de diseño, el manifiesto como fuente de verdad y las restricciones file://. Usar al añadir un tutorial nuevo a mano, al refinar uno existente, o al revisar la calidad de uno antes de publicarlo. No es para tocar el catálogo (se auto-genera) ni el sistema de diseño.
---

# Tutorial — Autoría y refinado

Codifica la tarea recurrente del proyecto: meter contenido nuevo o mejorar el
existente sin romper las invariantes (ver `.agents/rules/global.md`). Hay dos
caminos; elige según el caso.

## Autoría

El puente (`server/bridge.js`) **se borró el 2026-07-31**: la autoría desde la
app quedó descartada (ver `.agents/notes/plan-ia-en-la-app.md`). Se escribe a
mano desde una sesión de Claude Code, que es donde ya estaba el músculo.

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
- **Lenguajes soportados:** el resaltador conoce `php`, `bash`, `ini`, `sql`,
  `rust`, `go` y `redis`. Si usas otro, o lo añades a `LANGUAGES` en
  `assets/js/modules/syntax.js`, o lo dejas sin `data-lang`. No lo dejes mal
  resaltado.
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

## Antes de dar por bueno el trabajo

`node scripts/validar.js` valida el catálogo entero: slugs, `href`, ficheros que
faltan, referencias rotas de cursos y rutas, `<` sin escapar dentro de
`<code data-lang>` y el sesgo de posición de las respuestas correctas. Tiene que
salir **sin errores**. Corre igual en CI (`.github/workflows/validar.yml`).

## Secciones obligatorias

Además del esqueleto, todo tutorial lleva una sección **«Cuándo aplicarlo»**
(`<h2 id="cuando">`) con su enlace en el TOC: los 193 publicados la tienen, y es
lo que evita que el catálogo sea teoría sin criterio de uso.

## Fuera de alcance

- El catálogo (filtros, tarjetas, conteos): se auto-genera del manifest, no se
  toca a mano.
- El sistema de diseño (`styles.css`) y los módulos de `assets/js/modules/`: son
  infraestructura; cambiarlos es otra tarea, no "un tutorial".
