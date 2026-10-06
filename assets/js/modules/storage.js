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

  const CHANGES_KEY = "academia-cambios";
  const CHANGE_RETENTION_MS = 180 * 24 * 60 * 60 * 1000;

  MentorAI.CHANGE_RETENTION_MS = CHANGE_RETENTION_MS;

  function withoutExpiredChanges(changes, now) {
    const kept = {};

    for (const [key, items] of Object.entries(changes)) {
      const fresh = Object.entries(items ?? {}).filter(([, change]) => now - (change?.at ?? 0) < CHANGE_RETENTION_MS);

      if (fresh.length > 0) kept[key] = Object.fromEntries(fresh);
    }

    return kept;
  }

  function recordChanges(key, itemIds, isDeleted) {
    if (itemIds.length === 0) return;

    const now = Date.now();
    const stored = readJson(CHANGES_KEY, {});
    const changes = withoutExpiredChanges(stored && typeof stored === "object" ? stored : {}, now);
    const forKey = { ...(changes[key] ?? {}) };

    for (const itemId of itemIds) {
      forKey[itemId] = { at: now, deleted: isDeleted };
    }

    writeJson(CHANGES_KEY, { ...changes, [key]: forKey });
  }

  function changeTimesOf(key) {
    const stored = readJson(CHANGES_KEY, {});
    const forKey = (stored && typeof stored === "object" ? stored[key] : null) ?? {};

    return Object.fromEntries(
      Object.entries(forKey)
        .filter(([, change]) => change?.deleted === false)
        .map(([itemId, change]) => [itemId, change.at])
    );
  }

  function createSlugSet(key) {
    const read = () => {
      const stored = readJson(key, []);

      return Array.isArray(stored) ? stored : [];
    };

    return {
      has: (slug) => read().includes(slug),
      count: () => read().length,
      list: () => read(),
      markedAt: () => changeTimesOf(key),
      toggle(slug) {
        const slugs = read();
        const isPresent = slugs.includes(slug);
        const updated = isPresent
          ? slugs.filter((current) => current !== slug)
          : [...slugs, slug];

        writeJson(key, updated);
        recordChanges(key, [slug], isPresent);

        return !isPresent;
      },
      remove(slugsToRemove) {
        const slugs = read();

        writeJson(
          key,
          slugs.filter((slug) => !slugsToRemove.includes(slug))
        );
        recordChanges(key, slugsToRemove.filter((slug) => slugs.includes(slug)), true);
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
        const cleared = slugsToClear.filter((slug) => slug in map);

        for (const slug of slugsToClear) {
          delete map[slug];
        }

        writeJson(KEY, map);
        recordChanges(KEY, cleared, true);
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
    const idDe = (subrayado) => `${subrayado.seccion}|${subrayado.texto}|${subrayado.nth}`;

    return {
      list: leer,
      slugs: leerIndice,
      count: (slug) => leer(slug).length,
      total: () => leerIndice().reduce((suma, slug) => suma + leer(slug).length, 0),
      add(slug, subrayado) {
        const subrayados = leer(slug);

        if (subrayados.some((actual) => mismo(actual, subrayado))) return false;

        guardar(slug, [...subrayados, { ...subrayado, creadoEn: Date.now() }]);
        recordChanges(claveDe(slug), [idDe(subrayado)], false);

        return true;
      },
      remove(slug, subrayado) {
        const subrayados = leer(slug);

        guardar(
          slug,
          subrayados.filter((actual) => !mismo(actual, subrayado))
        );
        recordChanges(claveDe(slug), subrayados.filter((actual) => mismo(actual, subrayado)).map(idDe), true);
      },
      clear(slug) {
        const subrayados = leer(slug);

        guardar(slug, []);
        recordChanges(claveDe(slug), subrayados.map(idDe), true);
      },
    };
  })();
})();
