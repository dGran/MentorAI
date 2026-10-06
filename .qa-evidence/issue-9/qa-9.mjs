import { execSync } from 'node:child_process';
import vm from 'node:vm';
import fs from 'node:fs';
const root = process.env.PLAYWRIGHT_ROOT ?? execSync('npm root -g').toString().trim();
const { chromium } = await import(`${root}/playwright/index.mjs`);
const [base, repo, outDir] = process.argv.slice(2);
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(`${repo}/tutorials/courses.js`, 'utf8'), sandbox);
vm.runInNewContext(fs.readFileSync(`${repo}/tutorials/manifest.js`, 'utf8'), sandbox);
const published = new Set(sandbox.window.ACADEMIA_TUTORIALS.filter((t) => t.status !== 'soon').map((t) => t.slug));
const lessonsOf = (c) => (c.modules ? c.modules.flatMap((m) => m.lessons) : c.lessons).filter((s) => published.has(s));
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers: 'block' })).newPage();
const r = { cruces: [], revisadas: 0 };
for (const course of sandbox.window.MENTORAI_COURSES) {
  const own = new Set(lessonsOf(course).map((s) => `${s}.html`));
  for (const slug of lessonsOf(course)) {
    await page.goto(`${base}tutorials/${slug}.html`);
    const links = await page.$$eval('.route-nav .tutorial-nav a', (as) => as.map((a) => ({ label: a.querySelector('small')?.textContent.trim(), href: a.getAttribute('href') })));
    r.revisadas += 1;
    for (const link of links) {
      if (/Anterior|Siguiente/.test(link.label) && !own.has(link.href)) r.cruces.push(`${course.slug}/${slug} → ${link.label} ${link.href}`);
    }
  }
}
for (const slug of ['maq-cpu', 'maq-sockets-e-io']) {
  await page.goto(`${base}tutorials/${slug}.html`);
  r[slug] = await page.$$eval('.route-nav .tutorial-nav a', (as) => as.map((a) => `${a.innerText.replace(/\s+/g, ' ').trim()} (${a.getAttribute('href')})`));
  await page.locator('.route-nav').screenshot({ path: `${outDir}/${slug}.png` });
}
console.log(JSON.stringify({ ...r, cruces: r.cruces.length, ejemplosDeCruce: r.cruces.slice(0, 4) }, null, 2));
await browser.close();
