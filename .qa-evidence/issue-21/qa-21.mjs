import { execSync } from 'node:child_process';
const root = process.env.PLAYWRIGHT_ROOT ?? execSync('npm root -g').toString().trim();
const { chromium } = await import(`${root}/playwright/index.mjs`);
const [base, outDir] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers: 'block' })).newPage();
const r = {};
for (const slug of ['go-generics', 'python-docker', 'go-testing', 'phpunit-mocks', 'regex']) {
  await page.goto(`${base}tutorials/${slug}.html`);
  const hero = (await page.locator('.tutorial-meta').innerText()).replace(/\s+/g, ' ').trim();
  const card = await page.evaluate((s) => { const t = window.ACADEMIA_TUTORIALS.find((x) => x.slug === s); return `${t.minutes} min · ${t.level}`; }, slug);
  r[slug] = { hero, manifest: card };
  await page.locator('.tutorial-meta').screenshot({ path: `${outDir}/${slug}.png` });
}
console.log(JSON.stringify(r, null, 2));
await browser.close();
