/* ============================================================
   MentorAI — Cursos: colecciones temáticas
   Sin dependencias. Funciona por file://. Parte de window.MentorAI.
   ============================================================ */

(function () {
  "use strict";

  var MentorAI = (window.MentorAI = window.MentorAI || {});

  /* ---------- Cursos (colecciones temáticas) ----------
     Lee window.MENTORAI_COURSES (cursos con módulos y lecciones) y lo
     cruza con el manifest (estado y metadatos) y con Progress (lo ya
     completado). Pinta las tarjetas de curso de la home y, por separado,
     la página de un curso (curso.html?slug=...). */
  MentorAI.Courses = (function () {
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

    function modulesOf(course) {
      if (Array.isArray(course.modules)) {
        return course.modules;
      }

      return [{ title: "", summary: "", lessons: course.lessons || [] }];
    }

    function lessonSlugsOf(course) {
      const slugs = [];

      modulesOf(course).forEach(function (module) {
        (module.lessons || []).forEach(function (slug) {
          slugs.push(slug);
        });
      });

      return slugs;
    }

    function progressOf(course, manifest) {
      const slugs = lessonSlugsOf(course);
      const published = slugs.filter(function (slug) {
        return isPublished(manifest[slug]);
      });
      const done = published.filter(function (slug) {
        return MentorAI.Progress.has(slug);
      });

      return {
        total: slugs.length,
        published: published.length,
        done: done.length,
        percent: published.length
          ? Math.round((done.length / published.length) * 100)
          : 0,
      };
    }

    function buildLesson(slug, manifest, position, fromRoot) {
      const tutorial = manifest[slug];
      const published = isPublished(tutorial);
      const soon = Boolean(tutorial) && tutorial.status === "soon";
      const done = published && MentorAI.Progress.has(slug);
      const title = escapeHtml((tutorial && tutorial.title) || slug);

      const marker = done
        ? '<span class="step__marker step__marker--done">' + CHECK_SVG + "</span>"
        : '<span class="step__marker">' + position + "</span>";

      let body;
      let tag;

      if (published) {
        const href = fromRoot
          ? tutorial.href
          : tutorial.href.substring(tutorial.href.lastIndexOf("/") + 1);
        body = '<a class="step__title" href="' + escapeHtml(href) + '">' + title + "</a>";
        tag = done
          ? '<span class="step__tag step__tag--done">Completado</span>'
          : '<span class="step__meta">' + escapeHtml(tutorial.minutes) + " min</span>";
      }

      if (soon) {
        body = '<span class="step__title is-muted">' + title + "</span>";
        tag = '<span class="step__tag">Próximamente</span>';
      }

      if (!published && !soon) {
        body = '<span class="step__title is-muted">' + title + "</span>";
        tag = '<span class="step__tag">Planificado</span>';
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

    function buildModule(module, manifest, index) {
      const published = (module.lessons || []).filter(function (slug) {
        return isPublished(manifest[slug]);
      });
      const done = published.filter(function (slug) {
        return MentorAI.Progress.has(slug);
      });
      const percent = published.length
        ? Math.round((done.length / published.length) * 100)
        : 0;
      const label = published.length
        ? done.length + " / " + published.length
        : "Próximamente";

      const rows = (module.lessons || [])
        .map(function (slug, position) {
          return buildLesson(slug, manifest, position + 1, true);
        })
        .join("");

      const heading = module.title
        ? '<span class="pillar__num">' +
          (index + 1) +
          "</span>" +
          '<div class="pillar__headings">' +
          '<h3 class="pillar__title">' +
          escapeHtml(module.title) +
          "</h3>" +
          (module.summary
            ? '<p class="pillar__summary">' + escapeHtml(module.summary) + "</p>"
            : "") +
          "</div>" +
          '<span class="pillar__progress">' +
          label +
          "</span>"
        : "";

      return (
        '<section class="pillar">' +
        (heading ? '<header class="pillar__head">' + heading + "</header>" : "") +
        '<div class="pillar__bar"><span style="width:' +
        percent +
        '%"></span></div>' +
        '<ol class="steps">' +
        rows +
        "</ol>" +
        "</section>"
      );
    }

    function buildCourseCard(course, manifest) {
      const stats = progressOf(course, manifest);
      const icon = MentorAI.Catalog.iconFor(course.icon);
      const lessonsLabel =
        stats.published === stats.total
          ? stats.total + " lecciones"
          : stats.published + " de " + stats.total + " lecciones";

      return (
        '<a class="course-card" href="curso.html?slug=' +
        encodeURIComponent(course.slug) +
        '"><div class="course-card__top"><span class="course-card__icon">' +
        icon +
        '</span><span class="course-card__progress">' +
        stats.done +
        " / " +
        stats.published +
        "</span></div>" +
        '<h3 class="course-card__title">' +
        escapeHtml(course.title) +
        "</h3>" +
        '<p class="course-card__desc">' +
        escapeHtml(course.summary) +
        "</p>" +
        '<div class="course-card__bar"><span style="width:' +
        stats.percent +
        '%"></span></div>' +
        '<div class="course-card__meta"><span>' +
        escapeHtml(lessonsLabel) +
        "</span><span>" +
        escapeHtml(course.level || "") +
        "</span></div></a>"
      );
    }

    function courseBySlug(slug) {
      return (window.MENTORAI_COURSES || []).filter(function (course) {
        return course.slug === slug;
      })[0];
    }

    return {
      lessonSlugs: function () {
        const slugs = {};

        (window.MENTORAI_COURSES || []).forEach(function (course) {
          lessonSlugsOf(course).forEach(function (slug) {
            slugs[slug] = true;
          });
        });

        return slugs;
      },
      render: function () {
        const host = document.getElementById("courses");
        const courses = window.MENTORAI_COURSES;

        if (!host || !Array.isArray(courses)) {
          return;
        }

        const manifest = manifestMap();

        host.innerHTML = courses
          .map(function (course) {
            return buildCourseCard(course, manifest);
          })
          .join("");
      },
      renderCoursePage: function () {
        const host = document.getElementById("course");

        if (!host) {
          return;
        }

        const params = new URLSearchParams(window.location.search);
        const course = courseBySlug(params.get("slug"));

        if (!course) {
          host.innerHTML =
            '<p class="course-empty">No encontramos ese curso. <a href="index.html">Volver al inicio</a>.</p>';
          return;
        }

        const manifest = manifestMap();
        const render = function () {
          const stats = progressOf(course, manifest);

          document.title = course.title + " — MentorAI";

          const modulesHtml = modulesOf(course)
            .map(function (module, index) {
              return buildModule(module, manifest, index);
            })
            .join("");

          const resetButton = stats.done
            ? '<button type="button" class="course-hero__reset">Reiniciar progreso</button>'
            : "";

          host.innerHTML =
            '<header class="course-hero">' +
            '<a class="course-hero__back" href="cursos.html">← Todos los cursos</a>' +
            '<span class="eyebrow">Curso</span>' +
            '<h1 class="course-hero__title">' +
            escapeHtml(course.title) +
            "</h1>" +
            '<p class="course-hero__lead">' +
            escapeHtml(course.summary) +
            "</p>" +
            '<div class="course-hero__meta"><span>' +
            stats.published +
            " lecciones</span><span>" +
            escapeHtml(course.level || "") +
            "</span><span>" +
            stats.done +
            " / " +
            stats.published +
            " completadas</span></div>" +
            '<div class="course-hero__bar"><span style="width:' +
            stats.percent +
            '%"></span></div>' +
            resetButton +
            "</header>" +
            '<div class="course-modules">' +
            modulesHtml +
            "</div>";

          const resetEl = host.querySelector(".course-hero__reset");

          if (resetEl) {
            resetEl.addEventListener("click", function () {
              const slugs = lessonSlugsOf(course);

              MentorAI.Progress.remove(slugs);
              MentorAI.Reading.clear(slugs);
              render();
            });
          }
        };

        render();
      },
    };
  })();
})();
