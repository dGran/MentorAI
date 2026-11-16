import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = process.env.PLAYWRIGHT_ROOT ?? execSync("npm root -g").toString().trim();
const { chromium } = await import(`${root}/playwright/index.mjs`);

const [runDir, branchUrl, mainUrl, fileUrl] = process.argv.slice(2);
const assets = path.join(runDir, "assets");
const QUERIES = ["supabase", "rls", "indice", "docker compose", "arbol equilibrado", "kubernetes"];

fs.mkdirSync(assets, { recursive: true });

async function searchAll(context, baseUrl, label) {
  const page = await context.newPage();
  const consoleErrors = [];
  page.on("console", (message) => message.type() === "error" && consoleErrors.push(message.text()));
  page.on("pageerror", (error) => consoleErrors.push(String(error)));
  await page.goto(baseUrl, { waitUntil: "load" });

  const results = {};

  for (const query of QUERIES) {
    await page.fill("#home-search", "");
    await page.fill("#home-search", query);
    await page.waitForFunction(
      () => window.MENTORAI_SEARCH && !/Buscando/.test(document.getElementById("home-search-status")?.textContent ?? ""),
      null,
      { timeout: 30000 }
    );
    await page.waitForTimeout(300);
    results[query] = {
      status: await page.textContent("#home-search-status"),
      hrefs: await page.$$eval("#home-results a.mini-card", (links) => links.map((link) => link.getAttribute("href"))),
    };
    await page.screenshot({ path: path.join(assets, `${label}-${query.replace(/\s+/g, "-")}.png`), fullPage: false });
  }

  await page.close();
  return { results, consoleErrors };
}

const profile = fs.mkdtempSync(path.join(os.homedir(), ".cache/mentorai-qa-tmp/cdp-"));
let context;

try {
  context = await chromium.launchPersistentContext(profile, { headless: true, viewport: { width: 1280, height: 900 } });
  const branch = await searchAll(context, branchUrl, "rama");
  const main = await searchAll(context, mainUrl, "main");
  const file = await searchAll(context, fileUrl, "file");

  const comparison = QUERIES.map((query) => ({
    query,
    main: main.results[query].hrefs,
    rama: branch.results[query].hrefs,
    file: file.results[query].hrefs,
    iguales: JSON.stringify(main.results[query].hrefs) === JSON.stringify(branch.results[query].hrefs)
      && JSON.stringify(branch.results[query].hrefs) === JSON.stringify(file.results[query].hrefs),
    estado: branch.results[query].status,
  }));

  const report = { comparison, consoleErrors: { rama: branch.consoleErrors, main: main.consoleErrors, file: file.consoleErrors } };
  fs.writeFileSync(path.join(assets, "comparacion.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(comparison.map(({ query, iguales, rama, estado }) => ({ query, iguales, resultados: rama.length, estado }))));
  console.log("errores de consola:", JSON.stringify(report.consoleErrors));
  process.exitCode = comparison.every((row) => row.iguales) && branch.consoleErrors.length === 0 && file.consoleErrors.length === 0 ? 0 : 1;
} finally {
  await context?.close();
  fs.rmSync(profile, { recursive: true, force: true });
}
