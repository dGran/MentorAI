# QA #34, fase 3 (cierre): contenido de Rust y criterios de la épica en las 63 lecciones

Vehículo: Chrome headless por CDP contra la rama en `:8000` (run `04-verify-4e31250`).

| Criterio de #34 | Resultado | Evidencia |
|---|---|---|
| Las 63 lecciones usan la plantilla actual | ✅ desde la fase 0 (#108); la regla `problemasDeEstructura` lo exige como ERROR | `validar.txt` |
| «Cuándo aplicarlo» y al menos un callout de errores típicos | ✅ 63/63 | `criterios-63.txt`, `cuando-aplicarlo.png` |
| Minutos realistas (≥ 60 palabras/min de prosa, regla acordada) y hero igual que el manifest | ✅ 63/63 | `criterios-63.txt` |
| Cada curso con ≥ 18 preguntas de examen y ≥ 30 % de escenario | ✅ python 18, go 18, rust 18; 6 de escenario en cada uno (33 %); reglas de opciones dentro de los topes | `criterios-63.txt`, `examenes.txt` |
| `validar.js` sin avisos de «Cuándo aplicarlo» ni de hero en estos cursos | ✅ el aviso solo lista 33 lecciones de otros cursos (96 al empezar la épica) | `validar.txt` |
| Se pinta sin romper la plantilla | ✅ 126 vistas (63 × 1280/375): 0 `<pre>` sueltos, 0 callouts sin cuerpo, sin scroll horizontal y 0 errores de consola | `63-lecciones.txt` |

Gates: `node --test` 112/112 · `verificar-offline.js` verde.
