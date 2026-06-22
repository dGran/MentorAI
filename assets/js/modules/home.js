/* ============================================================
   MentorAI — Portada: dashboard de inicio, buscador y stat del hero
   Sin dependencias. Funciona por file://. Parte de window.MentorAI.
   ============================================================ */

(function () {
  "use strict";

  var MentorAI = (window.MentorAI = window.MentorAI || {});

  /* ---------- Portada: dashboard de inicio ----------
     Cruza manifest + Reading + Progress + roadmap y pinta cuatro bloques:
     seguir viendo, novedades, destacados y el banner de ruta en curso.
     Tarjetas propias (ancla simple), sin acoplarse al wiring del catálogo. */
  MentorAI.Home = (function () {
    const MIN_PERCENT = 5;
    const DONE_PERCENT = 90;
    const SHELF_LIMIT = 4;

    function escapeHtml(text) {
      return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    function publishedTutorials() {
      return (window.ACADEMIA_TUTORIALS || []).filter(function (tutorial) {
        return tutorial.status !== "soon";
      });
    }

    function manifestMap() {
      const map = {};

      (window.ACADEMIA_TUTORIALS || []).forEach(function (tutorial) {
        map[tutorial.slug] = tutorial;
      });

      return map;
    }

    function metaLine(tutorial) {
      return (
        "<span>" +
        MentorAI.Catalog.clockSvg +
        escapeHtml(tutorial.minutes) +
        " min</span><span>" +
        MentorAI.Catalog.levelSvg +
        escapeHtml(tutorial.level) +
        "</span>"
      );
    }

    function miniCard(tutorial) {
      return (
        '<a class="mini-card" href="' +
        escapeHtml(tutorial.href) +
        '"><span class="mini-card__icon">' +
        MentorAI.Catalog.iconFor(tutorial.icon) +
        '</span><h4 class="mini-card__title">' +
        escapeHtml(tutorial.title) +
        '</h4><p class="mini-card__desc">' +
        escapeHtml(tutorial.description) +
        '</p><div class="mini-card__meta">' +
        metaLine(tutorial) +
        "</div></a>"
      );
    }

    function continueCard(tutorial, percent) {
      return (
        '<a class="continue-card" href="' +
        escapeHtml(tutorial.href) +
        '"><div class="continue-card__top"><span class="mini-card__icon">' +
        MentorAI.Catalog.iconFor(tutorial.icon) +
        '</span><span class="continue-card__percent">' +
        percent +
        '%</span></div><h4 class="mini-card__title">' +
        escapeHtml(tutorial.title) +
        '</h4><div class="continue-card__bar"><span style="width:' +
        percent +
        '%"></span></div></a>'
      );
    }

    function fillShelf(id, title, subtitle, innerHtml) {
      const host = document.getElementById(id);

      if (!host) {
        return;
      }

      host.innerHTML =
        '<header class="shelf__head"><div><h3 class="shelf__title">' +
        escapeHtml(title) +
        "</h3>" +
        (subtitle
          ? '<p class="shelf__sub">' + escapeHtml(subtitle) + "</p>"
          : "") +
        '</div></header><div class="rail">' +
        innerHtml +
        "</div>";
      host.hidden = false;
    }

    function hideShelf(id) {
      const host = document.getElementById(id);

      if (host) {
        host.hidden = true;
        host.innerHTML = "";
      }
    }

    function renderContinue(map) {
      const items = MentorAI.Reading.list()
        .filter(function (entry) {
          const tutorial = map[entry.slug];

          return (
            tutorial &&
            tutorial.status !== "soon" &&
            entry.percent >= MIN_PERCENT &&
            entry.percent < DONE_PERCENT &&
            !MentorAI.Progress.has(entry.slug)
          );
        })
        .slice(0, SHELF_LIMIT);

      if (items.length === 0) {
        hideShelf("home-continue");
        return;
      }

      const cards = items
        .map(function (entry) {
          return continueCard(map[entry.slug], entry.percent);
        })
        .join("");

      fillShelf("home-continue", "Seguir viendo", "Retoma donde lo dejaste", cards);
    }

    function renderNew(list) {
      const ordered = list
        .slice()
        .sort(function (a, b) {
          return String(b.date || "").localeCompare(String(a.date || ""));
        })
        .slice(0, SHELF_LIMIT);

      fillShelf(
        "home-new",
        "Novedades",
        "Lo último que hemos publicado",
        ordered.map(miniCard).join("")
      );
    }

    function renderPopular(list) {
      const popular = list.filter(function (tutorial) {
        return tutorial.popular === true;
      });

      if (popular.length === 0) {
        hideShelf("home-popular");
        return;
      }

      fillShelf(
        "home-popular",
        "Destacados",
        "Una buena puerta de entrada",
        popular.map(miniCard).join("")
      );
    }

    function courseLessonSlugs(course) {
      const slugs = [];
      const modules = Array.isArray(course.modules)
        ? course.modules
        : [{ lessons: course.lessons || [] }];

      modules.forEach(function (module) {
        (module.lessons || []).forEach(function (slug) {
          slugs.push(slug);
        });
      });

      return slugs;
    }

    function pendingCourse(map) {
      const courses = window.MENTORAI_COURSES || [];
      let target = null;

      courses.forEach(function (course) {
        if (target) {
          return;
        }

        const publishedLessons = courseLessonSlugs(course).filter(function (slug) {
          const tutorial = map[slug];
          return tutorial && tutorial.status !== "soon";
        });
        const pending = publishedLessons.filter(function (slug) {
          return !MentorAI.Progress.has(slug);
        });

        if (publishedLessons.length > 0 && pending.length > 0) {
          target = {
            course: course,
            next: map[pending[0]],
            done: publishedLessons.length - pending.length,
            total: publishedLessons.length,
          };
        }
      });

      return target;
    }

    function renderRoute(map) {
      const host = document.getElementById("home-route");

      if (!host) {
        return;
      }

      const target = pendingCourse(map);

      if (!target) {
        hideShelf("home-route");
        return;
      }

      host.hidden = false;
      host.innerHTML =
        '<div class="route-banner"><div class="route-banner__body">' +
        '<span class="route-banner__eyebrow">Curso en marcha</span>' +
        '<h3 class="route-banner__title">' +
        escapeHtml(target.course.title) +
        '</h3><p class="route-banner__sub">' +
        escapeHtml(target.course.summary) +
        '</p><p class="route-banner__progress">' +
        target.done +
        " / " +
        target.total +
        " completadas</p></div>" +
        '<div class="route-banner__cta"><a class="btn btn--primary" href="' +
        escapeHtml(target.next.href) +
        '">Continuar: ' +
        escapeHtml(target.next.title) +
        '</a><a class="btn btn--ghost" href="curso.html?slug=' +
        encodeURIComponent(target.course.slug) +
        '">Ver el curso</a></div></div>';
    }

    function render() {
      if (!document.getElementById("home-new")) {
        return;
      }

      const map = manifestMap();
      const list = publishedTutorials();

      renderContinue(map);
      renderNew(list);
      renderPopular(list);
      renderRoute(map);
    }

    function normalize(text) {
      return String(text)
        .toLowerCase()
        .normalize("NFD")
        .replace(new RegExp("[\\u0300-\\u036f]", "g"), "");
    }

    function searchHaystack(tutorial) {
      return normalize(
        [
          tutorial.title,
          tutorial.description,
          tutorial.topic,
          (tutorial.categories || []).join(" "),
          (tutorial.tags || []).join(" "),
        ].join(" ")
      );
    }

    function applySearch() {
      const input = document.getElementById("home-search");
      const host = document.getElementById("home-results");

      if (!input || !host) {
        return;
      }

      const term = input.value.trim();
      const query = normalize(term);

      if (query.length === 0) {
        host.hidden = true;
        host.innerHTML = "";
        render();
        return;
      }

      ["home-continue", "home-new", "home-popular", "home-route"].forEach(
        hideShelf
      );

      const matches = publishedTutorials().filter(function (tutorial) {
        return searchHaystack(tutorial).indexOf(query) !== -1;
      });

      host.hidden = false;

      if (matches.length === 0) {
        host.innerHTML =
          '<header class="shelf__head"><div><h3 class="shelf__title">Sin resultados</h3>' +
          '<p class="shelf__sub">Nada coincide con “' +
          escapeHtml(term) +
          '”. Prueba con otra palabra.</p></div></header>';
        return;
      }

      host.innerHTML =
        '<header class="shelf__head"><div><h3 class="shelf__title">Resultados</h3>' +
        '<p class="shelf__sub">' +
        matches.length +
        (matches.length === 1 ? " coincidencia" : " coincidencias") +
        " para “" +
        escapeHtml(term) +
        '”</p></div></header><div class="rail">' +
        matches.map(miniCard).join("") +
        "</div>";
    }

    function initSearch() {
      const input = document.getElementById("home-search");

      if (!input) {
        return;
      }

      input.addEventListener("input", applySearch);
    }

    return { render: render, initSearch: initSearch };
  })();

  /* ---------- Stat "Publicados" del hero ----------
     Vive en index.html (Inicio); el catálogo está ahora en su propia
     página, así que el conteo se fija aquí y no depende de MentorAI.Catalog.render. */
  function initHeroStat() {
    const publishedEl = document.querySelector("[data-stat-published]");
    const all = window.ACADEMIA_TUTORIALS;

    if (!publishedEl || !Array.isArray(all)) {
      return;
    }

    publishedEl.textContent = all.filter(function (tutorial) {
      return tutorial.status !== "soon";
    }).length;
  }

  MentorAI.initHeroStat = initHeroStat;
})();
