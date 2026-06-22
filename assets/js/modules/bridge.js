/* ============================================================
   MentorAI — Puente local: compositor y refinador (server/bridge.js)
   Sin dependencias. Funciona por file://. Parte de window.MentorAI.
   ============================================================ */

(function () {
  "use strict";

  var MentorAI = (window.MentorAI = window.MentorAI || {});

  /* ---------- Puente local: compositor y refinador ----------
     Solo operativos cuando la web se sirve por el servidor (server/bridge.js).
     Abierto como file:// avisan de que hace falta arrancar el puente. */
  const IS_FILE_PROTOCOL = window.location.protocol === "file:";
  const BRIDGE_HINT =
    "Necesitas el puente local: ejecuta «node server/bridge.js» y abre http://localhost:4321";

  // Mecánica común de los modales (abrir, cerrar, estado).
  function createModalController(id) {
    const modal = document.getElementById(id);

    if (!modal) {
      return null;
    }

    const statusEl = modal.querySelector(".modal__status");

    function setStatus(message, kind) {
      if (!statusEl) {
        return;
      }

      statusEl.textContent = message || "";
      statusEl.className = "modal__status" + (kind ? " is-" + kind : "");
    }

    let lastFocused = null;

    function focusableElements() {
      const selector =
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

      return Array.from(modal.querySelectorAll(selector)).filter(function (el) {
        return el.offsetParent !== null;
      });
    }

    function focusInitial() {
      const items = focusableElements();
      const firstField = items.find(function (el) {
        return /^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName);
      });

      (firstField || items[0] || modal).focus();
    }

    function open() {
      lastFocused = document.activeElement;
      modal.hidden = false;
      document.body.style.overflow = "hidden";
      setStatus(IS_FILE_PROTOCOL ? BRIDGE_HINT : "", IS_FILE_PROTOCOL ? "warning" : "");
      focusInitial();
    }

    function close() {
      modal.hidden = true;
      document.body.style.overflow = "";

      if (lastFocused && typeof lastFocused.focus === "function") {
        lastFocused.focus();
      }
    }

    modal.querySelectorAll("[data-close]").forEach(function (el) {
      el.addEventListener("click", close);
    });

    modal.addEventListener("keydown", function (event) {
      if (event.key !== "Tab") {
        return;
      }

      const items = focusableElements();

      if (items.length === 0) {
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();

        return;
      }

      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !modal.hidden) {
        close();
      }
    });

    return { open: open, close: close, setStatus: setStatus };
  }

  // Llama al puente y recarga al terminar. Reutilizado por generar y refinar.
  function requestTutorial(url, payload, controller, submitBtn) {
    submitBtn.disabled = true;
    controller.setStatus("Trabajando con Claude… puede tardar 30-90 s.", "loading");

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        if (!result.ok) {
          throw new Error(result.error || "Error desconocido");
        }

        controller.setStatus("¡Listo! «" + result.title + "». Recargando…", "success");
        setTimeout(function () {
          window.location.reload();
        }, 1200);
      })
      .catch(function (error) {
        submitBtn.disabled = false;
        controller.setStatus("No se pudo completar: " + error.message, "error");
      });
  }

  function initComposer() {
    const controller = createModalController("composer");
    const openBtn = document.getElementById("open-composer");
    const form = document.getElementById("composer-form");

    if (!controller || !openBtn || !form) {
      return;
    }

    const submitBtn = document.getElementById("composer-submit");
    const datalist = document.getElementById("composer-categories");

    if (datalist && Array.isArray(window.ACADEMIA_TUTORIALS)) {
      const categories = {};

      window.ACADEMIA_TUTORIALS.forEach(function (tutorial) {
        (tutorial.categories || []).forEach(function (category) {
          categories[category] = true;
        });
      });

      datalist.innerHTML = Object.keys(categories)
        .map(function (category) {
          return '<option value="' + category + '"></option>';
        })
        .join("");
    }

    openBtn.addEventListener("click", controller.open);

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (IS_FILE_PROTOCOL) {
        controller.setStatus(BRIDGE_HINT, "warning");
        return;
      }

      const data = new FormData(form);

      requestTutorial(
        "/api/generate",
        {
          topic: data.get("topic"),
          category: data.get("category"),
          level: data.get("level"),
          minutes: data.get("minutes"),
        },
        controller,
        submitBtn
      );
    });
  }

  function initRefiner() {
    const controller = createModalController("refiner");
    const form = document.getElementById("refiner-form");

    if (!controller || !form) {
      return;
    }

    const submitBtn = document.getElementById("refiner-submit");
    const targetEl = document.getElementById("refiner-target");
    const selected = { slug: "" };

    document.querySelectorAll(".card__refine").forEach(function (btn) {
      btn.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();

        selected.slug = btn.dataset.refineSlug;
        form.reset();

        if (targetEl) {
          targetEl.textContent = "Sobre: " + btn.dataset.refineTitle;
        }

        controller.open();
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (IS_FILE_PROTOCOL) {
        controller.setStatus(BRIDGE_HINT, "warning");
        return;
      }

      const data = new FormData(form);

      requestTutorial(
        "/api/refine",
        { slug: selected.slug, instructions: data.get("instructions") },
        controller,
        submitBtn
      );
    });
  }

  MentorAI.initComposer = initComposer;
  MentorAI.initRefiner = initRefiner;
})();
