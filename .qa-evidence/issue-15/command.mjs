import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
const root = process.env.PLAYWRIGHT_ROOT ?? execSync('npm root -g').toString().trim();
const { chromium } = await import(`${root}/playwright/index.mjs`);
const [base, outDir] = process.argv.slice(2);
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 320, height: 800 }, serviceWorkers: 'block' });
const page = await context.newPage();
await page.goto(`${base}cursos.html`);
const cursos = await page.evaluate(() => window.MENTORAI_COURSES.map((c) => c.slug));
const vistas = ['articulos.html', ...cursos.map((slug) => `curso.html?slug=${slug}`)];
const r = { vistas: vistas.length, desbordes: [] };
for (const width of [320, 375]) {
  await page.setViewportSize({ width, height: 800 });
  for (const vista of vistas) {
    await page.goto(`${base}${vista}`);
    await page.waitForTimeout(200);
    const exceso = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (exceso > 0) r.desbordes.push(`${vista}@${width}:+${exceso}`);
  }
}
await page.setViewportSize({ width: 375, height: 800 });
await page.goto(`${base}curso.html?slug=clean-code`);
await page.waitForTimeout(300);
await page.locator('.practica__reto').first().evaluate((el) => el.querySelector('details')?.setAttribute('open', ''));
await page.locator('.practica').screenshot({ path: `${outDir}/practica-clean-code-375.png` });
const huellas = {};
await page.setViewportSize({ width: 1280, height: 900 });
for (const vista of ['index.html', 'articulos.html', 'cursos.html', 'rutas.html', 'curso.html?slug=clean-code']) {
  await page.goto(`${base}${vista}`);
  await page.waitForTimeout(400);
  const imagen = await page.screenshot({ fullPage: true, animations: 'disabled' });
  huellas[vista] = createHash('sha1').update(imagen).digest('hex').slice(0, 12);
}
r.huellasEscritorio1280 = huellas;
console.log(JSON.stringify(r, null, 2));
await browser.close();
