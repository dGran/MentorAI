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

  const VERSION = 1;
  const PREFIJO = "academia-";
  const NO_VIAJAN = ["academia-offline-saved", "academia-offline-todo", "academia-theme"];

  /* ---------- Lectura y escritura crudas ---------- */

  function leerJson(clave) {
    try {
      return JSON.parse(localStorage.getItem(clave));
    } catch {
      return null;
    }
  }

  function escribirJson(clave, valor) {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
    } catch {
      /* sin espacio: se importa lo que quepa */
    }
  }

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
      const valor = leerJson(clave);

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

  function fusionarClave(clave, mio, suyo) {
    if (clave === "academia-reading") return fusionarLectura(mio, suyo);
    if (clave === "academia-repaso") return fusionarRepaso(mio, suyo);
    if (clave === "academia-checks") return fusionarChecks(mio, suyo);
    if (clave.startsWith("academia-highlights:")) return fusionarSubrayados(mio, suyo);

    if (Array.isArray(suyo)) return union(mio, suyo);

    return suyo;
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

    for (const [clave, suyo] of Object.entries(contenido.datos)) {
      if (!clave.startsWith(PREFIJO) || NO_VIAJAN.includes(clave)) continue;

      escribirJson(clave, fusionarClave(clave, leerJson(clave), suyo));
    }

    const despues = resumenDe(contenidoExportado().datos);

    return { antes, despues };
  }

  /* ---------- Resumen para poder contarle al usuario qué cambió ---------- */

  function resumenDe(datos) {
    const subrayados = Object.entries(datos)
      .filter(([clave]) => clave.startsWith("academia-highlights:"))
      .reduce((suma, [, lista]) => suma + (Array.isArray(lista) ? lista.length : 0), 0);

    return {
      completados: (datos["academia-progress"] ?? []).length,
      marcadores: (datos["academia-bookmarks"] ?? []).length,
      enCurso: Object.keys(datos["academia-reading"] ?? {}).length,
      repaso: Object.keys(datos["academia-repaso"] ?? {}).length,
      comprobaciones: Object.keys(datos["academia-checks"] ?? {}).length,
      subrayados,
    };
  }

  /* ---------- Interfaz en la página de repaso ---------- */

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
          MentorAI.Highlights?.renderPage?.();
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
    resumen: () => resumenDe(contenidoExportado().datos),
    renderPage,
  };
  MentorAI.FicheroInvalido = FicheroInvalido;
})();
