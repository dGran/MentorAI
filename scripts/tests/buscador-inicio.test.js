"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const MODULES = path.join(__dirname, "..", "..", "assets", "js", "modules");
const MODULES_IN_PAGE_ORDER = ["ui-text.js", "ui-icons.js", "search.js", "search-engine.js", "home.js"];

const TUTORIALS = [
  {
    slug: "sb-rls",
    title: "Row Level Security en Supabase",
    description: "Políticas por fila",
    href: "tutorials/sb-rls.html",
    topic: "Supabase",
    categories: ["supabase", "seguridad"],
    tags: ["RLS", "Postgres"],
    level: "Intermedio",
    minutes: 19,
    icon: "shield",
    status: "published",
  },
  {
    slug: "sec-autorizacion",
    title: "Autorización: quién puede hacer qué",
    description: "Filtrar en la consulta y denegar por defecto",
    href: "tutorials/sec-autorizacion.html",
    topic: "Seguridad",
    categories: ["seguridad"],
    tags: ["IDOR"],
    level: "Intermedio",
    minutes: 14,
    icon: "shield",
    status: "published",
  },
  {
    slug: "docker-compose",
    title: "Docker Compose para desarrollo",
    description: "Varios contenedores con un fichero",
    href: "tutorials/docker-compose.html",
    topic: "Docker",
    categories: ["devops"],
    tags: ["Compose"],
    level: "Principiante",
    minutes: 12,
    icon: "code",
    status: "published",
  },
  {
    slug: "planes-de-ejecucion",
    title: "Planes de ejecución",
    description: "Cuándo el planificador usa un índice",
    href: "tutorials/planes-de-ejecucion.html",
    topic: "Bases de datos",
    categories: ["bbdd"],
    tags: ["Planificador"],
    level: "Avanzado",
    minutes: 11,
    icon: "database",
    status: "published",
  },
  {
    slug: "indices-btree",
    title: "Índices B-tree",
    description: "Por qué tu consulta es lenta",
    href: "tutorials/indices-btree.html",
    topic: "Bases de datos",
    categories: ["bbdd"],
    tags: ["Índices"],
    level: "Intermedio",
    minutes: 15,
    icon: "database",
    status: "published",
  },
  {
    slug: "consultas-lentas",
    title: "Encontrar la consulta culpable",
    description: "EXPLAIN y el índice que falta",
    href: "tutorials/consultas-lentas.html",
    topic: "Bases de datos",
    categories: ["bbdd"],
    tags: ["EXPLAIN"],
    level: "Avanzado",
    minutes: 13,
    icon: "database",
    status: "published",
  },
  {
    slug: "proximo-supabase",
    title: "Supabase y la próxima versión",
    description: "Aún no publicado",
    href: "tutorials/proximo-supabase.html",
    topic: "Supabase",
    categories: ["supabase"],
    tags: [],
    level: "Intermedio",
    minutes: 10,
    icon: "database",
    status: "soon",
  },
];

const COURSES = [
  {
    slug: "supabase",
    title: "Supabase a fondo",
    summary: "Postgres con todo lo de alrededor: RLS, Auth y Storage",
    icon: "database",
    modules: [{ title: "Base", lessons: ["sb-rls"] }],
  },
  {
    slug: "docker",
    title: "Docker",
    summary: "Contenedores de principio a fin",
    icon: "code",
    lessons: ["docker-compose"],
  },
];

const PATHS = [
  {
    slug: "construir-un-servicio",
    title: "Construir un servicio",
    summary: "Con Docker, índices y Supabase",
    icon: "bolt",
    steps: [
      { type: "course", ref: "docker" },
      { type: "course", ref: "supabase" },
    ],
  },
];

const CONTENT_INDEX = {
  "sb-rls": "las politicas rls filtran cada fila con auth uid y un indice en user id",
  "sec-autorizacion": "postgres puede bajar la idea a la base de datos con row level security de supabase",
  "docker-compose": "un fichero compose levanta postgres y la app juntos",
  "indices-btree": "un arbol b equilibrado ordena las claves del indice",
  "consultas-lentas": "explain analyze ensena el plan y el indice que falta",
  "proximo-supabase": "contenido de supabase que aun no se publica",
};

function fakeElement() {
  return { hidden: true, innerHTML: "", textContent: "", value: "", addEventListener() {} };
}

function loadHome({ withContentIndex }) {
  const elements = {};
  const sandbox = {
    console,
    location: { pathname: "/index.html" },
    ACADEMIA_TUTORIALS: TUTORIALS,
    MENTORAI_COURSES: COURSES,
    MENTORAI_PATHS: PATHS,
    document: {
      getElementById: (id) => (elements[id] ??= fakeElement()),
      createElement: () => fakeElement(),
    },
  };
  sandbox.window = sandbox;

  if (withContentIndex) sandbox.MENTORAI_SEARCH = CONTENT_INDEX;

  vm.createContext(sandbox);

  for (const file of MODULES_IN_PAGE_ORDER) {
    const source = path.join(MODULES, file);

    if (fs.existsSync(source)) vm.runInContext(fs.readFileSync(source, "utf8"), sandbox);
  }

  return { MentorAI: sandbox.MentorAI, elements };
}

function search(query, { withContentIndex = true } = {}) {
  const { MentorAI, elements } = loadHome({ withContentIndex });
  const listeners = [];

  elements["home-search"] = { ...fakeElement(), value: query, addEventListener: (event, listener) => listeners.push(listener) };
  MentorAI.Home.initSearch();
  listeners[0]();

  const results = elements["home-results"];
  const hrefs = [...results.innerHTML.matchAll(/class="mini-card" href="([^"]+)"/g)].map((match) => match[1]);

  return { hrefs, status: elements["home-search-status"].textContent, html: results.innerHTML };
}

const REFERENCE_QUERIES = [
  {
    query: "supabase",
    expected: [
      "rutas.html#ruta-construir-un-servicio",
      "curso.html?slug=supabase",
      "tutorials/sb-rls.html",
      "tutorials/sec-autorizacion.html",
    ],
  },
  { query: "rls", expected: ["curso.html?slug=supabase", "tutorials/sb-rls.html"] },
  {
    query: "indice",
    expected: [
      "rutas.html#ruta-construir-un-servicio",
      "tutorials/indices-btree.html",
      "tutorials/planes-de-ejecucion.html",
      "tutorials/consultas-lentas.html",
      "tutorials/sb-rls.html",
    ],
  },
  { query: "compose docker", expected: ["tutorials/docker-compose.html"] },
  { query: "ÍNDICES", expected: ["rutas.html#ruta-construir-un-servicio", "tutorials/indices-btree.html"] },
  {
    query: "postgres",
    expected: [
      "curso.html?slug=supabase",
      "tutorials/sb-rls.html",
      "tutorials/sec-autorizacion.html",
      "tutorials/docker-compose.html",
    ],
  },
  { query: "arbol equilibrado", expected: ["tutorials/indices-btree.html"] },
  { query: "kubernetes", expected: [] },
];

for (const { query, expected } of REFERENCE_QUERIES) {
  test(`the home search keeps its results and order for «${query}»`, () => {
    assert.deepEqual(search(query).hrefs, expected);
  });
}

test("collections come first, then metadata matches, then content matches", () => {
  const hrefs = search("postgres").hrefs;

  assert.equal(hrefs[0], "curso.html?slug=supabase");
  assert.deepEqual(hrefs.slice(2), ["tutorials/sec-autorizacion.html", "tutorials/docker-compose.html"]);
});

test("a title match comes before a description match even when it is later in the manifest", () => {
  const hrefs = search("indice").hrefs;

  assert.ok(hrefs.indexOf("tutorials/indices-btree.html") < hrefs.indexOf("tutorials/planes-de-ejecucion.html"));
});

test("unpublished tutorials never appear, not even through their content", () => {
  assert.deepEqual(search("proxima version").hrefs, []);
});

test("a query without matches says so", () => {
  assert.match(search("kubernetes").status, /Sin resultados para kubernetes/);
});

test("before the content index loads, only metadata matches show and an empty result keeps looking", () => {
  assert.deepEqual(search("postgres", { withContentIndex: false }).hrefs, ["curso.html?slug=supabase", "tutorials/sb-rls.html"]);
  assert.match(search("arbol equilibrado", { withContentIndex: false }).status, /Buscando dentro del contenido/);
});

test("content matches show the excerpt with the term highlighted", () => {
  assert.match(search("arbol equilibrado").html, /<mark>arbol<\/mark>/);
});
