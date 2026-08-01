#!/usr/bin/env node
/* ============================================================
   MentorAI — Verificación del modo offline, de extremo a extremo
   ------------------------------------------------------------
     node scripts/verificar-offline.js

   Monta el sitio bajo un subdirectorio (como hace GitHub Pages con
   /MentorAI/), lo sirve, conduce Chrome por CDP, descarga toda la
   academia, **mata el servidor** y comprueba que todo sigue funcionando.

   Matar el servidor es el único offline honesto: `Network.emulateNetwork
   Conditions` de CDP NO afecta a las peticiones del service worker, solo
   a las de la página. Con él puesto, el worker sigue llegando a la red y
   el test pasa sin probar nada.

   Requiere google-chrome y Node 22+ (por el WebSocket nativo). No añade
   dependencias al proyecto: no se ejecuta en CI, es una comprobación
   manual reproducible.
   ============================================================ */

"use strict";

const fs = require("fs");
const http = require("http");
const os = require("os");
const path = require("path");
const { spawn, execFileSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const PUERTO_WEB = 8899;
const PUERTO_CDP = 9336;
const SUBDIR = "MentorAI";
const BASE = `http://127.0.0.1:${PUERTO_WEB}/${SUBDIR}/`;

const PAGINAS = [
  "index.html",
  "rutas.html",
  "cursos.html",
  "articulos.html",
  "curso.html",
  "repaso.html",
  "offline.html",
  "manifest.webmanifest",
  "sw.js",
];

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---------- Sitio servido bajo subdirectorio ---------- */

function prepararSitio() {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "mentorai-offline-"));
  const destino = path.join(base, SUBDIR);

  fs.mkdirSync(destino);

  for (const pagina of PAGINAS) {
    fs.copyFileSync(path.join(ROOT, pagina), path.join(destino, pagina));
  }

  fs.cpSync(path.join(ROOT, "assets"), path.join(destino, "assets"), { recursive: true });
  fs.cpSync(path.join(ROOT, "tutorials"), path.join(destino, "tutorials"), { recursive: true });

  return base;
}

/* ---------- Protocolo de Chrome ---------- */

function cdpGet(ruta) {
  return new Promise((ok, mal) => {
    http
      .get({ host: "127.0.0.1", port: PUERTO_CDP, path: ruta }, (res) => {
        let datos = "";
        res.on("data", (trozo) => (datos += trozo));
        res.on("end", () => ok(JSON.parse(datos)));
      })
      .on("error", mal);
  });
}

class Sesion {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pendientes = new Map();

    ws.addEventListener("message", (evento) => {
      const mensaje = JSON.parse(evento.data);

      if (!mensaje.id || !this.pendientes.has(mensaje.id)) return;

      const { ok, mal } = this.pendientes.get(mensaje.id);

      this.pendientes.delete(mensaje.id);
      mensaje.error ? mal(new Error(JSON.stringify(mensaje.error))) : ok(mensaje.result);
    });
  }

  enviar(metodo, parametros = {}) {
    this.id += 1;

    const id = this.id;

    return new Promise((ok, mal) => {
      this.pendientes.set(id, { ok, mal });
      this.ws.send(JSON.stringify({ id, method: metodo, params: parametros }));
    });
  }

  async evaluar(expresion) {
    const resultado = await this.enviar("Runtime.evaluate", {
      expression: expresion,
      awaitPromise: true,
      returnByValue: true,
    });

    if (resultado.exceptionDetails) {
      throw new Error(resultado.exceptionDetails.exception?.description ?? "excepción");
    }

    return resultado.result.value;
  }

  navegar(url) {
    return this.enviar("Page.navigate", { url }).then(() => esperar(2500));
  }

  async textoDe(selector) {
    return this.evaluar(
      `((document.querySelector(${JSON.stringify(selector)}) || {}).textContent || "")` +
        `.replace(/\\s+/g, " ").trim().slice(0, 50)`
    );
  }
}

/* ---------- Comprobaciones ---------- */

const resultados = [];

function anotar(nombre, valor, bien) {
  resultados.push({ nombre, bien });
  console.log(`  ${bien ? "✓" : "✗"} ${nombre.padEnd(38)} ${valor}`);
}

async function main() {
  const raizServida = prepararSitio();

  const servidor = spawn("python3", ["-m", "http.server", String(PUERTO_WEB), "--bind", "127.0.0.1"], {
    cwd: raizServida,
    stdio: "ignore",
    detached: true,
  });

  const chrome = spawn(
    "google-chrome",
    [
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      `--remote-debugging-port=${PUERTO_CDP}`,
      `--user-data-dir=${path.join(raizServida, "perfil")}`,
      BASE + "offline.html",
    ],
    { stdio: "ignore" }
  );

  const limpiar = () => {
    try {
      chrome.kill();
    } catch {
      /* ya estaba */
    }

    try {
      process.kill(-servidor.pid);
    } catch {
      /* ya estaba */
    }

    fs.rmSync(raizServida, { recursive: true, force: true });
  };

  try {
    await esperar(4000);

    const pestanas = await cdpGet("/json/list");
    const ws = new WebSocket(pestanas.find((p) => p.type === "page").webSocketDebuggerUrl);

    await new Promise((ok) => ws.addEventListener("open", ok, { once: true }));

    const sesion = new Sesion(ws);

    await sesion.enviar("Page.enable");
    await sesion.enviar("Runtime.enable");

    const scope = await sesion.evaluar(
      `navigator.serviceWorker.ready.then(function (r) { return r.scope })`
    );
    anotar("service worker bajo el subdirectorio", scope, scope.includes(`/${SUBDIR}/`));

    /* Descargar toda la academia y esperar a que la caché se estabilice */
    await sesion.evaluar(`document.getElementById("offline-all-btn").click(); 1`);

    let anterior = -1;
    let estable = 0;
    let total = 0;

    for (let vuelta = 0; vuelta < 300 && estable < 4; vuelta += 1) {
      await esperar(1000);

      total = await sesion.evaluar(`
        caches.keys().then(function (claves) {
          return Promise.all(claves.map(function (clave) {
            return caches.open(clave).then(function (cache) { return cache.keys() });
          })).then(function (listas) { return listas.flat().length });
        })
      `);

      estable = total === anterior ? estable + 1 : 0;
      anterior = total;
    }

    const publicados = JSON.parse(
      execFileSync("node", [
        "-e",
        `const fs=require("fs"),vm=require("vm");const s={window:{}};` +
          `vm.runInNewContext(fs.readFileSync(${JSON.stringify(path.join(ROOT, "tutorials/manifest.js"))},"utf8"),s);` +
          `console.log(s.window.ACADEMIA_TUTORIALS.filter(t=>t.status!=="soon").length)`,
      ]).toString()
    );

    anotar("academia descargada", `${total} entradas`, total >= publicados);

    /* El offline honesto: se apaga el servidor */
    process.kill(-servidor.pid);
    await esperar(1500);

    const muerto = await new Promise((ok) => {
      http
        .get({ host: "127.0.0.1", port: PUERTO_WEB, path: "/", timeout: 2000 }, () => ok(false))
        .on("error", () => ok(true));
    });

    anotar("servidor apagado", muerto ? "no responde" : "SIGUE VIVO", muerto);

    const paginas = [
      [BASE + "index.html", ".hero__title, h1", "inicio"],
      [BASE + "tutorials/pr-sse.html", ".tutorial-hero__title", "un tutorial"],
      [BASE + "curso.html?slug=infraestructura", ".course-hero__title", "curso.html?slug="],
      [BASE + "rutas.html", "h1", "rutas"],
      [BASE + "repaso.html", ".page-head__title", "repaso"],
    ];

    for (const [url, selector, etiqueta] of paginas) {
      await sesion.navegar(url);

      const texto = await sesion.textoDe(selector);

      anotar(`${etiqueta} sin servidor`, texto || "(vacío)", texto.length > 0);
    }

    await sesion.navegar(BASE + "tutorials/inf-tls.html");

    const contenido = await sesion.evaluar(`
      JSON.stringify({
        secciones: document.querySelectorAll(".prose h2").length,
        bloques: document.querySelectorAll("pre code").length,
        estilos: getComputedStyle(document.body).backgroundColor
      })
    `);
    const { secciones } = JSON.parse(contenido);

    anotar("tutorial íntegro y con estilos", contenido, secciones > 0);

    await sesion.navegar(BASE + "index.html");

    const busqueda = await sesion.evaluar(`
      (function () {
        var input = document.getElementById("home-search");
        input.value = "cerebro dividido";
        input.dispatchEvent(new Event("input"));
        return new Promise(function (ok) {
          setTimeout(function () {
            ok("indice=" + (window.MENTORAI_SEARCH ? "SI" : "NO") +
               " resultados=" + document.querySelectorAll("#home-results .mini-card").length);
          }, 3500);
        });
      })()
    `);
    anotar("buscador full-text sin servidor", busqueda, !busqueda.includes("resultados=0"));

    await sesion.navegar(BASE + "no-existe.html");

    const fallback = await sesion.textoDe("h1");

    anotar("fallback de página no cacheada", fallback, /sin conexi/i.test(fallback));
  } finally {
    limpiar();
  }

  const fallos = resultados.filter((r) => !r.bien);

  console.log(
    `\n  ${fallos.length === 0 ? "Offline verificado de extremo a extremo." : `${fallos.length} fallos.`}\n`
  );

  process.exit(fallos.length === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error("  error ejecutando la verificación:", error.message);
  process.exit(2);
});
