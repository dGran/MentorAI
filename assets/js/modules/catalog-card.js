/* ============================================================
   MentorAI — Tarjeta del catálogo
   Construye el HTML de una tarjeta a partir de su entrada del manifiesto.
   Los data-* que deja son los que luego lee el filtrado, así que este
   fichero y catalog-filters.js comparten ese contrato.
   Sin dependencias. Funciona por file://. Parte de window.MentorAI.
   ============================================================ */

(function () {
  "use strict";

  const MentorAI = (window.MentorAI = window.MentorAI || {});

  const isSoon = (tutorial) => tutorial.status === "soon";

  function badgeHtml(tutorial) {
    const escapeHtml = MentorAI.escapeHtml;

    if (isSoon(tutorial)) {
      return '<span class="badge badge--level">Próximamente</span>';
    }

    if (tutorial.featured) {
      return '<span class="badge badge--new">Nuevo</span>';
    }

    return `<span class="badge badge--level">${escapeHtml(tutorial.level ?? "")}</span>`;
  }

  function metaHtml(tutorial) {
    const { escapeHtml, Icons } = MentorAI;

    if (isSoon(tutorial)) {
      return "<span>En preparación</span>";
    }

    return `<span>${Icons.clock}${escapeHtml(tutorial.minutes)} min</span><span>${
      Icons.level
    }${escapeHtml(tutorial.level)}</span>`;
  }

  function bookmarkHtml(tutorial) {
    const { escapeHtml, Icons, Bookmarks } = MentorAI;

    if (isSoon(tutorial)) return "";

    const saved = Bookmarks.has(tutorial.slug) ? " is-saved" : "";

    return `<button class="card__bookmark${saved}" type="button" data-bookmark-slug="${escapeHtml(
      tutorial.slug
    )}" aria-label="Guardar tutorial" title="Guardar">${Icons.star}</button>`;
  }

  /* Texto sobre el que busca el buscador del catálogo, precalculado en un
     data-* para no recorrer el manifiesto en cada pulsación. */
  function searchText(tutorial) {
    return MentorAI.normalize(
      [
        tutorial.title,
        tutorial.description,
        (tutorial.tags ?? []).join(" "),
        tutorial.topic ?? "",
        (tutorial.categories ?? []).join(" "),
        tutorial.level ?? "",
      ].join(" ")
    );
  }

  function buildCard(tutorial) {
    const { escapeHtml, Icons } = MentorAI;
    const soon = isSoon(tutorial);

    const tags = (tutorial.tags ?? [])
      .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
      .join("");

    const link = soon
      ? ""
      : `<a href="${escapeHtml(tutorial.href)}" class="card__link" aria-label="Abrir ${escapeHtml(
          tutorial.title
        )}"></a>`;

    const dataset = [
      `data-categories="${escapeHtml((tutorial.categories ?? []).join(" "))}"`,
      `data-topic="${escapeHtml(tutorial.topic ?? "")}"`,
      `data-level="${escapeHtml(tutorial.level ?? "")}"`,
      `data-minutes="${escapeHtml(String(tutorial.minutes ?? ""))}"`,
      `data-tags="${escapeHtml((tutorial.tags ?? []).join("|"))}"`,
      `data-slug="${escapeHtml(tutorial.slug)}"`,
      `data-search="${escapeHtml(searchText(tutorial))}"`,
    ].join(" ");

    return `<article class="card ${soon ? "card--soon" : ""}" ${dataset}>
      <div class="card__top"><span class="card__icon">${Icons.for(tutorial.icon)}</span>${badgeHtml(
        tutorial
      )}</div>
      <h3 class="card__title">${escapeHtml(tutorial.title)}</h3>
      <p class="card__desc">${escapeHtml(tutorial.description)}</p>
      ${tags ? `<div class="card__tags">${tags}</div>` : ""}
      <div class="card__meta">${metaHtml(tutorial)}${bookmarkHtml(tutorial)}</div>
      ${link}
    </article>`;
  }

  MentorAI.CatalogCard = { build: buildCard, isSoon };
})();
