import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
const root = process.env.PLAYWRIGHT_ROOT ?? execSync('npm root -g').toString().trim();
const { chromium } = await import(`${root}/playwright/index.mjs`);
const [base, outDir] = process.argv.slice(2);
const local = {
  'academia-quiz-git': { passed: true, bestScore: 90, attempts: 1 },
  'academia-examen-ruta-backend': { attempts: 1, best: 18, total: 20, passed: true },
  'academia-practica': { git: { 0: true }, docker: { 1: true } },
};
const remote = { version: 1, datos: {
  'academia-quiz-git': { passed: false, bestScore: 40, attempts: 3 },
  'academia-examen-ruta-backend': { attempts: 2, best: 9, total: 20, passed: false },
  'academia-practica': { git: { 2: true }, sql: { 0: true } },
} };
writeFileSync(`${outDir}/remoto.json`, JSON.stringify(remote, null, 2));
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers: 'block' });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
await page.goto(base + 'perfil.html');
await page.evaluate((entries) => { localStorage.clear(); for (const [k, v] of Object.entries(entries)) localStorage.setItem(k, JSON.stringify(v)); }, local);
await page.reload();
await page.setInputFiles('#perfil-fichero', `${outDir}/remoto.json`);
await page.waitForTimeout(800);
await page.screenshot({ path: `${outDir}/perfil-tras-importar.png`, fullPage: false });
const after = await page.evaluate((keys) => Object.fromEntries(keys.map((k) => [k, JSON.parse(localStorage.getItem(k))])), Object.keys(local));
console.log(JSON.stringify({ local, remoto: remote.datos, tras_importar: after, errors }, null, 2));
await browser.close();
