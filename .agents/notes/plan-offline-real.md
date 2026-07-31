# Plan — Modo offline realmente operativo (2026-07-31)

Surge de: *"¿el modo offline es totalmente operativo para hacer un curso en un
vuelo sin conexión?"*

## Veredicto

**No. Hoy, en producción, el modo offline no funciona en absoluto**, y aunque
se arregle el registro del Service Worker seguiría rompiéndose al abrir un
curso. Hay cinco fallos encadenados, tres de ellos bloqueantes.

Aclaración importante: **por `file://` (doble clic en `index.html`) todo
funciona offline desde siempre** — ese invariante está intacto. Lo que está
roto es el camino PWA/navegador, que es justo el del caso de uso real: entrar a
`dgran.github.io/MentorAI`, instalar, guardar cursos y llevárselos al avión en
el móvil o la tablet.

## Los fallos, por gravedad

### 1. BLOQUEANTE — el SW nunca se registra en producción
`assets/js/modules/offline.js:313` registra `/sw.js`. En Pages el sitio vive
bajo `/MentorAI/`, así que apunta a `https://dgran.github.io/sw.js`.
**Verificado 2026-07-31:** esa URL devuelve **404**; `/MentorAI/sw.js` devuelve
200. Además, aunque existiera, un SW en la raíz registrado desde una página en
`/MentorAI/` sería rechazado por ámbito.

→ Ningún usuario de Pages tiene service worker. «Guardar para viajar» no ha
funcionado nunca ahí. (Ya estaba anotado como sospecha en
`plan-multiusuario.md` frente C; queda **confirmado**.)

**Fix:** registrar relativo al scope (`navigator.serviceWorker.register("sw.js",
{scope: "./"})` calculando la base desde `location.pathname`, teniendo en cuenta
que las páginas de tutorial cuelgan de `tutorials/`).

### 2. BLOQUEANTE — `SHELL_URLS` con rutas absolutas y `addAll` atómico
`sw.js:11-36` lista `/index.html`, `/assets/...`, etc. Bajo `/MentorAI/` ninguna
existe. Y `cache.addAll()` **es atómico**: si una sola petición falla, la
promesa se rechaza, `event.waitUntil` falla y **la instalación entera aborta** —
no se cachea nada, ni siquiera lo que sí existía.

**Fix:** URLs relativas resueltas contra `self.registration.scope`.

### 3. BLOQUEANTE — la página de curso nunca acierta en caché
Toda la navegación de cursos usa query string: `curso.html?slug=go`
(`courses.js:186`, `paths.js:132`, `home.js:256`, `tutorial.js:58`, `:592`,
`:616`, `offline.js:267`). El `respond()` de `sw.js:82-101` hace
`cache.match(request)` **sin `ignoreSearch`**, y la Cache API compara la URL
**incluyendo la query**. `/MentorAI/curso.html?slug=go` no casa con el
`/MentorAI/curso.html` cacheado → cae al `fetch` → sin red → devuelve el
`Response` de texto plano *"Sin conexión — vuelve cuando tengas internet"*
(`sw.js:92`).

→ Aun con 1 y 2 arreglados, **el usuario guarda el curso, se sube al avión,
pulsa el curso y ve una página en blanco con un texto de error**. Justo el flujo
que se quería.

**Fix:** en peticiones de navegación, `cache.match(request, {ignoreSearch:
true})`.

### 4. La respuesta de fallback es texto plano, no `offline.html`
`sw.js:91-96` devuelve `text/plain` con 503. Para cualquier navegación no
cacheada debería servir `offline.html` (que ya está en el shell y explica qué
hay guardado).

### 5. Las fuentes vienen de Google Fonts (CDN) en los 200 HTML
Cada página carga Inter y JetBrains Mono desde `fonts.googleapis.com` /
`fonts.gstatic.com`. El SW ignora peticiones cross-origin (`sw.js:77`), así que
sin conexión: tipografía degradada a la del sistema **en toda la app**, más una
petición fallida por carga. No rompe, pero el "modo avión" se nota y se ve
peor.

**Fix:** auto-hospedar los `.woff2` (subset latin) en `assets/fonts/` y
añadirlos al shell. Bonus: quita una dependencia de terceros, mejora el primer
pintado y es más coherente con el invariante de "sin dependencias externas".

## Huecos de cobertura (no son bugs, son cosas que faltan)

6. **Los iconos de la PWA no están en el shell.** `assets/icons/*.png` no
   aparecen en `SHELL_URLS`; el `manifest.webmanifest` sí. Icono roto al
   instalar sin conexión.

7. **155 de 197 tutoriales no cargan `offline.js`.** Solo 42 lo incluyen
   (los más nuevos). Consecuencias: no aparece el enlace «Sin conexión» en la
   nav de esas páginas y, si el usuario entra directo a la URL de un tutorial,
   el SW no se registra. Hace falta un script que parchee los `<script>` de los
   197 ficheros (mismo tipo de tarea que el rollout de «Cuándo aplicarlo»).

8. **Solo se pueden guardar cursos.** Los artículos sueltos y las **rutas** no.
   La ruta es la unidad natural del norte del proyecto ("el grado que no
   hiciste"): guardar `el-grado-que-no-hiciste` debería bajar sus cursos y
   artículos de una vez.

9. **El shell nunca se actualiza.** `SHELL = "academia-shell-v1"` está fijo
   (`sw.js:8`) y la estrategia es cache-first sin revalidación. Tras un deploy,
   quien ya tenga el SW instalado **se queda con el CSS y el JS viejos para
   siempre**. Hace falta un sello de versión que cambie en cada release (o
   stale-while-revalidate para el shell, cache-first solo para el contenido).

10. **Sin gestión de cuota ni feedback de tamaño.** No se llama a
    `navigator.storage.estimate()` ni a `persist()` (sin `persist()` el
    navegador puede desalojar la caché justo antes del vuelo, que es el peor
    momento posible).

## El dato que simplifica todo

**El sitio entero pesa ~5,2 MB** (4,7 MB de `tutorials/` + 472 KB de
`assets/`). Eso es menos que una foto del móvil.

→ **Recomendación: ofrecer «Descargar toda la academia (≈5 MB)»** como acción
principal, y dejar la descarga por curso/ruta como opción secundaria. Elimina
de un plumazo la pregunta *"¿me habré bajado lo que necesito?"* justo antes de
un vuelo, y hace irrelevantes los puntos 8 y 10. Es también la respuesta más
simple: precachear todo el manifest en el `install`.

## Plan

**P0 — que funcione (bloqueantes).** Fixes 1, 2, 3 y 4. Sin esto no hay modo
offline en prod. Es un solo cambio coordinado en `sw.js` + `offline.js`.

**P1 — que funcione bien.** Fix 5 (fuentes propias), 6 (iconos), 7 (script de
parcheo de los 197 tutoriales), 9 (versionado del shell).

**P2 — que se disfrute.** «Descargar toda la academia», descarga por ruta,
`storage.persist()` + tamaño estimado, indicador de estado en la nav
(guardado / actualizable / sin conexión).

## Verificación (no darlo por bueno sin esto)

Checklist manual sobre la URL real de Pages, no en localhost — el bug 1 solo
aparece bajo subruta:

1. Abrir `https://dgran.github.io/MentorAI/`, comprobar en DevTools →
   Application que el SW está **activado**.
2. Instalar la PWA. Icono correcto.
3. Guardar un curso; ver el progreso `n/total`.
4. DevTools → Network → **Offline** (o modo avión real en el móvil).
5. Navegar: inicio → cursos → **abrir el curso guardado** (`curso.html?slug=…`)
   → abrir lección → siguiente lección → marcar completada → hacer el examen
   final → volver al inicio. **Todo sin errores.**
6. Recargar en frío estando offline.
7. Hacer un deploy, volver online y comprobar que el shell se actualiza.

El punto 5 es el que hoy falla y el que define "operativo".

## Estado

**P0 IMPLEMENTADO Y VERIFICADO (2026-07-31).** Fallos 1, 2, 3 y 4 arreglados, más
los huecos 6 (iconos), 7 (`offline.js` en los 200 HTML) y 9 (versionado del
shell con `VERSION` + `refreshShell()` una vez por arranque). Además,
`cache.addAll` pasó a `cache.add()` por fichero para que un 404 no aborte la
instalación. Verificado con Chrome headless sirviendo bajo `/MentorAI/`:
`sw.js` pedido y servido, shell precacheado, 0 errores en 47 peticiones.

**P1 fix 5 también HECHO:** Inter y JetBrains Mono auto-hospedadas en
`assets/fonts/` (solo subset latin, 340 KB; no hay un solo carácter fuera de ese
rango en el contenido, y `latin-ext` habría añadido 456 KB inútiles). Los
`<link>` a Google Fonts fuera de los 200 HTML, `@font-face` al principio de
`styles.css` y los woff2 en el shell del SW. Verificado: cero peticiones a
terceros.

**Queda pendiente:**
- **P2 completo** — «Descargar toda la academia» (5,2 MB, la recomendación
  principal de esta note), guardar por ruta, `storage.persist()` + tamaño
  estimado, indicador de estado en la nav.
- **La verificación manual del checklist de abajo sigue sin hacerse sobre la URL
  real de Pages**, con la PWA instalada y modo avión de verdad. Lo verificado es
  una reproducción local de las condiciones de subruta, no el despliegue.

Sustituye y concreta el frente C de `plan-multiusuario.md`.
