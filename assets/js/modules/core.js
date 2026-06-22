/* ============================================================
   MentorAI — Núcleo: tema, progreso de lectura, scrollspy, copiar, año
   Sin dependencias. Funciona por file://. Parte de window.MentorAI.
   ============================================================ */

(function () {
  "use strict";

  var MentorAI = (window.MentorAI = window.MentorAI || {});

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

    const slug = MentorAI.currentTutorialSlug();
    let lastSaved = 0;

    function update() {
      const scrollTop = window.scrollY;
      const height =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = height > 0 ? (scrollTop / height) * 100 : 0;
      bar.style.width = progress + "%";

      const now = Date.now();

      if (now - lastSaved > 600) {
        MentorAI.Reading.save(slug, progress);
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

  /* ---------- Año del footer ---------- */
  function initYear() {
    const el = document.querySelector("[data-year]");

    if (el) {
      el.textContent = new Date().getFullYear();
    }
  }

  /* ---------- Hamburger + nav drawer (mobile) ---------- */
  const BURGER_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
  const CLOSE_NAV_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>';
  const MOON_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  const SUN_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';

  function drawerThemeIcon() {
    return document.documentElement.getAttribute("data-theme") === "dark"
      ? SUN_SVG
      : MOON_SVG;
  }

  function initMobileNav() {
    const navActions = document.querySelector(".nav__actions");

    if (!navActions) {
      return;
    }

    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf("/") + 1).replace(/\.html$/, "");
    const isRoot = path.endsWith("/") || path.endsWith("/index.html") || page === "" || page === "index";

    function activeClass(id) {
      return (page === id || (isRoot && id === "index")) ? " is-active" : "";
    }

    const burger = document.createElement("button");
    burger.className = "icon-btn nav__burger";
    burger.setAttribute("aria-label", "Menú");
    burger.innerHTML = BURGER_SVG;
    navActions.appendChild(burger);

    const backdrop = document.createElement("div");
    backdrop.className = "nav-drawer-backdrop";
    document.body.appendChild(backdrop);

    const prefix = path.includes("/tutorials/") ? "../" : "";
    const drawer = document.createElement("div");
    drawer.className = "nav-drawer";
    drawer.innerHTML =
      '<div class="nav-drawer__head">' +
      '<span class="nav-drawer__title">MentorAI</span>' +
      '<div class="nav-drawer__head-actions">' +
      '<button class="icon-btn nav-drawer__theme-toggle" aria-label="Cambiar tema">' +
      drawerThemeIcon() +
      "</button>" +
      '<button class="icon-btn nav-drawer__close" aria-label="Cerrar">' + CLOSE_NAV_SVG + "</button>" +
      "</div>" +
      "</div>" +
      '<nav class="nav-drawer__links">' +
      '<a class="nav-drawer__link' + activeClass("index") + '" href="' + prefix + 'index.html">Inicio</a>' +
      '<a class="nav-drawer__link' + activeClass("cursos") + '" href="' + prefix + 'cursos.html">Cursos</a>' +
      '<a class="nav-drawer__link' + activeClass("articulos") + '" href="' + prefix + 'articulos.html">Artículos</a>' +
      "</nav>";
    document.body.appendChild(drawer);

    const closeDrawer = function () {
      drawer.classList.remove("is-open");
      backdrop.classList.remove("is-open");
      document.body.style.overflow = "";
    };

    const openDrawer = function () {
      drawer.classList.add("is-open");
      backdrop.classList.add("is-open");
      document.body.style.overflow = "hidden";
    };

    burger.addEventListener("click", openDrawer);
    backdrop.addEventListener("click", closeDrawer);
    drawer.querySelector(".nav-drawer__close").addEventListener("click", closeDrawer);

    const themeToggle = drawer.querySelector(".nav-drawer__theme-toggle");
    themeToggle.addEventListener("click", function () {
      const current = document.documentElement.getAttribute("data-theme");
      applyTheme(current === "dark" ? "light" : "dark");
      themeToggle.innerHTML = drawerThemeIcon();
    });
  }

  MentorAI.initTheme = initTheme;
  MentorAI.initReadingProgress = initReadingProgress;
  MentorAI.initScrollSpy = initScrollSpy;
  MentorAI.initCopyButtons = initCopyButtons;
  MentorAI.initYear = initYear;
  MentorAI.initMobileNav = initMobileNav;

  applyTheme(getPreferredTheme());
})();
