/* ============================================================
   MentorAI — Catálogo (artículos) auto-generado desde el manifiesto
   Orquesta: lee window.ACADEMIA_TUTORIALS, deja fuera lo que ya es
   lección de un curso, y monta chips y tarjetas. Añadir un tutorial =
   una entrada en tutorials/manifest.js; el catálogo se reorganiza solo.
   La tarjeta la construye catalog-card.js y el filtrado catalog-filters.js.
   Sin dependencias. Funciona por file://. Parte de window.MentorAI.
   ============================================================ */

(function () {
  "use strict";

  const MentorAI = (window.MentorAI = window.MentorAI || {});

  function standaloneTutorials(all) {
    const lessonSlugs = MentorAI.Courses.lessonSlugs();

    return all.filter((tutorial) => !lessonSlugs[tutorial.slug]);
  }

  function countByCategory(tutorials) {
    const counts = {};

    for (const tutorial of tutorials) {
      for (const category of tutorial.categories ?? []) {
        counts[category] = (counts[category] ?? 0) + 1;
      }
    }

    return counts;
  }

  /* Lo publicado primero y, dentro, lo más reciente arriba. */
  function displayOrder(tutorials) {
    const { isSoon } = MentorAI.CatalogCard;

    return [...tutorials].sort((a, b) => {
      const byStatus = (isSoon(a) ? 1 : 0) - (isSoon(b) ? 1 : 0);

      if (byStatus !== 0) return byStatus;

      return String(b.date ?? "").localeCompare(String(a.date ?? ""));
    });
  }

  function paintPublishedStat(all) {
    const el = document.querySelector("[data-stat-published]");

    if (!el) return;

    el.textContent = all.filter((tutorial) => !MentorAI.CatalogCard.isSoon(tutorial)).length;
  }

  function render() {
    const cardsEl = document.getElementById("cards");
    const all = window.ACADEMIA_TUTORIALS;

    if (!cardsEl || !Array.isArray(all)) return;

    const Filters = MentorAI.CatalogFilters;
    const tutorials = standaloneTutorials(all);
    const counts = countByCategory(tutorials);
    const categories = Object.keys(counts).sort((a, b) =>
      Filters.labelFor(a).localeCompare(Filters.labelFor(b))
    );

    cardsEl.innerHTML = displayOrder(tutorials).map(MentorAI.CatalogCard.build).join("");
    Filters.setCards(
      [...cardsEl.querySelectorAll("[data-slug]")],
      document.getElementById("cards-empty")
    );

    const chips = Filters.chipsHtml(tutorials.length, counts, categories);
    const chipHosts = ["filters", "drawer-filters"]
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    for (const host of chipHosts) {
      host.innerHTML = chips;
      Filters.wireChips(host);
    }

    for (const id of ["subfilters", "drawer-subfilters"]) {
      const host = document.getElementById(id);

      if (host) Filters.buildSubfilters(host, tutorials);
    }

    paintPublishedStat(all);
    Filters.wireSearch();
    Filters.wireBookmarks(chipHosts[0]);
    Filters.apply();
    Filters.wireDrawer();
  }

  MentorAI.Catalog = { render };
})();
