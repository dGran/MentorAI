import { execSync } from 'node:child_process';
const root = process.env.PLAYWRIGHT_ROOT ?? execSync('npm root -g').toString().trim();
const { chromium } = await import(`${root}/playwright/index.mjs`);
const [base, outDir, mode] = process.argv.slice(2);
const slugs = ['ag-por-que-un-metodo', 'ag-como-lee-el-agente', 'ag-instalar-un-metodo', 'ag-rules-y-paquetes', 'ag-skills-y-contratos', 'ag-hooks-que-inyectan', 'ag-roles-de-subagente', 'ag-del-requisito-al-issue', 'ag-implementar-y-revisar', 'ag-qa-con-evidencias', 'ag-cerrar-el-ciclo', 'ag-tandas-y-loops', 'ag-el-metodo-que-aprende'];
const browser = await chromium.launch();
const r = { lecciones: {} };
const errors = [];
for (const [width, theme] of mode === 'reproduce' ? [[1280, 'light']] : [[1280, 'light'], [375, 'dark']]) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, serviceWorkers: 'block' });
  await context.addInitScript((t) => localStorage.setItem('academia-theme', t), theme);
  const page = await context.newPage();
  page.on('pageerror', (error) => errors.push(`${width}: ${error.message}`));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(`${width} console: ${message.text()}`); });
  if (mode !== 'reproduce') {
    for (const slug of slugs) {
      await page.goto(`${base}tutorials/${slug}.html`);
      await page.waitForTimeout(350);
      const info = await page.evaluate(() => ({
        h1: document.querySelector('h1')?.textContent.trim(),
        secciones: document.querySelectorAll('.prose h2').length,
        tocRotos: [...document.querySelectorAll('.toc__list a')].filter((a) => !document.querySelector(a.getAttribute('href'))).length,
        cuando: Boolean(document.getElementById('cuando')),
        checks: document.querySelectorAll('.check__item').length,
        nav: [...document.querySelectorAll('.route-nav .tutorial-nav a, .tutorial-nav a')].map((a) => a.innerText.replace(/\s+/g, ' ').trim()).slice(0, 2),
        scroll: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      }));
      if (width === 1280) r.lecciones[slug] = info;
      if (width === 375 && info.scroll > 0) errors.push(`${slug}: scroll horizontal ${info.scroll}px a 375`);
      if (width === 1280 || ['ag-hooks-que-inyectan', 'ag-qa-con-evidencias'].includes(slug)) await page.screenshot({ path: `${outDir}/${slug}-${width}.png` });
    }
  }
  if (width !== 1280) { await context.close(); continue; }
  await page.goto(`${base}curso.html?slug=metodo-con-agentes`);
  await page.waitForTimeout(500);
  r.curso = await page.evaluate(() => ({ titulo: document.querySelector('h1')?.textContent.trim(), modulos: [...document.querySelectorAll('h2, h3')].map((h) => h.textContent.trim()).filter((t) => /método|piezas|flujo de entrega|Escalar/i.test(t)), retos: document.querySelectorAll('.practica__reto').length, enlacesLeccion: [...document.querySelectorAll('a[href*="tutorials/ag-"]')].length }));
  await page.screenshot({ path: `${outDir}/curso-1280.png`, fullPage: true });
  await page.goto(`${base}rutas.html`);
  await page.waitForTimeout(400);
  r.rutaIncluyeCurso = await page.evaluate(() => document.body.innerText.includes('Método con agentes'));
  await page.goto(`${base}tutorials/cc-flujo-de-equipo.html`);
  await page.waitForTimeout(300);
  r.calloutFlujoDeEquipo = await page.evaluate(() => [...document.querySelectorAll('.callout a')].map((a) => a.getAttribute('href')).filter((h) => h.includes('metodo-con-agentes')));
  if (mode !== 'reproduce') {
    await page.goto(`${base}tutorials/ag-el-metodo-que-aprende.html#quiz`);
    await page.waitForTimeout(600);
    r.examenPreguntas = await page.evaluate(() => document.querySelectorAll('.quiz__question').length);
  }
  await context.close();
}
r.errors = errors;
console.log(JSON.stringify(r, null, 2));
await browser.close();
