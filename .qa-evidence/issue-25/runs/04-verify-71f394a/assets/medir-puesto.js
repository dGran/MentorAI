const [DIR, ...CURSOS] = process.argv.slice(2);
const w = {}; global.window = w;
for (const f of ["courses", "quizzes", "checks"]) require(`${DIR}/tutorials/${f}.js`);
const puesto = (q) => { const L = q.o.map((o) => String(o).length); return 1 + L.filter((x) => x > L[q.a]).length; };
const larga = (q) => { const L = q.o.map((o) => String(o).length); return L.filter((x) => x >= L[q.a]).length === 1; };
const ratio = (q) => { const L = q.o.map((o) => String(o).length); return Math.max(...L) / Math.min(...L); };
for (const c of CURSOS) {
  const curso = w.MENTORAI_COURSES.find((x) => x.slug === c);
  const lecciones = curso.modules ? curso.modules.flatMap((m) => m.lessons) : curso.lessons;
  for (const [tipo, qs] of [["examen", w.MENTORAI_QUIZZES[c]?.questions ?? []], ["checks", lecciones.flatMap((l) => w.MENTORAI_CHECKS[l]?.questions ?? w.MENTORAI_CHECKS[l] ?? [])]]) {
    if (!qs.length) continue;
    const p = {}; for (const q of qs) p[puesto(q)] = (p[puesto(q)] ?? 0) + 1;
    const dominante = Math.max(...Object.entries(p).filter(([k]) => k !== "1").map(([, v]) => v), 0);
    const exacto = (100 * dominante) / qs.length; const pct = Math.round(exacto); const lp = Math.round((100 * qs.filter(larga).length) / qs.length);
    console.log(`${(c + " " + tipo).padEnd(34)} más larga ${lp} % · puesto dominante (≠1) ${pct} % · ratio ${Math.max(...qs.map(ratio)).toFixed(2)}${lp > 40 || exacto > 45 || Math.max(...qs.map(ratio)) > 2 ? "  ✗" : ""}`);
  }
}
