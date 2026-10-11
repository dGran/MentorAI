const [DIR, ...CURSOS] = process.argv.slice(2);
const w = {}; global.window = w;
for (const f of ["courses", "quizzes", "checks"]) require(`${DIR}/tutorials/${f}.js`);
const reglas = require("/tmp/claude-1000/-home-davidgran--projects-MentorAI/d5ec8059-b2c6-4cbd-ad8d-adeaebaa8c02/scratchpad/reglas-actuales.js");
const pistas = (q) => reglas.pistasDeForma(q);
let total = 0;
for (const c of CURSOS) {
  const curso = w.MENTORAI_COURSES.find((x) => x.slug === c);
  const lecciones = curso.modules ? curso.modules.flatMap((m) => m.lessons) : curso.lessons;
  const qs = [...(w.MENTORAI_QUIZZES[c]?.questions ?? []), ...lecciones.flatMap((l) => w.MENTORAI_CHECKS[l]?.questions ?? w.MENTORAI_CHECKS[l] ?? [])];
  const marcadas = qs.map((q) => [q, pistas(q)]).filter(([, m]) => m.length);
  total += marcadas.length;
  console.log(`${c}: ${marcadas.length}/${qs.length}${marcadas.length ? " → " + marcadas.map(([q, m]) => q.id + " (" + m.join(", ") + ")").join("; ") : ""}`);
}
console.log("total", total);
