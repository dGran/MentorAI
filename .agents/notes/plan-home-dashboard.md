# Plan — Home dashboard + Explorar + "Seguir viendo"

Reestructurar el index de "catálogo con toggle" a **tres vistas**: Inicio
(dashboard), Explorar (catálogo con filtros) y Ruta (roadmap actual).

## Decisiones del usuario (2026-06-21)
- **Tres pestañas:** Inicio / Explorar / Ruta. Inicio es el landing por defecto.
  Reusa el sistema de vistas existente (`[data-view-panel]` + `initViewToggle`).
- **"Más leídos" = Destacados CURADOS.** El sitio es estático/`file://` sin
  servidor: no hay analítica real ni global. Se resuelve con curaduría editorial
  en el manifest (campo `popular: true`); la sección se titula "Destacados", no
  finge estadísticas. (Descartado: contar vistas locales; descartado: backend.)
- **"Seguir viendo" SÍ se implementa** (no existía). Persistencia nueva del **%
  de scroll por tutorial** en `localStorage`.

## Modelo de datos
- `Progress` (ya existe): hecho/no hecho, clave `academia-progress`. Se mantiene.
- **Nuevo `Reading`**: clave `academia-reading`, mapa `{ [slug]: { percent,
  updatedAt } }`. Guarda el % máximo de scroll alcanzado por tutorial.
  - `save(slug, percent)` (solo si supera el guardado), `get(slug)`, `list()`
    (entradas ordenadas por `updatedAt` desc).
  - Se alimenta en las páginas de tutorial: en `initReadingProgress`, al hacer
    scroll (throttle), guarda el % para el slug del fichero.
- Manifest: `popular: true` en un puñado curado (foundational/representativos).
  Independiente de `featured` (que sigue siendo el único "Nuevo" = más reciente).

## Vistas / UI (index.html)
- `view-toggle`: 3 botones. `data-view`: **home** (nuevo, activo por defecto) /
  **catalog** (texto "Explorar") / **roadmap**. Los paneles existentes
  (`data-view-panel="catalog"|"roadmap"`) no se renombran; se añade
  `data-view-panel="home"`.
- **Panel Inicio** (contenedores vacíos, los rellena JS — invariante):
  1. *Seguir viendo* (`#home-continue`): tutoriales con % entre ~5 y ~90 y no
     marcados como hechos, ordenados por reciente. Tarjeta con barra de progreso.
     Si no hay nada, la sección se oculta.
  2. *Novedades* (`#home-new`): publicados por fecha desc, top N.
  3. *Destacados* (`#home-popular`): los `popular` del manifest.
  4. *Banner de ruta* (`#home-route`): el pilar en curso (primero con pasos
     publicados sin completar) + enlace al siguiente paso; CTA a la pestaña Ruta.
- **Panel Explorar**: el catálogo actual (buscador + chips de categoría + tarjetas).
  Filtros extra (nivel, duración, tags) = ETAPA 2, no bloquean Inicio.

## JS (main.js)
- `Reading` module (arriba, junto a Progress/Bookmarks).
- `Home` module: `render()` cruza manifest + Reading + Progress + roadmap y pinta
  los 4 bloques. Tarjetas propias (ancla simple, sin bookmark/refine) para no
  acoplarse al wiring de `Catalog`. Reusa de `Catalog` solo helpers expuestos
  (`iconFor`, `escapeHtml`, SVGs de meta).
- `initViewToggle`: vista por defecto = `home`; el empty-state del catálogo solo
  aplica en `catalog`.
- DOMContentLoaded: añadir `Home.render()`.

## CSS (styles.css)
- `.home`, `.shelf`/`.shelf__head`/`.shelf__title`, `.rail` (grid de tarjetas),
  `.mini-card` (+ `__top/__title/__desc/__meta`), `.continue-card` con
  `.continue-card__bar`, `.route-banner`. Todo en tokens.

## Etapas
1. **Inicio funcional** (esta tanda): Reading + persistencia de % + manifest
   `popular` + panel Inicio + Home module + 3ª pestaña + CSS. Verificar con
   render headless.
2. **Explorar a fondo**: filtros combinables (nivel, duración, tags) sobre el
   catálogo. Persistir filtro activo opcional.
3. Pulido: re-render de "Seguir viendo" al marcar hecho; vaciar estados; a11y.

## Estado
**ETAPA 1 implementada** (sin commit aún). Hecho:
- `Reading` module en `main.js` (clave `academia-reading`, `save/get/list`,
  guarda el % máximo). `initReadingProgress` persiste el % con throttle de 600 ms
  usando el slug del fichero.
- `popular: true` en 5 entradas curadas del manifest: `url-a-fondo`,
  `concurrencia`, `indices-btree`, `big-o`, `opcache` (documentado en cabecera).
- `Home` module: 4 bloques (`#home-continue` oculto si vacío, `#home-new`,
  `#home-popular`, banner `#home-route`). Tarjetas propias; reusa de `Catalog`
  solo `iconFor`, `clockSvg`, `levelSvg` (expuestos).
- `index.html`: 3ª pestaña **Inicio** (activa por defecto), "Catálogo"→"Explorar",
  panel `data-view-panel="home"` con contenedores vacíos. Paneles de catálogo con
  `hidden` por defecto (evita flash; home es la vista inicial).
- `initViewToggle`: aplica `show()` del botón activo al arrancar y cablea
  `[data-view-jump]` (botón "Ver la ruta completa" del banner → vista roadmap).
- CSS dashboard: `.home/.shelf/.rail/.mini-card/.continue-card/.route-banner`.
- Verificado con render headless (light): Novedades, Destacados y banner de ruta
  pintan; "Seguir viendo" oculto sin datos; lógica de filtro validada aparte.

**ETAPA 2 implementada** (sin commit aún): filtros combinables en Explorar.
- `Catalog.state` refactorizado a `{ category, level, duration, tag, query }`
  (antes `filter`); todos combinan en AND. El chip "Guardados" sigue siendo un
  valor de `category`.
- `buildCard` añade `data-level`, `data-minutes`, `data-tags` (pipe-joined).
  Matchers: `matchesCategory/Level/Duration/Tag/Query`.
- Nuevos selects derivados del manifest (auto-catálogo): **Nivel** (orden
  Principiante→Avanzado), **Duración** (`<15 min` / `≥15 min`, umbral 15) y
  **Tema** (todos los tags, ordenados). Contenedor `#subfilters` vacío en
  `index.html` (`data-view-panel="catalog"`), lo rellena `buildSubfilters`.
- CSS `.subfilters/.subfilter/.subfilter__select` (chevron reutilizado del
  select del modal).
- Verificado con render headless de la vista Explorar: selects pintan y encajan
  con los chips. Sin persistencia del filtro (era opcional, descartada por ahora).

**ETAPA 3 implementada** (pulido): a11y y estados vacíos.
- Pestañas con `role="tab"` ahora sincronizan `aria-selected` en `show()` (y en
  el HTML inicial), no solo la clase `.is-active`.
- Empty-state de Explorar generalizado ("…coincidan con los filtros. Prueba a
  quitar alguno.") para cubrir los nuevos filtros, no solo la búsqueda.
- "Seguir viendo" se recalcula al volver a la portada (es multipágina): al marcar
  completado en la página del tutorial, `Progress.has` lo excluye del bloque. No
  hace falta re-render dinámico en la home (no es SPA).
- CSS responsive (≤560px): subfiltros y CTA del banner de ruta a ancho completo.

**Dashboard COMPLETO** (etapas 1-3). Verificado con render headless (Inicio y
Explorar, light). Commit realizado; push pendiente de OK del usuario (junto al
commit previo `7f13d74`, scroll+foco modales).
