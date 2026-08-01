# Plan — Evaluaciones y aprendizaje efectivo (2026-07-31)

Surge de: *"la app ofrece tutoriales y cursos, pero seguro que si ponemos
exámenes tipo test el aprendizaje será más efectivo."*

## Punto de partida: los exámenes YA existen

Puede que se hubiera olvidado. Estado real del catálogo:

- `tutorials/quizzes.js` (95 KB) → `window.MENTORAI_QUIZZES`: **251 preguntas**
  repartidas en **20 de los 22 cursos**.
- `assets/js/modules/quiz.js` inyecta el examen al final de la **última
  lección** del curso y **bloquea** el botón «marcar como completado» hasta
  aprobar (`gateDoneButton`, `quiz.js:89`). Nota de corte: 70 %.
- Resultado en `localStorage` (`academia-quiz-<curso>`): `{passed, bestScore,
  attempts}`.

Así que la intuición es correcta, pero el trabajo no es "añadir exámenes": es
**arreglar los que hay y convertirlos en un sistema de aprendizaje**. Ahora
mismo el examen es decorativo, y hay un motivo muy concreto.

## Hallazgo crítico: los exámenes son triviales de aprobar sin estudiar

Distribución del índice de la respuesta correcta en las 251 preguntas:

```
a: 0  →   16   ( 6,4 %)
a: 1  →  233   (92,8 %)
a: 2  →    2   ( 0,8 %)
a: 3  →    0   ( 0,0 %)
```

**En el 93 % de las preguntas la respuesta correcta es la segunda opción.** En
el curso de Git, las 10 preguntas tienen `a: 1`. Cualquiera que lo note (o que
falle una vez y mire) aprueba todos los exámenes de la academia marcando
siempre la B, sin leer los enunciados. El "gate" que bloquea completar el curso
no mide nada.

Es un artefacto clásico de generación con IA: al escribir la pregunta se pone
la correcta la primera y luego se coloca detrás de un distractor. Se arreglará
solo si se ataca por dos lados:

- **Barajar las opciones en el render** (`quiz.js`): permutar `q.o` al pintar y
  remapear `data-correct`. Arregla las 251 preguntas existentes sin tocar el
  contenido, y también las futuras. **Es el primer cambio que hay que hacer.**
- **Chequeo en el validador de catálogo** (A1 de `plan-multiusuario.md`): fallar
  si la distribución de `a` en un curso se desvía demasiado de la uniforme. Sin
  esto, la IA volverá a introducir el sesgo en cada curso nuevo.

## Otros huecos del sistema actual

1. **Cero explicaciones.** `grep explanation quizzes.js` → 0. Al corregir solo
   se pinta verde/rojo. La retroalimentación *sin el porqué* es la mitad del
   valor del test; explicar por qué la elegida está mal es donde se aprende.
2. **Solo evaluación sumativa, al final del curso.** No hay recuperación activa
   por lección. El efecto de testeo funciona porque se recupera **poco y a
   menudo**, no por un examen único 20 lecciones después.
3. **No se descubren.** El examen solo es accesible abriendo la última lección
   del curso. No hay entrada desde `cursos.html`, ni desde `curso.html`, ni
   desde el dashboard. Si no llegas al final, no sabes que existe.
4. **No se puede repasar lo fallado.** Solo se guarda la nota máxima; qué
   preguntas fallaste se pierde al recargar. No hay forma de decir *"repasa
   estas 4"* ni de enlazar cada pregunta con la lección de la que salió.
5. **Sin repetición espaciada.** Nada trae de vuelta lo aprendido hace tres
   semanas. Para el norte del proyecto ("una carrera") esto es justo lo que
   separa haber leído de saber.
6. **Banco de preguntas fijo.** Reintentar muestra las mismas 10-12 preguntas en
   el mismo orden: se memorizan los ítems, no el temario.
7. **Un solo tipo de pregunta.** 4 opciones, respuesta única, y el enunciado
   pasa por `escapeHtml` (`quiz.js:147`), así que **no se puede poner un
   fragmento de código** en la pregunta. En una academia de programación,
   "¿qué imprime este código?" y "¿dónde está el bug?" son las preguntas que
   más miden.
8. **Faltan quizzes** de `rust` y `python` (y de los 4 cursos aprobados por
   escribir).
9. **Reintentar hace `window.location.reload()`** (`quiz.js:244`): se pierde el
   scroll y se recarga la página entera.

## Plan

### Fase 1 — Reparar lo que hay (alto impacto, poco código)

- **Barajado de opciones** en `quiz.js`. *Sin esto, todo lo demás da igual.*
- **Explicaciones**: campo `w` (why) por pregunta, pintado al corregir en la
  opción correcta y en la que elegiste. Retro-rellenar las 251 con un agente
  (una pasada por curso, igual que el rollout de «Cuándo aplicarlo»).
- **Traza a la lección**: campo `lesson` (slug) por pregunta → *"esto se
  explica en [Ramas y flujo de trabajo]"*, con enlace.
- **Guardar el detalle del intento**: extender `academia-quiz-<curso>` con el
  resultado por pregunta y la fecha.
- **Reintento sin recargar** (re-render en sitio).
- **Quizzes de `rust` y `python`.**

Formato extendido, retrocompatible (las entradas actuales siguen valiendo):

```js
{ q: "…", code: "…", lang: "go",   // code/lang opcionales
  o: [...], a: 1, w: "…", lesson: "git-ramas-y-flujo" }
```

`code` se pinta en un `<pre><code data-lang>` que ya recoge el resaltador; el
enunciado sigue escapado.

### Fase 2 — Recuperación activa por lección

Nuevo fichero `tutorials/checks.js` → `window.MENTORAI_CHECKS`, indexado por
slug de tutorial (mismo patrón `.js` + global, compatible con `file://`), con
**2-3 preguntas rápidas al final de cada tutorial**.

Reglas de diseño:
- **No bloquean nada.** Son autoevaluación, no portero. El examen del curso
  sigue siendo el que gatea.
- Corrección inmediata con explicación.
- El resultado alimenta el repaso (fase 3).

Esto es lo que convierte "he leído 197 tutoriales" en "sé 197 cosas", y encaja
con la idea ya aprobada de **«Ponlo en práctica»** de
`plan-huecos-versatilidad.md` (mini-retos al cierre de curso): los checks son la
versión ligera y por lección; los mini-retos, la versión aplicada y por curso.

### Fase 3 — Repaso espaciado

`academia-repaso`: cola de preguntas falladas o antiguas, con un SM-2 muy
simplificado (intervalos 1, 3, 7, 16, 35 días; fallar reinicia).

- Tarjeta en el dashboard del inicio: *"Tienes 7 preguntas para repasar hoy"*.
- Sesión de repaso corta (5-10 preguntas mezcladas de todo lo estudiado).
- Todo en `localStorage`, sin login, y exportable con el resto del progreso
  (B1 de `plan-multiusuario.md`).

### Fase 4 — Visibilidad y estructura

- **Entrada al examen desde `curso.html`** y badge en la tarjeta de curso
  (`sin intentar` / `suspendido 6/10` / `superado 9/10`).
- **Sección «Exámenes»** en el dashboard: qué has aprobado, con qué nota, qué
  te queda.
- **Examen final de ruta** (capstone): muestrea preguntas de todos los cursos
  de la ruta. Para `el-grado-que-no-hiciste` es literalmente el examen final de
  la carrera. Es la pieza que más refuerza el norte del proyecto.
- **Banco y muestreo**: ampliar a 20-30 preguntas por curso y presentar 10
  aleatorias. Barato de conseguir generándolas con IA.

### Fase 5 — Integración con la IA (depende de `plan-autoria-en-prod.md`)

- **Generar el examen junto con el tutorial** en el mismo prompt (es D3 de
  `plan-multiusuario.md`) — con instrucción explícita de **distribuir la
  posición de la respuesta correcta** y de escribir la explicación.
- **Práctica infinita bajo demanda**: *"ponme 5 preguntas más de este tema"*
  desde el tutor de la lección. Efímero, no toca el catálogo, coste mínimo.
- **Explicar el fallo**: al suspender una pregunta, botón *"¿por qué me he
  equivocado?"* que le pasa a la IA la pregunta, tu respuesta y el texto de la
  lección.

## Decisión pendiente (la tuya)

El examen actual **bloquea** marcar completada la última lección hasta aprobar.
¿Se mantiene ese gate, se suaviza (avisar pero dejar continuar) o se endurece
(bloquear la ruta entera)? Afecta a cómo se siente la app: academia exigente vs.
biblioteca con autoevaluación. Por defecto, en el plan se mantiene tal cual.

## Orden sugerido

1. Barajado + reintento sin recarga (una tarde, arregla el fallo crítico).
2. Explicaciones + `lesson` + detalle del intento (rollout con agentes).
3. Visibilidad (fase 4, primeras dos viñetas) — barato y muy visible.
4. Checks por lección (fase 2).
5. Repaso espaciado (fase 3).
6. Examen de ruta + banco ampliado.
7. Integración con IA cuando exista `ai.js`.

## Estado

**El fallo crítico está ARREGLADO (2026-07-31).** Implementado en `quiz.js`:
barajado Fisher-Yates de las opciones en cada render con remapeo de
`data-correct`, y reintento sin recargar la página. Las 251 preguntas quedan
arregladas sin tocar `quizzes.js`. Verificado con 4000 iteraciones: distribución
uniforme y la correcta sigue siempre a su opción.

**También implementado (misma sesión):**
- **Explicaciones (`w`) y traza a la lección (`lesson`)** en el formato de
  pregunta, renderizadas al corregir con enlace «Repasar «…»». Ambos campos son
  opcionales, así que conviven con las preguntas sin rellenar.
- **Exámenes de `rust` y `python`** (12 preguntas cada uno): los **22 cursos**
  tienen ya examen. 275 preguntas en total.
- **Sesgo corregido también en los datos**: un script rotó las opciones de las
  275 preguntas dejando la respuesta correcta repartida (24/28/24/24 %),
  verificando que cada pregunta conserva su mismo conjunto de opciones y su
  misma respuesta correcta.
- **Visibilidad completa** (`assets/js/modules/exams.js`, nuevo): badge de
  estado en la tarjeta de curso, panel con enlace directo al final de
  `curso.html`, y lista en el dashboard del inicio ordenada por lo que necesita
  atención. De paso se arreglaron los tokens CSS inexistentes que usaba el
  bloque `.quiz` desde que se escribió.

**Explicaciones: 275 de 275, COMPLETO** en los 22 cursos. Cada pregunta explica
por qué la correcta lo es y enlaza a la lección de la que sale, así que fallar
una te lleva directo a lo que hay que releer.

El flujo usado, por si hay que rellenar preguntas nuevas: leer las preguntas del
curso, escribir un JSON `{curso: [{w, lesson}, …]}` por índice y aplicar un
inyector que verifica después que ningún enunciado, opción o respuesta ha
cambiado y que todos los slugs de `lesson` existen en el manifest.

**Fase 2 (checks por lección) IMPLEMENTADA.** `assets/js/modules/checks.js` +
`tutorials/checks.js` → `window.MENTORAI_CHECKS`, indexado por slug de tutorial.
2-3 preguntas al final de la lección, corrección **inmediata por pregunta** (sin
botón de enviar, que es lo que hace que funcione como recuperación activa), con
el porqué. No bloquean nada. Se insertan antes del examen y de la navegación de
ruta, así que el orden en la página es contenido → check → examen → navegación.
El resultado por pregunta se guarda en `academia-checks` para alimentar el
repaso espaciado.

**Contenido: 96 lecciones de 194** (205 preguntas). Cubiertos por completo
**18 de los 22 cursos**: git, oop, clean-code, solid, di-contenedores, testing,
phpunit, apis-rest, acceso-a-datos, docker, ci-cd, sql-aplicado,
patrones-diseno, diseno-y-arquitectura, framework-por-dentro, terminal-linux,
observabilidad y programar-con-ia.

**Pendientes 97 lecciones:** `go` (21), `fundamentos` (22), `python` (21),
`rust` (21) y 12 artículos sueltos.

Criterio de redacción que ha ido saliendo: **plantear la pregunta como una
situación, no como una definición** («recibes un 502 de nginx, ¿dónde miras
primero?» en vez de «¿qué es un 502?»). Mide lo mismo pero se parece a cómo se
usa de verdad. Y repartir la posición de la correcta en los datos aunque el
render baraje.

Flujo para continuar: escribir un fichero `/tmp/checksN.js` con
`const NUEVOS = { slug: [{q,o,a,w}] }` y aplicar el script de anexado, que rota
las posiciones continuando la serie del fichero y valida slugs, duplicados y
explicaciones vacías.

**Sigue pendiente:** guardar el detalle del intento del examen por pregunta,
repaso espaciado y examen de ruta. **Y el chequeo de sesgo en el
validador** (A1 de `plan-multiusuario.md`): los datos ya están repartidos, pero
las preguntas nuevas que genere la IA volverán a sesgarse si nadie lo comprueba.

Decisión aún pendiente del usuario: mantener, suavizar o endurecer el gate del
examen.
