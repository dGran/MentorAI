/* ============================================================
   MentorAI — Cursos: colecciones temáticas
   Lee window.MENTORAI_COURSES (cursos con módulos y lecciones) y lo cruza
   con el manifiesto (estado y metadatos) y con Progress (lo completado).
   Pinta las tarjetas de cursos.html y la ficha de curso.html?slug=...
   Sin dependencias. Funciona por file://. Parte de window.MentorAI.
   ============================================================ */

(function () {
  "use strict";

  const MentorAI = (window.MentorAI = window.MentorAI || {});

  const ALL_LEVELS = "all";
  const ALL_LEVELS_LABEL = "Todos";
  const LEVEL_FILTER_LABEL = "Filtrar cursos por nivel";
  const LEVEL_FILTER_CLASS = "course-filters";

  let selectedLevel = ALL_LEVELS;

  const RESET_COURSE_MESSAGE = "Progreso del curso reiniciado.";
  const CHECK_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

  /* ---------- Datos ---------- */

  const manifestMap = () =>
    Object.fromEntries((window.ACADEMIA_TUTORIALS ?? []).map((t) => [t.slug, t]));

  const isPublished = (tutorial) => Boolean(tutorial) && tutorial.status !== "soon";

  const courseBySlug = (slug) =>
    (window.MENTORAI_COURSES ?? []).find((course) => course.slug === slug);

  /* Un curso sin módulos se trata como uno con un módulo sin título, para
     que el resto del código no tenga que distinguir los dos casos. */
  const modulesOf = (course) =>
    Array.isArray(course.modules)
      ? course.modules
      : [{ title: "", summary: "", lessons: course.lessons ?? [] }];

  const lessonSlugsOf = (course) =>
    modulesOf(course).flatMap((module) => module.lessons ?? []);

  function progressOf(course, manifest) {
    const slugs = lessonSlugsOf(course);
    const published = slugs.filter((slug) => isPublished(manifest[slug]));
    const done = published.filter((slug) => MentorAI.Progress.has(slug));

    return {
      total: slugs.length,
      published: published.length,
      done: done.length,
      percent: published.length ? Math.round((done.length / published.length) * 100) : 0,
    };
  }

  /* ---------- Lección ---------- */

  function lessonHtml(slug, manifest, position, fromRoot) {
    const escapeHtml = MentorAI.escapeHtml;
    const tutorial = manifest[slug];
    const published = isPublished(tutorial);
    const soon = tutorial?.status === "soon";
    const done = published && MentorAI.Progress.has(slug);
    const title = escapeHtml(tutorial?.title ?? slug);

    const marker = done
      ? `<span class="step__marker step__marker--done">${CHECK_SVG}</span>`
      : `<span class="step__marker">${position}</span>`;

    let body = `<span class="step__title is-muted">${title}</span>`;
    let tag = `<span class="step__tag">${soon ? "Próximamente" : "Planificado"}</span>`;

    if (published) {
      const href = fromRoot
        ? tutorial.href
        : tutorial.href.slice(tutorial.href.lastIndexOf("/") + 1);

      body = `<a class="step__title" href="${escapeHtml(href)}">${title}</a>`;
      tag = done
        ? '<span class="step__tag step__tag--done">Completado</span>'
        : `<span class="step__meta">${escapeHtml(tutorial.minutes)} min</span>`;
    }

    return `<li class="step${published ? "" : " step--pending"}${
      done ? " step--done" : ""
    }">${marker}${body}${tag}</li>`;
  }

  /* ---------- Módulo ---------- */

  function moduleHtml(module, manifest, index) {
    const escapeHtml = MentorAI.escapeHtml;
    const lessons = module.lessons ?? [];
    const published = lessons.filter((slug) => isPublished(manifest[slug]));
    const done = published.filter((slug) => MentorAI.Progress.has(slug));
    const percent = published.length ? Math.round((done.length / published.length) * 100) : 0;
    const label = published.length ? `${done.length} / ${published.length}` : "Próximamente";

    const rows = lessons
      .map((slug, position) => lessonHtml(slug, manifest, position + 1, true))
      .join("");

    const heading = module.title
      ? `<header class="pillar__head">
          <span class="pillar__num">${index + 1}</span>
          <div class="pillar__headings">
            <h3 class="pillar__title">${escapeHtml(module.title)}</h3>
            ${module.summary ? `<p class="pillar__summary">${escapeHtml(module.summary)}</p>` : ""}
          </div>
          <span class="pillar__progress">${label}</span>
        </header>`
      : "";

    return `<section class="pillar">
      ${heading}
      <div class="pillar__bar"><span style="width:${percent}%"></span></div>
      <ol class="steps">${rows}</ol>
    </section>`;
  }

  /* ---------- Tarjeta de curso ---------- */

  function courseCardHtml(course, manifest) {
    const { escapeHtml, Icons } = MentorAI;
    const stats = progressOf(course, manifest);
    const lessonsLabel =
      stats.published === stats.total
        ? `${stats.total} lecciones`
        : `${stats.published} de ${stats.total} lecciones`;

    return `<a class="course-card" href="curso.html?slug=${encodeURIComponent(course.slug)}" data-level="${escapeHtml(course.level ?? "")}">
      <div class="course-card__top">
        <span class="course-card__icon">${Icons.for(course.icon)}</span>
        <span class="course-card__progress">${stats.done} / ${stats.published}</span>
      </div>
      <h3 class="course-card__title">${escapeHtml(course.title)}</h3>
      <p class="course-card__desc">${escapeHtml(course.summary)}</p>
      <div class="course-card__bar"><span style="width:${stats.percent}%"></span></div>
      <div class="course-card__meta">
        <span>${escapeHtml(lessonsLabel)}</span>
        <span>${escapeHtml(course.level ?? "")}</span>
      </div>
      ${MentorAI.Exams?.badgeHtml(course) ?? ""}
    </a>`;
  }

  /* ---------- Ficha de curso ---------- */

  function routesOf(course) {
    return (window.MENTORAI_PATHS ?? [])
      .map((path) => {
        const steps = path.steps ?? [];
        const position = steps.findIndex((step) => step.type === "course" && step.ref === course.slug);

        return position === -1 ? null : { path, position: position + 1, total: steps.length };
      })
      .filter(Boolean);
  }

  function routesHtml(course) {
    const escapeHtml = MentorAI.escapeHtml;
    const routes = routesOf(course);

    if (routes.length === 0) return "";

    const items = routes
      .map(
        ({ path, position, total }) =>
          `<li><a href="rutas.html#ruta-${encodeURIComponent(path.slug)}">${escapeHtml(path.title)}</a> · paso ${position} de ${total}</li>`
      )
      .join("");

    return `<div class="course-hero__routes"><span>${routes.length === 1 ? "En la ruta" : "En las rutas"}</span><ul>${items}</ul></div>`;
  }

  function courseHeroHtml(course, stats) {
    const escapeHtml = MentorAI.escapeHtml;
    const resetButton = stats.done
      ? '<button type="button" class="course-hero__reset">Reiniciar progreso</button>'
      : "";

    return `<header class="course-hero">
      <a class="course-hero__back" href="cursos.html">← Todos los cursos</a>
      <span class="eyebrow">Curso</span>
      <h1 class="course-hero__title">${escapeHtml(course.title)}</h1>
      <p class="course-hero__lead">${escapeHtml(course.summary)}</p>
      <div class="course-hero__meta">
        <span>${stats.published} lecciones</span>
        <span>${escapeHtml(course.level ?? "")}</span>
        <span>${stats.done} / ${stats.published} completadas</span>
      </div>
      ${routesHtml(course)}
      <div class="course-hero__bar"><span style="width:${stats.percent}%"></span></div>
      <div class="course-hero__progress">
        <span class="course-hero__percent">${stats.percent}% completado</span>
        ${resetButton}
      </div>
    </header>`;
  }

  function renderCoursePage() {
    const host = document.getElementById("course");

    if (!host) return;

    const slug = new URLSearchParams(window.location.search).get("slug");
    const course = courseBySlug(slug);

    if (!course) {
      host.innerHTML =
        '<p class="course-empty">No encontramos ese curso. <a href="index.html">Volver al inicio</a>.</p>';
      return;
    }

    const manifest = manifestMap();

    const paint = () => {
      const stats = progressOf(course, manifest);

      document.title = `${course.title} — MentorAI`;

      const modules = modulesOf(course)
        .map((module, index) => moduleHtml(module, manifest, index))
        .join("");

      host.innerHTML =
        courseHeroHtml(course, stats) +
        `<div class="course-modules">${modules}</div>` +
        (MentorAI.Exams?.panelHtml(course) ?? "") +
        (MentorAI.Practica?.panelHtml(course) ?? "");

      MentorAI.Practica?.bind(host, course);

      host.querySelector(".course-hero__reset")?.addEventListener("click", () => {
        const slugs = lessonSlugsOf(course);
        const progressBefore = MentorAI.Progress.list();
        const readingBefore = MentorAI.Reading.all();

        MentorAI.Progress.remove(slugs);
        MentorAI.Reading.clear(slugs);
        paint();
        MentorAI.offerUndo?.(RESET_COURSE_MESSAGE, () => {
          MentorAI.Progress.restore(progressBefore);
          MentorAI.Reading.restore(readingBefore);
          paint();
          host.querySelector(".course-hero__reset")?.focus();
        });
      });
    };

    paint();
  }

  function render() {
    const host = document.getElementById("courses");
    const courses = window.MENTORAI_COURSES;

    if (!host || !Array.isArray(courses)) return;

    const manifest = manifestMap();

    host.innerHTML = courses.map((course) => courseCardHtml(course, manifest)).join("");
    renderLevelFilter(host, courses);
  }

  function levelChipHtml(level, label, count, isActive) {
    const escapeHtml = MentorAI.escapeHtml;

    return `<button type="button" class="chip${isActive ? " is-active" : ""}" data-level-filter="${escapeHtml(level)}" aria-pressed="${isActive}">${escapeHtml(label)}<span class="chip__count">${count}</span></button>`;
  }

  function renderLevelFilter(host, courses) {
    const counts = {};

    for (const course of courses) {
      if (course.level) counts[course.level] = (counts[course.level] ?? 0) + 1;
    }

    const levels = MentorAI.CatalogFilters.LEVEL_ORDER.filter((level) => counts[level]);

    if (levels.length < 2) return;

    host.parentElement.querySelector(`.${LEVEL_FILTER_CLASS}`)?.remove();

    const bar = document.createElement("div");
    bar.className = `filters ${LEVEL_FILTER_CLASS}`;
    bar.setAttribute("role", "group");
    bar.setAttribute("aria-label", LEVEL_FILTER_LABEL);
    bar.innerHTML = [
      levelChipHtml(ALL_LEVELS, ALL_LEVELS_LABEL, courses.length, selectedLevel === ALL_LEVELS),
      ...levels.map((level) => levelChipHtml(level, level, counts[level], selectedLevel === level)),
    ].join("");
    host.before(bar);
    applyLevelFilter(host, bar);

    bar.addEventListener("click", (event) => {
      const chip = event.target.closest("[data-level-filter]");

      if (!chip) return;

      selectedLevel = chip.dataset.levelFilter;
      applyLevelFilter(host, bar);
    });
  }

  function applyLevelFilter(host, bar) {
    for (const chip of bar.querySelectorAll("[data-level-filter]")) {
      const isActive = chip.dataset.levelFilter === selectedLevel;

      chip.classList.toggle("is-active", isActive);
      chip.setAttribute("aria-pressed", String(isActive));
    }

    for (const card of host.querySelectorAll(".course-card")) {
      const isHidden = selectedLevel !== ALL_LEVELS && card.dataset.level !== selectedLevel;

      card.hidden = isHidden;
    }
  }

  /* ---------- API pública ---------- */

  MentorAI.Courses = {
    routesOf,
    lessonSlugs: () =>
      Object.fromEntries(
        (window.MENTORAI_COURSES ?? []).flatMap(lessonSlugsOf).map((slug) => [slug, true])
      ),
    render,
    renderCoursePage,
  };
})();
