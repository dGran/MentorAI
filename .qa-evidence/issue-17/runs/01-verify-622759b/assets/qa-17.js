const { abrir } = require("./cdp.js");
const [BASE, LECCION, ULTIMA, OUT] = process.argv.slice(2);
(async () => { const b = await abrir(9442); await b.ancho(1280, 900, false); const out = [];
  await b.ir(`${BASE}/tutorials/${LECCION}.html`, 1200); await b.evaluar("localStorage.clear(); 1"); await b.ir(`${BASE}/tutorials/${LECCION}.html`, 1200);
  await b.evaluar(`document.querySelector(".check__option").focus(); 1`);
  await b.tecla("Enter", "Enter", 13); await b.sleep(400);
  out.push("check, tras Enter: " + JSON.stringify(await b.evaluar(`(() => { const item = document.querySelector(".check__item"); const fb = item.querySelector(".check__feedback"); return { foco: document.activeElement.className, rol: fb.getAttribute("role"), anuncio: fb.textContent.trim().replace(/\\s+/g, " ").slice(0, 140), etiquetas: [...item.querySelectorAll(".answer-tag")].map(t => t.textContent + "(" + t.className.split("--")[1] + ")") }; })()`)));
  await b.evaluar(`(() => { const items = [...document.querySelectorAll(".check__item")]; const it = items[1]; const ok = Number(it.dataset.correct); const mala = [...it.querySelectorAll(".check__option")].findIndex((_, i) => i !== ok); it.querySelectorAll(".check__option")[mala].click(); return 1; })()`); await b.sleep(400);
  out.push("check fallado: " + JSON.stringify(await b.evaluar(`(() => { const it = document.querySelectorAll(".check__item")[1]; return { veredicto: it.querySelector(".check__verdict").textContent, etiquetas: [...it.querySelectorAll(".answer-tag")].map(t => t.textContent + "(" + t.className.split("--")[1] + ")"), foco: document.activeElement.className }; })()`)));
  await b.evaluar(`(() => { const it = document.querySelectorAll(".check__item")[1]; it.scrollIntoView({ block: "center" }); return 1; })()`); await b.sleep(300);
  if (OUT) await b.captura(`${OUT}/check-fallado.png`);
  await b.ir(`${BASE}/tutorials/${ULTIMA}.html#quiz`, 1500);
  const r = await b.evaluar(`(() => { const form = document.getElementById("quiz-form"); if (!form) return "sin examen"; form.querySelectorAll(".quiz__question").forEach((q, i) => { const radios = q.querySelectorAll("input"); radios[i % 2 === 0 ? Number(q.dataset.correct) : (Number(q.dataset.correct) + 1) % radios.length].checked = true; }); form.querySelector(".quiz__submit").click(); return "enviado"; })()`); await b.sleep(600);
  out.push("examen: " + r + " " + JSON.stringify(await b.evaluar(`(() => { const res = document.getElementById("quiz-result"); return { foco: document.activeElement.id, rol: res.getAttribute("role"), anuncio: res.textContent.trim().replace(/\\s+/g, " ").slice(0, 120), etiquetas: document.querySelectorAll("#quiz .answer-tag").length, preguntas: document.querySelectorAll("#quiz .quiz__question").length }; })()`)));
  if (OUT) { await b.evaluar(`document.querySelector("#quiz .quiz__question").scrollIntoView({ block: "start" }); 1`); await b.sleep(300); await b.captura(`${OUT}/examen-corregido.png`); }
  out.push("errores de consola: " + (b.consola.length ? JSON.stringify(b.consola) : 0));
  console.log(out.join("\n")); b.cerrar(); })();
