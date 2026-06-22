/* ============================================================
   MentorAI — Persistencia: marcadores, progreso, lectura en curso
   Sin dependencias. Funciona por file://. Parte de window.MentorAI.
   ============================================================ */

(function () {
  "use strict";

  var MentorAI = (window.MentorAI = window.MentorAI || {});

  /* ---------- Marcadores (favoritos) en localStorage ----------
     Uso individual, sin servidor: guarda los slugs marcados. */
  MentorAI.Bookmarks = (function () {
    const KEY = "academia-bookmarks";

    function read() {
      try {
        const stored = JSON.parse(localStorage.getItem(KEY));
        return Array.isArray(stored) ? stored : [];
      } catch (error) {
        return [];
      }
    }

    function write(slugs) {
      localStorage.setItem(KEY, JSON.stringify(slugs));
    }

    return {
      has: function (slug) {
        return read().indexOf(slug) !== -1;
      },
      count: function () {
        return read().length;
      },
      toggle: function (slug) {
        const slugs = read();
        const index = slugs.indexOf(slug);
        const isSaved = index !== -1;

        if (isSaved) {
          slugs.splice(index, 1);
        }

        if (!isSaved) {
          slugs.push(slug);
        }

        write(slugs);

        return !isSaved;
      },
    };
  })();

  /* ---------- Progreso de lectura (localStorage) ----------
     Marca individual de "tutorial completado". Alimenta la ruta. */
  MentorAI.Progress = (function () {
    const KEY = "academia-progress";

    function read() {
      try {
        const stored = JSON.parse(localStorage.getItem(KEY));
        return Array.isArray(stored) ? stored : [];
      } catch (error) {
        return [];
      }
    }

    function write(slugs) {
      localStorage.setItem(KEY, JSON.stringify(slugs));
    }

    return {
      has: function (slug) {
        return read().indexOf(slug) !== -1;
      },
      count: function () {
        return read().length;
      },
      toggle: function (slug) {
        const slugs = read();
        const index = slugs.indexOf(slug);
        const isDone = index !== -1;

        if (isDone) {
          slugs.splice(index, 1);
        }

        if (!isDone) {
          slugs.push(slug);
        }

        write(slugs);

        return !isDone;
      },
      remove: function (slugsToRemove) {
        const remaining = read().filter(function (slug) {
          return slugsToRemove.indexOf(slug) === -1;
        });

        write(remaining);
      },
    };
  })();

  /* ---------- Lectura en curso (% de scroll por tutorial) ----------
     Persistencia individual del avance dentro de cada tutorial para
     alimentar "Seguir viendo" en la portada. Guarda el % máximo. */
  MentorAI.Reading = (function () {
    const KEY = "academia-reading";
    const MIN_PERCENT = 5;

    function read() {
      try {
        const stored = JSON.parse(localStorage.getItem(KEY));
        return stored && typeof stored === "object" ? stored : {};
      } catch (error) {
        return {};
      }
    }

    function write(map) {
      localStorage.setItem(KEY, JSON.stringify(map));
    }

    return {
      save: function (slug, percent) {
        if (!slug || percent < MIN_PERCENT) {
          return;
        }

        const map = read();
        const previous = map[slug] ? map[slug].percent : 0;

        map[slug] = {
          percent: Math.max(previous, Math.round(percent)),
          updatedAt: Date.now(),
        };

        write(map);
      },
      get: function (slug) {
        return read()[slug] || null;
      },
      list: function () {
        const map = read();

        return Object.keys(map)
          .map(function (slug) {
            return {
              slug: slug,
              percent: map[slug].percent,
              updatedAt: map[slug].updatedAt,
            };
          })
          .sort(function (a, b) {
            return b.updatedAt - a.updatedAt;
          });
      },
      clear: function (slugsToClear) {
        const map = read();

        slugsToClear.forEach(function (slug) {
          delete map[slug];
        });

        write(map);
      },
    };
  })();
})();
