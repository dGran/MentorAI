/* ============================================================
   MentorAI — Persistencia: marcadores, progreso, lectura en curso
   Uso individual, sin servidor: todo vive en localStorage con el
   prefijo "academia-".
   Sin dependencias. Funciona por file://. Parte de window.MentorAI.
   ============================================================ */

(function () {
  "use strict";

  const MentorAI = (window.MentorAI = window.MentorAI || {});

  /* ---------- Acceso seguro a localStorage ----------
     Puede fallar por cuota o por modo privado: si falla, la app sigue
     funcionando aunque no recuerde nada. */

  function readJson(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  }

  function writeJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* sin espacio o sin permiso: no persistimos, pero no rompemos */
    }
  }

  /* ---------- Conjunto de slugs ----------
     Marcadores y progreso son la misma estructura: una lista de slugs
     que se alterna. Se construyen los dos desde aquí. */

  function createSlugSet(key) {
    const read = () => {
      const stored = readJson(key, []);

      return Array.isArray(stored) ? stored : [];
    };

    return {
      has: (slug) => read().includes(slug),
      count: () => read().length,
      list: () => read(),
      toggle(slug) {
        const slugs = read();
        const isPresent = slugs.includes(slug);
        const updated = isPresent
          ? slugs.filter((current) => current !== slug)
          : [...slugs, slug];

        writeJson(key, updated);

        return !isPresent;
      },
      remove(slugsToRemove) {
        writeJson(
          key,
          read().filter((slug) => !slugsToRemove.includes(slug))
        );
      },
    };
  }

  MentorAI.Bookmarks = createSlugSet("academia-bookmarks");
  MentorAI.Progress = createSlugSet("academia-progress");

  /* ---------- Lectura en curso (% de scroll por tutorial) ----------
     Guarda el porcentaje máximo alcanzado en cada tutorial para
     alimentar "Seguir viendo" en la portada. */

  MentorAI.Reading = (() => {
    const KEY = "academia-reading";
    const MIN_PERCENT = 5;

    const read = () => {
      const stored = readJson(KEY, {});

      return stored && typeof stored === "object" ? stored : {};
    };

    return {
      save(slug, percent) {
        if (!slug || percent < MIN_PERCENT) return;

        const map = read();
        const previous = map[slug]?.percent ?? 0;

        map[slug] = {
          percent: Math.max(previous, Math.round(percent)),
          updatedAt: Date.now(),
        };

        writeJson(KEY, map);
      },
      get: (slug) => read()[slug] ?? null,
      list() {
        return Object.entries(read())
          .map(([slug, entry]) => ({ slug, ...entry }))
          .sort((a, b) => b.updatedAt - a.updatedAt);
      },
      clear(slugsToClear) {
        const map = read();

        for (const slug of slugsToClear) {
          delete map[slug];
        }

        writeJson(KEY, map);
      },
    };
  })();
})();
