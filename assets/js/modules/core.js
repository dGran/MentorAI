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

  MentorAI.initTheme = initTheme;
  MentorAI.initReadingProgress = initReadingProgress;
  MentorAI.initScrollSpy = initScrollSpy;
  MentorAI.initCopyButtons = initCopyButtons;
  MentorAI.initYear = initYear;

  applyTheme(getPreferredTheme());
})();
