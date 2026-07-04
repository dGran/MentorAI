# Plan — Curso de Rust (2026-07-04)

Pedido explícito del usuario, encolado junto al de Go (ver `plan-curso-go.md`):
**curso amplio de Rust para aprender el lenguaje con él**. Mismos requisitos que
Go: entorno local dockerizado, editores y plugins. Y un requisito común a ambos
cursos que fijó el usuario:
- **Tema propio destacando las virtudes del lenguaje y para qué tipos de
  proyectos es más adecuado** (tanto en Go como en Rust). Ambas lecciones deben
  cruzarse entre sí: "¿Go o Rust?" es la pregunta real de quien llega a ellos.

## Enfoque
Mismo criterio que Go: lector dev PHP senior, contrastar con PHP (y con Go,
cuando exista) en cada concepto. La particularidad de Rust es la curva del
ownership: es EL tema del lenguaje y merece un módulo entero, sin prisa —
es donde los tutoriales de Rust suelen perder al lector.

## Estructura tentativa (POR APROBAR antes de la autoría)
Curso `rust` con módulos, ~21 lecciones en 5 módulos. Categoría nueva `rust`
(label "Rust" en CATEGORY_LABELS).

### Módulo 1 — Arranque: qué es Rust y cuándo elegirlo (3)
1. `rust-que-es` — **la lección de virtudes/casos de uso que pidió el usuario**:
   seguridad de memoria SIN recolector de basura (ownership comprobado en
   compilación), rendimiento de C con abstracciones de alto nivel ("zero-cost"),
   "fearless concurrency" (los data races no compilan), el compilador como
   mentor. **Para qué proyectos**: CLIs y herramientas de sistema, servicios de
   alto rendimiento/baja latencia, WebAssembly, embedded, motores/parsers
   (ejemplos reales: Firefox, ripgrep, herramientas JS modernas). **Cuándo NO**:
   prototipos rápidos, equipos sin tiempo para la curva, CRUD sencillo. Cierre:
   ¿Go o Rust? (cruza `go-que-es`: Go = simplicidad y velocidad de entrega;
   Rust = control y garantías; tabla cara a cara).
2. `rust-entorno-docker` — entorno dockerizado: imagen `rust` oficial, cargo en
   contenedor, compose de desarrollo (bind mount + caché de crates en volumen,
   target/ fuera del bind para no penalizar), recompilación con `cargo watch`.
   Ojo: compilar Rust es lento → la caché importa el doble (cruza
   dockerfile-y-capas). Cruza docker-compose, go-entorno-docker.
3. `rust-editores` — **RustRover** (JetBrains, transición desde PhpStorm) vs
   **VS Code + rust-analyzer** (el language server de referencia); qué aporta el
   tooling: tipos inline (inlay hints), el borrow checker explicado en el editor,
   `rustfmt` al guardar, `clippy` como linter pedagógico, debugging (CodeLLDB).

### Módulo 2 — Fundamentos (4)
4. `cargo-y-crates` — Cargo.toml/Cargo.lock (paralelo composer.json/lock, cruza
   `composer`), crates.io, cargo build/run/check, features.
5. `rust-tipos-y-variables` — inmutable por defecto (`let` vs `let mut`),
   shadowing, tipos escalares, inferencia; contraste con PHP.
6. `rust-funciones-y-control` — funciones, expresiones vs sentencias (el `if`
   devuelve valor), loops, rangos.
7. `rust-structs-y-enums` — structs y métodos (impl), **enums con datos** (suma
   de tipos, lo que PHP no tiene) y `match` exhaustivo: la pareja que explica
   medio Rust idiomático.

### Módulo 3 — El corazón: ownership (4)
8. `ownership` — cada valor tiene un dueño; mover vs copiar; qué resuelve
   (use-after-free, double-free… sin GC). El modelo mental con calma. Cruza
   memoria, memoria-php.
9. `borrowing` — referencias `&` y `&mut`, la regla (n lecturas XOR 1 escritura),
   el borrow checker como verificador de la regla; errores típicos leídos con
   el compilador.
10. `lifetimes` — por qué existen, elisión (casi nunca se escriben), cuándo
    anotarlos; sin dramatizar: es documentación de relaciones de vida.
11. `option-y-result` — no hay null: `Option<T>`; errores como valores:
    `Result<T, E>` y el operador `?`; panic! solo para lo irrecuperable.
    Paralelo con go-errores y contraste con excepciones PHP (cruza manejo-errores).

### Módulo 4 — Abstracción y concurrencia (5)
12. `traits` — el contrato de Rust: definir, implementar, derive; trait objects
    vs generics (dispatch estático vs dinámico). Cruza interfaces, go-interfaces.
13. `rust-generics` — monomorfización (generics sin coste en runtime), bounds.
14. `rust-threads` — hilos del SO, move closures, Send/Sync: por qué el data
    race no compila (cruza concurrencia).
15. `rust-channels-y-arc` — channels (mpsc), estado compartido con Arc<Mutex<T>>;
    elegir entre mensajes y candados. Cruza go-channels.
16. `rust-async` — async/await, el runtime no viene de serie (tokio), cuándo
    async vs threads. Cruza async-event-loop.

### Módulo 5 — Backend con Rust (5)
17. `rust-http` — servicio HTTP con axum (handlers, extractors, estado
    compartido). Cruza http-a-fondo, go-http.
18. `serde-y-bd` — serde (serialización con derive), sqlx (queries verificadas
    en compilación: la BD entra al type system). Cruza acceso-a-datos.
19. `rust-testing` — tests integrados (#[test], cargo test), tests de unidad
    junto al código vs tests/ de integración, doc-tests. Cruza tdd-ciclo,
    go-testing.
20. `rust-tooling` — clippy (el linter que enseña), rustfmt, cargo audit;
    equivalencias con el pipeline PHP (cruza ci-para-php).
21. `rust-a-produccion` — binario estático (musl), multi-stage → FROM scratch,
    compilar en CI con caché de crates, tamaño y tiempos. Cruza
    docker-buenas-practicas, go-a-produccion.

## Dependencias técnicas previas
- **Lexer `rust` en syntax.js** (LANGUAGES.rust): keywords (fn/let/mut/impl/
  match/enum/trait/async...), lifetimes/macros si es viable con el motor de una
  pasada (si no, mantener simple), strings, comentarios, números. Probar ANTES
  del primer tutorial (mismo flujo que `sql` y que el futuro `go`).
- Bloques toml sin data-lang (o valorar lexer ini reutilizable: Cargo.toml es
  casi ini — comprobar si el lexer `ini` existente rinde bien).

## Encaje en el catálogo
- Categoría nueva `rust` → chip automático + label en CATEGORY_LABELS.
- Cruce obligatorio `rust-que-es` ↔ `go-que-es` (decisión del usuario: ambos
  cursos destacan virtudes y tipo de proyecto ideal, y se comparan entre sí).
- paths.js: valorar ruta "políglota backend" cuando ambos existan
  (go + rust: dos maneras de salir del mundo interpretado).

## Prioridad
Encolado tras Go (los dos detrás de lo ya comprometido: testing/observabilidad
en curso, huecos de versatilidad). Confirmar prioridad al arrancar cada tanda.

## Estado
**Cola documentada (2026-07-04). Estructura tentativa NO aprobada aún.**
