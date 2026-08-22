/* ============================================================
   MentorAI — Núcleo: tema, progreso de lectura, scrollspy, copiar, año
   Sin dependencias. Funciona por file://. Parte de window.MentorAI.
   ============================================================ */

(function () {
  "use strict";

  const MentorAI = (window.MentorAI = window.MentorAI || {});

  const THEME_KEY = "academia-theme";
  const SAVE_EVERY_MS = 600;

  /* ---------- Iconos ---------- */

  const BURGER_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
  const CLOSE_NAV_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>';
  const MOON_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  const SUN_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';

  /* ---------- Tema claro / oscuro ----------
     El <head> de cada página ya aplica el tema antes de pintar para evitar
     el parpadeo; aquí se reaplica y se cablea el interruptor. */

  function preferredTheme() {
    try {
      const stored = localStorage.getItem(THEME_KEY);

      if (stored) return stored;
    } catch {
      /* modo privado: caemos a la preferencia del sistema */
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    const root = document.documentElement;

    root.classList.add("theme-switching");
    root.setAttribute("data-theme", theme);

    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* el tema no se recordará, pero la página funciona */
    }

    requestAnimationFrame(() =>
      requestAnimationFrame(() => root.classList.remove("theme-switching"))
    );
  }

  const currentTheme = () => document.documentElement.getAttribute("data-theme");
  const toggleTheme = () => applyTheme(currentTheme() === "dark" ? "light" : "dark");

  function initTheme() {
    applyTheme(preferredTheme());
    document.querySelector(".theme-toggle")?.addEventListener("click", toggleTheme);
  }

  /* ---------- Barra de progreso de lectura ---------- */

  function initReadingProgress() {
    const bar = document.querySelector(".reading-progress");

    if (!bar) return;

    const slug = MentorAI.currentTutorialSlug();
    let lastSaved = 0;

    const update = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = height > 0 ? (window.scrollY / height) * 100 : 0;

      bar.style.width = `${progress}%`;

      const now = Date.now();

      if (now - lastSaved > SAVE_EVERY_MS) {
        MentorAI.Reading.save(slug, progress);
        lastSaved = now;
      }
    };

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ---------- Scrollspy del índice ---------- */

  function initScrollSpy() {
    const links = [...document.querySelectorAll(".toc__list a")];

    if (links.length === 0) return;

    const sections = links
      .map((link) => document.getElementById(link.getAttribute("href").slice(1)))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          for (const link of links) {
            link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    for (const section of sections) {
      observer.observe(section);
    }
  }

  /* ---------- Copiar bloques de código ---------- */

  function copyToClipboard(text) {
    if (navigator.clipboard?.writeText) {
      return navigator.clipboard.writeText(text);
    }

    return Promise.reject(new Error("sin clipboard API"));
  }

  /* El portapapeles moderno exige contexto seguro, y por file:// no lo hay:
     de ahí el camino alternativo con execCommand. */
  function copyLegacy(text) {
    const area = document.createElement("textarea");

    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();

    try {
      document.execCommand("copy");
    } finally {
      area.remove();
    }
  }

  function initCopyButtons() {
    for (const button of document.querySelectorAll(".copy-btn")) {
      button.addEventListener("click", () => {
        const code = button.closest(".code-block")?.querySelector("code");

        if (!code) return;

        const label = button.querySelector(".copy-btn__label");
        const text = code.innerText;

        const feedback = () => {
          button.classList.add("is-copied");

          if (label) label.textContent = "Copiado";

          setTimeout(() => {
            button.classList.remove("is-copied");

            if (label) label.textContent = "Copiar";
          }, 1800);
        };

        copyToClipboard(text)
          .then(feedback)
          .catch(() => {
            try {
              copyLegacy(text);
              feedback();
            } catch {
              /* el navegador no permitió copiar */
            }
          });
      });
    }
  }

  /* ---------- Año del footer ---------- */

  function initYear() {
    const el = document.querySelector("[data-year]");

    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------- Menú lateral en móvil ---------- */

  const PAGES = [
    { id: "index", label: "Inicio" },
    { id: "rutas", label: "Rutas" },
    { id: "cursos", label: "Cursos" },
    { id: "articulos", label: "Artículos" },
    { id: "repaso", label: "Repaso" },
    { id: "offline", label: "Sin conexión" },
  ];

  const drawerThemeIcon = () => (currentTheme() === "dark" ? SUN_SVG : MOON_SVG);

  function initMobileNav() {
    const navActions = document.querySelector(".nav__actions");

    if (!navActions) return;

    const { pathname } = window.location;
    const page = pathname.slice(pathname.lastIndexOf("/") + 1).replace(/\.html$/, "");
    const isRoot = page === "" || page === "index";
    const prefix = pathname.includes("/tutorials/") ? "../" : "";

    const enlaces = PAGES.map(({ id, label }) => {
      const activa = id === page || (isRoot && id === "index") ? " is-active" : "";

      return `<a class="nav-drawer__link${activa}" href="${prefix}${id}.html">${label}</a>`;
    }).join("");

    const burger = document.createElement("button");
    burger.className = "icon-btn nav__burger";
    burger.setAttribute("aria-label", "Menú");
    burger.innerHTML = BURGER_SVG;
    navActions.appendChild(burger);

    const backdrop = document.createElement("div");
    backdrop.className = "nav-drawer-backdrop";

    const drawer = document.createElement("div");
    drawer.className = "nav-drawer";
    drawer.innerHTML = `<div class="nav-drawer__head">
        <span class="nav-drawer__title">MentorAI</span>
        <div class="nav-drawer__head-actions">
          <button class="icon-btn nav-drawer__theme-toggle" aria-label="Cambiar tema">${drawerThemeIcon()}</button>
          <button class="icon-btn nav-drawer__close" aria-label="Cerrar">${CLOSE_NAV_SVG}</button>
        </div>
      </div>
      <nav class="nav-drawer__links">${enlaces}</nav>`;

    document.body.append(backdrop, drawer);

    const setOpen = (isOpen) => {
      drawer.classList.toggle("is-open", isOpen);
      backdrop.classList.toggle("is-open", isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
    };

    burger.addEventListener("click", () => setOpen(true));
    backdrop.addEventListener("click", () => setOpen(false));
    drawer.querySelector(".nav-drawer__close").addEventListener("click", () => setOpen(false));

    const themeToggle = drawer.querySelector(".nav-drawer__theme-toggle");

    themeToggle.addEventListener("click", () => {
      toggleTheme();
      themeToggle.innerHTML = drawerThemeIcon();
    });
  }

  /* ---------- Saltar al contenido ----------
     Se inyecta desde aquí, como el enlace de "Repaso" en la navegación,
     para no tener que tocar los 200 HTML del catálogo. */

  function initSkipLink() {
    const destino = document.querySelector("main") ?? document.querySelector("header.nav + *");

    if (!destino || document.querySelector(".skip-link")) return;

    if (!destino.id) destino.id = "contenido";

    destino.setAttribute("tabindex", "-1");

    const enlace = document.createElement("a");

    enlace.className = "skip-link";
    enlace.href = `#${destino.id}`;
    enlace.textContent = "Saltar al contenido";
    document.body.prepend(enlace);
  }

  /* ---------- API pública ---------- */

  Object.assign(MentorAI, {
    initTheme,
    initReadingProgress,
    initScrollSpy,
    initCopyButtons,
    initYear,
    initMobileNav,
    initSkipLink,
  });

  applyTheme(preferredTheme());
})();
