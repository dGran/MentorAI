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

  const SAVED_KEY = "academia-offline-saved";
  const ALL_KEY = "academia-offline-todo";
  const SHELL_PAGES = ["index.html", "cursos.html", "rutas.html", "articulos.html", "curso.html", "repaso.html"];

  const isSupported = () => "serviceWorker" in navigator && location.protocol !== "file:";

  /* ---------- Base del sitio ---------- */

  const basePath = () => (location.pathname.includes("/tutorials/") ? "../" : "./");
  const baseUrl = () => new URL(basePath(), location.href).href;
  const absolute = (ruta) => new URL(ruta, baseUrl()).href;

  /* ---------- Cursos guardados ---------- */

  function savedSlugs() {
    try {
      const stored = JSON.parse(localStorage.getItem(SAVED_KEY));

      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  }

  function writeSaved(slugs) {
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify(slugs));
    } catch {
      /* sin espacio: la caché sigue, solo se pierde la lista */
    }
  }

  const markSaved = (slug) => writeSaved([...new Set([...savedSlugs(), slug])]);
  const markRemoved = (slug) => writeSaved(savedSlugs().filter((s) => s !== slug));

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
    return new Promise((resolve) => {
      const onMessage = (event) => {
        const data = event.data ?? {};

        if (data.slug !== slug) return;

        if (data.type === "SAVE_PROGRESS") onProgress?.(data.done, data.total);

        if (data.type === "SAVE_DONE") {
          navigator.serviceWorker.removeEventListener("message", onMessage);
          resolve();
        }
      };

      navigator.serviceWorker.addEventListener("message", onMessage);
      sendToSW({ type: "SAVE_COURSE", slug, urls });
    });
  }

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
    link.href = `${basePath()}offline.html`;

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

  function buildButton(slug, isSaved) {
    const button = document.createElement("button");

    button.className = "offline-btn";
    button.dataset.slug = slug;
    setButtonState(button, isSaved ? "saved" : "idle");

    button.addEventListener("click", () => {
      if (button.dataset.state === "saving") return;

      if (button.dataset.state === "saved") {
        dropUrls(slug, urlsForCourse(slug));
        markRemoved(slug);
        setButtonState(button, "idle");
        return;
      }

      const urls = urlsForCourse(slug);

      if (urls.length === 0) return;

      setButtonState(button, "saving");

      cacheUrls(slug, urls, (done, total) => {
        const label = button.querySelector("span");

        if (label) label.textContent = `Guardando ${done}/${total}…`;
      }).then(() => {
        markSaved(slug);
        setButtonState(button, "saved");
      });
    });

    return button;
  }

  function addCourseButtons() {
    const container = document.getElementById("courses");

    if (!container) return;

    const saved = savedSlugs();

    for (const card of container.querySelectorAll(".course-card")) {
      if (card.parentElement.classList.contains("course-card-wrap")) continue;

      const slug = decodeURIComponent(card.getAttribute("href")?.match(/slug=([^&]+)/)?.[1] ?? "");

      if (!slug) continue;

      const wrap = document.createElement("div");

      wrap.className = "course-card-wrap";
      card.parentNode.insertBefore(wrap, card);
      wrap.append(card, buildButton(slug, saved.includes(slug)));
    }
  }

  /* ---------- Descargar toda la academia ----------
     El catálogo entero pesa unos 5 MB, menos que una foto del móvil. Antes
     de un vuelo, «me lo llevo todo» es más útil que ir eligiendo cursos. */

  function initDownloadAll() {
    const host = document.getElementById("offline-todo");

    if (!host || !isSupported()) return;

    const yaEsta = localStorage.getItem(ALL_KEY) === "1";
    const total = urlsForEverything().length;

    host.innerHTML = `<div class="offline-all">
      <div class="offline-all__body">
        <h2 class="offline-all__title">Toda la academia</h2>
        <p class="offline-all__copy">${
          yaEsta
            ? "Ya la tienes entera. Vuelve a descargar si has actualizado el contenido."
            : `Son ${total} páginas, unos 5 MB. Antes de un vuelo suele salir más a cuenta que ir curso por curso.`
        }</p>
        <p class="offline-all__size" id="offline-size"></p>
      </div>
      <button class="btn btn--primary" id="offline-all-btn">${
        yaEsta ? "Volver a descargar" : "Descargar todo"
      }</button>
    </div>`;

    const button = document.getElementById("offline-all-btn");
    const copy = host.querySelector(".offline-all__copy");

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
      }).then(() => {
        try {
          localStorage.setItem(ALL_KEY, "1");
        } catch {
          /* no se recordará, pero la caché está */
        }

        copy.textContent = "Listo. Puedes desconectarte y seguir estudiando.";
        button.textContent = "Volver a descargar";
        button.disabled = false;
        paintSize();
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

    const saved = savedSlugs();

    if (saved.length === 0) {
      host.innerHTML =
        '<p class="offline-empty">Aún no has guardado ningún curso suelto. Puedes descargarlo todo aquí arriba, o ir a <a href="cursos.html">Cursos</a> y pulsar <strong>«Guardar para viajar»</strong> en los que quieras.</p>';
      return;
    }

    const courses = (window.MENTORAI_COURSES ?? []).filter((course) =>
      saved.includes(course.slug)
    );

    host.innerHTML = `<ul class="offline-list">${courses.map(courseItemHtml).join("")}</ul>`;

    for (const button of host.querySelectorAll(".offline-remove-btn")) {
      button.addEventListener("click", () => {
        const { slug } = button.dataset;

        dropUrls(slug, urlsForCourse(slug));
        markRemoved(slug);
        initOfflinePage();
      });
    }
  }

  /* ---------- API pública ---------- */

  MentorAI.Offline = {
    urlsForEverything,
    init() {
      injectNavLink();

      if (!isSupported()) return;

      navigator.serviceWorker
        .register(`${basePath()}sw.js`, { scope: basePath() })
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
