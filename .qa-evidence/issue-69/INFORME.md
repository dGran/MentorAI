# QA #69 — drawer estático muerto

Vehículo: Chrome headless por CDP, viewport 375×800 móvil. La rama `9861d38` se sirvió en `:8000` y `main` en `:8001`, ambas con `python3 -m http.server` (comprobado el `cwd` de cada servidor). No escribe datos.

| Criterio | Resultado | Evidencia |
|---|---|---|
| 0 drawers escritos | ✅ en el DOM, 1 drawer y 1 backdrop (los dinámicos); en `main`, 2 y 2 | `runs/01-verify-9861d38/assets/rama.txt`, `main.txt` |
| Tab a 375 px sin enlaces invisibles | ✅ en las 14 primeras paradas, 0 invisibles; en `main`, 7 (Cerrar, 5 enlaces y Cambiar tema) | `rama.txt`, `*-375-foco-tras-14-tab.png` |
| ERROR de `validar.js` | ✅ criterio técnico: 42 errores con los HTML de `main`, 0 en la rama | ejecutado en el review y en `/implement` |
| La hamburguesa abre, Esc cierra y el foco vuelve | ✅ foco en «Inicio» al abrir y en `.nav__burger` al cerrar, en las 2 páginas | `rama.txt`, `*-375-drawer-abierto.png` |

Errores de consola: 0 en las dos páginas.
