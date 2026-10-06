import { execSync } from 'node:child_process';
const root = process.env.PLAYWRIGHT_ROOT ?? execSync('npm root -g').toString().trim();
const { chromium } = await import(`${root}/playwright/index.mjs`);
const [base, outDir] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers: 'block' })).newPage();
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
const banner = async (name) => {
  await page.goto(base + 'index.html');
  await page.waitForTimeout(500);
  const host = page.locator('#home-route');
  const visible = await host.isVisible();
  if (visible) await host.screenshot({ path: `${outDir}/${name}.png` });
  return visible ? { eyebrow: await host.locator('.route-banner__eyebrow').innerText(), title: await host.locator('.route-banner__title').innerText(), progress: await host.locator('.route-banner__progress').innerText(), continuar: await host.locator('.btn--primary').getAttribute('href') } : 'oculto';
};
const r = {};
await page.goto(base + 'index.html');
await page.evaluate(() => localStorage.clear());
r.sinProgreso = await banner('sin-progreso');
await page.evaluate(() => localStorage.setItem('academia-progress', JSON.stringify(['maq-cpu', 'maq-de-codigo-a-programa'])));
r.dosDeLaMaquina = await banner('la-maquina-2-de-5');
await page.evaluate(() => {
  localStorage.setItem('academia-progress', JSON.stringify(['maq-cpu', 'maq-de-codigo-a-programa', 'git-comandos-esenciales']));
  localStorage.setItem('academia-reading', JSON.stringify({ 'maq-cpu': { percent: 100, updatedAt: 1000 }, 'git-comandos-esenciales': { percent: 100, updatedAt: 9000 } }));
});
r.gitMasReciente = await banner('git-mas-reciente');
await page.evaluate(() => {
  const now = Date.now();
  localStorage.setItem('academia-progress', JSON.stringify(['git-comandos-esenciales']));
  localStorage.setItem('academia-reading', JSON.stringify({ 'maq-cpu': { percent: 60, updatedAt: now - 30 * 864e5 } }));
  localStorage.setItem('academia-cambios', JSON.stringify({ 'academia-progress': { 'git-comandos-esenciales': { at: now - 1000, deleted: false } } }));
});
r.marcadoRecienteGana = await banner('marcado-reciente');
await page.evaluate(() => {
  const slugs = (window.ACADEMIA_TUTORIALS ?? []).map((t) => t.slug);
  const reading = Object.fromEntries(slugs.map((slug, i) => [slug, { percent: 50, updatedAt: Date.now() - i * 1000 }]));
  localStorage.setItem('academia-reading', JSON.stringify(reading));
  localStorage.setItem('academia-progress', JSON.stringify(slugs.slice(0, 150)));
});
r.renderPeorCasoMs = await page.evaluate(() => {
  const times = [];
  for (let i = 0; i < 20; i += 1) { const t = performance.now(); MentorAI.Home.render(); times.push(performance.now() - t); }
  return Math.round(times.reduce((a, b) => a + b) / times.length * 10) / 10;
});
r.errors = errors;
console.log(JSON.stringify(r, null, 2));
await browser.close();
