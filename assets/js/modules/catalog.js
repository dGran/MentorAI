/* ============================================================
   MentorAI — Catálogo (artículos) auto-generado desde el manifiesto
   Sin dependencias. Funciona por file://. Parte de window.MentorAI.
   ============================================================ */

(function () {
  "use strict";

  var MentorAI = (window.MentorAI = window.MentorAI || {});

  /* ---------- Catálogo auto-generado desde el manifiesto ----------
     Lee window.ACADEMIA_TUTORIALS y construye los filtros (con conteo
     por categoría) y las tarjetas. Añadir un tutorial = una entrada en
     tutorials/manifest.js; el catálogo se reorganiza solo.
     Filtra por categoría, por marcadores y por texto a la vez. */
  MentorAI.Catalog = (function () {
    const BOOKMARK_FILTER = "saved";
    const ALL = "all";
    const DURATION_THRESHOLD = 15;
    const LEVEL_ORDER = ["Principiante", "Intermedio", "Avanzado"];
    const state = {
      category: ALL,
      level: ALL,
      duration: ALL,
      tag: ALL,
      query: "",
    };
    let cardEls = [];
    let emptyEl = null;
    const ICONS = {
      bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="13 2 13 9 20 9"/><path d="M13 2 4 13h7l-1 9 9-13h-7z"/></svg>',
      signal:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg>',
      database:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
      shield:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
      code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
      default:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    };

    const CATEGORY_LABELS = {
      php: "PHP",
      runtime: "PHP por dentro",
      cultura: "Cultura dev",
      rendimiento: "Rendimiento",
      infra: "Infraestructura",
      mensajeria: "Mensajería",
      seguridad: "Seguridad",
      frontend: "Frontend",
      backend: "Backend",
      devops: "DevOps",
      bbdd: "Bases de datos",
      representacion: "Representación de datos",
      algoritmos: "Algoritmos",
      sistemas: "El sistema por debajo",
      redes: "Cómo viaja un dato",
      distribuidos: "Sistemas distribuidos",
      arquitectura: "Arquitectura",
      oop: "Orientación a objetos",
      testing: "Testing",
      ia: "Programar con IA",
    };

    const CLOCK_SVG =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';
    const LEVEL_SVG =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
    const STAR_SVG =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';

    function escapeHtml(text) {
      return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    function normalize(text) {
      return String(text)
        .toLowerCase()
        .normalize("NFD")
        .replace(new RegExp("[\\u0300-\\u036f]", "g"), "");
    }

    function labelFor(category) {
      return (
        CATEGORY_LABELS[category] ||
        category.charAt(0).toUpperCase() + category.slice(1)
      );
    }

    function isSoon(tutorial) {
      return tutorial.status === "soon";
    }

    function buildChips(tutorials, counts, categories) {
      let html =
        '<button class="chip is-active" data-filter="all">Todos' +
        '<span class="chip__count">' +
        tutorials.length +
        "</span></button>" +
        '<button class="chip chip--saved" data-filter="' +
        BOOKMARK_FILTER +
        '">' +
        STAR_SVG +
        "Guardados" +
        '<span class="chip__count">' +
        MentorAI.Bookmarks.count() +
        "</span></button>";

      categories.forEach(function (category) {
        html +=
          '<button class="chip" data-filter="' +
          category +
          '">' +
          labelFor(category) +
          '<span class="chip__count">' +
          counts[category] +
          "</span></button>";
      });

      return html;
    }

    function buildCard(tutorial) {
      const soon = isSoon(tutorial);
      const icon = ICONS[tutorial.icon] || ICONS.default;

      let badge;

      if (soon) {
        badge = '<span class="badge badge--level">Próximamente</span>';
      } else if (tutorial.featured) {
        badge = '<span class="badge badge--new">Nuevo</span>';
      } else {
        badge =
          '<span class="badge badge--level">' +
          escapeHtml(tutorial.level || "") +
          "</span>";
      }

      const tags = (tutorial.tags || [])
        .map(function (tag) {
          return '<span class="tag">' + escapeHtml(tag) + "</span>";
        })
        .join("");

      const meta = soon
        ? "<span>En preparación</span>"
        : "<span>" +
          CLOCK_SVG +
          escapeHtml(tutorial.minutes) +
          " min</span><span>" +
          LEVEL_SVG +
          escapeHtml(tutorial.level) +
          "</span>";

      const link = soon
        ? ""
        : '<a href="' +
          escapeHtml(tutorial.href) +
          '" class="card__link" aria-label="Abrir ' +
          escapeHtml(tutorial.title) +
          '"></a>';

      const refine = soon
        ? ""
        : '<button class="card__refine" type="button" data-refine-slug="' +
          escapeHtml(tutorial.slug) +
          '" data-refine-title="' +
          escapeHtml(tutorial.title) +
          '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>Refinar</button>';

      const bookmark = soon
        ? ""
        : '<button class="card__bookmark' +
          (MentorAI.Bookmarks.has(tutorial.slug) ? " is-saved" : "") +
          '" type="button" data-bookmark-slug="' +
          escapeHtml(tutorial.slug) +
          '" aria-label="Guardar tutorial" title="Guardar">' +
          STAR_SVG +
          "</button>";

      const searchText = normalize(
        [
          tutorial.title,
          tutorial.description,
          (tutorial.tags || []).join(" "),
          tutorial.topic || "",
          (tutorial.categories || []).join(" "),
          tutorial.level || "",
        ].join(" ")
      );

      return (
        '<article class="card ' +
        (soon ? "card--soon" : "") +
        '" data-categories="' +
        escapeHtml((tutorial.categories || []).join(" ")) +
        '" data-topic="' +
        escapeHtml(tutorial.topic || "") +
        '" data-level="' +
        escapeHtml(tutorial.level || "") +
        '" data-minutes="' +
        escapeHtml(String(tutorial.minutes || "")) +
        '" data-tags="' +
        escapeHtml((tutorial.tags || []).join("|")) +
        '" data-slug="' +
        escapeHtml(tutorial.slug) +
        '" data-search="' +
        escapeHtml(searchText) +
        '">' +
        '<div class="card__top"><span class="card__icon">' +
        icon +
        "</span>" +
        badge +
        "</div>" +
        '<h3 class="card__title">' +
        escapeHtml(tutorial.title) +
        "</h3>" +
        '<p class="card__desc">' +
        escapeHtml(tutorial.description) +
        "</p>" +
        (tags ? '<div class="card__tags">' + tags + "</div>" : "") +
        '<div class="card__meta">' +
        meta +
        bookmark +
        refine +
        "</div>" +
        link +
        "</article>"
      );
    }

    function matchesQuery(card) {
      return state.query === "" || card.dataset.search.indexOf(state.query) !== -1;
    }

    function matchesCategory(card) {
      if (state.category === ALL) {
        return true;
      }

      if (state.category === BOOKMARK_FILTER) {
        return MentorAI.Bookmarks.has(card.dataset.slug);
      }

      return card.dataset.categories.split(" ").indexOf(state.category) !== -1;
    }

    function matchesLevel(card) {
      return state.level === ALL || card.dataset.level === state.level;
    }

    function matchesDuration(card) {
      if (state.duration === ALL) {
        return true;
      }

      const minutes = Number(card.dataset.minutes);

      if (state.duration === "short") {
        return minutes < DURATION_THRESHOLD;
      }

      return minutes >= DURATION_THRESHOLD;
    }

    function matchesTag(card) {
      return (
        state.tag === ALL ||
        card.dataset.tags.split("|").indexOf(state.tag) !== -1
      );
    }

    function applyFilters() {
      let visibleCount = 0;

      cardEls.forEach(function (card) {
        const isVisible =
          matchesCategory(card) &&
          matchesLevel(card) &&
          matchesDuration(card) &&
          matchesTag(card) &&
          matchesQuery(card);
        card.classList.toggle("is-hidden", !isVisible);

        if (isVisible) {
          visibleCount += 1;
        }
      });

      if (emptyEl) {
        emptyEl.hidden = visibleCount !== 0;
      }
    }

    const filterChipContainers = [];

    function syncChipActive(activeFilter) {
      filterChipContainers.forEach(function (container) {
        Array.from(container.querySelectorAll(".chip")).forEach(function (chip) {
          chip.classList.toggle("is-active", chip.dataset.filter === activeFilter);
        });
      });
    }

    function wireFilters(filtersEl) {
      filterChipContainers.push(filtersEl);
      const chips = Array.from(filtersEl.querySelectorAll(".chip"));

      chips.forEach(function (chip) {
        chip.addEventListener("click", function () {
          state.category = chip.dataset.filter;
          syncChipActive(state.category);
          applyFilters();
        });
      });
    }

    function levelsIn(tutorials) {
      const present = {};

      tutorials.forEach(function (tutorial) {
        if (tutorial.level) {
          present[tutorial.level] = true;
        }
      });

      return LEVEL_ORDER.filter(function (level) {
        return present[level];
      });
    }

    function tagsIn(tutorials) {
      const present = {};

      tutorials.forEach(function (tutorial) {
        (tutorial.tags || []).forEach(function (tag) {
          present[tag] = true;
        });
      });

      return Object.keys(present).sort(function (a, b) {
        return a.localeCompare(b);
      });
    }

    function optionsHtml(allLabel, pairs) {
      return (
        '<option value="' +
        ALL +
        '">' +
        allLabel +
        "</option>" +
        pairs
          .map(function (pair) {
            return (
              '<option value="' +
              escapeHtml(pair.value) +
              '">' +
              escapeHtml(pair.label) +
              "</option>"
            );
          })
          .join("")
      );
    }

    function selectHtml(key, label, optionsMarkup) {
      return (
        '<label class="subfilter"><span class="subfilter__label">' +
        label +
        '</span><select class="subfilter__select" data-subfilter="' +
        key +
        '">' +
        optionsMarkup +
        "</select></label>"
      );
    }

    function buildSubfilters(subfiltersEl, tutorials) {
      const levels = levelsIn(tutorials).map(function (level) {
        return { value: level, label: level };
      });
      const durations = [
        { value: "short", label: "Menos de " + DURATION_THRESHOLD + " min" },
        { value: "long", label: DURATION_THRESHOLD + " min o más" },
      ];
      const tags = tagsIn(tutorials).map(function (tag) {
        return { value: tag, label: tag };
      });

      subfiltersEl.innerHTML =
        selectHtml("level", "Nivel", optionsHtml("Todos", levels)) +
        selectHtml("duration", "Duración", optionsHtml("Cualquiera", durations)) +
        selectHtml("tag", "Tema", optionsHtml("Todos", tags));
    }

    function wireSubfilters(subfiltersEl) {
      subfiltersEl.querySelectorAll(".subfilter__select").forEach(function (select) {
        select.addEventListener("change", function () {
          state[select.dataset.subfilter] = select.value;
          applyFilters();
        });
      });
    }

    function wireSearch() {
      const input = document.getElementById("catalog-search");

      if (!input) {
        return;
      }

      input.addEventListener("input", function () {
        state.query = normalize(input.value.trim());
        applyFilters();
      });
    }

    function wireBookmarks(filtersEl) {
      const savedCount = filtersEl
        ? filtersEl.querySelector('[data-filter="' + BOOKMARK_FILTER + '"] .chip__count')
        : null;

      document.querySelectorAll(".card__bookmark").forEach(function (btn) {
        btn.addEventListener("click", function (event) {
          event.preventDefault();
          event.stopPropagation();

          const isSaved = MentorAI.Bookmarks.toggle(btn.dataset.bookmarkSlug);
          btn.classList.toggle("is-saved", isSaved);

          if (savedCount) {
            savedCount.textContent = MentorAI.Bookmarks.count();
          }

          if (state.category === BOOKMARK_FILTER) {
            applyFilters();
          }
        });
      });
    }

    return {
      iconFor: function (key) {
        return ICONS[key] || ICONS.default;
      },
      clockSvg: CLOCK_SVG,
      levelSvg: LEVEL_SVG,
      render: function () {
        const cardsEl = document.getElementById("cards");
        const filtersEl = document.getElementById("filters");
        const all = window.ACADEMIA_TUTORIALS;

        if (!cardsEl || !Array.isArray(all)) {
          return;
        }

        const lessonSlugs = MentorAI.Courses.lessonSlugs();
        const tutorials = all.filter(function (tutorial) {
          return !lessonSlugs[tutorial.slug];
        });

        const counts = {};

        tutorials.forEach(function (tutorial) {
          (tutorial.categories || []).forEach(function (category) {
            counts[category] = (counts[category] || 0) + 1;
          });
        });

        const categories = Object.keys(counts).sort(function (a, b) {
          return labelFor(a).localeCompare(labelFor(b));
        });

        const ordered = tutorials.slice().sort(function (a, b) {
          const byStatus = (isSoon(a) ? 1 : 0) - (isSoon(b) ? 1 : 0);

          if (byStatus !== 0) {
            return byStatus;
          }

          return String(b.date || "").localeCompare(String(a.date || ""));
        });

        const chipsHtml = buildChips(tutorials, counts, categories);

        if (filtersEl) {
          filtersEl.innerHTML = chipsHtml;
        }

        const drawerFiltersEl = document.getElementById("drawer-filters");

        if (drawerFiltersEl) {
          drawerFiltersEl.innerHTML = chipsHtml;
        }

        cardsEl.innerHTML = ordered.map(buildCard).join("");
        cardEls = Array.from(cardsEl.querySelectorAll("[data-slug]"));
        emptyEl = document.getElementById("cards-empty");

        const publishedEl = document.querySelector("[data-stat-published]");

        if (publishedEl) {
          publishedEl.textContent = all.filter(function (tutorial) {
            return !isSoon(tutorial);
          }).length;
        }

        const subfiltersEl = document.getElementById("subfilters");
        const drawerSubfiltersEl = document.getElementById("drawer-subfilters");

        if (subfiltersEl) {
          buildSubfilters(subfiltersEl, tutorials);
          wireSubfilters(subfiltersEl);
        }

        if (drawerSubfiltersEl) {
          buildSubfilters(drawerSubfiltersEl, tutorials);
          wireSubfilters(drawerSubfiltersEl);
        }

        if (filtersEl) {
          wireFilters(filtersEl);
        }

        if (drawerFiltersEl) {
          wireFilters(drawerFiltersEl);
        }

        wireSearch();
        wireBookmarks(filtersEl || drawerFiltersEl);
        applyFilters();
        wireFilterDrawer();
      },
    };
  })();

  function wireFilterDrawer() {
    const openBtn = document.getElementById("open-filters");
    const closeBtn = document.getElementById("close-filters");
    const backdrop = document.getElementById("filter-drawer-backdrop");
    const drawer = document.getElementById("filter-drawer");

    if (!openBtn || !drawer) {
      return;
    }

    const open = function () {
      drawer.classList.add("is-open");

      if (backdrop) {
        backdrop.classList.add("is-open");
      }

      document.body.style.overflow = "hidden";
    };

    const close = function () {
      drawer.classList.remove("is-open");

      if (backdrop) {
        backdrop.classList.remove("is-open");
      }

      document.body.style.overflow = "";
    };

    openBtn.addEventListener("click", open);

    if (closeBtn) {
      closeBtn.addEventListener("click", close);
    }

    if (backdrop) {
      backdrop.addEventListener("click", close);
    }
  }
})();
