#!/usr/bin/env node
/* ============================================================
   MentorAI — Puente local con Claude Code
   ------------------------------------------------------------
   Sirve la web estática Y expone /api/generate en el mismo
   puerto (sin CORS). Cuando la web pide un tutorial nuevo, este
   servidor ejecuta Claude Code en modo headless (claude -p), que
   usa TU sesión de Claude Code (sin API key de Anthropic).

   Claude devuelve un JSON con el HTML y los metadatos; el
   servidor escribe tutorials/<slug>.html y añade la entrada al
   manifiesto. La web recarga y el tutorial ya está catalogado.

   Uso:
     node server/bridge.js
     # luego abre http://localhost:4321

   Variables de entorno opcionales:
     PORT        puerto (por defecto 4321)
     CLAUDE_BIN  binario de Claude Code (por defecto "claude")
     CLAUDE_MODEL  modelo a usar (por defecto el de tu config)
   ============================================================ */

"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { spawn } = require("child_process");

const ROOT = path.join(__dirname, "..");
const PORT = Number(process.env.PORT) || 4321;
const CLAUDE_BIN = process.env.CLAUDE_BIN || "claude";
const CLAUDE_MODEL = process.env.CLAUDE_MODEL || "";
const MANIFEST_PATH = path.join(ROOT, "tutorials", "manifest.js");
const TEMPLATE_PATH = path.join(ROOT, "tutorials", "_PLANTILLA.html");
const EXAMPLE_PATH = path.join(ROOT, "tutorials", "opcache.html");

const VALID_ICONS = ["bolt", "signal", "database", "shield", "code", "default"];

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".map": "application/json",
};

/* ---------- Utilidades ---------- */

function slugify(text) {
  return String(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function sendJson(response, statusCode, payload) {
  const body = JSON.stringify(payload);
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(body);
}

function readBody(request) {
  return new Promise(function (resolve, reject) {
    const chunks = [];
    let size = 0;

    request.on("data", function (chunk) {
      size += chunk.length;

      if (size > 1_000_000) {
        reject(new Error("Cuerpo de la petición demasiado grande"));
        request.destroy();
        return;
      }

      chunks.push(chunk);
    });

    request.on("end", function () {
      resolve(Buffer.concat(chunks).toString("utf8"));
    });

    request.on("error", reject);
  });
}

/* ---------- Servir ficheros estáticos ---------- */

function serveStatic(request, response) {
  const urlPath = decodeURIComponent(request.url.split("?")[0]);
  const relative = urlPath === "/" ? "index.html" : urlPath.replace(/^\/+/, "");
  const filePath = path.join(ROOT, relative);

  if (!filePath.startsWith(ROOT)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, function (error, content) {
    if (error) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("No encontrado: " + relative);
      return;
    }

    const mime = MIME_TYPES[path.extname(filePath)] || "application/octet-stream";
    response.writeHead(200, { "Content-Type": mime });
    response.end(content);
  });
}

/* ---------- Construir el prompt para Claude ---------- */

function buildPrompt(params) {
  const template = fs.readFileSync(TEMPLATE_PATH, "utf8");
  const example = fs.readFileSync(EXAMPLE_PATH, "utf8");

  return [
    "Eres un generador de tutoriales para la plataforma de formación 'MentorAI'.",
    "Devuelves EXCLUSIVAMENTE un objeto JSON válido: sin texto antes ni después,",
    "sin vallas de markdown (```), sin comentarios.",
    "",
    "Tema solicitado: " + params.topic,
    "Categoría (slug): " + params.category,
    "Nivel: " + params.level,
    "Minutos de lectura objetivo: " + params.minutes,
    "",
    "Genera un tutorial técnico PROFUNDO pero entendible, en español, con el mismo",
    "tono, estructura y componentes que el ejemplo de referencia. Debe incluir:",
    "entradilla con clase 'lead', secciones <h2 id=\"...\"> cuyos id coincidan con",
    "los enlaces del índice .toc__list, al menos un diagrama de flujo (.diagram",
    "con .flow) o una comparativa (.compare) cuando aporte, bloques de código con",
    "data-lang y botón copiar, varios callouts (info/tip/warning/danger) y un",
    "bloque .keypoints de resumen al final.",
    "",
    "Reglas estrictas:",
    "- Sigue EXACTAMENTE la estructura de la plantilla (head, nav, tutorial-hero,",
    "  tutorial-layout con .toc + .prose, footer y los <script> con rutas",
    "  ../tutorials/manifest.js NO hace falta; sí ../assets/js/main.js y la hoja",
    "  ../assets/css/styles.css).",
    "- Dentro de los <code data-lang=\"...\"> escapa < > & como &lt; &gt; &amp;.",
    "- data-lang admitidos: php, bash, ini.",
    "- Cada <h2 id=\"x\"> debe tener su entrada en .toc__list con href=\"#x\".",
    "- No añadas dependencias externas nuevas.",
    "- El 'slug' en kebab-case, corto y descriptivo.",
    "- 'icon' debe ser uno de: " + VALID_ICONS.join(", ") + ".",
    "",
    "PLANTILLA ESTRUCTURAL (respeta su esqueleto):",
    "<<<PLANTILLA",
    template,
    "PLANTILLA>>>",
    "",
    "EJEMPLO DE REFERENCIA (mismo estilo y profundidad):",
    "<<<EJEMPLO",
    example,
    "EJEMPLO>>>",
    "",
    "Responde con este JSON exacto (la página completa va en 'html'):",
    '{',
    '  "slug": "kebab-case",',
    '  "title": "Título atractivo y claro",',
    '  "description": "Resumen de 1-2 frases para la tarjeta del catálogo",',
    '  "topic": "Tema principal legible (ej: PHP, Bases de datos)",',
    '  "categories": ["' + params.category + '"],',
    '  "tags": ["Etiqueta1", "Etiqueta2"],',
    '  "icon": "uno de la lista",',
    '  "html": "<!DOCTYPE html> ... </html>"',
    '}',
  ].join("\n");
}

/* ---------- Ejecutar Claude Code en headless ---------- */

function runClaude(prompt) {
  return new Promise(function (resolve, reject) {
    const args = ["-p", "--output-format", "json"];

    if (CLAUDE_MODEL) {
      args.push("--model", CLAUDE_MODEL);
    }

    const child = spawn(CLAUDE_BIN, args, { cwd: ROOT });

    let stdout = "";
    let stderr = "";

    child.on("error", function (error) {
      if (error.code === "ENOENT") {
        reject(
          new Error(
            "No se encontró el binario '" +
              CLAUDE_BIN +
              "'. ¿Está Claude Code instalado y en el PATH?"
          )
        );
        return;
      }

      reject(error);
    });

    child.stdout.on("data", function (chunk) {
      stdout += chunk;
    });

    child.stderr.on("data", function (chunk) {
      stderr += chunk;
    });

    child.on("close", function (code) {
      if (code !== 0) {
        reject(new Error("Claude terminó con código " + code + ": " + stderr));
        return;
      }

      resolve(stdout);
    });

    child.stdin.write(prompt);
    child.stdin.end();
  });
}

// El envoltorio de --output-format json trae el texto del modelo en .result.
function extractModelJson(rawStdout) {
  let resultText = rawStdout;

  try {
    const envelope = JSON.parse(rawStdout);

    if (envelope && typeof envelope.result === "string") {
      resultText = envelope.result;
    }
  } catch (error) {
    /* no era un envoltorio JSON; usamos el stdout tal cual */
  }

  const fenceless = resultText
    .replace(/^[\s\S]*?```(?:json)?\s*/, function (match) {
      return match.indexOf("```") === -1 ? match : "";
    })
    .replace(/```[\s\S]*$/, "")
    .trim();

  const candidate = fenceless.startsWith("{") ? fenceless : resultText.trim();

  return JSON.parse(candidate);
}

/* ---------- Serializar entrada del manifiesto ---------- */

const ENTRY_KEY_ORDER = [
  "slug",
  "title",
  "description",
  "href",
  "categories",
  "topic",
  "tags",
  "level",
  "minutes",
  "icon",
  "status",
  "date",
  "featured",
];

function entryToJs(entry) {
  const lines = ENTRY_KEY_ORDER.filter(function (key) {
    return entry[key] !== undefined;
  }).map(function (key) {
    return "    " + key + ": " + JSON.stringify(entry[key]) + ",";
  });

  return "  {\n" + lines.join("\n") + "\n  },\n";
}

// Carga el manifiesto preservando su cabecera (comentario de cabecera).
function loadManifest() {
  const text = fs.readFileSync(MANIFEST_PATH, "utf8");
  const marker = "window.ACADEMIA_TUTORIALS";
  const markerIndex = text.indexOf(marker);

  if (markerIndex === -1) {
    throw new Error("manifest.js no tiene el marcador esperado");
  }

  const sandbox = { window: {} };
  vm.runInNewContext(text, sandbox);

  return {
    prefix: text.slice(0, markerIndex),
    entries: sandbox.window.ACADEMIA_TUTORIALS || [],
  };
}

function saveManifest(prefix, entries) {
  const body = entries.map(entryToJs).join("");
  fs.writeFileSync(
    MANIFEST_PATH,
    prefix + "window.ACADEMIA_TUTORIALS = [\n" + body + "];\n",
    "utf8"
  );
}

function manifestHasSlug(slug) {
  return loadManifest().entries.some(function (entry) {
    return entry.slug === slug;
  });
}

/* ---------- Endpoint de generación ---------- */

async function handleGenerate(request, response) {
  let params;

  try {
    params = JSON.parse(await readBody(request));
  } catch (error) {
    sendJson(response, 400, { ok: false, error: "JSON inválido en la petición" });
    return;
  }

  const topic = (params.topic || "").trim();

  if (!topic) {
    sendJson(response, 400, { ok: false, error: "Falta el tema del tutorial" });
    return;
  }

  const category = slugify(params.category || "general") || "general";
  const level = params.level || "Intermedio";
  const minutes = Number(params.minutes) || 12;

  console.log("→ Generando tutorial sobre:", topic);

  let model;

  try {
    const stdout = await runClaude(
      buildPrompt({ topic: topic, category: category, level: level, minutes: minutes })
    );
    model = extractModelJson(stdout);
  } catch (error) {
    console.error("✖", error.message);
    sendJson(response, 502, { ok: false, error: error.message });
    return;
  }

  if (!model || typeof model.html !== "string" || !model.html.includes("<!DOCTYPE")) {
    sendJson(response, 502, {
      ok: false,
      error: "Claude no devolvió un HTML válido",
    });
    return;
  }

  let slug = slugify(model.slug || model.title || topic);

  if (!slug) {
    slug = "tutorial-" + Date.now();
  }

  if (manifestHasSlug(slug)) {
    slug = slug + "-" + Date.now().toString().slice(-4);
  }

  const icon = VALID_ICONS.indexOf(model.icon) !== -1 ? model.icon : "default";
  const categories = Array.from(
    new Set([category].concat((model.categories || []).map(slugify)).filter(Boolean))
  );

  const entry = {
    slug: slug,
    title: model.title || topic,
    description: model.description || "",
    href: "tutorials/" + slug + ".html",
    categories: categories,
    topic: model.topic || "",
    tags: Array.isArray(model.tags) ? model.tags : [],
    level: level,
    minutes: minutes,
    icon: icon,
    status: "published",
    date: todayIso(),
    featured: true,
  };

  try {
    fs.writeFileSync(path.join(ROOT, "tutorials", slug + ".html"), model.html, "utf8");
    const manifest = loadManifest();
    manifest.entries.push(entry);
    saveManifest(manifest.prefix, manifest.entries);
  } catch (error) {
    console.error("✖", error.message);
    sendJson(response, 500, { ok: false, error: error.message });
    return;
  }

  console.log("✓ Tutorial creado:", slug);
  sendJson(response, 200, {
    ok: true,
    slug: slug,
    title: entry.title,
    href: entry.href,
  });
}

/* ---------- Endpoint de refinado ---------- */

function buildRefinePrompt(currentHtml, instructions) {
  return [
    "Eres editor de tutoriales de la plataforma de formación 'MentorAI'.",
    "Devuelves EXCLUSIVAMENTE un objeto JSON válido: sin texto antes ni después,",
    "sin vallas de markdown (```), sin comentarios.",
    "",
    "Te paso el HTML COMPLETO actual de un tutorial y una petición de cambios.",
    "Aplica los cambios SOBRE esa base, conservando el estilo, la estructura y",
    "los componentes de la plataforma. No rehagas lo que no se pide: respeta el",
    "contenido existente salvo en lo que afecten los cambios. Si añades secciones,",
    "añade también su entrada en el índice .toc__list.",
    "",
    "Petición de cambios del usuario:",
    instructions,
    "",
    "Reglas estrictas:",
    "- Devuelve la página HTML COMPLETA ya modificada (no un fragmento).",
    "- Dentro de los <code data-lang=\"...\"> escapa < > & como &lt; &gt; &amp;.",
    "- data-lang admitidos: php, bash, ini.",
    "- Cada <h2 id=\"x\"> debe tener su entrada en .toc__list con href=\"#x\".",
    "- Mantén las rutas ../assets/css/styles.css y ../assets/js/main.js.",
    "- No añadas dependencias externas nuevas.",
    "",
    "HTML ACTUAL:",
    "<<<HTML",
    currentHtml,
    "HTML>>>",
    "",
    "Responde con este JSON (el 'html' siempre; el resto solo si cambian):",
    "{",
    '  "html": "<!DOCTYPE html> ... </html>",',
    '  "title": "opcional, solo si cambia el título",',
    '  "description": "opcional",',
    '  "topic": "opcional",',
    '  "tags": ["opcional"],',
    '  "icon": "opcional, uno de: ' + VALID_ICONS.join(", ") + '",',
    '  "minutes": 12',
    "}",
  ].join("\n");
}

async function handleRefine(request, response) {
  let params;

  try {
    params = JSON.parse(await readBody(request));
  } catch (error) {
    sendJson(response, 400, { ok: false, error: "JSON inválido en la petición" });
    return;
  }

  const slug = slugify(params.slug || "");
  const instructions = (params.instructions || "").trim();

  if (!slug || !instructions) {
    sendJson(response, 400, {
      ok: false,
      error: "Faltan el tutorial o las instrucciones",
    });
    return;
  }

  const filePath = path.join(ROOT, "tutorials", slug + ".html");

  if (!filePath.startsWith(ROOT) || !fs.existsSync(filePath)) {
    sendJson(response, 404, { ok: false, error: "No existe ese tutorial" });
    return;
  }

  const manifest = loadManifest();
  const entry = manifest.entries.find(function (item) {
    return item.slug === slug;
  });

  if (!entry) {
    sendJson(response, 404, { ok: false, error: "El tutorial no está en el catálogo" });
    return;
  }

  console.log("→ Refinando tutorial:", slug);

  let model;

  try {
    const currentHtml = fs.readFileSync(filePath, "utf8");
    const stdout = await runClaude(buildRefinePrompt(currentHtml, instructions));
    model = extractModelJson(stdout);
  } catch (error) {
    console.error("✖", error.message);
    sendJson(response, 502, { ok: false, error: error.message });
    return;
  }

  if (!model || typeof model.html !== "string" || !model.html.includes("<!DOCTYPE")) {
    sendJson(response, 502, {
      ok: false,
      error: "Claude no devolvió un HTML válido",
    });
    return;
  }

  ["title", "description", "topic", "icon"].forEach(function (key) {
    if (model[key]) {
      entry[key] = model[key];
    }
  });

  if (Array.isArray(model.tags) && model.tags.length > 0) {
    entry.tags = model.tags;
  }

  if (Number(model.minutes) > 0) {
    entry.minutes = Number(model.minutes);
  }

  if (VALID_ICONS.indexOf(entry.icon) === -1) {
    entry.icon = "default";
  }

  try {
    fs.writeFileSync(filePath, model.html, "utf8");
    saveManifest(manifest.prefix, manifest.entries);
  } catch (error) {
    console.error("✖", error.message);
    sendJson(response, 500, { ok: false, error: error.message });
    return;
  }

  console.log("✓ Tutorial refinado:", slug);
  sendJson(response, 200, {
    ok: true,
    slug: slug,
    title: entry.title,
    href: entry.href,
  });
}

/* ---------- Servidor ---------- */

const server = http.createServer(function (request, response) {
  if (request.method === "POST" && request.url === "/api/generate") {
    handleGenerate(request, response).catch(function (error) {
      sendJson(response, 500, { ok: false, error: error.message });
    });
    return;
  }

  if (request.method === "POST" && request.url === "/api/refine") {
    handleRefine(request, response).catch(function (error) {
      sendJson(response, 500, { ok: false, error: error.message });
    });
    return;
  }

  if (request.method === "GET") {
    serveStatic(request, response);
    return;
  }

  response.writeHead(405);
  response.end("Método no permitido");
});

server.listen(PORT, function () {
  console.log("");
  console.log("  MentorAI — puente local activo");
  console.log("  ▶ http://localhost:" + PORT);
  console.log("  Binario de Claude: " + CLAUDE_BIN + (CLAUDE_MODEL ? " (modelo " + CLAUDE_MODEL + ")" : ""));
  console.log("  Ctrl+C para parar");
  console.log("");
});
