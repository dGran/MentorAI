/* ============================================================
   MentorAI — Sincronización del progreso entre dispositivos
   Guarda el mismo JSON del export en un Gist secreto de GitHub del
   propio usuario (su cuenta = su almacén: sin backend ni login). Es
   opcional y oportunista: sin token o sin red, la app es la de siempre
   — localStorage sigue siendo la única verdad y la fusión al bajar
   reutiliza las reglas de Perfil.importar (gana lo más avanzado).
   El token no viaja en el export (NO_VIAJAN en perfil.js).
   Sin dependencias. Funciona por file://. Parte de window.MentorAI.
   ============================================================ */

(function () {
  "use strict";

  const MentorAI = (window.MentorAI = window.MentorAI || {});

  const CLAVE = "academia-sync";
  const API = "https://api.github.com";
  const FICHERO = "mentorai-progreso.json";
  const DESCRIPCION = "MentorAI — progreso";
  const INTERVALO_MINIMO_MS = 30 * 1000;
  const LIMITE_KEEPALIVE_BYTES = 60 * 1024;
  const GISTS_POR_PAGINA = 100;
  const MAXIMO_DE_PAGINAS = 50;

  let estado = { fase: "inactivo", detalle: "" };
  let ultimoSubido = null;
  let isSincronizando = false;

  function leerConfig() {
    const guardado = MentorAI.readJson(CLAVE, null);

    return guardado && typeof guardado === "object" ? guardado : null;
  }

  function escribirConfig(config) {
    if (config === null) {
      MentorAI.removeKey(CLAVE);
      return;
    }

    MentorAI.writeJson(CLAVE, config);
  }

  /* ---------- Cliente de la API de Gists ---------- */

  function peticion(ruta, opciones = {}) {
    const { token } = leerConfig() ?? {};

    return fetch(API + ruta, {
      ...opciones,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        ...(opciones.body ? { "Content-Type": "application/json" } : {}),
      },
    });
  }

  async function buscarGistExistente() {
    for (let pagina = 1; pagina <= MAXIMO_DE_PAGINAS; pagina += 1) {
      const respuesta = await peticion(`/gists?per_page=${GISTS_POR_PAGINA}&page=${pagina}`);

      if (!respuesta.ok) return { error: respuesta.status };

      const gists = await respuesta.json();
      const propio = gists.find((gist) => gist.files && gist.files[FICHERO]);

      if (propio) return { gistId: propio.id };

      if (gists.length < GISTS_POR_PAGINA) return { gistId: null };
    }

    return { gistId: null };
  }

  async function crearGist(contenido) {
    const respuesta = await peticion("/gists", {
      method: "POST",
      body: JSON.stringify({
        description: DESCRIPCION,
        public: false,
        files: { [FICHERO]: { content: contenido } },
      }),
    });

    if (!respuesta.ok) return { error: respuesta.status };

    const gist = await respuesta.json();

    return { gistId: gist.id };
  }

  async function bajarGist(gistId) {
    const respuesta = await peticion(`/gists/${gistId}`);

    if (!respuesta.ok) return { error: respuesta.status };

    const gist = await respuesta.json();
    const fichero = gist.files?.[FICHERO];

    if (!fichero) return { contenido: null };

    if (fichero.truncated) {
      const crudo = await fetch(fichero.raw_url);

      return { contenido: crudo.ok ? await crudo.text() : null };
    }

    return { contenido: fichero.content };
  }

  const bytesDe = (texto) => new TextEncoder().encode(texto).length;

  function subirGist(gistId, contenido, { alSalir = false } = {}) {
    const cuerpo = JSON.stringify({ files: { [FICHERO]: { content: contenido } } });
    const shouldKeepAlive = alSalir && bytesDe(cuerpo) <= LIMITE_KEEPALIVE_BYTES;

    return peticion(`/gists/${gistId}`, {
      method: "PATCH",
      body: cuerpo,
      ...(shouldKeepAlive ? { keepalive: true } : {}),
    });
  }

  const contenidoLocal = () => JSON.stringify(MentorAI.Perfil.contenido());

  function conClavesOrdenadas(valor) {
    if (Array.isArray(valor)) return valor.map(conClavesOrdenadas);

    if (!valor || typeof valor !== "object") return valor;

    return Object.fromEntries(
      Object.keys(valor)
        .sort()
        .map((clave) => [clave, conClavesOrdenadas(valor[clave])])
    );
  }

  function huellaDe(texto) {
    try {
      const progreso = JSON.parse(texto);

      delete progreso.exportadoEn;

      return JSON.stringify(conClavesOrdenadas(progreso));
    } catch {
      return texto;
    }
  }

  function cambiarEstado(fase, detalle = "") {
    estado = { fase, detalle };
    pintarPanel();
  }

  const isDentroDelIntervalo = (config) => Date.now() - (config.ultimaSync ?? 0) < INTERVALO_MINIMO_MS;

  async function sincronizar({ forzar = false } = {}) {
    const config = leerConfig();

    if (!config?.token || !config?.gistId || isSincronizando) return;

    if (!forzar && isDentroDelIntervalo(config)) return;

    if (!navigator.onLine) {
      cambiarEstado("sin-conexion");
      return;
    }

    isSincronizando = true;

    try {
      await sincronizarConElGist(config);
    } finally {
      isSincronizando = false;
    }
  }

  async function sincronizarConElGist(config) {
    cambiarEstado("sincronizando");

    try {
      const { contenido, error } = await bajarGist(config.gistId);

      if (error === 401 || error === 404) {
        cambiarEstado("error", error === 401 ? "El token ya no es válido." : "El gist ya no existe.");
        return;
      }

      if (error) {
        cambiarEstado("sin-conexion");
        return;
      }

      const antesDeFusionar = contenidoLocal();
      const huellaRemota = contenido ? huellaDe(contenido) : null;

      if (huellaRemota && huellaRemota !== huellaDe(antesDeFusionar)) {
        try {
          MentorAI.Perfil.importar(contenido);
        } catch (fallo) {
          if (fallo instanceof MentorAI.SinEspacio) {
            cambiarEstado("error", fallo.message);
            return;
          }

          if (!(fallo instanceof MentorAI.FicheroInvalido)) throw fallo;

          cambiarEstado("error", "El contenido del gist no es un progreso válido.");
          return;
        }
      }

      const trasFusionar = contenidoLocal();
      const huellaTrasFusionar = huellaDe(trasFusionar);

      if (huellaTrasFusionar !== huellaRemota) {
        const subida = await subirGist(config.gistId, trasFusionar);

        if (!subida.ok) {
          cambiarEstado("sin-conexion");
          return;
        }
      }

      const configActual = leerConfig();

      if (configActual?.token !== config.token) return;

      ultimoSubido = huellaTrasFusionar;
      escribirConfig({ ...configActual, ultimaSync: Date.now() });
      cambiarEstado("sincronizado");

      if (huellaTrasFusionar !== huellaDe(antesDeFusionar)) repintarTodo();
    } catch {
      cambiarEstado("sin-conexion");
    }
  }

  function subirSiCambio() {
    const config = leerConfig();

    if (!config?.token || !config?.gistId || !navigator.onLine || isSincronizando) return;

    const actual = contenidoLocal();
    const huellaActual = huellaDe(actual);

    if (huellaActual === ultimoSubido) return;

    subirGist(config.gistId, actual, { alSalir: true })
      .then((respuesta) => {
        if (respuesta.ok) ultimoSubido = huellaActual;
      })
      .catch(() => {});
  }

  async function vincular(token) {
    escribirConfig({ token });
    cambiarEstado("sincronizando");

    const existente = await buscarGistExistente().catch(() => ({ error: "red" }));

    if (existente.error === 401) {
      escribirConfig(null);
      cambiarEstado("error", "Token inválido o sin el scope «gist». Debe ser un token clásico.");
      return;
    }

    if (existente.error) {
      escribirConfig(null);
      cambiarEstado("error", "No se pudo hablar con GitHub. ¿Hay conexión?");
      return;
    }

    let gistId = existente.gistId;

    if (!gistId) {
      const creado = await crearGist(contenidoLocal()).catch(() => ({ error: "red" }));

      if (creado.error) {
        escribirConfig(null);
        cambiarEstado("error", "No se pudo crear el gist. Revisa el scope del token.");
        return;
      }

      gistId = creado.gistId;
    }

    escribirConfig({ token, gistId });
    await sincronizar({ forzar: true });
  }

  async function desconectar({ borrarGist = false } = {}) {
    const config = leerConfig();
    let gistNoBorrado = false;

    if (borrarGist && config?.gistId) {
      const respuesta = await peticion(`/gists/${config.gistId}`, { method: "DELETE" }).catch(() => null);

      gistNoBorrado = !respuesta || (!respuesta.ok && respuesta.status !== 404);
    }

    escribirConfig(null);
    ultimoSubido = null;

    if (gistNoBorrado) {
      cambiarEstado("error", "Desconectado, pero el gist no se pudo borrar: hazlo desde gist.github.com.");
      return;
    }

    cambiarEstado("inactivo");
  }

  /* ---------- Refresco de las vistas tras una fusión con cambios ---------- */

  function repintarTodo() {
    MentorAI.Home?.render?.();
    MentorAI.Exams?.renderHome?.();
    MentorAI.Repaso?.renderHome?.();
    MentorAI.Repaso?.renderPage?.();
    MentorAI.renderHighlightsPage?.();
    MentorAI.Perfil?.renderPage?.();
    MentorAI.Catalog?.render?.();
    MentorAI.Courses?.render?.();
    MentorAI.Courses?.renderCoursePage?.();
    MentorAI.Paths?.render?.();
    MentorAI.Paths?.renderHome?.();
  }

  /* ---------- Panel en la página de repaso ---------- */

  function haceCuanto(momento) {
    if (!momento) return "todavía nunca";

    const minutos = Math.round((Date.now() - momento) / 60000);

    if (minutos < 1) return "hace un momento";
    if (minutos < 60) return `hace ${minutos} min`;
    if (minutos < 1440) return `hace ${Math.round(minutos / 60)} h`;

    return `hace ${Math.round(minutos / 1440)} días`;
  }

  function textoDeEstado(config) {
    if (estado.fase === "sincronizando") return "Sincronizando…";
    if (estado.fase === "sin-conexion") return `Sin conexión. Última sincronización: ${haceCuanto(config?.ultimaSync)}.`;
    if (estado.fase === "error") return estado.detalle;

    return `Sincronizado ${haceCuanto(config?.ultimaSync)}.`;
  }

  function mostrarErrorDeConexion(host, mensaje) {
    const aviso = host.querySelector("#sync-error");

    aviso.textContent = mensaje;
    aviso.hidden = false;
  }

  function pintarPanel() {
    const host = document.getElementById("sync");

    if (!host) return;

    const escapeHtml = MentorAI.escapeHtml;
    const config = leerConfig();

    if (!config?.token) {
      host.innerHTML = `<div class="sync">
        <h3 class="sync__titulo">Sincronizar entre dispositivos</h3>
        <p class="sync__texto">
          Guarda tu progreso en un <strong>gist secreto</strong> de tu cuenta de
          GitHub y todos tus dispositivos se pondrán de acuerdo solos, fusionando
          como el import. Necesitas un
          <a href="https://github.com/settings/tokens/new?scopes=gist&description=MentorAI%20sync" target="_blank" rel="noopener">token clásico con el scope «gist»</a>.
        </p>
        <div class="sync__acciones">
          <label class="visually-hidden" for="sync-token">Token de GitHub</label>
          <input type="password" class="sync__token" id="sync-token"
            placeholder="Pega aquí tu token (ghp_…)" autocomplete="off" />
          <button type="button" class="btn btn--primary" id="sync-conectar">Conectar</button>
        </div>
        <p class="sync__aviso sync__aviso--error" id="sync-error" role="alert"${estado.fase === "error" ? "" : " hidden"}>${
          estado.fase === "error" ? escapeHtml(estado.detalle) : ""
        }</p>
      </div>`;

      host.querySelector("#sync-conectar").addEventListener("click", () => {
        const token = host.querySelector("#sync-token").value.trim();

        if (!token) {
          mostrarErrorDeConexion(host, "Pega primero tu token de GitHub.");
          return;
        }

        vincular(token);
      });

      return;
    }

    const esError = estado.fase === "error";

    host.innerHTML = `<div class="sync">
      <h3 class="sync__titulo">Sincronizar entre dispositivos</h3>
      <p class="sync__texto">
        Conectado con el token <code>····${escapeHtml(config.token.slice(-4))}</code>.
      </p>
      <p class="sync__aviso${esError ? " sync__aviso--error" : ""}"${esError ? ' role="alert"' : ""}>${escapeHtml(textoDeEstado(config))}</p>
      <div class="sync__acciones">
        <button type="button" class="btn btn--primary" id="sync-ahora">Sincronizar ahora</button>
        <button type="button" class="btn btn--ghost" id="sync-desconectar">Desconectar</button>
      </div>
    </div>`;

    host.querySelector("#sync-ahora").addEventListener("click", () => sincronizar({ forzar: true }));
    host.querySelector("#sync-desconectar").addEventListener("click", () => {
      const borrarGist = window.confirm(
        "¿Borrar también el gist de GitHub?\n\nAceptar: borra el gist y desconecta.\nCancelar: solo desconecta este dispositivo (el gist sigue para los demás)."
      );

      desconectar({ borrarGist });
    });
  }

  /* ---------- Arranque ---------- */

  function init() {
    pintarPanel();
    sincronizar();

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") subirSiCambio();
    });
  }

  /* ---------- API pública ---------- */

  MentorAI.Sync = {
    init,
    sincronizar,
    vincular,
    desconectar,
  };
})();
