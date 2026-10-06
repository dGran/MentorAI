import { execSync } from 'node:child_process';
const root = execSync('npm root -g').toString().trim();
const { chromium } = await import(`${root}/playwright/index.mjs`);
const [base, out] = process.argv.slice(2);
const browser = await chromium.launch();
const res = {};
const owner = (p) => p.evaluate(() => { const e = document.activeElement; return e ? `${e.tagName.toLowerCase()}.${[...e.classList].join('.')}|${(e.getAttribute('aria-label')||e.textContent||'').trim().slice(0,18)}|inDrawer=${Boolean(e.closest('#nav-drawer'))}|inLegacy=${Boolean(e.closest('.nav-drawer:not(#nav-drawer)'))}` : 'none'; });
async function fullTab(p, shift) {
  const hits = new Set(); let n = 0; const seen = new Set();
  for (let i = 0; i < 3000; i++) {
    await p.keyboard.press(shift ? 'Shift+Tab' : 'Tab');
    const k = await p.evaluate(() => { const e = document.activeElement; if (!e || e === document.body) return 'BODY'; if (!e.__k) e.__k = Math.random(); return { k: e.__k, d: e.closest('.nav-drawer') ? (e.closest('#nav-drawer') ? 'new' : 'legacy') : null, t: e.tagName + '.' + e.className }; });
    if (k === 'BODY') { if (n > 0) break; continue; }
    if (seen.has(k.k)) break; seen.add(k.k); n++;
    if (k.d) hits.add(k.d + ':' + k.t);
  }
  return { recorridos: n, drawerHits: [...hits] };
}
for (const [label, path] of [['index', 'index.html'], ['tutorial', 'tutorials/alerting.html'], ['python', 'tutorials/python-clases-y-oop.html']]) {
  for (const width of [375, 1280]) {
    const ctx = await browser.newContext({ viewport: { width, height: 812 }, serviceWorkers: 'block' });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto(base + path); await p.waitForTimeout(400);
    const r = { errs };
    r.tabCerrado = await fullTab(p, false);
    r.drawers = await p.$$eval('.nav-drawer', els => els.map(e => ({ id: e.id, inert: e.inert, shadow: getComputedStyle(e).boxShadow.slice(0, 30) })));
    r.burgers = await p.$$eval('.nav__burger', els => els.map(e => ({ visible: e.offsetParent !== null, exp: e.getAttribute('aria-expanded'), ctrl: e.getAttribute('aria-controls') })));
    if (width === 1280) { await p.screenshot({ path: `${out}/${label}-1280-borde.png`, clip: { x: 1180, y: 0, width: 100, height: 400 } }); res[`${label}-${width}`] = r; await ctx.close(); continue; }
    const burger = p.locator('#nav-drawer').locator('xpath=..').locator('.nav__burger[aria-controls]');
    const b = p.locator('.nav__burger[aria-controls="nav-drawer"]');
    await b.focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(350);
    r.alAbrirTeclado = { foco: await owner(p), exp: await b.getAttribute('aria-expanded'), overflow: await p.evaluate(() => document.body.style.overflow), current: await p.$$eval('#nav-drawer [aria-current]', e => e.map(x => x.textContent)) };
    await p.screenshot({ path: `${out}/${label}-375-abierto.png` });
    const fw = []; for (let i = 0; i < 12; i++) { await p.keyboard.press('Tab'); fw.push((await owner(p)).split('|')[1]); }
    r.tabAbierto = fw; r.tabSale = !(await owner(p)).includes('inDrawer=true');
    const bw = []; for (let i = 0; i < 12; i++) { await p.keyboard.press('Shift+Tab'); bw.push((await owner(p)).split('|')[1]); }
    r.shiftTabAbierto = bw; r.shiftSale = !(await owner(p)).includes('inDrawer=true');
    await p.focus('#nav-drawer .nav-drawer__theme-toggle'); const th0 = await p.evaluate(() => document.documentElement.dataset.theme); await p.keyboard.press('Enter'); await p.waitForTimeout(100);
    r.tema = { antes: th0, despues: await p.evaluate(() => document.documentElement.dataset.theme), foco: await owner(p), sigueAbierto: await p.$eval('#nav-drawer', e => e.classList.contains('is-open')) };
    await p.keyboard.press('Escape'); await p.waitForTimeout(350);
    r.esc = { foco: await owner(p), exp: await b.getAttribute('aria-expanded'), inert: await p.$eval('#nav-drawer', e => e.inert), overflow: await p.evaluate(() => document.body.style.overflow) };
    await b.click(); await p.waitForTimeout(350); await p.click('#nav-drawer .nav-drawer__close'); await p.waitForTimeout(350);
    r.cerrarBoton = { foco: await owner(p), abierto: await p.$eval('#nav-drawer', e => e.classList.contains('is-open')) };
    await b.click(); await p.waitForTimeout(350); await p.mouse.click(20, 400); await p.waitForTimeout(350);
    r.clicFondo = { foco: await owner(p), abierto: await p.$eval('#nav-drawer', e => e.classList.contains('is-open')), overflow: await p.evaluate(() => document.body.style.overflow) };
    await b.click(); await p.waitForTimeout(350);
    const box = await p.$eval('#nav-drawer', e => { const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
    await p.mouse.click(box.x + box.w / 2, box.y + box.h - 30); await p.waitForTimeout(100);
    const afterClick = await owner(p); await p.keyboard.press('Tab');
    r.clicZonaVaciaDrawerYTab = { trasClic: afterClick, trasTab: await owner(p) };
    await p.keyboard.press('Shift+Tab'); r.clicZonaVaciaShiftTab = await owner(p);
    await p.keyboard.press('Escape');
    if (label === 'python') {
      const legacy = p.locator('.nav__burger:not([aria-controls])');
      r.legacyBurger = await legacy.count();
      if (await legacy.count()) { await legacy.first().click(); await p.waitForTimeout(350); r.legacyClick = await p.$$eval('.nav-drawer', els => els.map(e => ({ id: e.id, open: e.classList.contains('is-open') }))); }
    }
    res[`${label}-${width}`] = r; await ctx.close();
  }
}
const ctx = await browser.newContext({ viewport: { width: 375, height: 812 }, serviceWorkers: 'block', reducedMotion: 'reduce' });
const p = await ctx.newPage(); await p.goto(base + 'index.html'); await p.waitForTimeout(300);
res.reducedMotion = await p.$eval('#nav-drawer', e => getComputedStyle(e).transitionDuration + ' / ' + getComputedStyle(e).transitionProperty);
const ctx2 = await browser.newContext({ viewport: { width: 375, height: 812 }, serviceWorkers: 'block' });
const p2 = await ctx2.newPage(); await p2.goto(base + 'index.html'); await p2.waitForTimeout(300);
res.normalMotion = await p2.$eval('#nav-drawer', e => getComputedStyle(e).transitionDuration);
res.keydownListeners = 'n/a';
console.log(JSON.stringify(res, null, 1));
await browser.close();
