/* ============================================================
   MentorAI — Subrayar texto dentro de un tutorial
   Se ancla por sección + texto + nº de ocurrencia, nunca por posición
   en el DOM: si el tutorial se reescribe, el subrayado sobrevive
   mientras su texto siga ahí, y si desaparece se descarta con aviso.
   Pinta con la CSS Custom Highlight API, que no toca el DOM: no choca
   con el resaltador de sintaxis y admite selecciones que cruzan
   etiquetas, que es el caso normal al subrayar una frase.
   Sin dependencias. Funciona por file://. Parte de window.MentorAI.
   ============================================================ */

(function () {
  "use strict";

  const MentorAI = (window.MentorAI = window.MentorAI || {});

  const NOMBRE_RESALTADO = "mentorai-subrayado";
  const MINIMO_CARACTERES = 3;
  const MAXIMO_CARACTERES = 400;

  const soportado = () => typeof Highlight === "function" && typeof CSS?.highlights === "object";

  let contenedor = null;
  let slugActual = "";
  let rangosPintados = [];
  let popover = null;

  /* ---------- Recorrido del texto ----------
     El mismo recorrido se usa al guardar y al restaurar, así que basta
     con que sea consistente consigo mismo. Se saltan los bloques de
     código: ahí manda el resaltador de sintaxis. */

  function seccionesDelArticulo() {
    const secciones = new Map();
    let actual = null;

    for (const hijo of contenedor.children) {
      if (hijo.tagName === "H2" && hijo.id) {
        actual = hijo.id;
        secciones.set(actual, []);
        continue;
      }

      if (actual) secciones.get(actual).push(hijo);
    }

    return secciones;
  }

  function nodosDeTexto(elementos) {
    const nodos = [];

    for (const elemento of elementos) {
      const recorrido = document.createTreeWalker(elemento, NodeFilter.SHOW_TEXT, {
        acceptNode(nodo) {
          if (nodo.parentElement.closest("pre, .code-block__head, .toc")) {
            return NodeFilter.FILTER_REJECT;
          }

          return nodo.nodeValue.trim() === "" ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
        },
      });

      let nodo = recorrido.nextNode();

      while (nodo) {
        nodos.push(nodo);
        nodo = recorrido.nextNode();
      }
    }

    return nodos;
  }

  /* Texto plano de la sección más un mapa para volver de un índice de ese
     texto al nodo y desplazamiento reales. Es lo que permite anclar por
     texto en vez de por posición. */
  function textoDeSeccion(elementos) {
    const piezas = [];
    let texto = "";

    for (const nodo of nodosDeTexto(elementos)) {
      const valor = nodo.nodeValue.replace(/\s+/g, " ");

      piezas.push({ nodo, desde: texto.length, hasta: texto.length + valor.length });
      texto += valor;
    }

    return { texto, piezas };
  }

  function posicionEnNodo(piezas, indice) {
    const pieza = piezas.find((actual) => indice >= actual.desde && indice < actual.hasta);

    if (!pieza) return null;

    return { nodo: pieza.nodo, desplazamiento: indice - pieza.desde };
  }

  function rangoPara(elementos, texto, nth) {
    const { texto: completo, piezas } = textoDeSeccion(elementos);

    let indice = -1;

    for (let vuelta = 0; vuelta < nth; vuelta += 1) {
      indice = completo.indexOf(texto, indice + 1);

      if (indice === -1) return null;
    }

    const inicio = posicionEnNodo(piezas, indice);
    const fin = posicionEnNodo(piezas, indice + texto.length - 1);

    if (!inicio || !fin) return null;

    const rango = document.createRange();

    rango.setStart(inicio.nodo, inicio.desplazamiento);
    rango.setEnd(fin.nodo, fin.desplazamiento + 1);

    return rango;
  }

  /* ---------- De una selección a un subrayado ---------- */

  function seccionDe(nodo) {
    const elemento = nodo.nodeType === Node.TEXT_NODE ? nodo.parentElement : nodo;
    const secciones = seccionesDelArticulo();

    for (const [id, elementos] of secciones) {
      if (elementos.some((candidato) => candidato.contains(elemento))) return id;
    }

    return null;
  }

  function subrayadoDesde(rango) {
    const texto = rango.toString().replace(/\s+/g, " ").trim();

    if (texto.length < MINIMO_CARACTERES || texto.length > MAXIMO_CARACTERES) return null;

    const seccion = seccionDe(rango.startContainer);

    if (!seccion) return null;

    const elementos = seccionesDelArticulo().get(seccion);
    const { texto: completo, piezas } = textoDeSeccion(elementos);
    const inicioReal = piezas.find((pieza) => pieza.nodo === rango.startContainer);

    if (!inicioReal) return null;

    /* nth = cuántas veces aparece ese texto antes de esta ocurrencia, +1 */
    const hasta = inicioReal.desde + rango.startOffset;
    let nth = 1;
    let indice = completo.indexOf(texto);

    while (indice !== -1 && indice < hasta) {
      indice = completo.indexOf(texto, indice + 1);

      if (indice !== -1 && indice <= hasta) nth += 1;
    }

    return { seccion, texto, nth };
  }

  /* ---------- Pintado ---------- */

  function repintar() {
    if (!soportado()) return;

    const resaltado = new Highlight();

    rangosPintados = [];

    const secciones = seccionesDelArticulo();

    let huerfanos = 0;

    for (const subrayado of MentorAI.Highlights.list(slugActual)) {
      const elementos = secciones.get(subrayado.seccion);
      const rango = elementos ? rangoPara(elementos, subrayado.texto, subrayado.nth) : null;

      if (!rango) {
        huerfanos += 1;
        continue;
      }

      resaltado.add(rango);
      rangosPintados.push({ rango, subrayado });
    }

    CSS.highlights.set(NOMBRE_RESALTADO, resaltado);
    mostrarContador(rangosPintados.length, huerfanos);
  }

  /* Se crea al vuelo dentro del índice lateral: no tiene sentido editar
     257 ficheros para meter un contador. */
  function elementoContador() {
    const existente = document.querySelector("[data-highlights-count]");

    if (existente) return existente;

    const toc = document.querySelector(".toc");

    if (!toc) return null;

    const aviso = document.createElement("p");

    aviso.className = "toc__highlights";
    aviso.hidden = true;
    aviso.setAttribute("data-highlights-count", "");
    toc.appendChild(aviso);

    return aviso;
  }

  function mostrarContador(pintados, huerfanos) {
    const aviso = elementoContador();

    if (!aviso) return;

    if (pintados === 0 && huerfanos === 0) {
      aviso.hidden = true;
      return;
    }

    aviso.hidden = false;
    aviso.textContent =
      `${pintados} ${pintados === 1 ? "subrayado" : "subrayados"}` +
      (huerfanos ? ` · ${huerfanos} ya no encaja${huerfanos === 1 ? "" : "n"} con el texto` : "");
  }

  /* ---------- Popover ---------- */

  function crearPopover() {
    const elemento = document.createElement("div");

    elemento.className = "subrayado-popover";
    elemento.hidden = true;
    document.body.appendChild(elemento);

    return elemento;
  }

  function ocultarPopover() {
    if (popover) popover.hidden = true;
  }

  function mostrarPopover(rango, etiqueta, alPulsar) {
    const caja = rango.getBoundingClientRect();

    popover.innerHTML = `<button type="button" class="subrayado-popover__accion">${etiqueta}</button>`;
    popover.hidden = false;

    const boton = popover.querySelector("button");

    boton.addEventListener("click", (evento) => {
      evento.preventDefault();
      alPulsar();
      ocultarPopover();
      window.getSelection().removeAllRanges();
    });

    const alto = popover.offsetHeight;

    popover.style.top = `${window.scrollY + caja.top - alto - 8}px`;
    popover.style.left = `${window.scrollX + caja.left + caja.width / 2 - popover.offsetWidth / 2}px`;
  }

  /* ---------- Interacción ---------- */

  function subrayadoBajoElPunto(evento) {
    const posicion = document.caretPositionFromPoint?.(evento.clientX, evento.clientY);

    if (!posicion) return null;

    return rangosPintados.find(({ rango }) =>
      rango.isPointInRange(posicion.offsetNode, posicion.offset)
    );
  }

  function alSoltar(evento) {
    const seleccion = window.getSelection();

    if (!seleccion || seleccion.isCollapsed) {
      const existente = subrayadoBajoElPunto(evento);

      if (!existente) return ocultarPopover();

      return mostrarPopover(existente.rango, "Quitar subrayado", () => {
        MentorAI.Highlights.remove(slugActual, existente.subrayado);
        repintar();
      });
    }

    const rango = seleccion.getRangeAt(0);

    if (!contenedor.contains(rango.commonAncestorContainer)) return ocultarPopover();

    const subrayado = subrayadoDesde(rango);

    if (!subrayado) return ocultarPopover();

    mostrarPopover(rango, "Subrayar", () => {
      MentorAI.Highlights.add(slugActual, subrayado);
      repintar();
    });
  }

  /* ---------- Arranque ---------- */

  function initHighlights() {
    contenedor = document.querySelector(".prose");

    if (!contenedor || !soportado()) return;

    slugActual = MentorAI.currentTutorialSlug();
    popover = crearPopover();

    repintar();

    contenedor.addEventListener("mouseup", alSoltar);
    document.addEventListener("scroll", ocultarPopover, { passive: true });
    document.addEventListener("mousedown", (evento) => {
      if (!popover.contains(evento.target)) ocultarPopover();
    });
  }

  /* ---------- Página de repaso: todo lo subrayado ---------- */

  function tituloDe(slug) {
    const tutorial = (window.ACADEMIA_TUTORIALS ?? []).find((actual) => actual.slug === slug);

    return tutorial?.title ?? slug;
  }

  function hrefDe(slug, seccion) {
    const tutorial = (window.ACADEMIA_TUTORIALS ?? []).find((actual) => actual.slug === slug);

    return `${tutorial?.href ?? `tutorials/${slug}.html`}#${seccion}`;
  }

  function grupoHtml(slug) {
    const { escapeHtml } = MentorAI;
    const subrayados = MentorAI.Highlights.list(slug);

    const fragmentos = subrayados
      .map(
        (subrayado) => `<li class="subrayados-grupo__item">
          <a href="${escapeHtml(hrefDe(slug, subrayado.seccion))}">${escapeHtml(subrayado.texto)}</a>
        </li>`
      )
      .join("");

    return `<article class="subrayados-grupo">
      <header class="subrayados-grupo__head">
        <h3 class="subrayados-grupo__titulo">
          <a href="${escapeHtml(hrefDe(slug, ""))}">${escapeHtml(tituloDe(slug))}</a>
        </h3>
        <span class="subrayados-grupo__cuenta">${subrayados.length}</span>
      </header>
      <ul class="subrayados-grupo__lista">${fragmentos}</ul>
    </article>`;
  }

  function renderPaginaDeRepaso() {
    const host = document.getElementById("subrayados");
    const seccion = document.getElementById("subrayados-seccion");

    if (!host || !seccion) return;

    const slugs = MentorAI.Highlights.slugs().filter((slug) => MentorAI.Highlights.count(slug) > 0);

    if (slugs.length === 0) {
      seccion.hidden = true;
      return;
    }

    seccion.hidden = false;
    host.innerHTML = `<div class="subrayados">${slugs.map(grupoHtml).join("")}</div>`;
  }

  /* ---------- API pública ---------- */

  MentorAI.initHighlights = initHighlights;
  MentorAI.Highlights.renderPage = renderPaginaDeRepaso;
})();
