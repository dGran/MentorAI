/* ============================================================
   MentorAI — Navegación del tutorial dentro de su curso
   Miga de pan, anterior/siguiente y "más en este módulo".
   Sin dependencias. Funciona por file://. Parte de window.MentorAI.
   ============================================================ */

(function () {
  "use strict";

  const MentorAI = (window.MentorAI = window.MentorAI || {});

  const escapeHtml = (text) => MentorAI.escapeHtml(text);

  function basename(href) {
    const value = String(href ?? "");

    return value.slice(value.lastIndexOf("/") + 1);
  }

  function courseHref(course) {
    return `../curso.html?slug=${encodeURIComponent(course.slug)}`;
  }

  function courseSequence() {
    return (window.MENTORAI_COURSES || []).flatMap((course) => {
      const modules = Array.isArray(course.modules)
        ? course.modules
        : [{ title: "", lessons: course.lessons || [] }];

      return modules.flatMap((module) =>
        (module.lessons || []).map((slug, position) => ({
          slug,
          course,
          module,
          position,
        }))
      );
    });
  }

  function manifestBySlug() {
    return Object.fromEntries(
      (window.ACADEMIA_TUTORIALS || []).map((tutorial) => [tutorial.slug, tutorial])
    );
  }

  function isPublished(tutorial) {
    return Boolean(tutorial) && tutorial.status !== "soon";
  }

  function courseOfSlug(slug) {
    return courseSequence().find((step) => step.slug === slug)?.course ?? null;
  }

  /* ---------- Miga de pan ---------- */

  function injectCourseCrumb(slug) {
    const breadcrumb = document.querySelector(".breadcrumb");

    if (!breadcrumb) return;

    const course = courseOfSlug(slug);
    const topicSpan = breadcrumb.querySelector("span");
    const separator = breadcrumb.querySelector("svg");

    if (!course || !topicSpan || !separator) return;

    const link = document.createElement("a");
    link.href = courseHref(course);
    link.textContent = course.title;

    breadcrumb.insertBefore(link, topicSpan);
    breadcrumb.insertBefore(separator.cloneNode(true), topicSpan);
  }

  /* ---------- Navegación de ruta ---------- */

  function neighbor(manifest, sequence, fromIndex, direction) {
    for (
      let index = fromIndex + direction;
      index >= 0 && index < sequence.length;
      index += direction
    ) {
      const tutorial = manifest[sequence[index].slug];

      if (isPublished(tutorial)) return tutorial;
    }

    return null;
  }

  function relatedInModule(manifest, module, slug) {
    return (module.lessons || [])
      .filter((lesson) => lesson !== slug && isPublished(manifest[lesson]))
      .map((lesson) => manifest[lesson]);
  }

  function crumbHtml({ course, module, position }) {
    const label = module.title
      ? `${escapeHtml(course.title)} · ${escapeHtml(module.title)}`
      : escapeHtml(course.title);

    return `<p class="route-nav__crumb"><a href="${courseHref(course)}">${label}</a> · lección ${
      position + 1
    } de ${(module.lessons || []).length}</p>`;
  }

  function examIsOnThisLesson(course, slug) {
    const questions = (window.MENTORAI_QUIZZES ?? {})[course.slug]?.questions ?? [];
    const lessons = courseSequence()
      .filter((step) => step.course === course)
      .map((step) => step.slug);

    return questions.length > 0 && lessons.at(-1) === slug;
  }

  function endOfCourseHtml(course, slug) {
    if (examIsOnThisLesson(course, slug)) {
      return `<a href="#quiz" class="next"><small>Fin del curso →</small><b>Haz el examen del curso</b></a>`;
    }

    return `<a href="${courseHref(course)}" class="next"><small>Fin del curso →</small><b>Volver al curso</b></a>`;
  }

  function neighborsHtml(prev, next, course, slug) {
    const prevLink = prev
      ? `<a href="${escapeHtml(basename(prev.href))}"><small>← Anterior</small><b>${escapeHtml(
          prev.title
        )}</b></a>`
      : "";

    const nextLink = next
      ? `<a href="${escapeHtml(
          basename(next.href)
        )}" class="next"><small>Siguiente →</small><b>${escapeHtml(next.title)}</b></a>`
      : endOfCourseHtml(course, slug);

    return `<div class="tutorial-nav">${prevLink}${nextLink}</div>`;
  }

  function relatedHtml(related, title) {
    if (related.length === 0) return "";

    const items = related
      .map(
        (tutorial) =>
          `<li><a href="${escapeHtml(basename(tutorial.href))}">${escapeHtml(
            tutorial.title
          )}<span>${escapeHtml(tutorial.minutes)} min</span></a></li>`
      )
      .join("");

    return `<div class="route-related"><p class="route-related__title">Más en «${escapeHtml(
      title
    )}»</p><ul>${items}</ul></div>`;
  }

  function buildRouteNav(manifest, sequence, index) {
    const current = sequence[index];
    const { course, module } = current;
    const prev = neighbor(manifest, sequence, index, -1);
    const next = neighbor(manifest, sequence, index, 1);
    const related = relatedInModule(manifest, module, current.slug);

    return `<nav class="route-nav">${crumbHtml(current)}${neighborsHtml(
      prev,
      next,
      course,
      current.slug
    )}${relatedHtml(related, module.title || course.title)}</nav>`;
  }

  function injectRouteNav(slug, prose) {
    const sequence = courseSequence();
    const current = sequence.find((step) => step.slug === slug);

    if (!current) return;

    const courseSteps = sequence.filter((step) => step.course === current.course);
    const index = courseSteps.findIndex((step) => step.slug === slug);
    const html = buildRouteNav(manifestBySlug(), courseSteps, index);
    const manualNav = prose.querySelector(".tutorial-nav");

    if (manualNav) {
      manualNav.insertAdjacentHTML("beforebegin", html);
      manualNav.remove();
      return;
    }

    prose.insertAdjacentHTML("beforeend", html);
  }

  /* ---------- API pública ---------- */

  MentorAI.TutorialNav = {
    courseOfSlug,
    courseSequence,
    injectCourseCrumb,
    injectRouteNav,
  };
})();
