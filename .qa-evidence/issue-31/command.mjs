import { execSync } from 'node:child_process';
const root = process.env.PLAYWRIGHT_ROOT ?? execSync('npm root -g').toString().trim();
const { chromium } = await import(`${root}/playwright/index.mjs`);
const [base, outDir] = process.argv.slice(2);
const browser = await chromium.launch();
const errors = [];
const r = {};
const normalizeDates = (value) => JSON.parse(JSON.stringify(value), (key, v) => (['d', 'at', 'updatedAt', 'percent'].includes(key) && typeof v === 'number' ? 'FECHA' : v));
const storageDump = (page) => page.evaluate(() => Object.fromEntries(Object.keys(localStorage).filter((k) => k.startsWith('academia-') && k !== 'academia-theme').sort().map((k) => [k, JSON.parse(localStorage.getItem(k))])));

const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers: 'block' });
await context.addInitScript(() => { let seed = 42; Math.random = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648); });
const page = await context.newPage();
page.on('pageerror', (error) => errors.push(`pageerror ${page.url()}: ${error.message}`));
page.on('console', (message) => { if (message.type() === 'error') errors.push(`console ${page.url()}: ${message.text()}`); });

await page.goto(`${base}tutorials/ag-qa-con-evidencias.html`);
await page.waitForTimeout(400);
const items = await page.locator('.check__item').count();
for (let index = 0; index < items; index += 1) await page.locator('.check__item').nth(index).locator('.check__option').first().click();
r.checks = { preguntas: items, porqueVisibles: await page.locator('.check__why:not([hidden])').count(), correctas: await page.locator('.check__item .check__option--correct, .check__option.is-correct').count() };
await page.screenshot({ path: `${outDir}/checks.png`, clip: await page.locator('#check').boundingBox() });

await page.goto(`${base}tutorials/ag-el-metodo-que-aprende.html`);
await page.waitForTimeout(500);
const questions = await page.locator('#quiz-form .quiz__question').count();
for (let index = 0; index < questions; index += 1) await page.locator('#quiz-form .quiz__question').nth(index).locator('input[type=radio]').first().check();
await page.locator('#quiz-form .quiz__submit').click();
await page.waitForTimeout(300);
r.quiz = { preguntas: questions, resultado: (await page.locator('#quiz-result').innerText()).replace(/\s+/g, ' ').slice(0, 120) };

await page.goto(`${base}curso.html?slug=metodo-con-agentes`);
await page.waitForTimeout(400);
r.curso = { examen: (await page.locator('.exam-panel, .exam-badge').first().innerText()).replace(/\s+/g, ' ').slice(0, 160) };

await page.goto(`${base}repaso.html`);
await page.waitForTimeout(400);
r.repaso = { tarjetas: await page.locator('.repaso-card, .repaso__card, [class*="repaso"] li, [class*="repaso"] article').count(), enlaceNav: await page.locator('.repaso-nav-link').getAttribute('href') };

await page.goto(`${base}perfil.html`);
await page.waitForTimeout(400);
r.perfil = { enlaceNav: await page.locator('.perfil-nav-link').getAttribute('href'), texto: (await page.locator('main').innerText()).replace(/\s+/g, ' ').slice(0, 200) };

await page.goto(`${base}tutorials/opcache.html`);
await page.waitForTimeout(300);
r.leccionNav = { burgerDrawerLinks: await page.locator('.nav-drawer__link').evaluateAll((links) => links.map((a) => a.getAttribute('href'))), offline: await page.locator('.offline-nav-link').getAttribute('href').catch(() => null), codigo: await page.locator('pre code .tok-keyword, pre code [class^="tok-"]').count() };

await page.goto(`${base}index.html`);
await page.waitForTimeout(300);
await page.fill('#home-search', 'precarga');
await page.waitForTimeout(2500);
r.busqueda = await page.locator('mark').evaluateAll((marks) => marks.slice(0, 2).map((m) => m.parentElement.innerHTML.slice(0, 160)));
r.storage = normalizeDates(await storageDump(page));
await context.close();

const swContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const swPage = await swContext.newPage();
await swPage.goto(`${base}tutorials/opcache.html`);
await swPage.waitForTimeout(2500);
r.serviceWorker = await swPage.evaluate(async () => { const reg = await navigator.serviceWorker.getRegistration(); return reg ? { scope: reg.scope, script: reg.active?.scriptURL ?? reg.installing?.scriptURL ?? reg.waiting?.scriptURL } : null; });
await swContext.close();

r.errors = errors;
console.log(JSON.stringify(r, null, 2));
await browser.close();
