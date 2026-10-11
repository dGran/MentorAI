const { abrir } = require("./cdp.js");
const fs = require("fs");
const [BASE, OUT] = process.argv.slice(2);
(async () => { const b = await abrir(9441); await b.ancho(1280, 900, false); const out = [];
  for (const tema of ["light", "dark"]) {
    await b.ir(`${BASE}/index.html`, 800); await b.evaluar(`localStorage.setItem("academia-theme", ${JSON.stringify(tema)}); 1`); await b.ir(`${BASE}/index.html`, 1200);
    const boton = await b.evaluar(`(() => { const e = document.querySelector(".btn--primary"); if (!e) return null; e.scrollIntoView({ block: "center" }); const r = e.getBoundingClientRect(); return { x: r.left - 12, y: r.top + scrollY - 12, width: r.width + 24, height: r.height + 24, fondo: getComputedStyle(e).backgroundImage.slice(0, 60), color: getComputedStyle(e).color }; })()`);
    if (boton) { await b.sleep(200); const s = await b.send("Page.captureScreenshot", { format: "png", clip: { x: boton.x, y: boton.y, width: boton.width, height: boton.height, scale: 2 }, captureBeyondViewport: true }); fs.writeFileSync(`${OUT}/c2-boton-primario-${tema}.png`, Buffer.from(s.result.data, "base64")); out.push(`${tema} botón: ${boton.color} sobre ${boton.fondo}`); }
    let enfocados = 0, sinAnillo = 0;
    await b.evaluar("document.body.focus(); 1");
    for (let i = 0; i < 25; i++) { await b.tecla("Tab", "Tab", 9); const r = await b.evaluar(`(() => { const e = document.activeElement; if (!e || e === document.body) return null; const c = getComputedStyle(e); return c.outlineStyle !== "none" && parseFloat(c.outlineWidth) >= 2; })()`); if (r === null) continue; enfocados++; if (!r) sinAnillo++; }
    out.push(`${tema} inicio: ${enfocados} elementos enfocados con Tab, ${sinAnillo} sin anillo de 2 px`);
    await b.evaluar(`document.getElementById("home-search")?.focus(); 1`); await b.tecla("Tab", "Tab", 9, true); await b.tecla("Tab", "Tab", 9);
    const input = await b.evaluar(`(() => { const e = document.activeElement; e.scrollIntoView({ block: "center" }); const r = e.getBoundingClientRect(); return { x: r.left - 12, y: r.top + scrollY - 12, width: Math.min(r.width + 24, 700), height: r.height + 24, id: e.id, outline: getComputedStyle(e).outlineStyle }; })()`);
    await b.sleep(200); const s = await b.send("Page.captureScreenshot", { format: "png", clip: { ...input, scale: 2 }, captureBeyondViewport: true }); fs.writeFileSync(`${OUT}/c3-foco-buscador-${tema}.png`, Buffer.from(s.result.data, "base64"));
    out.push(`${tema} buscador (${input.id}): outline ${input.outline}`);
  }
  out.push("errores de consola: " + (b.consola.length ? JSON.stringify(b.consola) : 0));
  console.log(out.join("\n")); b.cerrar(); })();
