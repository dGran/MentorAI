/* ============================================================
   MentorAI — Offline: guardar para viajar
   Requiere service worker, o sea http/https: por file:// no aplica (y no
   hace falta, porque ahí ya está todo en disco).

   El sitio puede vivir en la raíz o bajo un subdirectorio (Pages lo sirve
   en /MentorAI/), así que todo se resuelve relativo a la página actual.
   Sin dependencias. Parte de window.MentorAI.
   ============================================================ */

(function () {
  "use strict";

  const MentorAI = (window.MentorAI = window.MentorAI || {});

  const CONTENT_CACHE = "academia-content";
  const SAVE_STALL_TIMEOUT_MS = 45000;
  const STATUS_REGION_ID = "offline-status";
  const SHELL_PAGES = [
    "index.html",
    "cursos.html",
    "rutas.html",
    "articulos.html",
    "curso.html",
    "repaso.html",
    "perfil.html",
    "offline.html",
  ];

  const isSupported = () => "serviceWorker" in navigator && location.protocol !== "file:";

  const baseUrl = () => new URL(MentorAI.basePath(), location.href).href;
  const absolute = (ruta) => new URL(ruta, baseUrl()).href;

  function countMissing(urls) {
    if (!window.caches) return Promise.resolve(urls.length);

    return caches
      .has(CONTENT_CACHE)
      .then((exists) => {
        if (!exists) return urls.length;

        return caches
          .open(CONTENT_CACHE)
          .then((cache) => Promise.all(urls.map((url) => cache.match(url))))
          .then((matches) => matches.filter((match) => !match).length);
      })
      .catch(() => urls.length);
  }

  const isFullyCached = (urls) =>
    urls.length === 0 ? Promise.resolve(false) : countMissing(urls).then((missing) => missing === 0);

  function ensureStatusRegion() {
    const existing = document.getElementById(STATUS_REGION_ID);

    if (existing) return existing;

    const region = document.createElement("p");

    region.id = STATUS_REGION_ID;
    region.className = "visually-hidden";
    region.setAttribute("role", "status");
    document.body.appendChild(region);

    return region;
  }

  function announce(message) {
    const region = ensureStatusRegion();

    region.textContent = "";
    requestAnimationFrame(() => {
      region.textContent = message;
    });
  }

  function savedCourseSlugs() {
    const courses = window.MENTORAI_COURSES ?? [];

    return Promise.all(courses.map((course) => isFullyCached(urlsForCourse(course.slug)))).then(
      (cached) => courses.filter((course, index) => cached[index]).map((course) => course.slug)
    );
  }

  /* ---------- URLs ---------- */

  function urlsForCourse(slug) {
    const course = (window.MENTORAI_COURSES ?? []).find((c) => c.slug === slug);

    if (!course) return [];

    const lessons = Array.isArray(course.modules)
      ? course.modules.flatMap((module) => module.lessons ?? [])
      : course.lessons ?? [];

    return lessons.map((lesson) => absolute(`tutorials/${lesson}.html`));
  }

  function urlsForEverything() {
    const tutoriales = (window.ACADEMIA_TUTORIALS ?? [])
      .filter((tutorial) => tutorial.status !== "soon")
      .map((tutorial) => `tutorials/${tutorial.slug}.html`);

    /* El índice de búsqueda pesa ~1,6 MB y normalmente se carga bajo demanda;
       aquí entra a propósito, para poder buscar dentro del contenido sin red. */
    return [...SHELL_PAGES, "tutorials/search-index.js", ...tutoriales].map(absolute);
  }

  /* ---------- Diálogo con el service worker ----------
     El worker descarga y responde con el avance. Envolverlo en una promesa
     evita repetir el baile de addEventListener/removeEventListener en cada
     sitio que guarda algo. */

  function sendToSW(message) {
    return navigator.serviceWorker.ready.then((registration) => {
      const worker = registration.active ?? registration.waiting ?? registration.installing;

      worker?.postMessage(message);
    });
  }

  function cacheUrls(slug, urls, onProgress) {
    const requestId = `${slug}:${Date.now()}:${Math.random().toString(36).slice(2)}`;

    return new Promise((resolve) => {
      let stallTimer = null;

      const finish = (isStalled) => {
        clearTimeout(stallTimer);
        navigator.serviceWorker.removeEventListener("message", onMessage);
        countMissing(urls).then((missing) => resolve({ missing, total: urls.length, isStalled }));
      };

      const watchForStall = () => {
        clearTimeout(stallTimer);
        stallTimer = setTimeout(() => finish(true), SAVE_STALL_TIMEOUT_MS);
      };

      const onMessage = (event) => {
        const data = event.data ?? {};

        if (data.requestId !== requestId) return;

        if (data.type === "SAVE_PROGRESS") {
          onProgress?.(data.done, data.total);
          watchForStall();
        }

        if (data.type === "SAVE_DONE") finish(false);
      };

      navigator.serviceWorker.addEventListener("message", onMessage);
      watchForStall();
      sendToSW({ type: "SAVE_COURSE", slug, urls, requestId });
    });
  }

  const missingText = ({ missing, total }) => `Faltan ${missing} de ${total}`;

  const dropUrls = (slug, urls) => sendToSW({ type: "REMOVE_COURSE", slug, urls });

  /* ---------- Cuota ---------- */

  function requestPersistence() {
    navigator.storage?.persisted?.().then((already) => {
      if (!already) navigator.storage.persist();
    });
  }

  function usedMegabytes() {
    if (!navigator.storage?.estimate) return Promise.resolve(null);

    return navigator.storage
      .estimate()
      .then((info) => (info.usage ? Math.round(info.usage / 1024 / 1024) : null));
  }

  /* ---------- Iconos ---------- */

  const ICONS = {
    download:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
    check:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    spinner:
      '<svg class="offline-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-6.2-8.6"/></svg>',
    trash:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>',
  };

  /* ---------- Enlace en la navegación ---------- */

  function injectNavLink() {
    const nav = document.querySelector(".nav__actions");

    if (!nav || nav.querySelector(".offline-nav-link")) return;

    const link = document.createElement("a");

    link.className = "nav__link offline-nav-link";
    link.textContent = "Sin conexión";
    link.href = `${MentorAI.basePath()}offline.html`;

    if (/\boffline\.html\b/.test(location.pathname)) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }

    nav.insertBefore(link, nav.querySelector(".theme-toggle"));
  }

  /* ---------- Botón por curso en cursos.html ---------- */

  const BUTTON_STATES = {
    idle: {
      html: `${ICONS.download}<span>Guardar para viajar</span>`,
      title: "Guardar para consultar sin internet",
      extra: "",
    },
    saving: {
      html: `${ICONS.spinner}<span>Guardando…</span>`,
      title: "Guardando…",
      extra: "offline-btn--saving",
    },
    saved: {
      html: `${ICONS.check}<span>Guardado · Eliminar</span>`,
      title: "Guardado para sin conexión. Pulsa para eliminar.",
      extra: "offline-btn--saved",
    },
  };

  function setButtonState(button, state) {
    const { html, title, extra } = BUTTON_STATES[state];

    button.dataset.state = state;
    button.classList.remove("offline-btn--saved", "offline-btn--saving");

    if (extra) button.classList.add(extra);

    button.innerHTML = html;
    button.title = title;
  }

  function paintSavedState(button, slug) {
    return isFullyCached(urlsForCourse(slug)).then((isSaved) => {
      setButtonState(button, isSaved ? "saved" : "idle");
    });
  }

  function paintIncomplete(button, outcome) {
    const label = button.querySelector("span");

    if (label) label.textContent = `${missingText(outcome)} · Reintentar`;

    button.title = outcome.isStalled
      ? "La descarga se quedó parada. Pulsa para reintentar."
      : "Algunas lecciones no se pudieron descargar. Pulsa para reintentar.";
    announce(`${missingText(outcome)} lecciones sin guardar. ${button.title}`);
  }

  function buildButton(slug) {
    const button = document.createElement("button");

    button.className = "offline-btn";
    button.dataset.slug = slug;
    setButtonState(button, "idle");
    paintSavedState(button, slug);

    button.addEventListener("click", () => {
      if (button.dataset.state === "saving") return;

      if (button.dataset.state === "saved") {
        dropUrls(slug, urlsForCourse(slug));
        setButtonState(button, "idle");
        return;
      }

      const urls = urlsForCourse(slug);

      if (urls.length === 0) return;

      setButtonState(button, "saving");

      cacheUrls(slug, urls, (done, total) => {
        const label = button.querySelector("span");

        if (label) label.textContent = `Guardando ${done}/${total}…`;
      })
        .then((outcome) => paintSavedState(button, slug).then(() => outcome))
        .then((outcome) => {
          if (outcome.missing === 0) {
            announce("Curso guardado: ya puedes leerlo sin conexión.");
            return;
          }

          paintIncomplete(button, outcome);
        });
    });

    return button;
  }

  function addCourseButtons() {
    const container = document.getElementById("courses");

    if (!container) return;

    for (const card of container.querySelectorAll(".course-card")) {
      if (card.parentElement.classList.contains("course-card-wrap")) continue;

      const slug = decodeURIComponent(card.getAttribute("href")?.match(/slug=([^&]+)/)?.[1] ?? "");

      if (!slug) continue;

      const wrap = document.createElement("div");

      wrap.className = "course-card-wrap";
      card.parentNode.insertBefore(wrap, card);
      wrap.append(card, buildButton(slug));
    }
  }

  /* ---------- Descargar toda la academia ----------
     El catálogo entero pesa unos 5 MB, menos que una foto del móvil. Antes
     de un vuelo, «me lo llevo todo» es más útil que ir eligiendo cursos. */

  function initDownloadAll() {
    const host = document.getElementById("offline-todo");

    if (!host || !isSupported()) return;

    const total = urlsForEverything().length;

    host.innerHTML = `<div class="offline-all">
      <div class="offline-all__body">
        <h2 class="offline-all__title">Toda la academia</h2>
        <p class="offline-all__copy">Son ${total} páginas, unos 5 MB. Antes de un vuelo suele salir más a cuenta que ir curso por curso.</p>
        <p class="offline-all__size" id="offline-size"></p>
      </div>
      <button class="btn btn--primary" id="offline-all-btn">Descargar todo</button>
    </div>`;

    const button = document.getElementById("offline-all-btn");
    const copy = host.querySelector(".offline-all__copy");

    const paintIfComplete = () =>
      isFullyCached(urlsForEverything()).then((isComplete) => {
        if (!isComplete) return;

        copy.textContent = "Ya la tienes entera. Vuelve a descargar si has actualizado el contenido.";
        button.textContent = "Volver a descargar";
      });

    paintIfComplete();

    const paintSize = () =>
      usedMegabytes().then((mb) => {
        const el = document.getElementById("offline-size");

        if (el && mb) el.textContent = `Ocupado ahora mismo: unos ${mb} MB.`;
      });

    paintSize();

    button.addEventListener("click", () => {
      if (button.disabled) return;

      button.disabled = true;
      requestPersistence();

      cacheUrls("__todo__", urlsForEverything(), (done, hecho) => {
        copy.textContent = `Descargando ${done} de ${hecho}…`;
      }).then((outcome) => {
        button.disabled = false;
        paintSize();

        if (outcome.missing > 0) {
          copy.textContent = `${missingText(outcome)} páginas por descargar: revisa la conexión y vuelve a intentarlo.`;
          button.textContent = "Reintentar";
          announce(copy.textContent);
          return;
        }

        copy.textContent = "Listo. Puedes desconectarte y seguir estudiando.";
        button.textContent = "Volver a descargar";
        announce(copy.textContent);
      });
    });
  }

  /* ---------- Lista de la página offline.html ---------- */

  function courseItemHtml(course) {
    const escapeHtml = MentorAI.escapeHtml;
    const total = (course.modules ?? []).reduce(
      (n, module) => n + (module.lessons ?? []).length,
      Array.isArray(course.lessons) ? course.lessons.length : 0
    );

    return `<li class="offline-item">
      <div class="offline-item__info">
        <strong>${escapeHtml(course.title)}</strong>
        <span>${total} lecciones guardadas</span>
      </div>
      <div class="offline-item__actions">
        <a href="curso.html?slug=${encodeURIComponent(
          course.slug
        )}" class="btn btn--ghost btn--sm">Abrir curso</a>
        <button class="btn btn--ghost btn--sm offline-remove-btn" data-slug="${escapeHtml(
          course.slug
        )}">${ICONS.trash} Eliminar</button>
      </div>
    </li>`;
  }

  function initOfflinePage() {
    const host = document.getElementById("offline-content");

    if (!host) return;

    if (!isSupported()) {
      host.innerHTML =
        '<p class="offline-empty">La función sin conexión requiere abrir la academia por http o https, no con el protocolo <code>file://</code> (aunque por <code>file://</code> ya lo tienes todo en disco).</p>';
      return;
    }

    savedCourseSlugs().then((saved) => renderSavedCourses(host, saved));
  }

  function renderSavedCourses(host, saved) {
    if (saved.length === 0) {
      host.innerHTML =
        '<p class="offline-empty">Aún no has guardado ningún curso suelto. Puedes descargarlo todo aquí arriba, o ir a <a href="cursos.html">Cursos</a> y pulsar <strong>«Guardar para viajar»</strong> en los que quieras.</p>';
      return;
    }

    const courses = (window.MENTORAI_COURSES ?? []).filter((course) => saved.includes(course.slug));

    host.innerHTML = `<ul class="offline-list">${courses.map(courseItemHtml).join("")}</ul>`;

    for (const button of host.querySelectorAll(".offline-remove-btn")) {
      button.addEventListener("click", () => {
        const { slug } = button.dataset;

        dropUrls(slug, urlsForCourse(slug));
        renderSavedCourses(host, saved.filter((savedSlug) => savedSlug !== slug));
      });
    }
  }

  /* ---------- API pública ---------- */

  MentorAI.Offline = {
    urlsForEverything,
    init() {
      injectNavLink();

      if (!isSupported()) return;

      ensureStatusRegion();

      navigator.serviceWorker
        .register(`${MentorAI.basePath()}sw.js`, { scope: MentorAI.basePath() })
        .catch((error) => console.warn("[MentorAI] SW no registrado:", error));
    },
    initCourseButtons() {
      if (isSupported()) addCourseButtons();
    },
    initOfflinePage() {
      initDownloadAll();
      initOfflinePage();
    },
  };
})();
