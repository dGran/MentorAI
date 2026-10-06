import { execSync } from 'node:child_process';
const root = process.env.PLAYWRIGHT_ROOT ?? execSync('npm root -g').toString().trim();
const { chromium } = await import(`${root}/playwright/index.mjs`);
const [base, outDir] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers: 'block' })).newPage();
const r = {};
for (const pagina of ['index', 'rutas', 'cursos', 'articulos', 'repaso', 'perfil', 'offline']) {
  await page.goto(`${base}${pagina}.html`);
  await page.waitForTimeout(300);
  r[pagina] = await page.$$eval('.nav [aria-current="page"], .nav .is-active', (nodes) => [...new Set(nodes)].map((node) => `${node.textContent.trim()}${node.getAttribute('aria-current') ? ' [aria-current]' : ''}`));
  if (['repaso', 'perfil'].includes(pagina)) await page.locator('.nav').first().screenshot({ path: `${outDir}/nav-${pagina}.png` });
}
console.log(JSON.stringify(r, null, 2));
await browser.close();
