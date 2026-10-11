const { abrir } = require("./cdp.js");
const BASE = process.argv[2], OUT = process.argv[3];
(async () => {
  const b = await abrir();
  await b.ancho(375);
  for (const slug of ["python-a-produccion", "rust-traits"]) {
    await b.ir(`${BASE}/tutorials/${slug}.html`);
    const estaticos = await b.evaluar(`document.querySelectorAll(".nav-drawer").length + "/" + document.querySelectorAll(".nav-drawer-backdrop").length`);
    const recorrido = [];
    for (let i = 0; i < 14; i++) {
      await b.tecla("Tab", "Tab", 9);
      recorrido.push(await b.evaluar(`(() => { const e = document.activeElement; const r = e.getBoundingClientRect(); const visible = r.width > 0 && r.height > 0 && r.right > 0 && r.left < innerWidth && !e.closest("[inert]"); return (visible ? "" : "INVISIBLE:") + (e.getAttribute("aria-label") || e.textContent.trim().slice(0, 22) || e.tagName); })()`));
    }
    const invisibles = recorrido.filter((x) => x.startsWith("INVISIBLE")).length;
    if (OUT) await b.captura(`${OUT}/${slug}-375-foco-tras-14-tab.png`);
    await b.evaluar(`document.querySelector(".nav__burger").click()`); await b.sleep(400);
    if (OUT) await b.captura(`${OUT}/${slug}-375-drawer-abierto.png`);
    const abierto = await b.evaluar(`document.querySelector("#nav-drawer").classList.contains("is-open") + " foco=" + document.activeElement.textContent.trim()`);
    await b.tecla("Escape", "Escape", 27); await b.sleep(200);
    const cerrado = await b.evaluar(`!document.querySelector("#nav-drawer").classList.contains("is-open") + " foco=" + document.activeElement.className`);
    console.log(`${slug}: drawers=${estaticos} invisibles=${invisibles}\n  tab: ${recorrido.join(" | ")}\n  abre: ${abierto} · Esc cierra: ${cerrado}`);
  }
  console.log("errores de consola:", b.consola.length ? b.consola : 0);
  b.cerrar();
})();
