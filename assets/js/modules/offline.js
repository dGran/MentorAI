/* ============================================================
   MentorAI — Offline / Guardar para viajar
   Requiere service worker (solo http/https, no file://).
   Expone MentorAI.Offline con init(), initCourseButtons()
   e initOfflinePage().
   ============================================================ */

(function () {
  "use strict";

  var MentorAI = (window.MentorAI = window.MentorAI || {});

  /* ---------- Estado local ---------- */
  var SAVED_KEY = "academia-offline-saved";

  function isSupported() {
    return "serviceWorker" in navigator && location.protocol !== "file:";
  }

  function savedSlugs() {
    try {
      return JSON.parse(localStorage.getItem(SAVED_KEY) || "[]");
    } catch (_) {
      return [];
    }
  }

  function markSaved(slug) {
    var slugs = savedSlugs();

    if (slugs.indexOf(slug) === -1) {
      slugs.push(slug);
      localStorage.setItem(SAVED_KEY, JSON.stringify(slugs));
    }
  }

  function markRemoved(slug) {
    var slugs = savedSlugs().filter(function (s) {
      return s !== slug;
    });

    localStorage.setItem(SAVED_KEY, JSON.stringify(slugs));
  }

  /* ---------- URLs de un curso ---------- */
  function urlsForCourse(slug) {
    var course = (window.MENTORAI_COURSES || []).filter(function (c) {
      return c.slug === slug;
    })[0];

    if (!course) return [];

    var lessonSlugs = [];
    var modules = Array.isArray(course.modules)
      ? course.modules
      : [{ lessons: course.lessons || [] }];

    modules.forEach(function (m) {
      (m.lessons || []).forEach(function (s) {
        lessonSlugs.push(s);
      });
    });

    return lessonSlugs.map(function (s) {
      return "/tutorials/" + s + ".html";
    });
  }

  /* ---------- Comunicación con el SW ---------- */
  function sendToSW(message) {
    return navigator.serviceWorker.ready.then(function (reg) {
      var worker = reg.active || reg.waiting || reg.installing;

      if (worker) worker.postMessage(message);
    });
  }

  /* ---------- Iconos ---------- */
  function iconDownload() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';
  }

  function iconCheck() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
  }

  function iconSpinner() {
    return '<svg class="offline-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-6.2-8.6"/></svg>';
  }

  function iconTrash() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>';
  }

  /* ---------- Inyectar enlace en nav ---------- */
  function injectNavLink() {
    var nav = document.querySelector(".nav__actions");

    if (!nav || nav.querySelector(".offline-nav-link")) return;

    var link = document.createElement("a");
    link.className = "nav__link offline-nav-link";
    link.textContent = "Sin conexión";

    var isActive = /\boffline\.html\b/.test(location.pathname);

    if (isActive) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }

    var base = location.pathname.includes("/tutorials/") ? "../" : "";
    link.href = base + "offline.html";

    var themeBtn = nav.querySelector(".theme-toggle");
    nav.insertBefore(link, themeBtn);
  }

  /* ---------- Botones de descarga en cursos.html ---------- */
  function addCourseButtons() {
    var container = document.getElementById("courses");

    if (!container) return;

    var saved = savedSlugs();

    Array.from(container.querySelectorAll(".course-card")).forEach(function (card) {
      if (card.parentElement.classList.contains("course-card-wrap")) return;

      var href = card.getAttribute("href") || "";
      var match = href.match(/slug=([^&]+)/);
      var slug = match ? decodeURIComponent(match[1]) : null;

      if (!slug) return;

      var wrap = document.createElement("div");
      wrap.className = "course-card-wrap";
      card.parentNode.insertBefore(wrap, card);
      wrap.appendChild(card);

      var isSaved = saved.indexOf(slug) !== -1;
      wrap.appendChild(buildBtn(slug, isSaved));
    });
  }

  function buildBtn(slug, isSaved) {
    var btn = document.createElement("button");
    btn.className = "offline-btn" + (isSaved ? " offline-btn--saved" : "");
    btn.dataset.slug = slug;
    setbtnState(btn, isSaved ? "saved" : "idle");

    btn.addEventListener("click", function () {
      if (btn.dataset.state === "saving") return;

      if (btn.dataset.state === "saved") {
        doRemove(slug, btn);
      } else {
        doSave(slug, btn);
      }
    });

    return btn;
  }

  function setbtnState(btn, state) {
    btn.dataset.state = state;
    btn.classList.remove("offline-btn--saved", "offline-btn--saving");

    if (state === "idle") {
      btn.innerHTML = iconDownload() + "<span>Guardar para viajar</span>";
      btn.title = "Guardar para consultar sin internet";
    }

    if (state === "saving") {
      btn.classList.add("offline-btn--saving");
      btn.innerHTML = iconSpinner() + "<span>Guardando…</span>";
      btn.title = "Guardando…";
    }

    if (state === "saved") {
      btn.classList.add("offline-btn--saved");
      btn.innerHTML = iconCheck() + "<span>Guardado · Eliminar</span>";
      btn.title = "Guardado para sin conexión. Pulsa para eliminar.";
    }
  }

  function doSave(slug, btn) {
    var urls = urlsForCourse(slug);

    if (!urls.length) return;

    setbtnState(btn, "saving");

    sendToSW({ type: "SAVE_COURSE", slug: slug, urls: urls });

    function onMessage(event) {
      var data = event.data || {};

      if (data.slug !== slug) return;

      if (data.type === "SAVE_PROGRESS" && btn.querySelector("span")) {
        btn.querySelector("span").textContent = "Guardando " + data.done + "/" + data.total + "…";
      }

      if (data.type === "SAVE_DONE") {
        navigator.serviceWorker.removeEventListener("message", onMessage);
        markSaved(slug);
        setbtnState(btn, "saved");
      }
    }

    navigator.serviceWorker.addEventListener("message", onMessage);
  }

  function doRemove(slug, btn) {
    var urls = urlsForCourse(slug);

    sendToSW({ type: "REMOVE_COURSE", slug: slug, urls: urls });
    markRemoved(slug);
    setbtnState(btn, "idle");
  }

  /* ---------- Página offline.html ---------- */
  function initOfflinePage() {
    var host = document.getElementById("offline-content");

    if (!host) return;

    if (!isSupported()) {
      host.innerHTML =
        '<p class="offline-empty">La función sin conexión requiere acceder a la academia vía navegador web (http/https), no con el protocolo <code>file://</code>.</p>';
      return;
    }

    var saved = savedSlugs();

    if (!saved.length) {
      host.innerHTML =
        '<p class="offline-empty">Aún no has guardado ningún curso. Ve a <a href="cursos.html">Cursos</a> y pulsa <strong>«Guardar para viajar»</strong> en los que quieras consultar sin internet.</p>';
      return;
    }

    var courses = (window.MENTORAI_COURSES || []).filter(function (c) {
      return saved.indexOf(c.slug) !== -1;
    });

    var html =
      '<ul class="offline-list">' +
      courses
        .map(function (course) {
          var total = 0;
          (course.modules || []).forEach(function (m) {
            total += (m.lessons || []).length;
          });

          return (
            '<li class="offline-item">' +
            '<div class="offline-item__info">' +
            "<strong>" +
            escapeHtml(course.title) +
            "</strong>" +
            "<span>" +
            total +
            " lecciones guardadas</span>" +
            "</div>" +
            '<div class="offline-item__actions">' +
            '<a href="curso.html?slug=' +
            encodeURIComponent(course.slug) +
            '" class="btn btn--ghost btn--sm">Abrir curso</a>' +
            '<button class="btn btn--ghost btn--sm offline-remove-btn" data-slug="' +
            escapeHtml(course.slug) +
            '">' +
            iconTrash() +
            " Eliminar" +
            "</button>" +
            "</div>" +
            "</li>"
          );
        })
        .join("") +
      "</ul>";

    host.innerHTML = html;

    host.querySelectorAll(".offline-remove-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var slug = btn.dataset.slug;
        var urls = urlsForCourse(slug);

        sendToSW({ type: "REMOVE_COURSE", slug: slug, urls: urls });
        markRemoved(slug);
        initOfflinePage();
      });
    });
  }

  /* ---------- Helpers ---------- */
  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ---------- API pública ---------- */
  MentorAI.Offline = {
    init: function () {
      injectNavLink();

      if (!isSupported()) return;

      navigator.serviceWorker.register("/sw.js").catch(function (err) {
        console.warn("[MentorAI] SW no registrado:", err);
      });
    },

    initCourseButtons: function () {
      if (!isSupported()) return;
      addCourseButtons();
    },

    initOfflinePage: function () {
      initOfflinePage();
    },
  };
})();
