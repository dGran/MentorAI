/* ============================================================
   MentorAI — Interacciones
   Sin dependencias externas. Todo funciona abriendo el HTML
   directamente en el navegador (file://).
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Tema claro / oscuro (persistente) ---------- */
  const THEME_KEY = "academia-theme";

  function getPreferredTheme() {
    const stored = localStorage.getItem(THEME_KEY);

    if (stored) {
      return stored;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    return prefersDark ? "dark" : "light";
  }

  function applyTheme(theme) {
    const root = document.documentElement;

    root.classList.add("theme-switching");
    root.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);

    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        root.classList.remove("theme-switching");
      });
    });
  }

  function initTheme() {
    applyTheme(getPreferredTheme());

    const toggle = document.querySelector(".theme-toggle");

    if (!toggle) {
      return;
    }

    toggle.addEventListener("click", function () {
      const current = document.documentElement.getAttribute("data-theme");
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }

  /* ---------- Barra de progreso de lectura ---------- */
  function initReadingProgress() {
    const bar = document.querySelector(".reading-progress");

    if (!bar) {
      return;
    }

    const slug = currentTutorialSlug();
    let lastSaved = 0;

    function update() {
      const scrollTop = window.scrollY;
      const height =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = height > 0 ? (scrollTop / height) * 100 : 0;
      bar.style.width = progress + "%";

      const now = Date.now();

      if (now - lastSaved > 600) {
        Reading.save(slug, progress);
        lastSaved = now;
      }
    }

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ---------- Scrollspy del índice (TOC) ---------- */
  function initScrollSpy() {
    const tocLinks = Array.from(document.querySelectorAll(".toc__list a"));

    if (tocLinks.length === 0) {
      return;
    }

    const sections = tocLinks
      .map(function (link) {
        const id = link.getAttribute("href").slice(1);
        return document.getElementById(id);
      })
      .filter(Boolean);

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }

          tocLinks.forEach(function (link) {
            link.classList.toggle(
              "is-active",
              link.getAttribute("href") === "#" + entry.target.id
            );
          });
        });
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  /* ---------- Botones de copiar código ---------- */
  function initCopyButtons() {
    document.querySelectorAll(".copy-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const block = btn.closest(".code-block");
        const code = block ? block.querySelector("code") : null;

        if (!code) {
          return;
        }

        const text = code.innerText;
        const label = btn.querySelector(".copy-btn__label");

        const done = function () {
          btn.classList.add("is-copied");

          if (label) {
            label.textContent = "Copiado";
          }

          setTimeout(function () {
            btn.classList.remove("is-copied");
            if (label) {
              label.textContent = "Copiar";
            }
          }, 1800);
        };

        const fallbackCopy = function () {
          const area = document.createElement("textarea");
          area.value = text;
          area.style.position = "fixed";
          area.style.opacity = "0";
          document.body.appendChild(area);
          area.select();

          try {
            document.execCommand("copy");
            done();
          } catch (error) {
            /* el navegador no permitió copiar */
          }

          document.body.removeChild(area);
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done).catch(fallbackCopy);
        } else {
          fallbackCopy();
        }
      });
    });
  }

  /* ---------- Marcadores (favoritos) en localStorage ----------
     Uso individual, sin servidor: guarda los slugs marcados. */
  const Bookmarks = (function () {
    const KEY = "academia-bookmarks";

    function read() {
      try {
        const stored = JSON.parse(localStorage.getItem(KEY));
        return Array.isArray(stored) ? stored : [];
      } catch (error) {
        return [];
      }
    }

    function write(slugs) {
      localStorage.setItem(KEY, JSON.stringify(slugs));
    }

    return {
      has: function (slug) {
        return read().indexOf(slug) !== -1;
      },
      count: function () {
        return read().length;
      },
      toggle: function (slug) {
        const slugs = read();
        const index = slugs.indexOf(slug);
        const isSaved = index !== -1;

        if (isSaved) {
          slugs.splice(index, 1);
        }

        if (!isSaved) {
          slugs.push(slug);
        }

        write(slugs);

        return !isSaved;
      },
    };
  })();

  /* ---------- Progreso de lectura (localStorage) ----------
     Marca individual de "tutorial completado". Alimenta la ruta. */
  const Progress = (function () {
    const KEY = "academia-progress";

    function read() {
      try {
        const stored = JSON.parse(localStorage.getItem(KEY));
        return Array.isArray(stored) ? stored : [];
      } catch (error) {
        return [];
      }
    }

    function write(slugs) {
      localStorage.setItem(KEY, JSON.stringify(slugs));
    }

    return {
      has: function (slug) {
        return read().indexOf(slug) !== -1;
      },
      count: function () {
        return read().length;
      },
      toggle: function (slug) {
        const slugs = read();
        const index = slugs.indexOf(slug);
        const isDone = index !== -1;

        if (isDone) {
          slugs.splice(index, 1);
        }

        if (!isDone) {
          slugs.push(slug);
        }

        write(slugs);

        return !isDone;
      },
    };
  })();

  /* ---------- Lectura en curso (% de scroll por tutorial) ----------
     Persistencia individual del avance dentro de cada tutorial para
     alimentar "Seguir viendo" en la portada. Guarda el % máximo. */
  const Reading = (function () {
    const KEY = "academia-reading";
    const MIN_PERCENT = 5;

    function read() {
      try {
        const stored = JSON.parse(localStorage.getItem(KEY));
        return stored && typeof stored === "object" ? stored : {};
      } catch (error) {
        return {};
      }
    }

    function write(map) {
      localStorage.setItem(KEY, JSON.stringify(map));
    }

    return {
      save: function (slug, percent) {
        if (!slug || percent < MIN_PERCENT) {
          return;
        }

        const map = read();
        const previous = map[slug] ? map[slug].percent : 0;

        map[slug] = {
          percent: Math.max(previous, Math.round(percent)),
          updatedAt: Date.now(),
        };

        write(map);
      },
      get: function (slug) {
        return read()[slug] || null;
      },
      list: function () {
        const map = read();

        return Object.keys(map)
          .map(function (slug) {
            return {
              slug: slug,
              percent: map[slug].percent,
              updatedAt: map[slug].updatedAt,
            };
          })
          .sort(function (a, b) {
            return b.updatedAt - a.updatedAt;
          });
      },
    };
  })();

  /* ---------- Catálogo auto-generado desde el manifiesto ----------
     Lee window.ACADEMIA_TUTORIALS y construye los filtros (con conteo
     por categoría) y las tarjetas. Añadir un tutorial = una entrada en
     tutorials/manifest.js; el catálogo se reorganiza solo.
     Filtra por categoría, por marcadores y por texto a la vez. */
  const Catalog = (function () {
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
        Bookmarks.count() +
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
          (Bookmarks.has(tutorial.slug) ? " is-saved" : "") +
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
        return Bookmarks.has(card.dataset.slug);
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

    function wireFilters(filtersEl) {
      const chips = Array.from(filtersEl.querySelectorAll(".chip"));

      chips.forEach(function (chip) {
        chip.addEventListener("click", function () {
          chips.forEach(function (other) {
            other.classList.toggle("is-active", other === chip);
          });

          state.category = chip.dataset.filter;
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

          const isSaved = Bookmarks.toggle(btn.dataset.bookmarkSlug);
          btn.classList.toggle("is-saved", isSaved);

          if (savedCount) {
            savedCount.textContent = Bookmarks.count();
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
        const tutorials = window.ACADEMIA_TUTORIALS;

        if (!cardsEl || !Array.isArray(tutorials)) {
          return;
        }

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

        if (filtersEl) {
          filtersEl.innerHTML = buildChips(tutorials, counts, categories);
        }

        cardsEl.innerHTML = ordered.map(buildCard).join("");
        cardEls = Array.from(cardsEl.querySelectorAll("[data-slug]"));
        emptyEl = document.getElementById("cards-empty");

        const publishedEl = document.querySelector("[data-stat-published]");

        if (publishedEl) {
          publishedEl.textContent = tutorials.filter(function (tutorial) {
            return !isSoon(tutorial);
          }).length;
        }

        const subfiltersEl = document.getElementById("subfilters");

        if (subfiltersEl) {
          buildSubfilters(subfiltersEl, tutorials);
          wireSubfilters(subfiltersEl);
        }

        if (filtersEl) {
          wireFilters(filtersEl);
        }

        wireSearch();
        wireBookmarks(filtersEl);
        applyFilters();
      },
    };
  })();

  /* ---------- Ruta de aprendizaje (vista de la home) ----------
     Lee window.MENTORAI_ROADMAP (orden por pilares) y lo cruza con el
     manifest (estado y metadatos) y con Progress (lo ya completado). */
  const Roadmap = (function () {
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

    function buildStep(step, manifest, position) {
      const tutorial = manifest[step.slug];
      const published = isPublished(tutorial);
      const soon = Boolean(tutorial) && tutorial.status === "soon";
      const done = published && Progress.has(step.slug);
      const title = escapeHtml((tutorial && tutorial.title) || step.title || step.slug);

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

    function buildPillar(pillar, manifest, index) {
      const published = pillar.steps.filter(function (step) {
        return isPublished(manifest[step.slug]);
      });
      const done = published.filter(function (step) {
        return Progress.has(step.slug);
      });
      const percent = published.length
        ? Math.round((done.length / published.length) * 100)
        : 0;
      const label = published.length
        ? done.length + " / " + published.length
        : "Próximamente";

      const rows = pillar.steps
        .map(function (step, position) {
          return buildStep(step, manifest, position + 1);
        })
        .join("");

      return (
        '<section class="pillar">' +
        '<header class="pillar__head">' +
        '<span class="pillar__num">' +
        (index + 1) +
        "</span>" +
        '<div class="pillar__headings">' +
        '<h3 class="pillar__title">' +
        escapeHtml(pillar.title) +
        "</h3>" +
        '<p class="pillar__summary">' +
        escapeHtml(pillar.summary) +
        "</p></div>" +
        '<span class="pillar__progress">' +
        label +
        "</span>" +
        "</header>" +
        '<div class="pillar__bar"><span style="width:' +
        percent +
        '%"></span></div>' +
        '<ol class="steps">' +
        rows +
        "</ol>" +
        "</section>"
      );
    }

    return {
      render: function () {
        const host = document.getElementById("roadmap");
        const pillars = window.MENTORAI_ROADMAP;

        if (!host || !Array.isArray(pillars)) {
          return;
        }

        const manifest = manifestMap();

        host.innerHTML = pillars
          .map(function (pillar, index) {
            return buildPillar(pillar, manifest, index);
          })
          .join("");
      },
    };
  })();

  /* ---------- Portada: dashboard de inicio ----------
     Cruza manifest + Reading + Progress + roadmap y pinta cuatro bloques:
     seguir viendo, novedades, destacados y el banner de ruta en curso.
     Tarjetas propias (ancla simple), sin acoplarse al wiring del catálogo. */
  const Home = (function () {
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
        Catalog.clockSvg +
        escapeHtml(tutorial.minutes) +
        " min</span><span>" +
        Catalog.levelSvg +
        escapeHtml(tutorial.level) +
        "</span>"
      );
    }

    function miniCard(tutorial) {
      return (
        '<a class="mini-card" href="' +
        escapeHtml(tutorial.href) +
        '"><span class="mini-card__icon">' +
        Catalog.iconFor(tutorial.icon) +
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
        Catalog.iconFor(tutorial.icon) +
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
      const items = Reading.list()
        .filter(function (entry) {
          const tutorial = map[entry.slug];

          return (
            tutorial &&
            tutorial.status !== "soon" &&
            entry.percent >= MIN_PERCENT &&
            entry.percent < DONE_PERCENT &&
            !Progress.has(entry.slug)
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

    function pendingPillar(map) {
      const pillars = window.MENTORAI_ROADMAP || [];
      let target = null;

      pillars.forEach(function (pillar) {
        if (target) {
          return;
        }

        const publishedSteps = pillar.steps.filter(function (step) {
          const tutorial = map[step.slug];
          return tutorial && tutorial.status !== "soon";
        });
        const pending = publishedSteps.filter(function (step) {
          return !Progress.has(step.slug);
        });

        if (publishedSteps.length > 0 && pending.length > 0) {
          target = {
            pillar: pillar,
            next: map[pending[0].slug],
            done: publishedSteps.length - pending.length,
            total: publishedSteps.length,
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

      const target = pendingPillar(map);

      if (!target) {
        hideShelf("home-route");
        return;
      }

      host.hidden = false;
      host.innerHTML =
        '<div class="route-banner"><div class="route-banner__body">' +
        '<span class="route-banner__eyebrow">Ruta de aprendizaje</span>' +
        '<h3 class="route-banner__title">' +
        escapeHtml(target.pillar.title) +
        '</h3><p class="route-banner__sub">' +
        escapeHtml(target.pillar.summary) +
        '</p><p class="route-banner__progress">' +
        target.done +
        " / " +
        target.total +
        " completados</p></div>" +
        '<div class="route-banner__cta"><a class="btn btn--primary" href="' +
        escapeHtml(target.next.href) +
        '">Continuar: ' +
        escapeHtml(target.next.title) +
        '</a><button class="btn btn--ghost" type="button" data-view-jump="roadmap">' +
        "Ver la ruta completa</button></div></div>";
    }

    return {
      render: function () {
        if (!document.getElementById("home-new")) {
          return;
        }

        const map = manifestMap();
        const list = publishedTutorials();

        renderContinue(map);
        renderNew(list);
        renderPopular(list);
        renderRoute(map);
      },
    };
  })();

  /* ---------- Conmutador de vistas (inicio / catálogo / ruta) ---------- */
  function initViewToggle() {
    const buttons = Array.from(document.querySelectorAll(".view-toggle__btn"));

    if (buttons.length === 0) {
      return;
    }

    const emptyEl = document.getElementById("cards-empty");

    function show(view) {
      buttons.forEach(function (button) {
        const isActive = button.dataset.view === view;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-selected", isActive ? "true" : "false");
      });

      document.querySelectorAll("[data-view-panel]").forEach(function (panel) {
        panel.hidden = panel.dataset.viewPanel !== view;
      });

      if (emptyEl && view !== "catalog") {
        emptyEl.hidden = true;
      }
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        show(button.dataset.view);
      });
    });

    document.querySelectorAll("[data-view-jump]").forEach(function (el) {
      el.addEventListener("click", function () {
        show(el.dataset.viewJump);

        const section = document.getElementById("catalogo");

        if (section) {
          section.scrollIntoView({ block: "start" });
        }
      });
    });

    const active = buttons.find(function (button) {
      return button.classList.contains("is-active");
    });

    show(active ? active.dataset.view : buttons[0].dataset.view);
  }

  /* ---------- Resaltador de sintaxis propio ----------
     Una sola pasada con un regex combinado por lenguaje. Gana el token
     que empieza antes; a igualdad de posición, el primero de la lista.
     Así no hay colisiones entre reglas (p. ej. números dentro de strings). */
  const SyntaxHighlighter = (function () {
    function escapeHtml(text) {
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }

    // Cada regla usa SOLO grupos no capturadores (?:...) para que el grupo
    // capturador externo de cada alternativa identifique la regla.
    const LANGUAGES = {
      php: [
        { cls: "comment", src: "\\/\\/[^\\n]*|#[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/" },
        { cls: "string", src: "'(?:\\\\.|[^'\\\\])*'|\"(?:\\\\.|[^\"\\\\])*\"" },
        { cls: "variable", src: "\\$[a-zA-Z_]\\w*" },
        {
          cls: "keyword",
          src: "\\b(?:function|return|if|else|elseif|foreach|for|while|class|public|private|protected|static|const|new|echo|use|namespace|try|catch|throw|extends|implements|interface|true|false|null|array|void|int|string|bool|float|declare|strict_types)\\b",
        },
        { cls: "function", src: "\\b[a-zA-Z_]\\w*(?=\\s*\\()" },
        { cls: "number", src: "\\b\\d+(?:\\.\\d+)?\\b" },
      ],
      bash: [
        { cls: "comment", src: "#[^\\n]*" },
        { cls: "string", src: "'(?:\\\\.|[^'\\\\])*'|\"(?:\\\\.|[^\"\\\\])*\"" },
        {
          cls: "function",
          src: "\\b(?:sudo|php|systemctl|service|apt|docker|grep|cat|echo|cd|ls|curl|find|wc)\\b",
        },
        { cls: "attr", src: "--?[a-zA-Z][\\w-]*" },
        { cls: "variable", src: "\\$\\w+" },
      ],
      ini: [
        { cls: "comment", src: ";[^\\n]*" },
        { cls: "tag", src: "^\\s*\\[[^\\]]+\\]" },
        { cls: "property", src: "^\\s*[\\w.]+(?=\\s*=)" },
        { cls: "keyword", src: "\\b(?:On|Off|true|false)\\b" },
        { cls: "number", src: "\\b\\d+[MKG]?\\b" },
      ],
      sql: [
        { cls: "comment", src: "--[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/" },
        { cls: "string", src: "'(?:\\\\.|[^'\\\\])*'" },
        {
          cls: "keyword",
          src: "\\b(?:SELECT|FROM|WHERE|JOIN|INNER|LEFT|RIGHT|FULL|OUTER|CROSS|ON|USING|AND|OR|NOT|IN|AS|ORDER|BY|GROUP|HAVING|LIMIT|OFFSET|UNION|ALL|DISTINCT|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|INDEX|UNIQUE|DROP|ALTER|ADD|COLUMN|PRIMARY|KEY|FOREIGN|REFERENCES|DEFAULT|AUTO_INCREMENT|NULL|IS|LIKE|BETWEEN|EXISTS|CASE|WHEN|THEN|ELSE|END|EXPLAIN|ANALYZE|BEGIN|START|TRANSACTION|COMMIT|ROLLBACK|SAVEPOINT|LOCK|FOR|SHARE|NOWAIT|ISOLATION|LEVEL|READ|WRITE|COMMITTED|UNCOMMITTED|REPEATABLE|SERIALIZABLE|ASC|DESC|INT|INTEGER|BIGINT|SMALLINT|TINYINT|DECIMAL|NUMERIC|VARCHAR|CHAR|TEXT|DATE|DATETIME|TIMESTAMP|BOOLEAN)\\b",
        },
        { cls: "function", src: "\\b[a-zA-Z_]\\w*(?=\\s*\\()" },
        { cls: "number", src: "\\b\\d+(?:\\.\\d+)?\\b" },
      ],
    };

    function highlight(rawCode, language) {
      const rules = LANGUAGES[language];

      if (!rules) {
        return escapeHtml(rawCode);
      }

      const combined = new RegExp(
        rules
          .map(function (rule) {
            return "(" + rule.src + ")";
          })
          .join("|"),
        "gm"
      );

      let result = "";
      let lastIndex = 0;

      rawCode.replace(combined, function () {
        const match = arguments[0];
        const offset = arguments[arguments.length - 2];

        result += escapeHtml(rawCode.slice(lastIndex, offset));

        let cls = "default";

        for (let group = 1; group < arguments.length - 2; group++) {
          if (arguments[group] !== undefined) {
            cls = rules[group - 1].cls;
            break;
          }
        }

        result +=
          '<span class="tok-' + cls + '">' + escapeHtml(match) + "</span>";
        lastIndex = offset + match.length;

        return match;
      });

      result += escapeHtml(rawCode.slice(lastIndex));

      return result;
    }

    return {
      run: function () {
        document.querySelectorAll("code[data-lang]").forEach(function (code) {
          code.innerHTML = highlight(code.textContent, code.dataset.lang);
        });
      },
    };
  })();

  /* ---------- Puente local: compositor y refinador ----------
     Solo operativos cuando la web se sirve por el servidor (server/bridge.js).
     Abierto como file:// avisan de que hace falta arrancar el puente. */
  const IS_FILE_PROTOCOL = window.location.protocol === "file:";
  const BRIDGE_HINT =
    "Necesitas el puente local: ejecuta «node server/bridge.js» y abre http://localhost:4321";

  // Mecánica común de los modales (abrir, cerrar, estado).
  function createModalController(id) {
    const modal = document.getElementById(id);

    if (!modal) {
      return null;
    }

    const statusEl = modal.querySelector(".modal__status");

    function setStatus(message, kind) {
      if (!statusEl) {
        return;
      }

      statusEl.textContent = message || "";
      statusEl.className = "modal__status" + (kind ? " is-" + kind : "");
    }

    let lastFocused = null;

    function focusableElements() {
      const selector =
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

      return Array.from(modal.querySelectorAll(selector)).filter(function (el) {
        return el.offsetParent !== null;
      });
    }

    function focusInitial() {
      const items = focusableElements();
      const firstField = items.find(function (el) {
        return /^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName);
      });

      (firstField || items[0] || modal).focus();
    }

    function open() {
      lastFocused = document.activeElement;
      modal.hidden = false;
      document.body.style.overflow = "hidden";
      setStatus(IS_FILE_PROTOCOL ? BRIDGE_HINT : "", IS_FILE_PROTOCOL ? "warning" : "");
      focusInitial();
    }

    function close() {
      modal.hidden = true;
      document.body.style.overflow = "";

      if (lastFocused && typeof lastFocused.focus === "function") {
        lastFocused.focus();
      }
    }

    modal.querySelectorAll("[data-close]").forEach(function (el) {
      el.addEventListener("click", close);
    });

    modal.addEventListener("keydown", function (event) {
      if (event.key !== "Tab") {
        return;
      }

      const items = focusableElements();

      if (items.length === 0) {
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();

        return;
      }

      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !modal.hidden) {
        close();
      }
    });

    return { open: open, close: close, setStatus: setStatus };
  }

  // Llama al puente y recarga al terminar. Reutilizado por generar y refinar.
  function requestTutorial(url, payload, controller, submitBtn) {
    submitBtn.disabled = true;
    controller.setStatus("Trabajando con Claude… puede tardar 30-90 s.", "loading");

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        if (!result.ok) {
          throw new Error(result.error || "Error desconocido");
        }

        controller.setStatus("¡Listo! «" + result.title + "». Recargando…", "success");
        setTimeout(function () {
          window.location.reload();
        }, 1200);
      })
      .catch(function (error) {
        submitBtn.disabled = false;
        controller.setStatus("No se pudo completar: " + error.message, "error");
      });
  }

  function initComposer() {
    const controller = createModalController("composer");
    const openBtn = document.getElementById("open-composer");
    const form = document.getElementById("composer-form");

    if (!controller || !openBtn || !form) {
      return;
    }

    const submitBtn = document.getElementById("composer-submit");
    const datalist = document.getElementById("composer-categories");

    if (datalist && Array.isArray(window.ACADEMIA_TUTORIALS)) {
      const categories = {};

      window.ACADEMIA_TUTORIALS.forEach(function (tutorial) {
        (tutorial.categories || []).forEach(function (category) {
          categories[category] = true;
        });
      });

      datalist.innerHTML = Object.keys(categories)
        .map(function (category) {
          return '<option value="' + category + '"></option>';
        })
        .join("");
    }

    openBtn.addEventListener("click", controller.open);

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (IS_FILE_PROTOCOL) {
        controller.setStatus(BRIDGE_HINT, "warning");
        return;
      }

      const data = new FormData(form);

      requestTutorial(
        "/api/generate",
        {
          topic: data.get("topic"),
          category: data.get("category"),
          level: data.get("level"),
          minutes: data.get("minutes"),
        },
        controller,
        submitBtn
      );
    });
  }

  function initRefiner() {
    const controller = createModalController("refiner");
    const form = document.getElementById("refiner-form");

    if (!controller || !form) {
      return;
    }

    const submitBtn = document.getElementById("refiner-submit");
    const targetEl = document.getElementById("refiner-target");
    const selected = { slug: "" };

    document.querySelectorAll(".card__refine").forEach(function (btn) {
      btn.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();

        selected.slug = btn.dataset.refineSlug;
        form.reset();

        if (targetEl) {
          targetEl.textContent = "Sobre: " + btn.dataset.refineTitle;
        }

        controller.open();
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (IS_FILE_PROTOCOL) {
        controller.setStatus(BRIDGE_HINT, "warning");
        return;
      }

      const data = new FormData(form);

      requestTutorial(
        "/api/refine",
        { slug: selected.slug, instructions: data.get("instructions") },
        controller,
        submitBtn
      );
    });
  }

  /* ---------- Página de tutorial: audio, progreso y ruta ----------
     Mejoras inyectadas por JS según el slug del fichero, para no editar
     a mano cada tutorial: lector por voz (Web Speech), marca de
     completado (Progress) y navegación dentro de la ruta de aprendizaje. */
  function initTutorialPage() {
    const prose = document.querySelector("article.prose");

    if (!prose) {
      return;
    }

    const slug = currentTutorialSlug();

    injectTutorialActions(slug, prose);
    injectRouteNav(slug, prose);
  }

  function escapeAttr(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function currentTutorialSlug() {
    const path = window.location.pathname;
    const file = path.substring(path.lastIndexOf("/") + 1);

    return file.replace(/\.html$/, "");
  }

  function basename(href) {
    return String(href || "").substring(String(href || "").lastIndexOf("/") + 1);
  }

  const PLAY_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 4 20 12 6 20 6 4"/></svg>';
  const STOP_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>';
  const DONE_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

  function injectTutorialActions(slug, prose) {
    const host = document.querySelector(".tutorial-hero .container");

    if (!host) {
      return;
    }

    const actions = document.createElement("div");
    actions.className = "tutorial-actions";

    const hasSpeech = "speechSynthesis" in window;

    const audioBtn = hasSpeech ? buildAudioButton(prose) : null;
    const doneBtn = buildDoneButton(slug);

    if (audioBtn) {
      actions.appendChild(audioBtn);
    }

    actions.appendChild(doneBtn);
    host.appendChild(actions);
  }

  function speechChunks(prose) {
    const sources = [];
    const title = document.querySelector(".tutorial-hero__title");
    const lead = document.querySelector(".tutorial-hero__lead");

    if (title) {
      sources.push(title);
    }

    if (lead) {
      sources.push(lead);
    }

    prose.querySelectorAll("h2, p, li").forEach(function (node) {
      sources.push(node);
    });

    return sources
      .map(function (node) {
        return node.textContent.replace(/\s+/g, " ").trim();
      })
      .filter(function (text) {
        return text.length > 0;
      });
  }

  function pickSpanishVoice() {
    const voices = window.speechSynthesis.getVoices();

    return voices.filter(function (voice) {
      return voice.lang && voice.lang.toLowerCase().indexOf("es") === 0;
    })[0];
  }

  function buildAudioButton(prose) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tutorial-action";

    const setIdle = function () {
      button.classList.remove("is-playing");
      button.innerHTML = PLAY_SVG + "<span>Escuchar</span>";
    };

    const setPlaying = function () {
      button.classList.add("is-playing");
      button.innerHTML = STOP_SVG + "<span>Detener</span>";
    };

    setIdle();

    const stop = function () {
      window.speechSynthesis.cancel();
      setIdle();
    };

    const play = function () {
      const chunks = speechChunks(prose);

      if (chunks.length === 0) {
        return;
      }

      window.speechSynthesis.cancel();
      const voice = pickSpanishVoice();

      chunks.forEach(function (text, index) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "es-ES";
        utterance.rate = 1;

        if (voice) {
          utterance.voice = voice;
        }

        if (index === chunks.length - 1) {
          utterance.onend = setIdle;
        }

        window.speechSynthesis.speak(utterance);
      });

      setPlaying();
    };

    button.addEventListener("click", function () {
      if (button.classList.contains("is-playing")) {
        stop();
        return;
      }

      play();
    });

    window.addEventListener("beforeunload", function () {
      window.speechSynthesis.cancel();
    });

    return button;
  }

  function buildDoneButton(slug) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tutorial-action tutorial-action--done";

    const paint = function (isDone) {
      button.classList.toggle("is-done", isDone);
      button.innerHTML = isDone
        ? DONE_SVG + "<span>Completado</span>"
        : DONE_SVG + "<span>Marcar como completado</span>";
    };

    paint(Progress.has(slug));

    button.addEventListener("click", function () {
      paint(Progress.toggle(slug));
    });

    return button;
  }

  function roadmapSequence() {
    const sequence = [];

    (window.MENTORAI_ROADMAP || []).forEach(function (pillar) {
      pillar.steps.forEach(function (step, position) {
        sequence.push({
          slug: step.slug,
          title: step.title,
          pillar: pillar,
          position: position,
        });
      });
    });

    return sequence;
  }

  function manifestBySlug() {
    const map = {};

    (window.ACADEMIA_TUTORIALS || []).forEach(function (tutorial) {
      map[tutorial.slug] = tutorial;
    });

    return map;
  }

  function isPublishedTutorial(tutorial) {
    return Boolean(tutorial) && tutorial.status !== "soon";
  }

  function neighborLink(manifest, sequence, fromIndex, direction) {
    for (let index = fromIndex + direction; index >= 0 && index < sequence.length; index += direction) {
      const tutorial = manifest[sequence[index].slug];

      if (isPublishedTutorial(tutorial)) {
        return tutorial;
      }
    }

    return null;
  }

  function relatedInPillar(manifest, pillar, slug) {
    return pillar.steps
      .filter(function (step) {
        return step.slug !== slug && isPublishedTutorial(manifest[step.slug]);
      })
      .map(function (step) {
        return manifest[step.slug];
      });
  }

  function buildRouteNav(manifest, sequence, index) {
    const current = sequence[index];
    const pillar = current.pillar;
    const prev = neighborLink(manifest, sequence, index, -1);
    const next = neighborLink(manifest, sequence, index, 1);

    const crumb =
      '<p class="route-nav__crumb">Ruta · <strong>' +
      escapeAttr(pillar.title) +
      "</strong> · paso " +
      (current.position + 1) +
      " de " +
      pillar.steps.length +
      "</p>";

    const prevLink = prev
      ? '<a href="' +
        escapeAttr(basename(prev.href)) +
        '"><small>← Anterior</small><b>' +
        escapeAttr(prev.title) +
        "</b></a>"
      : "";

    const nextLink = next
      ? '<a href="' +
        escapeAttr(basename(next.href)) +
        '" class="next"><small>Siguiente →</small><b>' +
        escapeAttr(next.title) +
        "</b></a>"
      : '<a href="../index.html" class="next"><small>Fin de la ruta →</small><b>Volver al catálogo</b></a>';

    const related = relatedInPillar(manifest, pillar, current.slug);

    const relatedBlock =
      related.length === 0
        ? ""
        : '<div class="route-related"><p class="route-related__title">Más en «' +
          escapeAttr(pillar.title) +
          '»</p><ul>' +
          related
            .map(function (tutorial) {
              return (
                '<li><a href="' +
                escapeAttr(basename(tutorial.href)) +
                '">' +
                escapeAttr(tutorial.title) +
                '<span>' +
                escapeAttr(tutorial.minutes) +
                " min</span></a></li>"
              );
            })
            .join("") +
          "</ul></div>";

    return (
      '<nav class="route-nav">' +
      crumb +
      '<div class="tutorial-nav">' +
      prevLink +
      nextLink +
      "</div>" +
      relatedBlock +
      "</nav>"
    );
  }

  function injectRouteNav(slug, prose) {
    const sequence = roadmapSequence();
    const index = sequence
      .map(function (step) {
        return step.slug;
      })
      .indexOf(slug);

    if (index === -1) {
      return;
    }

    const manifest = manifestBySlug();
    const manualNav = prose.querySelector(".tutorial-nav");
    const html = buildRouteNav(manifest, sequence, index);

    if (manualNav) {
      manualNav.insertAdjacentHTML("beforebegin", html);
      manualNav.hidden = true;
      return;
    }

    prose.insertAdjacentHTML("beforeend", html);
  }

  /* ---------- Año del footer ---------- */
  function initYear() {
    const el = document.querySelector("[data-year]");

    if (el) {
      el.textContent = new Date().getFullYear();
    }
  }

  /* ---------- Arranque ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    initReadingProgress();
    initScrollSpy();
    initCopyButtons();
    Catalog.render();
    Roadmap.render();
    Home.render();
    initViewToggle();
    initTutorialPage();
    initComposer();
    initRefiner();
    initYear();
    SyntaxHighlighter.run();
  });

  window.addEventListener("load", function () {
    document.documentElement.classList.add("smooth-scroll");
  });

  // El tema se aplica cuanto antes para evitar parpadeo.
  applyTheme(getPreferredTheme());
})();
