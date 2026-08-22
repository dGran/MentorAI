# Estado del proyecto

Última actualización: **2026-08-22**.

Este fichero se lee al empezar cada sesión y está pensado para leerse **entero**.
Lo cerrado vive en `archivo/`; si algo de aquí crece demasiado, se archiva.

## Dónde está el proyecto

**272 tutoriales · 28 cursos · 7 rutas · 409 preguntas de examen · 586 checks ·
82 retos de práctica.** `node scripts/validar.js` sale sin errores ni avisos.

**Tanda IA (2026-08-22, segunda del día):** dos cursos nuevos —
**`claude-code`** («Claude Code: ingeniería con agentes», 11 lecciones en 3
módulos: el agente por dentro, configurar el entorno, automatizar) y
**`construir-con-ia`** (4 lecciones: API desde PHP, structured output,
streaming, coste y evals) — más la **7ª ruta `ingenieria-con-ia`**
(programar-con-ia → claude-code → construir-con-ia). Cada curso con su examen,
sus checks por lección y sus retos. Decisión de arquitectura: tres cursos
separados sin solapes en vez de inflar `programar-con-ia`, que queda intacto
como intro. Los slugs nuevos usan prefijos `cc-` e `ia-`.

El **norte está cumplido**: la ruta `el-grado-que-no-hiciste` son 23 cursos, y
**ningún curso queda fuera de una ruta**. Los 16 planes de `archivo/` están
cerrados, y las tres colas de ideas están consumidas: no queda backlog.

**«Ponlo en práctica» se cerró el 2026-08-22** (era lo último pendiente). El
formato decidido con el usuario: datos en `tutorials/practica.js`
(`window.MENTORAI_PRACTICE`, mismo patrón que quizzes/checks), pintados por
`assets/js/modules/practica.js` al final de la ficha de curso — solución en
`<details>` plegado y check «hecho» persistido en `academia-practica`, que viaja
con el export del perfil. 2-3 retos por curso, ejecutables en la máquina del
lector, con la solución explicando el porqué. El `lang` de los bloques de
código **no se restringe** a lo que resalta `syntax.js`: el resaltador escapa y
deja en plano lo que no conoce, así que `sql`, `go` o `rust` son etiquetas
válidas.

De la misma tanda (auditoría 2026-08-22): el validador ganó tres checks
estructurales (enlaces entre tutoriales, ids duplicados, páginas raíz en el
shell del service worker), hay skip link y `aria-live` en el buscador del
inicio (inyectados por JS, sin tocar los 264 HTML), y
**`verificar-offline.js` ahora corre en CI** — se reabrió la decisión de
«solo manual» porque los runners de GitHub traen Chrome de serie.

A partir de aquí, todo lo que venga es **contenido nuevo o funcionalidad
nueva**, sin plan previo que consultar.

## Decisiones que no se reabren sin motivo nuevo

Están razonadas en `archivo/`; aquí solo el veredicto, para no volver a
discutirlas por olvido:

- **No hay autoría desde la app**, ni con IA ni manual. Se escribe en sesiones de
  Claude Code con la skill `/tutorial`. El puente (`server/bridge.js`) se borró.
- **No hay tutor con IA por lección.** Rompería el invariante de `file://` y
  offline por una función que compite con leer. El diseño técnico está guardado
  en `archivo/plan-ia-en-la-app.md` por si algún día cambia el criterio.
- **No hay tablero de tareas** (ni GitHub Projects ni GitLab). La continuidad es
  este fichero.
- **El uso es individual**: nada de campo `author` ni features de grupo. Sí hay
  export/import del progreso, que es el caso real de dos dispositivos.

## Trampas que ya nos han mordido

Cada una costó una depuración; están aquí para no repetirlas.

- **Emular «offline» en el navegador no prueba el offline.** No afecta a las
  peticiones del service worker. Hay que **apagar el servidor**: lo hace
  `node scripts/verificar-offline.js`.
- **El sesgo de posición en las preguntas se cuela solo.** La IA tiende a poner
  la correcta en el mismo sitio. El validador lo mide **por curso y en total**,
  porque un curso nuevo mal repartido se diluye en el conjunto.
- **Las notes derivan.** El 2026-08-01 había seis planes declarando «pendiente de
  autoría» cursos publicados semanas antes. Al cerrar algo hay que tocar su
  `## Estado`, no solo la lista de las rules.
- **Un `<` sin escapar dentro de `<code>` se come el resto del bloque.** Lo caza
  el validador; llegó a haber cinco tutoriales rotos así.
- **`pkill -f "patrón"` se mata a sí mismo** si el patrón aparece en la propia
  línea de comandos del shell.

## Cómo se mantiene

| Comando | Para qué |
| --- | --- |
| `node scripts/validar.js` | Valida el catálogo entero. Corre en CI |
| `node scripts/generar-indice.js` | Regenera el índice de búsqueda tras tocar tutoriales |
| `node scripts/verificar-offline.js` | Comprueba el offline con el servidor apagado |

Al tocar `sw.js` o los módulos del shell, **subir `VERSION`** (va por `v10`).

## El archivo

`archivo/` guarda los 16 planes cerrados, las tres colas de ideas consumidas y
`estado-historico.md` (el log de sesiones de junio y julio de 2026, 1500 líneas).
No hace falta leerlo para trabajar; sirve para responder «¿por qué esto es así?».
