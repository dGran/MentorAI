/* ============================================================
   MentorAI — Búsqueda dentro del contenido (full-text)
   El índice (tutorials/search-index.js) pesa ~1,6 MB, así que no se
   carga con la página: se inyecta como <script> la primera vez que
   alguien escribe en un buscador. Inyectar un <script> sí funciona
   por file://, a diferencia de fetch.
   Sin dependencias. Funciona por file://. Parte de window.MentorAI.
   ============================================================ */

(function () {
  "use strict";

  const MentorAI = (window.MentorAI = window.MentorAI || {});

  const FICHERO = "tutorials/search-index.js";
  const CONTEXTO = 70;
  const MINIMO_PARA_BUSCAR = 3;

  let promesaDeCarga = null;

  /* ---------- Carga bajo demanda ---------- */

  function rutaDelIndice() {
    const { pathname } = window.location;

    return pathname.includes("/tutorials/") ? `../${FICHERO}` : FICHERO;
  }

  function inyectar(src) {
    return new Promise((resolver, rechazar) => {
      const etiqueta = document.createElement("script");

      etiqueta.src = src;
      etiqueta.onload = () => resolver();
      etiqueta.onerror = () => rechazar(new Error(`no se pudo cargar ${src}`));
      document.head.appendChild(etiqueta);
    });
  }

  /* Resuelve siempre: si el índice no está, la búsqueda sigue
     funcionando sobre los metadatos y nadie ve un error. */
  function cargar() {
    if (promesaDeCarga) return promesaDeCarga;

    promesaDeCarga = inyectar(rutaDelIndice()).catch(() => {});

    return promesaDeCarga;
  }

  const indice = () => window.MENTORAI_SEARCH ?? null;
  const estaListo = () => indice() !== null;

  /* ---------- Consulta ---------- */

  function coincide(slug, consulta) {
    if (consulta.length < MINIMO_PARA_BUSCAR) return false;

    const cuerpo = indice()?.[slug];

    return typeof cuerpo === "string" && cuerpo.includes(consulta);
  }

  /* Fragmento con la coincidencia resaltada, cortado por espacios para
     no partir palabras. El texto indexado ya viene normalizado, así que
     lo que se muestra no lleva acentos: es un extracto para ubicarte,
     no el texto del tutorial. */
  function fragmento(slug, consulta) {
    const cuerpo = indice()?.[slug];

    if (typeof cuerpo !== "string") return "";

    const posicion = cuerpo.indexOf(consulta);

    if (posicion === -1) return "";

    const desde = Math.max(0, posicion - CONTEXTO);
    const hasta = Math.min(cuerpo.length, posicion + consulta.length + CONTEXTO);
    const recorte = cuerpo.slice(desde, hasta);

    const inicioLimpio = desde > 0 ? recorte.indexOf(" ") + 1 : 0;
    const finLimpio = hasta < cuerpo.length ? recorte.lastIndexOf(" ") : recorte.length;
    const texto = recorte.slice(inicioLimpio, finLimpio);

    const relativa = texto.indexOf(consulta);
    const escapeHtml = MentorAI.escapeHtml;

    const html =
      escapeHtml(texto.slice(0, relativa)) +
      `<mark>${escapeHtml(texto.slice(relativa, relativa + consulta.length))}</mark>` +
      escapeHtml(texto.slice(relativa + consulta.length));

    return `${desde > 0 ? "…" : ""}${html}${hasta < cuerpo.length ? "…" : ""}`;
  }

  /* Engancha un input a la carga perezosa: en cuanto se escribe algo con
     sustancia se pide el índice y, al llegar, se repite la búsqueda. */
  function alBuscar(input, volverAFiltrar) {
    if (!input) return;

    input.addEventListener("input", () => {
      if (estaListo() || input.value.trim().length < MINIMO_PARA_BUSCAR) return;

      cargar().then(volverAFiltrar);
    });
  }

  /* ---------- API pública ---------- */

  MentorAI.Search = { cargar, estaListo, coincide, fragmento, alBuscar };
})();
