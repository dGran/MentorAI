"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const MODULES = path.join(__dirname, "..", "..", "assets", "js", "modules");
const SOURCES = ["storage.js", "ui-text.js", "perfil.js", "sync.js"].map((name) =>
  fs.readFileSync(path.join(MODULES, name), "utf8")
);

const SYNC_KEY = "academia-sync";
const GIST_FILE = "mentorai-progreso.json";
const GIST_ID = "gist-propio";
const TOKEN = "ghp_prueba";
const SECONDS = 1000;
const KEEPALIVE_LIMIT_BYTES = 60 * 1024;
const GISTS_PER_PAGE = 100;

function createMemoryStorage(initialEntries, { isFull = () => false } = {}) {
  const entries = new Map(Object.entries(initialEntries).map(([key, value]) => [key, JSON.stringify(value)]));

  return {
    getItem: (key) => (entries.has(key) ? entries.get(key) : null),
    setItem: (key, value) => {
      if (isFull(key)) throw new Error("QuotaExceededError");

      entries.set(key, String(value));
    },
    removeItem: (key) => entries.delete(key),
    key: (index) => [...entries.keys()][index] ?? null,
    get length() {
      return entries.size;
    },
    read: (key) => JSON.parse(entries.get(key) ?? "null"),
  };
}

function jsonResponse(body, { ok = true, status = 200 } = {}) {
  return { ok, status, json: async () => body, text: async () => JSON.stringify(body) };
}

function gistResponse(content) {
  return jsonResponse({ id: GIST_ID, files: { [GIST_FILE]: { content, truncated: false } } });
}

function loadApp({ localEntries = {}, respond, isFull }) {
  const localStorage = createMemoryStorage(localEntries, { isFull });
  const requests = [];
  const listeners = {};
  const document = {
    visibilityState: "visible",
    getElementById: () => null,
    querySelector: () => null,
    addEventListener: (type, listener) => {
      listeners[type] = listener;
    },
  };
  const fetch = (url, options = {}) => {
    const request = { url, method: options.method ?? "GET", body: options.body, keepalive: options.keepalive };

    requests.push(request);

    return Promise.resolve(respond(request));
  };
  const sandbox = { localStorage, document, fetch, navigator: { onLine: true }, TextEncoder, console };
  sandbox.window = sandbox;

  vm.createContext(sandbox);
  SOURCES.forEach((source) => vm.runInContext(source, sandbox));

  const hide = () => {
    document.visibilityState = "hidden";
    listeners.visibilitychange?.();
    document.visibilityState = "visible";
  };

  return { MentorAI: sandbox.MentorAI, localStorage, requests, hide };
}

function loadStartedApp(options) {
  const app = loadApp(options);

  app.MentorAI.Sync.init();

  return app;
}

const connected = (extra = {}) => ({ [SYNC_KEY]: { token: TOKEN, gistId: GIST_ID, ...extra } });
const justSynced = () => connected({ ultimaSync: Date.now() });
const remoteExport = (datos = {}) => JSON.stringify({ version: 2, datos });
const patches = (requests) => requests.filter((request) => request.method === "PATCH");
const settle = () => new Promise((resolve) => setImmediate(resolve));

test("two overlapping syncs make a single round trip", async () => {
  const { MentorAI, requests } = loadApp({
    localEntries: connected(),
    respond: () => gistResponse(remoteExport()),
  });

  await Promise.all([MentorAI.Sync.sincronizar(), MentorAI.Sync.sincronizar()]);

  assert.equal(requests.filter((request) => request.method === "GET").length, 1);
});

test("a sync inside the interval is skipped unless forced", async () => {
  const { MentorAI, requests } = loadApp({
    localEntries: connected({ ultimaSync: Date.now() - 10 * SECONDS }),
    respond: () => gistResponse(remoteExport()),
  });

  await MentorAI.Sync.sincronizar();
  assert.equal(requests.length, 0);

  await MentorAI.Sync.sincronizar({ forzar: true });
  assert.ok(requests.length > 0);
});

test("a sync after the interval goes ahead", async () => {
  const { MentorAI, requests } = loadApp({
    localEntries: connected({ ultimaSync: Date.now() - 31 * SECONDS }),
    respond: () => gistResponse(remoteExport()),
  });

  await MentorAI.Sync.sincronizar();

  assert.ok(requests.length > 0);
});

test("the uploaded progress is compact JSON", async () => {
  const { MentorAI, requests } = loadApp({
    localEntries: { ...connected(), "academia-progress": ["opcache"] },
    respond: (request) => (request.method === "GET" ? gistResponse(remoteExport()) : jsonResponse({})),
  });

  await MentorAI.Sync.sincronizar();

  const [upload] = patches(requests);
  const content = JSON.parse(upload.body).files[GIST_FILE].content;

  assert.equal(content, JSON.stringify(JSON.parse(content)));
});

test("the upload on leaving uses keepalive only while the body fits", async () => {
  const small = loadStartedApp({
    localEntries: { ...justSynced(), "academia-progress": ["opcache"] },
    respond: () => jsonResponse({}),
  });
  const bigSlugs = Array.from({ length: 6000 }, (_, index) => `tutorial-con-nombre-largo-${index}`);
  const big = loadStartedApp({
    localEntries: { ...justSynced(), "academia-progress": bigSlugs },
    respond: () => jsonResponse({}),
  });

  small.hide();
  big.hide();
  await settle();

  const [smallUpload] = patches(small.requests);
  const [bigUpload] = patches(big.requests);

  assert.ok(Buffer.byteLength(bigUpload.body) > KEEPALIVE_LIMIT_BYTES);
  assert.equal(smallUpload.keepalive, true);
  assert.notEqual(bigUpload.keepalive, true);
});

test("a failed upload on leaving is retried the next time", async () => {
  let answers = 0;
  const { requests, hide } = loadStartedApp({
    localEntries: { ...justSynced(), "academia-progress": ["opcache"] },
    respond: () => {
      answers += 1;
      return jsonResponse({}, answers === 1 ? { ok: false, status: 502 } : {});
    },
  });

  hide();
  await settle();
  hide();
  await settle();

  assert.equal(patches(requests).length, 2);
});

test("a successful upload on leaving is not repeated without changes", async () => {
  const { requests, hide } = loadStartedApp({
    localEntries: { ...justSynced(), "academia-progress": ["opcache"] },
    respond: () => jsonResponse({}),
  });

  hide();
  await settle();
  hide();
  await settle();

  assert.equal(patches(requests).length, 1);
});

test("connecting finds an existing gist beyond the first page", async () => {
  const otherGists = Array.from({ length: GISTS_PER_PAGE }, (_, index) => ({ id: `otro-${index}`, files: { "notas.md": {} } }));
  const { MentorAI, requests, localStorage } = loadApp({
    respond: (request) => {
      if (request.url.includes("/gists?") && request.url.includes("page=2")) {
        return jsonResponse([{ id: GIST_ID, files: { [GIST_FILE]: {} } }]);
      }

      if (request.url.includes("/gists?")) return jsonResponse(otherGists);

      if (request.method === "GET") return gistResponse(remoteExport());

      return jsonResponse({});
    },
  });

  await MentorAI.Sync.vincular(TOKEN);

  assert.equal(requests.filter((request) => request.method === "POST").length, 0);
  assert.equal(localStorage.read(SYNC_KEY).gistId, GIST_ID);
});

test("importing without space left raises SinEspacio", () => {
  const { MentorAI } = loadApp({
    respond: () => jsonResponse({}),
    isFull: (key) => key === "academia-progress",
  });

  assert.throws(
    () => MentorAI.Perfil.importar(remoteExport({ "academia-progress": ["opcache"] })),
    (error) => error instanceof MentorAI.SinEspacio
  );
});

test("a sync that cannot store the merge does not upload it", async () => {
  const { MentorAI, requests } = loadApp({
    localEntries: connected(),
    respond: (request) =>
      request.method === "GET" ? gistResponse(remoteExport({ "academia-progress": ["opcache"] })) : jsonResponse({}),
    isFull: (key) => key === "academia-progress",
  });

  await MentorAI.Sync.sincronizar();

  assert.equal(patches(requests).length, 0);
});

test("a sync whose remote only differs in export time or key order does not upload", async () => {
  const remote = JSON.stringify({
    exportadoEn: "2020-01-01T00:00:00.000Z",
    datos: { "academia-reading": { regex: { updatedAt: 1, percent: 40 } }, "academia-progress": ["opcache"] },
    version: 2,
  });
  const { MentorAI, requests } = loadApp({
    localEntries: {
      ...connected(),
      "academia-progress": ["opcache"],
      "academia-reading": { regex: { percent: 40, updatedAt: 1 } },
    },
    respond: (request) => (request.method === "GET" ? gistResponse(remote) : jsonResponse({})),
  });

  await MentorAI.Sync.sincronizar();

  assert.equal(patches(requests).length, 0);
});
