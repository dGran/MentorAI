/* ============================================================
   MentorAI — Portada: dashboard de inicio, buscador y stats del hero
   Cruza manifiesto + Reading + Progress + cursos y pinta cuatro bloques:
   seguir viendo, novedades, destacados y el curso en marcha. Usa tarjetas
   propias (ancla simple), sin acoplarse al cableado del catálogo.
   Sin dependencias. Funciona por file://. Parte de window.MentorAI.
   ============================================================ */

(function () {
  "use strict";

  const MentorAI = (window.MentorAI = window.MentorAI || {});

  const MIN_PERCENT = 5;
  const DONE_PERCENT = 90;
  const SHELF_LIMIT = 4;
  const SHELVES = ["home-continue", "home-new", "home-popular", "home-route"];

  /* ---------- Datos ---------- */

  const publishedTutorials = () =>
    (window.ACADEMIA_TUTORIALS ?? []).filter((tutorial) => tutorial.status !== "soon");

  const manifestMap = () =>
    Object.fromEntries((window.ACADEMIA_TUTORIALS ?? []).map((t) => [t.slug, t]));

  const lessonsOf = (course) =>
    Array.isArray(course.modules)
      ? course.modules.flatMap((module) => module.lessons ?? [])
      : course.lessons ?? [];

  /* ---------- Tarjetas ---------- */

  function metaHtml(tutorial) {
    const { escapeHtml, Icons } = MentorAI;

    return `<span>${Icons.clock}${escapeHtml(tutorial.minutes)} min</span><span>${
      Icons.level
    }${escapeHtml(tutorial.level)}</span>`;
  }

  function miniCardHtml(tutorial, fragmento) {
    const { escapeHtml, Icons } = MentorAI;

    const cuerpo = fragmento
      ? `<p class="mini-card__desc mini-card__desc--match">${fragmento}</p>`
      : `<p class="mini-card__desc">${escapeHtml(tutorial.description)}</p>`;

    return `<a class="mini-card" href="${escapeHtml(tutorial.href)}">
      <span class="mini-card__icon">${Icons.for(tutorial.icon)}</span>
      <h4 class="mini-card__title">${escapeHtml(tutorial.title)}</h4>
      ${cuerpo}
      <div class="mini-card__meta">${metaHtml(tutorial)}</div>
    </a>`;
  }

  function continueCardHtml(tutorial, percent) {
    const { escapeHtml, Icons } = MentorAI;

    return `<a class="continue-card" href="${escapeHtml(tutorial.href)}">
      <div class="continue-card__top">
        <span class="mini-card__icon">${Icons.for(tutorial.icon)}</span>
        <span class="continue-card__percent">${percent}%</span>
      </div>
      <h4 class="mini-card__title">${escapeHtml(tutorial.title)}</h4>
      <div class="continue-card__bar"><span style="width:${percent}%"></span></div>
    </a>`;
  }

  /* ---------- Estanterías ---------- */

  function fillShelf(id, title, subtitle, inner) {
    const host = document.getElementById(id);

    if (!host) return;

    const escapeHtml = MentorAI.escapeHtml;

    host.innerHTML = `<header class="shelf__head">
        <div>
          <h3 class="shelf__title">${escapeHtml(title)}</h3>
          ${subtitle ? `<p class="shelf__sub">${escapeHtml(subtitle)}</p>` : ""}
        </div>
      </header>
      <div class="rail">${inner}</div>`;
    host.hidden = false;
  }

  function hideShelf(id) {
    const host = document.getElementById(id);

    if (!host) return;

    host.hidden = true;
    host.innerHTML = "";
  }

  function renderContinue(map) {
    const items = MentorAI.Reading.list()
      .filter((entry) => {
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
      .map((entry) => continueCardHtml(map[entry.slug], entry.percent))
      .join("");

    fillShelf("home-continue", "Seguir viendo", "Retoma donde lo dejaste", cards);
  }

  function renderNew(list) {
    const ordered = [...list]
      .sort((a, b) => String(b.date ?? "").localeCompare(String(a.date ?? "")))
      .slice(0, SHELF_LIMIT);

    fillShelf("home-new", "Novedades", "Lo último que hemos publicado", ordered.map(miniCardHtml).join(""));
  }

  function renderPopular(list) {
    const popular = list.filter((tutorial) => tutorial.popular === true);

    if (popular.length === 0) {
      hideShelf("home-popular");
      return;
    }

    fillShelf("home-popular", "Destacados", "Una buena puerta de entrada", popular.map(miniCardHtml).join(""));
  }

  /* Primer curso empezado o por empezar que aún tenga lecciones pendientes. */
  function pendingCourse(map) {
    for (const course of window.MENTORAI_COURSES ?? []) {
      const published = lessonsOf(course).filter((slug) => map[slug]?.status !== "soon" && map[slug]);
      const pending = published.filter((slug) => !MentorAI.Progress.has(slug));

      if (published.length > 0 && pending.length > 0) {
        return {
          course,
          next: map[pending[0]],
          done: published.length - pending.length,
          total: published.length,
        };
      }
    }

    return null;
  }

  function renderRoute(map) {
    const host = document.getElementById("home-route");

    if (!host) return;

    const target = pendingCourse(map);

    if (!target) {
      hideShelf("home-route");
      return;
    }

    const escapeHtml = MentorAI.escapeHtml;
    const { course, next, done, total } = target;

    host.innerHTML = `<div class="route-banner">
      <div class="route-banner__body">
        <span class="route-banner__eyebrow">Curso en marcha</span>
        <h3 class="route-banner__title">${escapeHtml(course.title)}</h3>
        <p class="route-banner__sub">${escapeHtml(course.summary)}</p>
        <p class="route-banner__progress">${done} / ${total} completadas</p>
      </div>
      <div class="route-banner__cta">
        <a class="btn btn--primary" href="${escapeHtml(next.href)}">Continuar: ${escapeHtml(
          next.title
        )}</a>
        <a class="btn btn--ghost" href="curso.html?slug=${encodeURIComponent(
          course.slug
        )}">Ver el curso</a>
      </div>
    </div>`;
    host.hidden = false;
  }

  function render() {
    if (!document.getElementById("home-new")) return;

    const map = manifestMap();
    const list = publishedTutorials();

    renderContinue(map);
    renderNew(list);
    renderPopular(list);
    renderRoute(map);
  }

  /* ---------- Buscador del inicio ---------- */

  const haystack = (tutorial) =>
    MentorAI.normalize(
      [
        tutorial.title,
        tutorial.description,
        tutorial.topic,
        (tutorial.categories ?? []).join(" "),
        (tutorial.tags ?? []).join(" "),
      ].join(" ")
    );

  function applySearch() {
    const input = document.getElementById("home-search");
    const host = document.getElementById("home-results");

    if (!input || !host) return;

    const escapeHtml = MentorAI.escapeHtml;
    const term = input.value.trim();
    const query = MentorAI.normalize(term);

    if (query.length === 0) {
      host.hidden = true;
      host.innerHTML = "";
      render();
      return;
    }

    for (const id of SHELVES) {
      hideShelf(id);
    }

    const Search = MentorAI.Search;
    const enMetadatos = publishedTutorials().filter((tutorial) =>
      haystack(tutorial).includes(query)
    );
    const yaEncontrados = new Set(enMetadatos.map((tutorial) => tutorial.slug));
    const enContenido = publishedTutorials().filter(
      (tutorial) => !yaEncontrados.has(tutorial.slug) && Search.coincide(tutorial.slug, query)
    );

    const matches = [...enMetadatos, ...enContenido];

    host.hidden = false;

    if (matches.length === 0) {
      const buscando = !Search.estaListo();

      host.innerHTML = `<header class="shelf__head"><div>
          <h3 class="shelf__title">${buscando ? "Buscando dentro del contenido…" : "Sin resultados"}</h3>
          <p class="shelf__sub">${
            buscando
              ? "Nada en los títulos. Mirando dentro de los tutoriales."
              : `Nada coincide con “${escapeHtml(term)}”. Prueba con otra palabra.`
          }</p>
        </div></header>`;
      return;
    }

    const resultados = [
      ...enMetadatos.map(miniCardHtml),
      ...enContenido.map((tutorial) => miniCardHtml(tutorial, Search.fragmento(tutorial.slug, query))),
    ].join("");

    host.innerHTML = `<header class="shelf__head"><div>
        <h3 class="shelf__title">Resultados</h3>
        <p class="shelf__sub">${matches.length} ${
          matches.length === 1 ? "coincidencia" : "coincidencias"
        } para “${escapeHtml(term)}”${
          enContenido.length ? ` · ${enContenido.length} dentro del contenido` : ""
        }</p>
      </div></header>
      <div class="rail">${resultados}</div>`;
  }

  function initSearch() {
    const input = document.getElementById("home-search");

    input?.addEventListener("input", applySearch);
    MentorAI.Search.alBuscar(input, applySearch);
  }

  /* ---------- Contadores del hero ----------
     Viven en index.html; el catálogo está en su propia página, así que el
     conteo se fija aquí y no depende de Catalog.render. */

  function initHeroStat() {
    const published = document.querySelector("[data-stat-published]");

    if (published && Array.isArray(window.ACADEMIA_TUTORIALS)) {
      published.textContent = publishedTutorials().length;
    }

    const courses = document.querySelector("[data-stat-courses]");

    if (courses && Array.isArray(window.MENTORAI_COURSES)) {
      courses.textContent = window.MENTORAI_COURSES.length;
    }
  }

  /* ---------- API pública ---------- */

  MentorAI.Home = { render, initSearch };
  MentorAI.initHeroStat = initHeroStat;
})();
