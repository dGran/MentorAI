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

  /* ---------- Subrayados dentro de un tutorial ----------
     Una clave por tutorial, para no cargar los subrayados de 257
     tutoriales cuando solo estás leyendo uno. Cada subrayado se ancla por
     sección + texto + nº de ocurrencia, nunca por posición en el DOM: así
     sobrevive a que el tutorial se reescriba, mientras su texto siga ahí. */

  MentorAI.Highlights = (() => {
    const PREFIJO = "academia-highlights:";
    const INDICE = "academia-highlights-index";

    const claveDe = (slug) => PREFIJO + slug;

    const leer = (slug) => {
      const guardado = readJson(claveDe(slug), []);

      return Array.isArray(guardado) ? guardado : [];
    };

    /* Un índice aparte con los slugs que tienen subrayados, para que la
       página de repaso no tenga que recorrer todo localStorage. */
    const leerIndice = () => {
      const guardado = readJson(INDICE, []);

      return Array.isArray(guardado) ? guardado : [];
    };

    const actualizarIndice = (slug, tieneAlguno) => {
      const slugs = leerIndice();
      const estaba = slugs.includes(slug);

      if (tieneAlguno === estaba) return;

      writeJson(INDICE, tieneAlguno ? [...slugs, slug] : slugs.filter((s) => s !== slug));
    };

    const guardar = (slug, subrayados) => {
      writeJson(claveDe(slug), subrayados);
      actualizarIndice(slug, subrayados.length > 0);
    };

    const mismo = (a, b) => a.seccion === b.seccion && a.texto === b.texto && a.nth === b.nth;

    return {
      list: leer,
      slugs: leerIndice,
      count: (slug) => leer(slug).length,
      total: () => leerIndice().reduce((suma, slug) => suma + leer(slug).length, 0),
      add(slug, subrayado) {
        const subrayados = leer(slug);

        if (subrayados.some((actual) => mismo(actual, subrayado))) return false;

        guardar(slug, [...subrayados, { ...subrayado, creadoEn: Date.now() }]);

        return true;
      },
      remove(slug, subrayado) {
        guardar(
          slug,
          leer(slug).filter((actual) => !mismo(actual, subrayado))
        );
      },
      clear(slug) {
        guardar(slug, []);
      },
    };
  })();
})();
