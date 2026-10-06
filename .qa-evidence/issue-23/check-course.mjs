import { execSync } from 'node:child_process';
const root = process.env.PLAYWRIGHT_ROOT ?? execSync('npm root -g').toString().trim();
const { chromium } = await import(`${root}/playwright/index.mjs`);
const [base, outDir] = process.argv.slice(2);
const browser = await chromium.launch();
const r = { lecciones: {} };
const errors = [];
for (const [width, theme] of [[1280, 'light'], [375, 'dark']]) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, serviceWorkers: 'block' });
  await context.addInitScript((t) => localStorage.setItem('academia-theme', t), theme);
  const page = await context.newPage();
  page.on('pageerror', (error) => errors.push(`${width}: ${error.message}`));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(`${width} console: ${message.text()}`); });
  for (const slug of ['llm-de-texto-a-tokens', 'llm-atencion-y-contexto', 'llm-entrenamiento', 'llm-muestreo', 'llm-alucinacion-y-razonamiento']) {
    await page.goto(`${base}tutorials/${slug}.html`);
    await page.waitForTimeout(400);
    const info = await page.evaluate(() => ({
      h1: document.querySelector('h1')?.textContent.trim(),
      secciones: document.querySelectorAll('.prose h2').length,
      tocRotos: [...document.querySelectorAll('.toc__list a')].filter((a) => !document.querySelector(a.getAttribute('href'))).length,
      checks: document.querySelectorAll('.check__item').length,
      nav: [...document.querySelectorAll('.route-nav .tutorial-nav a')].map((a) => a.innerText.replace(/\s+/g, ' ').trim()),
      examen: Boolean(document.getElementById('quiz')),
      scroll: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }));
    if (width === 1280) r.lecciones[slug] = info;
    if (width === 375 && info.scroll > 0) errors.push(`${slug}: scroll horizontal ${info.scroll}px a 375`);
    await page.screenshot({ path: `${outDir}/${slug}-${width}.png`, fullPage: false });
  }
  await page.goto(`${base}curso.html?slug=ia-por-dentro`);
  await page.waitForTimeout(500);
  if (width === 1280) {
    r.curso = await page.evaluate(() => ({ titulo: document.querySelector('h1')?.textContent.trim(), lecciones: document.querySelectorAll('.course-lessons li, .lesson-list li, ol li a').length, retos: document.querySelectorAll('.practica__reto').length, texto: document.body.innerText.includes('Haz el examen') || document.body.innerText.toLowerCase().includes('examen') }));
    await page.screenshot({ path: `${outDir}/curso-1280.png`, fullPage: true });
    await page.goto(`${base}rutas.html`);
    await page.waitForTimeout(400);
    r.ruta = await page.evaluate(() => document.body.innerText.includes('La IA por dentro'));
    await page.goto(`${base}tutorials/llm-alucinacion-y-razonamiento.html#quiz`);
    await page.waitForTimeout(500);
    r.examenPreguntas = await page.evaluate(() => document.querySelectorAll('.quiz__question').length);
  }
  await context.close();
}
r.errors = errors;
console.log(JSON.stringify(r, null, 2));
await browser.close();
