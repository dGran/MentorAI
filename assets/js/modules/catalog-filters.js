/* ============================================================
   MentorAI — Filtrado del catálogo
   Chips de categoría, subfiltros (nivel, duración, tema), buscador,
   marcadores y el cajón lateral en móvil. Todo el filtrado ocurre sobre
   los data-* que deja catalog-card.js, sin volver a tocar el manifiesto.
   Sin dependencias. Funciona por file://. Parte de window.MentorAI.
   ============================================================ */

(function () {
  "use strict";

  const MentorAI = (window.MentorAI = window.MentorAI || {});

  const ALL = "all";
  const SAVED = "saved";
  const DURATION_THRESHOLD = 15;
  const LEVEL_ORDER = ["Principiante", "Intermedio", "Avanzado"];

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
    apis: "APIs",
    oop: "Orientación a objetos",
    herramientas: "Herramientas",
    testing: "Testing",
    observabilidad: "Observabilidad",
    ia: "Programar con IA",
    go: "Go",
    rust: "Rust",
    python: "Python",
  };

  const state = { category: ALL, level: ALL, duration: ALL, tag: ALL, query: "" };

  let cards = [];
  let emptyEl = null;
  const chipContainers = [];

  function labelFor(category) {
    return CATEGORY_LABELS[category] ?? category[0].toUpperCase() + category.slice(1);
  }

  /* ---------- Coincidencias ----------
     Primero los metadatos, que están en el dataset y no cuestan nada;
     el contenido solo si el índice ya se cargó. */

  function coincideConLaBusqueda(dataset) {
    if (dataset.search.includes(state.query)) return true;

    return MentorAI.Search.coincide(dataset.slug, state.query);
  }

  function matches(card) {
    const { dataset } = card;

    if (state.query && !coincideConLaBusqueda(dataset)) return false;

    if (state.category === SAVED && !MentorAI.Bookmarks.has(dataset.slug)) return false;

    if (
      state.category !== ALL &&
      state.category !== SAVED &&
      !dataset.categories.split(" ").includes(state.category)
    ) {
      return false;
    }

    if (state.level !== ALL && dataset.level !== state.level) return false;

    if (state.duration !== ALL) {
      const minutes = Number(dataset.minutes);
      const isShort = minutes < DURATION_THRESHOLD;

      if (state.duration === "short" ? !isShort : isShort) return false;
    }

    if (state.tag !== ALL && !dataset.tags.split("|").includes(state.tag)) return false;

    return true;
  }

  function apply() {
    let visible = 0;

    for (const card of cards) {
      const isVisible = matches(card);

      card.classList.toggle("is-hidden", !isVisible);

      if (isVisible) visible += 1;
    }

    if (emptyEl) emptyEl.hidden = visible !== 0;
  }

  /* ---------- Chips de categoría ---------- */

  function chipsHtml(total, counts, categories) {
    const { escapeHtml, Icons, Bookmarks } = MentorAI;

    const chip = (filter, label, count, extraClass = "") =>
      `<button class="chip${extraClass}" data-filter="${escapeHtml(
        filter
      )}">${label}<span class="chip__count">${count}</span></button>`;

    return [
      chip(ALL, "Todos", total, " is-active"),
      chip(SAVED, `${Icons.star}Guardados`, Bookmarks.count(), " chip--saved"),
      ...categories.map((category) =>
        chip(category, escapeHtml(labelFor(category)), counts[category])
      ),
    ].join("");
  }

  function syncChips(active) {
    for (const container of chipContainers) {
      for (const chip of container.querySelectorAll(".chip")) {
        chip.classList.toggle("is-active", chip.dataset.filter === active);
      }
    }
  }

  function wireChips(container) {
    chipContainers.push(container);

    for (const chip of container.querySelectorAll(".chip")) {
      chip.addEventListener("click", () => {
        state.category = chip.dataset.filter;
        syncChips(state.category);
        apply();
      });
    }
  }

  /* ---------- Subfiltros ---------- */

  function levelsIn(tutorials) {
    const present = new Set(tutorials.map((tutorial) => tutorial.level).filter(Boolean));

    return LEVEL_ORDER.filter((level) => present.has(level));
  }

  function tagsIn(tutorials) {
    const present = new Set(tutorials.flatMap((tutorial) => tutorial.tags ?? []));

    return [...present].sort((a, b) => a.localeCompare(b));
  }

  function selectHtml(key, label, allLabel, pairs) {
    const escapeHtml = MentorAI.escapeHtml;
    const options = [
      `<option value="${ALL}">${allLabel}</option>`,
      ...pairs.map(
        ({ value, label: text }) =>
          `<option value="${escapeHtml(value)}">${escapeHtml(text)}</option>`
      ),
    ].join("");

    return `<label class="subfilter"><span class="subfilter__label">${label}</span><select class="subfilter__select" data-subfilter="${key}">${options}</select></label>`;
  }

  function buildSubfilters(container, tutorials) {
    const levels = levelsIn(tutorials).map((level) => ({ value: level, label: level }));
    const tags = tagsIn(tutorials).map((tag) => ({ value: tag, label: tag }));
    const durations = [
      { value: "short", label: `Menos de ${DURATION_THRESHOLD} min` },
      { value: "long", label: `${DURATION_THRESHOLD} min o más` },
    ];

    container.innerHTML =
      selectHtml("level", "Nivel", "Todos", levels) +
      selectHtml("duration", "Duración", "Cualquiera", durations) +
      selectHtml("tag", "Tema", "Todos", tags);

    for (const select of container.querySelectorAll(".subfilter__select")) {
      select.addEventListener("change", () => {
        state[select.dataset.subfilter] = select.value;
        apply();
      });
    }
  }

  /* ---------- Buscador y marcadores ---------- */

  function wireSearch() {
    const input = document.getElementById("catalog-search");

    if (!input) return;

    input.addEventListener("input", () => {
      state.query = MentorAI.normalize(input.value.trim());
      apply();
    });

    MentorAI.Search.alBuscar(input, apply);
  }

  function wireBookmarks(filtersEl) {
    const savedCount = filtersEl?.querySelector(`[data-filter="${SAVED}"] .chip__count`);

    for (const button of document.querySelectorAll(".card__bookmark")) {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        const isSaved = MentorAI.Bookmarks.toggle(button.dataset.bookmarkSlug);
        button.classList.toggle("is-saved", isSaved);

        if (savedCount) savedCount.textContent = MentorAI.Bookmarks.count();
        if (state.category === SAVED) apply();
      });
    }
  }

  /* ---------- Cajón de filtros en móvil ---------- */

  function wireDrawer() {
    const openButton = document.getElementById("open-filters");
    const closeButton = document.getElementById("close-filters");
    const backdrop = document.getElementById("filter-drawer-backdrop");
    const drawer = document.getElementById("filter-drawer");

    if (!openButton || !drawer) return;

    const setOpen = (isOpen) => {
      drawer.classList.toggle("is-open", isOpen);
      backdrop?.classList.toggle("is-open", isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
    };

    openButton.addEventListener("click", () => setOpen(true));
    closeButton?.addEventListener("click", () => setOpen(false));
    backdrop?.addEventListener("click", () => setOpen(false));
  }

  /* ---------- API pública ---------- */

  MentorAI.CatalogFilters = {
    labelFor,
    chipsHtml,
    buildSubfilters,
    wireChips,
    wireSearch,
    wireBookmarks,
    wireDrawer,
    apply,
    setCards(cardEls, empty) {
      cards = cardEls;
      emptyEl = empty;
    },
  };
})();
