const { spawn } = require("child_process");
const fs = require("fs"), path = require("path"), os = require("os");
const ROOT = process.argv[2];
const PORT = 9411;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "cdp-"));
  const chrome = spawn("google-chrome", ["--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, "--allow-file-access-from-files", "about:blank"], { stdio: "ignore" });
  let targets;
  for (let i = 0; i < 60; i++) { try { targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); break; } catch { await sleep(250); } }
  const page = targets.find((t) => t.type === "page");
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0; const pending = new Map();
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const files = fs.readdirSync(path.join(ROOT, "tutorials")).filter((f) => f.endsWith(".html") && !f.startsWith("_"));
  const out = {};
  for (const w of [320, 375]) {
    await send("Emulation.setDeviceMetricsOverride", { width: w, height: 800, deviceScaleFactor: 1, mobile: true });
    for (const f of files) {
      await send("Page.navigate", { url: process.env.BASE ? `${process.env.BASE}/tutorials/${f}` : "file://" + path.join(ROOT, "tutorials", f) });
      await sleep(250);
      const r = await send("Runtime.evaluate", { expression: "document.documentElement.scrollWidth - document.documentElement.clientWidth", returnByValue: true });
      const ex = r.result.result.value;
      if (ex > 0) (out[w] ||= []).push([f, ex]);
    }
  }
  console.log("tutoriales:", files.length);
  for (const w of [320, 375]) { const l = (out[w] || []).sort((a, b) => b[1] - a[1]); console.log(`${w}px: ${l.length} desbordan; peores:`, l.slice(0, 5).map(([f, e]) => `${f}+${e}`).join(" ")); }
  ws.close(); chrome.kill();
})();
