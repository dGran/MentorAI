const { spawn } = require("child_process");
const fs = require("fs"), path = require("path"), os = require("os");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function abrir(port = 9412) {
  const raiz = path.join(os.homedir(), ".cache/mentorai-qa-tmp");
  fs.mkdirSync(raiz, { recursive: true });
  const profile = fs.mkdtempSync(path.join(raiz, "cdp-"));
  const chrome = spawn("google-chrome", ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "--allow-file-access-from-files", "about:blank"], { stdio: "ignore" });
  const salido = new Promise((r) => chrome.once("exit", r));
  const cerrar = async () => { try { ws?.close(); } catch {} chrome.kill(); await Promise.race([salido, sleep(5000)]); fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }); };
  let ws;
  try {
    let targets;
    for (let i = 0; i < 80; i++) { try { targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); if (targets.length) break; } catch {} await sleep(250); }
    ws = new WebSocket(targets.find((t) => t.type === "page").webSocketDebuggerUrl);
    await new Promise((r) => (ws.onopen = r));
  } catch (error) { await cerrar(); throw error; }
  let id = 0; const pending = new Map(); const consola = [];
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } else if (d.method === "Runtime.exceptionThrown") consola.push(d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text); else if (d.method === "Runtime.consoleAPICalled" && d.params.type === "error") consola.push(d.params.args.map((a) => a.value ?? a.description).join(" ")); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  await send("Runtime.enable");
  const evaluar = async (expression) => { const r = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true }); if (r.result.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails)); return r.result.result.value; };
  const ir = async (url, ms = 600) => { await send("Page.enable"); await send("Page.navigate", { url }); await sleep(ms); };
  const ancho = (width, height = 800, mobile = true) => send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile });
  const raton = async (x, y) => { await send("Input.dispatchMouseEvent", { type: "mouseMoved", x, y }); await sleep(250); };
  const clic = async (x, y) => { await send("Input.dispatchMouseEvent", { type: "mousePressed", x, y, button: "left", clickCount: 1 }); await send("Input.dispatchMouseEvent", { type: "mouseReleased", x, y, button: "left", clickCount: 1 }); await sleep(400); };
  const tecla = async (key, code, keyCode, shift = false) => { const modifiers = shift ? 8 : 0; await send("Input.dispatchKeyEvent", { type: "keyDown", key, code, windowsVirtualKeyCode: keyCode, modifiers, ...(key === "Enter" ? { text: "\r" } : {}) }); await send("Input.dispatchKeyEvent", { type: "keyUp", key, code, windowsVirtualKeyCode: keyCode, modifiers }); await sleep(60); };
  const captura = async (fichero, clip) => { const r = await send("Page.captureScreenshot", { format: "png", ...(clip ? { clip: { ...clip, scale: 1 } } : {}) }); fs.writeFileSync(fichero, Buffer.from(r.result.data, "base64")); };
  return { send, evaluar, ir, ancho, raton, clic, tecla, captura, cerrar, consola, sleep };
}
module.exports = { abrir };
