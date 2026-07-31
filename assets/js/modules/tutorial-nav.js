/* ============================================================
   MentorAI — Navegación del tutorial dentro de su curso
   Miga de pan, anterior/siguiente y "más en este módulo".
   Sin dependencias. Funciona por file://. Parte de window.MentorAI.
   ============================================================ */

(function () {
  "use strict";

  const MentorAI = (window.MentorAI = window.MentorAI || {});

  /* ---------- Helpers ---------- */

  function escapeAttr(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function basename(href) {
    const value = String(href ?? "");

    return value.slice(value.lastIndexOf("/") + 1);
  }

  function courseHref(course) {
    return `../curso.html?slug=${encodeURIComponent(course.slug)}`;
  }

  /* ---------- Índice de lecciones ----------
     Aplana todos los cursos a una secuencia lineal de lecciones, para poder
     situar la actual y calcular sus vecinas. */

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
      ? `${escapeAttr(course.title)} · ${escapeAttr(module.title)}`
      : escapeAttr(course.title);

    return `<p class="route-nav__crumb"><a href="${courseHref(course)}">${label}</a> · lección ${
      position + 1
    } de ${(module.lessons || []).length}</p>`;
  }

  function neighborsHtml(prev, next, course) {
    const prevLink = prev
      ? `<a href="${escapeAttr(basename(prev.href))}"><small>← Anterior</small><b>${escapeAttr(
          prev.title
        )}</b></a>`
      : "";

    const nextLink = next
      ? `<a href="${escapeAttr(
          basename(next.href)
        )}" class="next"><small>Siguiente →</small><b>${escapeAttr(next.title)}</b></a>`
      : `<a href="${courseHref(
          course
        )}" class="next"><small>Fin del curso →</small><b>Volver al curso</b></a>`;

    return `<div class="tutorial-nav">${prevLink}${nextLink}</div>`;
  }

  function relatedHtml(related, title) {
    if (related.length === 0) return "";

    const items = related
      .map(
        (tutorial) =>
          `<li><a href="${escapeAttr(basename(tutorial.href))}">${escapeAttr(
            tutorial.title
          )}<span>${escapeAttr(tutorial.minutes)} min</span></a></li>`
      )
      .join("");

    return `<div class="route-related"><p class="route-related__title">Más en «${escapeAttr(
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
      course
    )}${relatedHtml(related, module.title || course.title)}</nav>`;
  }

  function injectRouteNav(slug, prose) {
    const sequence = courseSequence();
    const index = sequence.findIndex((step) => step.slug === slug);

    if (index === -1) return;

    const html = buildRouteNav(manifestBySlug(), sequence, index);
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
