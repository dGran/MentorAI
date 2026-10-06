import { execSync } from 'node:child_process';
const root = process.env.PLAYWRIGHT_ROOT ?? execSync('npm root -g').toString().trim();
const { chromium } = await import(`${root}/playwright/index.mjs`);
const [base, shotDir] = process.argv.slice(2);
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 375, height: 812 }, serviceWorkers: 'block' });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
const result = {};
for (const ruta of ['index.html', 'tutorials/regex.html']) {
  await page.goto(base + ruta);
  await page.click('.nav__burger');
  await page.waitForTimeout(400);
  const links = await page.$$eval('.nav-drawer__link', (nodes) => nodes.map((node) => ({ text: node.textContent.trim(), href: node.getAttribute('href') })));
  result[ruta] = links;
  if (ruta === 'index.html') await page.screenshot({ path: `${shotDir}/drawer-375.png` });
}
await page.goto(base + 'index.html');
await page.click('.nav__burger');
await page.waitForTimeout(400);
await page.click('.nav-drawer__link:has-text("Perfil")');
await page.waitForLoadState();
result.tras_click = { url: page.url(), h1: await page.textContent('h1') };
result.errors = errors;
console.log(JSON.stringify(result, null, 2));
await browser.close();
