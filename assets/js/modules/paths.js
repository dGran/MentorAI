/* ============================================================
   MentorAI — Rutas de aprendizaje (itinerarios)
   Sin dependencias. Funciona por file://. Parte de window.MentorAI.
   Lee window.MENTORAI_PATHS y lo cruza con los cursos, el manifest
   y el progreso. Pinta la página de rutas (rutas.html → #paths) y
   una sección de entrada en el inicio (index.html → #home-paths).
   ============================================================ */

(function () {
  "use strict";

  var MentorAI = (window.MentorAI = window.MentorAI || {});

  MentorAI.Paths = (function () {
    const CHECK_SVG =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

    function escapeHtml(text) {
      return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    function manifestMap() {
      const map = {};

      (window.ACADEMIA_TUTORIALS || []).forEach(function (tutorial) {
        map[tutorial.slug] = tutorial;
      });

      return map;
    }

    function isPublished(tutorial) {
      return Boolean(tutorial) && tutorial.status !== "soon";
    }

    function courseBySlug(slug) {
      return (window.MENTORAI_COURSES || []).filter(function (course) {
        return course.slug === slug;
      })[0];
    }

    function courseLessons(course) {
      if (!course) {
        return [];
      }

      if (Array.isArray(course.modules)) {
        return course.modules.reduce(function (all, module) {
          return all.concat(module.lessons || []);
        }, []);
      }

      return course.lessons || [];
    }

    /* Slugs de tutorial que componen un paso: las lecciones de un
       curso, o el propio artículo. */
    function stepLessons(step) {
      if (step.type === "course") {
        return courseLessons(courseBySlug(step.ref));
      }

      return [step.ref];
    }

    function pathProgress(path, manifest) {
      let published = 0;
      let done = 0;

      (path.steps || []).forEach(function (step) {
        stepLessons(step).forEach(function (slug) {
          if (isPublished(manifest[slug])) {
            published += 1;

            if (MentorAI.Progress.has(slug)) {
              done += 1;
            }
          }
        });
      });

      return {
        published: published,
        done: done,
        percent: published ? Math.round((done / published) * 100) : 0,
      };
    }

    function stepDone(step, manifest) {
      const lessons = stepLessons(step).filter(function (slug) {
        return isPublished(manifest[slug]);
      });

      if (lessons.length === 0) {
        return false;
      }

      return lessons.every(function (slug) {
        return MentorAI.Progress.has(slug);
      });
    }

    function buildCourseStep(step, manifest, position) {
      const course = courseBySlug(step.ref);

      if (!course) {
        return "";
      }

      const lessons = courseLessons(course).filter(function (slug) {
        return isPublished(manifest[slug]);
      });
      const completed = lessons.filter(function (slug) {
        return MentorAI.Progress.has(slug);
      }).length;
      const allDone = lessons.length > 0 && completed === lessons.length;
      const icon = MentorAI.Catalog.iconFor(course.icon);

      const marker = allDone
        ? '<span class="step__marker step__marker--done">' + CHECK_SVG + "</span>"
        : '<span class="step__marker step__marker--icon">' + icon + "</span>";

      return (
        '<li class="step step--course' +
        (allDone ? " step--done" : "") +
        '">' +
        marker +
        '<a class="step__title" href="curso.html?slug=' +
        encodeURIComponent(course.slug) +
        '">' +
        escapeHtml(course.title) +
        '<small class="step__kind">Curso</small></a>' +
        '<span class="step__tag">' +
        completed +
        " / " +
        lessons.length +
        " lecciones</span>" +
        "</li>"
      );
    }

    function buildArticleStep(step, manifest, position) {
      const tutorial = manifest[step.ref];
      const published = isPublished(tutorial);
      const soon = Boolean(tutorial) && tutorial.status === "soon";
      const done = published && MentorAI.Progress.has(step.ref);
      const title = escapeHtml((tutorial && tutorial.title) || step.ref);

      const marker = done
        ? '<span class="step__marker step__marker--done">' + CHECK_SVG + "</span>"
        : '<span class="step__marker">' + position + "</span>";

      let body;
      let tag;

      if (published) {
        body = '<a class="step__title" href="' + escapeHtml(tutorial.href) + '">' + title + "</a>";
        tag = done
          ? '<span class="step__tag step__tag--done">Completado</span>'
          : '<span class="step__meta">' + escapeHtml(tutorial.minutes) + " min</span>";
      } else {
        body = '<span class="step__title is-muted">' + title + "</span>";
        tag = '<span class="step__tag">' + (soon ? "Próximamente" : "Planificado") + "</span>";
      }

      return (
        '<li class="step' +
        (published ? "" : " step--pending") +
        (done ? " step--done" : "") +
        '">' +
        marker +
        body +
        tag +
        "</li>"
      );
    }

    function buildStep(step, manifest, position) {
      return step.type === "course"
        ? buildCourseStep(step, manifest, position)
        : buildArticleStep(step, manifest, position);
    }

    function buildPath(path, manifest) {
      const stats = pathProgress(path, manifest);
      const icon = MentorAI.Catalog.iconFor(path.icon);

      const steps = (path.steps || [])
        .map(function (step, index) {
          return buildStep(step, manifest, index + 1);
        })
        .join("");

      return (
        '<section class="path" id="ruta-' +
        encodeURIComponent(path.slug) +
        '">' +
        '<header class="path__head">' +
        '<span class="path__icon">' +
        icon +
        "</span>" +
        '<div class="path__headings">' +
        '<h2 class="path__title">' +
        escapeHtml(path.title) +
        "</h2>" +
        '<p class="path__summary">' +
        escapeHtml(path.summary) +
        "</p>" +
        "</div>" +
        '<span class="path__progress">' +
        stats.done +
        " / " +
        stats.published +
        "</span>" +
        "</header>" +
        '<div class="path__bar"><span style="width:' +
        stats.percent +
        '%"></span></div>' +
        '<ol class="steps">' +
        steps +
        "</ol>" +
        "</section>"
      );
    }

    function buildPathCard(path, manifest) {
      const stats = pathProgress(path, manifest);
      const icon = MentorAI.Catalog.iconFor(path.icon);

      return (
        '<a class="path-card" href="rutas.html#ruta-' +
        encodeURIComponent(path.slug) +
        '"><div class="path-card__top"><span class="path-card__icon">' +
        icon +
        '</span><span class="path-card__progress">' +
        stats.percent +
        "%</span></div>" +
        '<h3 class="path-card__title">' +
        escapeHtml(path.title) +
        "</h3>" +
        '<p class="path-card__desc">' +
        escapeHtml(path.summary) +
        "</p>" +
        '<div class="path-card__bar"><span style="width:' +
        stats.percent +
        '%"></span></div>' +
        '<span class="path-card__steps">' +
        (path.steps || []).length +
        " pasos</span></a>"
      );
    }

    return {
      render: function () {
        const host = document.getElementById("paths");
        const paths = window.MENTORAI_PATHS;

        if (!host || !Array.isArray(paths)) {
          return;
        }

        const manifest = manifestMap();

        host.innerHTML = paths
          .map(function (path) {
            return buildPath(path, manifest);
          })
          .join("");
      },
      renderHome: function () {
        const host = document.getElementById("home-paths");
        const paths = window.MENTORAI_PATHS;

        if (!host || !Array.isArray(paths)) {
          return;
        }

        const manifest = manifestMap();

        host.innerHTML = paths
          .map(function (path) {
            return buildPathCard(path, manifest);
          })
          .join("");
      },
    };
  })();
})();
