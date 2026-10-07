import { execSync } from 'node:child_process';
const root = process.env.PLAYWRIGHT_ROOT ?? execSync('npm root -g').toString().trim();
const { chromium } = await import(`${root}/playwright/index.mjs`);
const [base, outDir] = process.argv.slice(2);
const GIST_ID = 'gist-propio';
const FILE = 'mentorai-progreso.json';
const browser = await chromium.launch();
const r = {};
const errors = [];
const exportFile = (datos) => JSON.stringify({ version: 2, exportadoEn: '2020-01-01T00:00:00.000Z', datos });

async function newPage({ remote, fullKey, initial } = {}) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers: 'block' });
  const log = [];
  let remoteContent = remote ?? null;
  await context.route('https://api.github.com/**', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    log.push(`${request.method()} ${url.pathname}${url.search}`);
    if (url.pathname === '/gists' && request.method() === 'GET') {
      const page = Number(url.searchParams.get('page') ?? 1);
      const body = page === 1 ? Array.from({ length: 100 }, (_, i) => ({ id: `otro-${i}`, files: { 'notas.md': {} } })) : [{ id: GIST_ID, files: { [FILE]: {} } }];
      return route.fulfill({ json: body });
    }
    if (url.pathname === `/gists/${GIST_ID}` && request.method() === 'GET') {
      return route.fulfill({ json: { id: GIST_ID, files: remoteContent ? { [FILE]: { content: remoteContent, truncated: false } } : {} } });
    }
    if (url.pathname === `/gists/${GIST_ID}` && request.method() === 'PATCH') {
      remoteContent = JSON.parse(request.postData()).files[FILE].content;
      return route.fulfill({ json: { id: GIST_ID } });
    }
    if (url.pathname === '/gists' && request.method() === 'POST') return route.fulfill({ json: { id: 'creado' } });
    return route.fulfill({ status: 404, json: {} });
  });
  if (fullKey) {
    await context.addInitScript((key) => {
      const original = Storage.prototype.setItem;
      Storage.prototype.setItem = function (k, v) {
        if (window.__llena && k === key) throw new DOMException('lleno', 'QuotaExceededError');
        return original.call(this, k, v);
      };
    }, fullKey);
  }
  if (initial) {
    await context.addInitScript((entries) => {
      if (sessionStorage.getItem('qa-sembrado')) return;
      sessionStorage.setItem('qa-sembrado', '1');
      for (const [key, value] of Object.entries(entries)) localStorage.setItem(key, JSON.stringify(value));
    }, initial);
  }
  const page = await context.newPage();
  page.on('pageerror', (error) => errors.push(`pageerror ${page.url()}: ${error.message}`));
  page.on('console', (message) => { if (message.type() === 'error' && !message.text().includes('404')) errors.push(`console ${page.url()}: ${message.text()}`); });
  return { context, page, log, remote: () => remoteContent };
}

{
  const { context, page } = await newPage();
  await page.goto(`${base}perfil.html`);
  await page.waitForTimeout(400);
  r.panel = { label: await page.locator('label[for="sync-token"]').count() };
  await page.click('#sync-conectar');
  await page.waitForTimeout(200);
  const error = page.locator('#sync .sync__aviso--error');
  r.panel.conectarVacio = (await error.count()) ? { visible: await error.first().isVisible(), role: await error.first().getAttribute('role'), texto: (await error.first().innerText()).trim() } : null;
  await page.locator('#sync').screenshot({ path: `${outDir}/panel-conectar-vacio.png` });
  await context.close();
}

{
  const { context, page, log } = await newPage({ remote: null });
  await page.goto(`${base}perfil.html`);
  await page.waitForTimeout(300);
  await page.fill('#sync-token', 'ghp_prueba');
  await page.click('#sync-conectar');
  await page.waitForTimeout(1500);
  r.conectar = { peticiones: [...log], config: await page.evaluate(() => JSON.parse(localStorage.getItem('academia-sync'))?.gistId ?? null) };
  log.length = 0;
  for (const ruta of ['index.html', 'rutas.html', 'tutorials/opcache.html', 'perfil.html']) {
    await page.goto(`${base}${ruta}`);
    await page.waitForTimeout(700);
  }
  r.navegaciones = { paginas: 4, peticiones: [...log] };
  await context.close();
}

{
  const { context, page } = await newPage();
  await page.goto(`${base}perfil.html`);
  await page.waitForTimeout(300);
  await page.setInputFiles('#perfil-fichero', { name: 'progreso.json', mimeType: 'application/json', buffer: Buffer.from(exportFile({ 'academia-progress': ['opcache', 'regex'] })) });
  await page.waitForTimeout(600);
  const aviso = page.locator('#perfil-aviso');
  r.importar = { visible: await aviso.isVisible(), texto: (await aviso.innerText()).trim(), guardado: await page.evaluate(() => localStorage.getItem('academia-progress')) };
  await page.locator('#perfil').screenshot({ path: `${outDir}/importar-ok.png` });
  await context.close();
}

{
  const { context, page } = await newPage({ fullKey: 'academia-progress' });
  await page.goto(`${base}perfil.html`);
  await page.waitForTimeout(300);
  await page.evaluate(() => { window.__llena = true; });
  await page.setInputFiles('#perfil-fichero', { name: 'progreso.json', mimeType: 'application/json', buffer: Buffer.from(exportFile({ 'academia-progress': ['opcache'] })) });
  await page.waitForTimeout(600);
  const aviso = page.locator('#perfil-aviso');
  r.importarSinEspacio = { visible: await aviso.isVisible(), texto: (await aviso.innerText()).trim(), esError: await aviso.evaluate((el) => el.classList.contains('perfil__aviso--error')) };
  await page.locator('#perfil').screenshot({ path: `${outDir}/importar-sin-espacio.png` });
  await context.close();
}

for (const [nombre, haceMs] of [['otroDispositivoSyncHace5s', 5000], ['otroDispositivoSyncHace60s', 60000]]) {
  const remoto = exportFile({ 'academia-progress': ['de-otro-dispositivo'] });
  const { context, page, log, remote } = await newPage({
    remote: remoto,
    initial: { 'academia-sync': { token: 'ghp_prueba', gistId: GIST_ID, ultimaSync: Date.now() - haceMs }, 'academia-progress': ['local'] },
  });
  await page.goto(`${base}perfil.html`);
  await page.waitForTimeout(1200);
  await page.goto(`${base}index.html`);
  await page.waitForTimeout(1200);
  const gist = remote();
  r[nombre] = {
    peticiones: [...log],
    gistTieneLoDelOtro: gist.includes('de-otro-dispositivo'),
    gistTieneLoLocal: gist.includes('"local"'),
    localTieneLoDelOtro: (await page.evaluate(() => localStorage.getItem('academia-progress'))).includes('de-otro-dispositivo'),
  };
  await context.close();
}

r.errors = errors;
console.log(JSON.stringify(r, null, 2));
await browser.close();
