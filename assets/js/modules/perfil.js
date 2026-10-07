/* ============================================================
   MentorAI — Llevarte tu progreso a otro dispositivo
   Exporta a un fichero e importa fusionando, nunca reemplazando: el
   caso real es la misma persona leyendo en el portátil y en el móvil,
   y ahí reemplazar tira lo leído en el otro sitio.
   No se exporta lo que describe a ESTE navegador (qué hay descargado
   para offline): importarlo sería mentir sobre una caché que no viaja.
   Sin dependencias. Funciona por file://. Parte de window.MentorAI.
   ============================================================ */

(function () {
  "use strict";

  const MentorAI = (window.MentorAI = window.MentorAI || {});

  class FicheroInvalido extends Error {}

  const VERSION = 2;
  const PREFIJO = "academia-";
  const CLAVE_CAMBIOS = "academia-cambios";
  const CLAVE_INDICE_SUBRAYADOS = "academia-highlights-index";
  const CLAVE_LECTURA = "academia-reading";
  const PREFIJO_SUBRAYADOS = "academia-highlights:";
  const NO_VIAJAN = [
    "academia-offline-saved",
    "academia-offline-todo",
    "academia-theme",
    "academia-sync",
  ];


  function clavesExportables() {
    const claves = [];

    for (let indice = 0; indice < localStorage.length; indice += 1) {
      const clave = localStorage.key(indice);

      if (!clave.startsWith(PREFIJO) || NO_VIAJAN.includes(clave)) continue;

      claves.push(clave);
    }

    return claves.sort();
  }

  /* ---------- Exportar ---------- */

  function contenidoExportado() {
    const datos = {};

    for (const clave of clavesExportables()) {
      const valor = MentorAI.readJson(clave, null);

      if (valor !== null) datos[clave] = valor;
    }

    return { version: VERSION, exportadoEn: new Date().toISOString(), datos };
  }

  function exportar() {
    const contenido = contenidoExportado();
    const blob = new Blob([JSON.stringify(contenido, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement("a");
    const fecha = contenido.exportadoEn.slice(0, 10);

    enlace.href = url;
    enlace.download = `mentorai-progreso-${fecha}.json`;
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);

    return resumenDe(contenido.datos);
  }

  /* ---------- Fusión ----------
     Cada tipo de dato tiene su regla, y todas eligen "lo más avanzado":
     si en un sitio leíste más o acertaste más, eso es lo que se queda. */

  const union = (a, b) => [...new Set([...(a ?? []), ...(b ?? [])])];

  function fusionarLectura(mio, suyo) {
    const resultado = { ...(mio ?? {}) };

    for (const [slug, entrada] of Object.entries(suyo ?? {})) {
      const actual = resultado[slug];

      resultado[slug] = actual
        ? {
            percent: Math.max(actual.percent ?? 0, entrada.percent ?? 0),
            updatedAt: Math.max(actual.updatedAt ?? 0, entrada.updatedAt ?? 0),
          }
        : entrada;
    }

    return resultado;
  }

  /* En repaso gana el paso más alto: refleja más aciertos acumulados. */
  function fusionarRepaso(mio, suyo) {
    const resultado = { ...(mio ?? {}) };

    for (const [id, entrada] of Object.entries(suyo ?? {})) {
      const actual = resultado[id];

      if (!actual || (entrada.s ?? 0) > (actual.s ?? 0)) {
        resultado[id] = entrada;
      }
    }

    return resultado;
  }

  /* En comprobaciones gana la más reciente. */
  function fusionarChecks(mio, suyo) {
    const resultado = { ...(mio ?? {}) };

    for (const [slug, entrada] of Object.entries(suyo ?? {})) {
      const actual = resultado[slug];

      if (!actual || (entrada.at ?? 0) > (actual.at ?? 0)) {
        resultado[slug] = entrada;
      }
    }

    return resultado;
  }

  const mismoSubrayado = (a, b) =>
    a.seccion === b.seccion && a.texto === b.texto && a.nth === b.nth;

  function fusionarSubrayados(mios, suyos) {
    const resultado = [...(mios ?? [])];

    for (const subrayado of suyos ?? []) {
      if (resultado.some((actual) => mismoSubrayado(actual, subrayado))) continue;

      resultado.push(subrayado);
    }

    return resultado;
  }

  const CAMPOS_DE_MEJOR_NOTA = ["bestScore", "best"];

  function fusionarExamen(mio, suyo) {
    const esResultado = (valor) => Boolean(valor) && typeof valor === "object";

    if (!esResultado(mio)) return suyo;
    if (!esResultado(suyo)) return mio;

    const resultado = {
      ...suyo,
      ...mio,
      passed: Boolean(mio.passed || suyo.passed),
      attempts: Math.max(mio.attempts ?? 0, suyo.attempts ?? 0),
    };

    for (const campo of CAMPOS_DE_MEJOR_NOTA) {
      if (!(campo in mio) && !(campo in suyo)) continue;

      resultado[campo] = Math.max(mio[campo] ?? 0, suyo[campo] ?? 0);
    }

    return resultado;
  }

  function fusionarPractica(mio, suyo) {
    const resultado = { ...(suyo ?? {}) };

    for (const [curso, hechos] of Object.entries(mio ?? {})) {
      resultado[curso] = { ...(resultado[curso] ?? {}), ...hechos };
    }

    return resultado;
  }

  function ganaElCambio(nuevo, actual) {
    if (!actual) return true;
    if (nuevo.at !== actual.at) return nuevo.at > actual.at;

    return nuevo.deleted === true && actual.deleted !== true;
  }

  function fusionarCambios(mios, suyos) {
    const resultado = {};
    const caducan = Date.now() - (MentorAI.CHANGE_RETENTION_MS ?? Infinity);

    for (const fuente of [mios ?? {}, suyos ?? {}]) {
      for (const [clave, elementos] of Object.entries(fuente)) {
        const porElemento = { ...(resultado[clave] ?? {}) };

        for (const [elemento, cambio] of Object.entries(elementos ?? {})) {
          if (typeof cambio?.at !== "number" || cambio.at < caducan) continue;
          if (!ganaElCambio(cambio, porElemento[elemento])) continue;

          porElemento[elemento] = cambio;
        }

        resultado[clave] = porElemento;
      }
    }

    return resultado;
  }

  const estaBorrado = (cambiosDeLaClave, elemento) => cambiosDeLaClave[elemento]?.deleted === true;
  const idDeSubrayado = (subrayado) => `${subrayado.seccion}|${subrayado.texto}|${subrayado.nth}`;

  function quitarBorrados(clave, valor, cambiosDeLaClave) {
    if (clave === CLAVE_LECTURA) {
      return Object.fromEntries(
        Object.entries(valor ?? {}).filter(([slug, entrada]) => {
          if (!estaBorrado(cambiosDeLaClave, slug)) return true;

          return (entrada?.updatedAt ?? 0) > cambiosDeLaClave[slug].at;
        })
      );
    }

    if (!Array.isArray(valor)) return valor;

    if (clave.startsWith(PREFIJO_SUBRAYADOS)) {
      return valor.filter((subrayado) => !estaBorrado(cambiosDeLaClave, idDeSubrayado(subrayado)));
    }

    return valor.filter((elemento) => !estaBorrado(cambiosDeLaClave, elemento));
  }

  function slugsConSubrayados() {
    const conSubrayados = clavesExportables()
      .filter((clave) => clave.startsWith(PREFIJO_SUBRAYADOS))
      .filter((clave) => MentorAI.readJson(clave, []).length > 0)
      .map((clave) => clave.slice(PREFIJO_SUBRAYADOS.length));
    const ordenPrevio = MentorAI.readJson(CLAVE_INDICE_SUBRAYADOS, []).filter((slug) => conSubrayados.includes(slug));

    return [...ordenPrevio, ...conSubrayados.filter((slug) => !ordenPrevio.includes(slug))];
  }

  function fusionarClave(clave, mio, suyo) {
    if (clave === CLAVE_LECTURA) return fusionarLectura(mio, suyo);
    if (clave === "academia-repaso") return fusionarRepaso(mio, suyo);
    if (clave === "academia-checks") return fusionarChecks(mio, suyo);
    if (clave === "academia-practica") return fusionarPractica(mio, suyo);
    if (clave.startsWith(PREFIJO_SUBRAYADOS)) return fusionarSubrayados(mio, suyo);
    if (clave.startsWith("academia-quiz-")) return fusionarExamen(mio, suyo);
    if (clave.startsWith("academia-examen-ruta-")) return fusionarExamen(mio, suyo);

    if (Array.isArray(suyo)) return union(mio, suyo);

    return mio ?? suyo;
  }

  /* ---------- Importar ---------- */

  function esValido(contenido) {
    return (
      contenido &&
      typeof contenido === "object" &&
      typeof contenido.version === "number" &&
      contenido.datos &&
      typeof contenido.datos === "object"
    );
  }

  function importar(texto) {
    let contenido = null;

    try {
      contenido = JSON.parse(texto);
    } catch {
      throw new FicheroInvalido("El fichero no es un JSON válido.");
    }

    if (!esValido(contenido)) {
      throw new FicheroInvalido("El fichero no parece una exportación de MentorAI.");
    }

    if (contenido.version > VERSION) {
      throw new FicheroInvalido(
        `El fichero es de una versión más nueva (v${contenido.version}). Actualiza la aplicación.`
      );
    }

    const antes = resumenDe(contenidoExportado().datos);
    const cambios = fusionarCambios(MentorAI.readJson(CLAVE_CAMBIOS, null), contenido.datos[CLAVE_CAMBIOS]);

    MentorAI.writeJson(CLAVE_CAMBIOS, cambios);

    for (const [clave, suyo] of Object.entries(contenido.datos)) {
      if (!clave.startsWith(PREFIJO) || NO_VIAJAN.includes(clave) || clave === CLAVE_CAMBIOS) continue;

      const borrados = cambios[clave] ?? {};
      const mio = quitarBorrados(clave, MentorAI.readJson(clave, null), borrados);

      MentorAI.writeJson(clave, fusionarClave(clave, mio, quitarBorrados(clave, suyo, borrados)));
    }

    for (const clave of clavesExportables()) {
      if (clave === CLAVE_CAMBIOS || !cambios[clave]) continue;

      MentorAI.writeJson(clave, quitarBorrados(clave, MentorAI.readJson(clave, null), cambios[clave]));
    }

    MentorAI.writeJson(CLAVE_INDICE_SUBRAYADOS, slugsConSubrayados());

    const despues = resumenDe(contenidoExportado().datos);

    return { antes, despues };
  }

  /* ---------- Resumen para poder contarle al usuario qué cambió ---------- */

  function resumenDe(datos) {
    const subrayados = Object.entries(datos)
      .filter(([clave]) => clave.startsWith(PREFIJO_SUBRAYADOS))
      .reduce((suma, [, lista]) => suma + (Array.isArray(lista) ? lista.length : 0), 0);

    return {
      completados: (datos["academia-progress"] ?? []).length,
      marcadores: (datos["academia-bookmarks"] ?? []).length,
      enCurso: Object.keys(datos[CLAVE_LECTURA] ?? {}).length,
      repaso: Object.keys(datos["academia-repaso"] ?? {}).length,
      comprobaciones: Object.keys(datos["academia-checks"] ?? {}).length,
      subrayados,
    };
  }

  /* ---------- Enlace en la navegación ----------
     Se inyecta como los de "Repaso" y "Sin conexión", para no tener que
     tocar los HTML del catálogo. */

  function injectNavLink() {
    const nav = document.querySelector(".nav__actions");

    if (!nav || nav.querySelector(".perfil-nav-link")) return;

    const base = MentorAI.basePath();
    const link = document.createElement("a");

    link.className = "nav__link perfil-nav-link";
    link.href = `${base}perfil.html`;
    link.textContent = "Perfil";

    if (/\bperfil\.html\b/.test(location.pathname)) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }

    nav.insertBefore(link, nav.querySelector(".offline-nav-link") ?? nav.querySelector(".theme-toggle"));
  }

  /* ---------- Interfaz en la página de perfil ---------- */

  const ETIQUETAS = {
    completados: "tutoriales completados",
    marcadores: "marcadores",
    enCurso: "en curso",
    repaso: "preguntas en repaso",
    comprobaciones: "comprobaciones hechas",
    subrayados: "subrayados",
  };

  function lineaDeResumen(resumen) {
    const partes = Object.entries(ETIQUETAS)
      .filter(([clave]) => resumen[clave] > 0)
      .map(([clave, etiqueta]) => `${resumen[clave]} ${etiqueta}`);

    return partes.length ? partes.join(" · ") : "Todavía no hay nada que llevarse.";
  }

  function contarNuevos(antes, despues) {
    const nuevos = Object.keys(ETIQUETAS)
      .map((clave) => [ETIQUETAS[clave], despues[clave] - antes[clave]])
      .filter(([, diferencia]) => diferencia > 0)
      .map(([etiqueta, diferencia]) => `+${diferencia} ${etiqueta}`);

    return nuevos.length ? nuevos.join(" · ") : "No había nada nuevo que añadir.";
  }

  function renderPage() {
    const host = document.getElementById("perfil");

    if (!host) return;

    const escapeHtml = MentorAI.escapeHtml;

    host.innerHTML = `<div class="perfil">
      <p class="perfil__resumen">${escapeHtml(lineaDeResumen(MentorAI.Perfil.resumen()))}</p>
      <div class="perfil__acciones">
        <button type="button" class="btn btn--primary" id="perfil-exportar">Exportar mi progreso</button>
        <label class="btn btn--ghost" for="perfil-fichero">Importar desde un fichero</label>
        <input type="file" id="perfil-fichero" accept="application/json,.json" hidden />
      </div>
      <p class="perfil__aviso" id="perfil-aviso" hidden></p>
    </div>`;

    const aviso = host.querySelector("#perfil-aviso");

    const decir = (mensaje, esError) => {
      aviso.hidden = false;
      aviso.textContent = mensaje;
      aviso.classList.toggle("perfil__aviso--error", Boolean(esError));
    };

    host.querySelector("#perfil-exportar").addEventListener("click", () => {
      const resumen = exportar();

      decir(`Descargado. Lleva: ${lineaDeResumen(resumen)}`, false);
    });

    host.querySelector("#perfil-fichero").addEventListener("change", (evento) => {
      const fichero = evento.target.files?.[0];

      if (!fichero) return;

      const lector = new FileReader();

      lector.onload = () => {
        try {
          const { antes, despues } = importar(String(lector.result));

          decir(`Importado y fusionado. ${contarNuevos(antes, despues)}`, false);
          renderPage();
          MentorAI.Repaso?.renderPage?.();
          MentorAI.renderHighlightsPage?.();
        } catch (fallo) {
          decir(
            fallo instanceof FicheroInvalido ? fallo.message : "No se pudo leer el fichero.",
            true
          );
        }
      };

      lector.onerror = () => decir("No se pudo leer el fichero.", true);
      lector.readAsText(fichero);
    });
  }

  /* ---------- API pública ---------- */

  MentorAI.Perfil = {
    exportar,
    importar,
    contenido: contenidoExportado,
    resumen: () => resumenDe(contenidoExportado().datos),
    injectNavLink,
    renderPage,
  };
  MentorAI.FicheroInvalido = FicheroInvalido;
})();
