/* ============================================================
   MentorAI — Rutas de aprendizaje (itinerarios)
   Lee window.MENTORAI_PATHS y lo cruza con los cursos, el manifiesto y el
   progreso. Pinta la página de rutas (rutas.html → #paths) y las tarjetas
   de entrada del inicio (index.html → #home-paths).
   Sin dependencias. Funciona por file://. Parte de window.MentorAI.
   ============================================================ */

(function () {
  "use strict";

  const MentorAI = (window.MentorAI = window.MentorAI || {});

  const CHECK_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

  /* ---------- Datos ---------- */

  const manifestMap = () =>
    Object.fromEntries((window.ACADEMIA_TUTORIALS ?? []).map((t) => [t.slug, t]));

  const isPublished = (tutorial) => Boolean(tutorial) && tutorial.status !== "soon";

  const courseBySlug = (slug) =>
    (window.MENTORAI_COURSES ?? []).find((course) => course.slug === slug);

  function courseLessons(course) {
    if (!course) return [];
    if (Array.isArray(course.modules)) {
      return course.modules.flatMap((module) => module.lessons ?? []);
    }

    return course.lessons ?? [];
  }

  /* Slugs de tutorial que componen un paso: las lecciones del curso, o el
     propio artículo si el paso es un artículo suelto. */
  const stepLessons = (step) =>
    step.type === "course" ? courseLessons(courseBySlug(step.ref)) : [step.ref];

  function pathProgress(path, manifest) {
    const lessons = (path.steps ?? [])
      .flatMap(stepLessons)
      .filter((slug) => isPublished(manifest[slug]));
    const done = lessons.filter((slug) => MentorAI.Progress.has(slug)).length;

    return {
      published: lessons.length,
      done,
      percent: lessons.length ? Math.round((done / lessons.length) * 100) : 0,
    };
  }

  /* ---------- Pasos ---------- */

  function courseStepHtml(step, manifest) {
    const { escapeHtml, Icons } = MentorAI;
    const course = courseBySlug(step.ref);

    if (!course) return "";

    const lessons = courseLessons(course).filter((slug) => isPublished(manifest[slug]));
    const completed = lessons.filter((slug) => MentorAI.Progress.has(slug)).length;
    const allDone = lessons.length > 0 && completed === lessons.length;

    const marker = allDone
      ? `<span class="step__marker step__marker--done">${CHECK_SVG}</span>`
      : `<span class="step__marker step__marker--icon">${Icons.for(course.icon)}</span>`;

    return `<li class="step step--course${allDone ? " step--done" : ""}">
      ${marker}
      <a class="step__title" href="curso.html?slug=${encodeURIComponent(
        course.slug
      )}">${escapeHtml(course.title)}<small class="step__kind">Curso</small></a>
      <span class="step__tag">${completed} / ${lessons.length} lecciones</span>
    </li>`;
  }

  function articleStepHtml(step, manifest, position) {
    const escapeHtml = MentorAI.escapeHtml;
    const tutorial = manifest[step.ref];
    const published = isPublished(tutorial);
    const soon = tutorial?.status === "soon";
    const done = published && MentorAI.Progress.has(step.ref);
    const title = escapeHtml(tutorial?.title ?? step.ref);

    const marker = done
      ? `<span class="step__marker step__marker--done">${CHECK_SVG}</span>`
      : `<span class="step__marker">${position}</span>`;

    const body = published
      ? `<a class="step__title" href="${escapeHtml(tutorial.href)}">${title}</a>`
      : `<span class="step__title is-muted">${title}</span>`;

    let tag = `<span class="step__tag">${soon ? "Próximamente" : "Planificado"}</span>`;

    if (published) {
      tag = done
        ? '<span class="step__tag step__tag--done">Completado</span>'
        : `<span class="step__meta">${escapeHtml(tutorial.minutes)} min</span>`;
    }

    return `<li class="step${published ? "" : " step--pending"}${
      done ? " step--done" : ""
    }">${marker}${body}${tag}</li>`;
  }

  const stepHtml = (step, manifest, position) =>
    step.type === "course"
      ? courseStepHtml(step, manifest)
      : articleStepHtml(step, manifest, position);

  /* ---------- Vistas ---------- */

  function pathHtml(path, manifest) {
    const { escapeHtml, Icons } = MentorAI;
    const stats = pathProgress(path, manifest);
    const steps = (path.steps ?? [])
      .map((step, index) => stepHtml(step, manifest, index + 1))
      .join("");

    return `<section class="path" id="ruta-${encodeURIComponent(path.slug)}">
      <header class="path__head">
        <span class="path__icon">${Icons.for(path.icon)}</span>
        <div class="path__headings">
          <h2 class="path__title">${escapeHtml(path.title)}</h2>
          <p class="path__summary">${escapeHtml(path.summary)}</p>
        </div>
        <span class="path__progress">${stats.done} / ${stats.published}</span>
      </header>
      <div class="path__bar"><span style="width:${stats.percent}%"></span></div>
      <ol class="steps">${steps}</ol>
    </section>`;
  }

  function pathCardHtml(path, manifest) {
    const { escapeHtml, Icons } = MentorAI;
    const stats = pathProgress(path, manifest);

    return `<a class="path-card" href="rutas.html#ruta-${encodeURIComponent(path.slug)}">
      <div class="path-card__top">
        <span class="path-card__icon">${Icons.for(path.icon)}</span>
        <span class="path-card__progress">${stats.percent}%</span>
      </div>
      <h3 class="path-card__title">${escapeHtml(path.title)}</h3>
      <p class="path-card__desc">${escapeHtml(path.summary)}</p>
      <div class="path-card__bar"><span style="width:${stats.percent}%"></span></div>
      <span class="path-card__steps">${(path.steps ?? []).length} pasos</span>
    </a>`;
  }

  function renderInto(hostId, build) {
    const host = document.getElementById(hostId);
    const paths = window.MENTORAI_PATHS;

    if (!host || !Array.isArray(paths)) return;

    const manifest = manifestMap();

    host.innerHTML = paths.map((path) => build(path, manifest)).join("");
  }

  /* ---------- API pública ---------- */

  MentorAI.Paths = {
    pathProgress,
    stepLessons,
    render: () => renderInto("paths", pathHtml),
    renderHome: () => renderInto("home-paths", pathCardHtml),
  };
})();
