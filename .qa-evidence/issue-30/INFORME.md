# QA funcional — issue #30 (service worker y arranque)

Entorno:
- Copias de `main` (09f7a62) y de la rama (0d7f822) servidas con `servidor.py`, un `http.server` que registra el código y los bytes de cada respuesta.
- Chromium con el service worker activo.

Comando: `node command.mjs <base> <assets> <copia> <registro>`.

| Escenario | main | rama |
|---|---|---|
| **Bytes servidos en un arranque del worker** (tras `install`) | **1.755 KB**: 55 respuestas 200, 12 de ellas fuentes e iconos | **0 bytes**: 44 respuestas 304, sin fuentes ni iconos |
| Caché `otra-app` creada a mano y `activate` de una versión nueva | **borrada** | **sobrevive**; la shell vieja sí se borra |
| `initTheme` lanza (core.js parcheado al servirlo) | error de página; **SW sin registrar y sin panel de sync** | 0 errores de página (el error va a `console.error`); SW registrado y panel de sync pintado |
| `localStorage` bloqueado, sistema en oscuro | lanza `bloqueado`; **pinta en claro** y luego cambia a oscuro (destello) | sin errores; **oscuro desde el primer pintado** |
| Lo mismo, sistema en claro | lanza; claro | sin errores; claro |
| Índice de búsqueda: falla la 1.ª carga y se vuelve a buscar | 1 intento y **nunca carga** | 2 intentos y encuentra la coincidencia en el contenido |

El criterio 2 (revalidar lo guardado) ya se cumplía desde #43. Lo comprueba `verificar-offline.js`: «lo guardado se refresca con red — versión nueva».

Captura revisada: `busqueda-tras-reintento.png` («2 coincidencias… · 1 dentro del contenido»).

No probado: los bytes reales en GitHub Pages. Allí la revalidación depende de su ETag/Last-Modified, que Pages envía.

Veredicto: **aprobado**.
