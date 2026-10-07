import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
const root = process.env.PLAYWRIGHT_ROOT ?? execSync('npm root -g').toString().trim();
const { chromium } = await import(`${root}/playwright/index.mjs`);
const [base, outDir, serveDir, logFile] = process.argv.slice(2);
const browser = await chromium.launch();
const r = {};
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const readLog = () => readFileSync(logFile, 'utf8').trim().split('\n').filter(Boolean).map((line) => { const [code, bytes, path] = line.split('\t'); return { code, bytes: Number(bytes), path }; });
const clearLog = () => writeFileSync(logFile, '');
const ready = (page) => page.evaluate(() => navigator.serviceWorker.ready.then(() => true));

{
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${base}index.html`);
  await ready(page);
  await wait(4000);
  clearLog();
  await page.goto(`${base}index.html`);
  await wait(5000);
  const log = readLog();
  const total = log.reduce((sum, entry) => sum + entry.bytes, 0);
  r.arranque = {
    peticiones: log.length,
    bytes: total,
    kb: Math.round(total / 1024),
    por_codigo: log.reduce((acc, entry) => ({ ...acc, [entry.code]: (acc[entry.code] ?? 0) + 1 }), {}),
    fuentesEIconos: log.filter((entry) => /assets\/(fonts|icons)\//.test(entry.path)).length,
  };
  await context.close();
}

{
  const swPath = `${serveDir}/sw.js`;
  const original = readFileSync(swPath, 'utf8');
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${base}index.html`);
  await ready(page);
  await page.evaluate(() => caches.open('otra-app').then((cache) => cache.put('/otra-app/dato', new Response('de otro proyecto'))));
  writeFileSync(swPath, original.replace(/var VERSION = "(v\d+)";/, 'var VERSION = "$1-qa";'));
  r.activate = await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    await registration.update();
    for (let i = 0; i < 60; i += 1) {
      const keys = await caches.keys();
      if (keys.some((key) => key.endsWith('-qa'))) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        return { caches: (await caches.keys()).sort(), otraAppSobrevive: (await caches.keys()).includes('otra-app') };
      }
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    return { timeout: true, caches: await caches.keys() };
  });
  writeFileSync(swPath, original);
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await context.route('**/assets/js/modules/core.js', async (route) => {
    const response = await route.fetch();
    const body = (await response.text()) + '\nwindow.MentorAI.initTheme = () => { throw new Error("fallo forzado en initTheme"); };\n';
    await route.fulfill({ response, body });
  });
  await page.goto(`${base}perfil.html`);
  await wait(1500);
  r.initConThrow = {
    erroresDePagina: errors,
    enlaceOffline: await page.locator('.offline-nav-link').count(),
    swRegistrado: await page.evaluate(() => navigator.serviceWorker.getRegistration().then((reg) => Boolean(reg))),
    panelSync: await page.locator('#sync .sync').count(),
  };
  await context.close();
}

for (const scheme of ['dark', 'light']) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: scheme, serviceWorkers: 'block' });
  await context.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { configurable: true, get() { throw new DOMException('bloqueado', 'SecurityError'); } });
    window.__temaAlPintar = null;
    new MutationObserver((records, observer) => {
      if (document.body) {
        window.__temaAlPintar = document.documentElement.getAttribute('data-theme');
        observer.disconnect();
      }
    }).observe(document, { childList: true, subtree: true });
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(`${base}tutorials/opcache.html`);
  await wait(800);
  r[`localStorageBloqueado_${scheme}`] = {
    temaAlPintar: await page.evaluate(() => window.__temaAlPintar),
    temaFinal: await page.evaluate(() => document.documentElement.getAttribute('data-theme')),
    erroresDePagina: errors,
  };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers: 'block' });
  let intentos = 0;
  await context.route('**/tutorials/search-index.js', (route) => {
    intentos += 1;
    return intentos === 1 ? route.abort() : route.continue();
  });
  const page = await context.newPage();
  await page.goto(`${base}index.html`);
  await wait(300);
  await page.fill('#home-search', 'precarga');
  await wait(1500);
  const trasFallo = await page.locator('mark').count();
  await page.fill('#home-search', 'precargas');
  await wait(1500);
  await page.fill('#home-search', 'precarga');
  await wait(1500);
  r.busqueda = { intentosDeCarga: intentos, marcasTrasElFallo: trasFallo, marcasTrasReintentar: await page.locator('mark').count() };
  await page.screenshot({ path: `${outDir}/busqueda-tras-reintento.png`, clip: { x: 0, y: 0, width: 1280, height: 900 } });
  await context.close();
}

console.log(JSON.stringify(r, null, 2));
await browser.close();
