# Estado del proyecto

Última actualización: **2026-08-22**.

Este fichero se lee al empezar cada sesión y está pensado para leerse **entero**.
Lo cerrado vive en `archivo/`; si algo de aquí crece demasiado, se archiva.

## Dónde está el proyecto

**282 tutoriales · 30 cursos · 7 rutas · 431 preguntas de examen · 622 checks ·
88 retos de práctica.** `node scripts/validar.js` sale sin errores ni avisos.

**Tanda fundamentos (2026-08-23):** dos cursos nuevos que cierran huecos de
base detectados en auditoría contra un temario de carrera — **`la-maquina`**
(«La máquina por dentro», 5 lecciones: CPU y caché, de código a programa,
kernel y syscalls, scheduler, sockets e I/O; en `el-grado-que-no-hiciste`
justo tras Fundamentos) y **`k8s-para-devs`** («Kubernetes para
desarrolladores», 4 lecciones prácticas con kind; en las dos rutas de infra
tras el curso de Infraestructura) — más el artículo suelto **`regex`**.
Prefijos de slug `maq-` y `k8s-`. Además, **«Tus datos» se movió de
`repaso.html` a la página nueva `perfil.html`** (export/import + sync), con
enlace «Perfil» inyectado en el nav por `perfil.js` — repaso quedaba como un
nombre que escondía la sincronización. Shell `v12`.

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

**Sync entre dispositivos (2026-08-23):** se reabrió —con motivo nuevo real:
uso multi-dispositivo frecuente— la opción Gist que `archivo/plan-multiusuario.md`
dejó anotada como descartada. `assets/js/modules/sync.js`: gist secreto por
usuario (token clásico scope `gist`, pegado en `repaso.html`), fusión
reutilizando `Perfil.importar`, sync oportunista al cargar/salir/botón. El
token vive en `academia-sync` y **no viaja en el export**. Cada compañero usa
su cuenta → independencia gratis; se descartó explícitamente centralizar los
progresos en la cuenta del usuario (exigiría distribuir su token: un secreto
compartido no es un secreto). E2E verificado con dos perfiles de navegador y
gist real (creado, encontrado por token, fusionado en ambas direcciones,
borrado). Ojo para tests futuros: matar Chrome headless a lo bruto puede
perder escrituras de localStorage — no es un bug de la app.

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

## Rutina pendiente: revisión de frescura

El validador vigila la estructura, no la verdad: el contenido caduca sin que
nada avise. **Hacia febrero-marzo de 2027, primera revisión de frescura** de
las categorías volátiles — los cursos `claude-code` y `construir-con-ia` sobre
todo (la lección de la API ya nació corrigiendo `temperature`, que desapareció
de los modelos actuales), y de paso `programar-con-ia`. Formato: una sesión de
auditoría como la del 2026-08-22, leyendo contra las fuentes actuales y
corrigiendo con `/tutorial`. Repetir cada ~6 meses solo para esas categorías;
el resto del catálogo (SQL, OOP, Linux…) envejece a décadas, no a meses.

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
