const fs = require("fs"), path = require("path");
const ROOT = process.argv[2];
const dir = path.join(ROOT, "tutorials");
const slugs = fs.readdirSync(dir).filter((f) => f.endsWith(".html") && !f.startsWith("_")).map((f) => f.slice(0, -5));
const set = new Set(slugs);
const entrantes = Object.fromEntries(slugs.map((s) => [s, new Set()]));
const salientes = {};
for (const s of slugs) {
  const html = fs.readFileSync(path.join(dir, s + ".html"), "utf8");
  const prose = (html.match(/<article class="prose"[\s\S]*?<\/article>/) || [""])[0].replace(/<nav class="tutorial-nav"[\s\S]*?<\/nav>/g, "");
  salientes[s] = new Set();
  for (const [, destino] of prose.matchAll(/href="(?:\.\.\/tutorials\/|\.\/)?([a-z0-9-]+)\.html(?:#[^"]*)?"/g)) {
    if (!set.has(destino) || destino === s) continue;
    entrantes[destino].add(s); salientes[s].add(destino);
  }
}
const sinEntrantes = slugs.filter((s) => entrantes[s].size === 0);
const sinSalientes = slugs.filter((s) => salientes[s].size === 0);
console.log(`piezas: ${slugs.length} · sin enlace entrante en texto: ${sinEntrantes.length} · sin enlace saliente: ${sinSalientes.length}`);
if (process.argv[3] === "--pares") for (const [a, b] of [["idempotencia","sd-garantias-de-entrega"],["cap-consistencia","sd-replicacion"],["procesos-hilos","maq-scheduler"],["inf-orquestacion","k8s-objetos"],["flujo-con-agentes","cc-agente-por-dentro"]]) console.log(`${a} → ${b}: ${salientes[a]?.has(b) ? "sí" : "NO"} · ${b} → ${a}: ${salientes[b]?.has(a) ? "sí" : "NO"}`);
