# Plan — Multiusuario y multi-dispositivo (2026-07-13)

Surge de la conversación "¿qué falta para usarlo entre varios?" (2026-07-13).
Propósito confirmado por el usuario: colección **portable** de tutoriales y
cursos generados por IA, muy útil **offline** (viajes), donde el contenido lo
añade cualquier usuario **con su propia suscripción** de IA. Escala objetivo:
**grupo de trabajo** (él + colegas de profesión), no una red grande.

## Decisiones de fondo (acordadas 2026-07-13)

- **Git es la capa de colaboración.** Repo compartido (`dGran/MentorAI`, ya
  público con Pages), contribución por push/PR, consumo por Pages, clone o zip.
  **Nada de cuentas, login ni backend de contenido**: a esta escala git ya da
  historial, revisión y resolución de conflictos.
- **La generación ya es multiusuario:** cada colega ejecuta SU puente local con
  SU sesión de Claude Code. No hay nada que cambiar ahí.
- **El progreso no se mezcla entre usuarios.** `localStorage` por persona sigue
  siendo el modelo; el problema real detectado es **multi-dispositivo de la
  misma persona** (tablet/móvil no comparten progreso con el PC, y limpiar el
  navegador lo borra). Se ataca sin backend (export/import + puente).

## Frente A — Colaboración de contenido

### A1. Validador del catálogo (`server/validate.js`) — el primero
Formaliza los chequeos que hoy se repiten a mano cada sesión (ver estado.md:
node --check, TOC↔h2, escapado, cruces, enlaces). Script Node puro sin deps:
slugs duplicados, cada `href` del manifest tiene su `.html`, lecciones de
`courses.js` y pasos de `paths.js` referencian slugs existentes, exactamente
1 `featured`, ids de `<h2>` casan con el `.toc__list`, `<`/`>`/`&` crudos en
`<code data-lang>`. Ejecutable a mano y como **GitHub Action en PRs** (solo
valida, no genera: no rompe el invariante sin-build). Con varios autores es el
control de calidad mecánico que sustituye al "yo reviso todo".

### A2. Inserción ordenada en el manifest (anti-conflictos de merge)
`bridge.js` hace `entries.push(entry)` (bridge.js:410): todos añaden al final
del array → dos personas generando en paralelo conflictan siempre en las
mismas líneas. Cambiar a **insertar ordenado alfabéticamente por slug** (el
catálogo ordena por `date` en runtime, el orden del fichero es libre): cada
inserción cae en un punto distinto y los merges se vuelven casi siempre
automáticos. Mismo criterio para `courses.js`/`quizzes.js` si el puente los
toca en el futuro.

### A3. Campo `author` en el manifest
El puente lo rellena de `git config user.name`; visible en tarjeta y/o hero.
Con varios contribuyendo es atribución y canal de feedback ("esto tuyo tiene
un error"). Retro-rellenar las ~193 entradas existentes con el autor actual
(sed/script puntual). Documentarlo en la cabecera del manifest.

### A4. Estado `draft` para curar antes de publicar
Hoy el puente publica directo (`status: "published"`, `featured: true`). En
grupo, lo generado debería poder entrar como **borrador**: valor nuevo `draft`
en `status`; el catálogo lo muestra con badge "Borrador", sin `featured` y
fuera de Destacados/Novedades. Publicar = editar el status (a mano o botón en
el compositor). Decidir al implementar: ¿drafts visibles con badge (mejor para
que otro los revise) u ocultos tras un filtro?

## Frente B — Progreso multi-dispositivo (por persona)

### B1. Export/import del progreso a fichero
Botón que descarga un JSON con todas las claves `academia-*` y otro que
importa **fusionando**: unión de slugs (bookmarks/progress), máximo `percent`
y `updatedAt` más reciente por tutorial (reading). Funciona por `file://`,
cubre "me voy de viaje con la tablet" y copia de seguridad. Dónde: ¿ajustes en
el dashboard? Decidir UI al implementar. (Ya estaba anotado como "primer paso"
en estado.md 2026-06-21; ahora se concreta.)

### B2. Sincronización vía puente en red local
El puente expone `GET/POST /api/progress` persistiendo en fichero local
**fuera de git** (p. ej. `.local/progress.json` + entrada en `.gitignore` —
si viajara en el repo se mezclaría el progreso de todos). `storage.js`
reconcilia al cargar cuando el puente responde (misma fusión que B1);
`localStorage` sigue siendo la verdad offline y por `file://`. Uso: móvil y
tablet acceden a `http://<ip-del-pc>:4321` en la wifi de casa y comparten
progreso con el PC. Sincroniza dispositivos de UNA persona (cada colega, su
puente).

**Descartado por ahora:** sync por Gist/token de GitHub (única opción que
sincroniza fuera de casa). Solo si el uso multi-dispositivo remoto se vuelve
frecuente; es el primer paso hacia la complejidad que se quiere evitar.

## Frente C — Fix previo: SW roto en GitHub Pages

`offline.js:313` registra `/sw.js` y `SHELL_URLS` de `sw.js` usa rutas
absolutas (`/index.html`, `/assets/...`). En Pages el sitio vive bajo
`/MentorAI/`, así que apuntan a rutas inexistentes: **"Guardar para viajar"
casi seguro no funciona hoy en `dgran.github.io/MentorAI/`** (verificar al
arrancar este plan). Pasar registro y URLs a **relativas al scope**. Es
prerequisito del modelo "colegas que solo consumen": entran a la URL de Pages,
instalan la PWA, guardan cursos y se los llevan al avión sin saber git.

## Frente D — Features de grupo

- **D1. "Novedades desde tu última visita".** LA feature de grupo: si un
  colega generó 3 tutoriales esta semana, verlo al abrir. `date` ya existe en
  el manifest; guardar `academia-last-visit` y pintar sección en el dashboard.
  Coste bajo.
- **D2. Guardar para viajar por curso y por ruta.** Hoy es tutorial a
  tutorial; el caso real pre-viaje es "llévate el curso de Rust entero".
  Iterar las lecciones llamando a lo que ya hace el SW + estimación de tamaño.
- **D3. El puente genera también el quiz** en el mismo prompt (quizzes.js ya
  existe), y propone categorías/curso/ruta donde encajar — **absorbe
  plan-autocategorizacion.md** (fase 2): al hacer D3, revisar esa note y
  cerrarla o fusionarla aquí.
- **D4. Wishlist compartida de temas.** `tutorials/wishlist.js` →
  `window.MENTORAI_WISHLIST` (mismo patrón file://): cualquiera apunta "quiero
  un tutorial de X" (por git o por el puente), quien tenga un rato lo genera
  desde el compositor y lo tacha. Colaboración sin infraestructura.
- **D5. Feedback ligero entre colegas.** Botón "proponer mejora" en el
  tutorial que abre un issue de GitHub prellenado
  (`github.com/dGran/MentorAI/issues/new?title=...&body=...`) con slug y
  sección; degrada a copiar el texto para pegarlo en el refinador. Cierra el
  ciclo generar → usar → refinar entre varias personas.

## Orden sugerido

1. **Fase 1 — colaboración segura:** A1 validador → A2 inserción ordenada →
   A3 author → A4 draft. (A1 primero: protege todo lo que venga después.)
2. **Fase 2 — consumo y multi-dispositivo:** C fix SW/Pages → B1
   export/import → B2 sync por puente.
3. **Fase 3 — features:** D1 novedades → D2 offline por curso → D3 quiz+
   categorías en generación → D4 wishlist → D5 feedback.

Fases 1 y 2 son cortas y técnicas (sin autoría de contenido); pueden
intercalarse con los 4 cursos nuevos aprobados (sistemas-distribuidos, etc.)
según apetezca. D3 toca el prompt del puente: probar con una generación real.

## Estado
**PARCIAL.** A1 (validador del catálogo) hecho 2026-07-31, pero como
`scripts/validar.js` + workflow de CI, no como `server/validate.js`: el puente
se borró. C (SW roto en Pages) hecho y superado por `plan-offline-real.md`.
A2 y A4 perdieron su sentido al descartarse la autoría desde la app
(ver `plan-ia-en-la-app.md`). Quedan A3 (`author`), B (export/import y sync
de progreso — el sync por puente ya no aplica) y D (features de grupo).
