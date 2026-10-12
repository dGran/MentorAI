# QA #34, fase 2: contenido del curso de Go

Vehículo: Chrome headless por CDP contra la rama en `:8000` (run `03-verify-70675b3`).

| Criterio de #34 | Resultado | Evidencia |
|---|---|---|
| «Cuándo aplicarlo» enlazado en el índice | ✅ 21/21 (4 secciones retituladas y ampliadas) | `criterios-por-leccion.txt`, `cuando-aplicarlo.png` |
| Callout de errores típicos | ✅ 21/21 (en 3, el aviso de un solo error que ya tenían, decisión explícita) | `criterios-por-leccion.txt` |
| Minutos ≥ 60 palabras/min de prosa, hero igual que el manifest | ✅ 21/21; bajan en 14 lecciones | `criterios-por-leccion.txt` |
| Examen ≥ 18 con ≥ 30 % de escenario | ✅ ya cumplía: 18, 6 de escenario (desde #101) | — |
| Errores de contenido corregidos | ✅ `cmp.Ordered` en lugar de `x/exp/constraints`, `i := i` y Go 1.22, `internal/`, `go mod tidy`, `.air.toml`, GC, channels cerrados, chi, caché de `go test` y `go vet` | `paquete-cmp.png`, PR |
| Se pinta sin romper la plantilla | ✅ 42 vistas sin `<pre>` sueltos, sin callouts sin cuerpo, sin scroll horizontal y 0 errores de consola | `go-21-lecciones.txt` |

Gates: `validar.js` sin errores (aviso de «Cuándo aplicarlo»: 75 → 54) · `node --test` 112/112 · `verificar-offline.js` verde.
