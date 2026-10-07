import { execSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
const root = process.env.PLAYWRIGHT_ROOT ?? execSync('npm root -g').toString().trim();
const { chromium } = await import(`${root}/playwright/index.mjs`);
const [base, outDir, repoDir] = process.argv.slice(2);
const slugs = readdirSync(`${repoDir}/tutorials`).filter((f) => f.endsWith('.html')).map((f) => f.replace(/\.html$/, ''));
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 375, height: 800 }, serviceWorkers: 'block' });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (error) => errors.push(`${page.url()}: ${error.message}`));
const resumen = { paginas: 0, conDosHamburguesas: [], sinAnio: [], navDistinto: [] };
let navCanonico = null;
for (const slug of slugs) {
  await page.goto(`${base}tutorials/${slug}.html`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(120);
  const info = await page.evaluate(() => ({
    burgers: document.querySelectorAll('.nav__burger').length,
    anio: document.querySelector('.footer')?.innerText.match(/20\d\d/)?.[0] ?? null,
    nav: [...document.querySelectorAll('.nav__actions a')].map((a) => a.textContent.trim()).join('|'),
  }));
  resumen.paginas += 1;
  if (info.burgers !== 1) resumen.conDosHamburguesas.push(`${slug}:${info.burgers}`);
  if (!info.anio) resumen.sinAnio.push(slug);
  navCanonico ??= info.nav;
  if (info.nav !== navCanonico) resumen.navDistinto.push(`${slug}: ${info.nav}`);
}
resumen.navCanonico = navCanonico;
await page.goto(`${base}tutorials/python-a-produccion.html`);
await page.waitForTimeout(300);
await page.screenshot({ path: `${outDir}/python-cabecera-375.png`, clip: { x: 0, y: 0, width: 375, height: 120 } });
await page.click('.nav__burger');
await page.waitForTimeout(400);
resumen.drawerPython = await page.evaluate(() => ({ expanded: document.querySelector('.nav__burger').getAttribute('aria-expanded'), enlaces: [...document.querySelectorAll('.nav-drawer__link')].length }));
await page.screenshot({ path: `${outDir}/python-drawer-375.png` });
await page.goto(`${base}tutorials/go-a-produccion.html`);
await page.waitForTimeout(300);
await page.locator('.footer').screenshot({ path: `${outDir}/go-pie.png` });
resumen.errors = errors;
console.log(JSON.stringify(resumen, null, 2));
await browser.close();
