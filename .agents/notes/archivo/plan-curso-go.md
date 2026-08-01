# Plan — Curso de Go (2026-07-04)

Pedido explícito del usuario: **curso amplio de Go para aprender el lenguaje con
él** (no una introducción: el curso ES el vehículo de aprendizaje). Requisitos
que fijó al encolarlo:
- **Amplio**: cubrir el lenguaje entero, de cero a escribir un servicio.
- **Entorno local dockerizado**: cómo montarlo (el usuario trabaja SIEMPRE
  containerizado; coherente con el curso `docker`).
- **Editores y plugins**: qué editores usar y con qué plugins.

## Enfoque
Primer curso de un lenguaje nuevo en el catálogo. El lector es dev PHP senior:
**contrastar con PHP en cada concepto** es la palanca didáctica (modelo de
ejecución binario-persistente vs FPM request-response, punteros vs objetos,
errores-como-valores vs excepciones, interfaces implícitas vs explícitas).
Reusa la base ya publicada: procesos-hilos, concurrencia, async-event-loop,
interfaces, composición, docker, ci-cd.

## Estructura tentativa (POR APROBAR antes de la autoría)
Curso `go` con **módulos** (como `fundamentos` y `diseno-y-arquitectura`),
~20 lecciones en 5 módulos. Categoría nueva `go` (label "Go" en CATEGORY_LABELS).

### Módulo 1 — Arranque: el lenguaje y tu entorno (3)
1. `go-que-es` — **la lección de virtudes/casos de uso que pidió el usuario
   (2026-07-04, requisito común con Rust)**: por qué Go — compilado a binario
   único, tipado estático, GC, concurrencia nativa, simplicidad deliberada
   (poco lenguaje a propósito, se lee en una tarde), compilación casi
   instantánea, despliegue trivial. **Para qué proyectos es más adecuado**:
   servicios de red y APIs, CLIs, infraestructura y tooling (Docker y
   Kubernetes están escritos en Go), microservicios con equipos grandes.
   **Cuándo NO**: dominio con jerarquías ricas, máximo control de memoria/
   latencia (→ Rust). Go vs PHP como modelos de ejecución (cruza php-fpm,
   workers-php). Cierre ¿Go o Rust? con tabla cara a cara (cruza `rust-que-es`
   cuando exista, ver plan-curso-rust.md).
2. `go-entorno-docker` — el entorno local dockerizado: imagen `golang` oficial,
   compose de desarrollo (bind mount del código, caché de módulos en volumen
   named), hot reload con `air`, compilar/ejecutar dentro del contenedor,
   go version / go env. Cruza docker-compose, php-en-docker.
3. `go-editores` — editores y plugins: **GoLand** (JetBrains: transición natural
   desde PhpStorm, mismo IDE con otro cerebro) vs **VS Code + extensión oficial
   Go**; qué aporta el tooling en ambos: `gopls` (el language server compartido),
   `gofmt`/`goimports` al guardar (el formato no se discute: es del lenguaje),
   debugging con `delve`; menciones: vim/neovim con gopls. Incluir cómo apuntar
   el editor al Go del contenedor o instalar toolchain local solo para el IDE.

### Módulo 2 — Fundamentos del lenguaje (6)
4. `go-paquetes-y-modulos` — package/import, `go.mod`+`go.sum` (paralelo
   composer.json/lock, cruza `composer`), go get, visibilidad por
   mayúscula/minúscula (no hay public/private).
5. `go-tipos-y-variables` — var y `:=`, zero values (no hay null por defecto),
   constantes e iota, conversiones siempre explícitas.
6. `go-funciones-y-control` — retornos múltiples (idioma `valor, err`),
   if/switch, `for` como único bucle, `defer`.
7. `go-structs-y-metodos` — struct, métodos con receiver, value receiver vs
   pointer receiver (cuándo cada uno).
8. `go-punteros` — LO NUEVO para un dev PHP: qué es un puntero, `&` y `*`,
   paso por valor siempre (y qué implica), paralelo con objetos PHP (handles);
   sin aritmética de punteros (seguro). Cruza memoria, memoria-php.
9. `go-slices-y-maps` — array vs slice (len/cap, append, el gotcha del backing
   array compartido), maps, range. Contraste con el array-para-todo de PHP
   (cruza estructuras-datos).

### Módulo 3 — El modelo de Go (4)
10. `go-interfaces` — interfaces implícitas (se satisfacen sin `implements`),
    interfaces pequeñas (io.Reader/io.Writer), definidas por el consumidor
    (¡ISP de serie!). Cruza interfaces, isp-segregacion-interfaces.
11. `go-composicion` — no hay herencia y no se echa de menos: embedding y
    composición. Cruza herencia (Go impone lo que OOP recomendaba).
12. `go-errores` — el error es un valor de retorno, no una excepción (contraste
    frontal con PHP, cruza manejo-errores); wrapping con %w, errors.Is/As;
    panic/recover solo para lo irrecuperable.
13. `go-generics` — type parameters (1.18+), constraints, cuándo sí y el idioma
    de no abusar.

### Módulo 4 — Concurrencia, la joya (3)
14. `goroutines` — goroutine vs hilo del SO (verdes, baratas, scheduler M:N);
    lanzar es `go f()`. Cruza procesos-hilos, async-event-loop.
15. `go-channels` — "no compartas memoria para comunicarte: comunícate para
    compartir memoria"; channels con/sin buffer, select, cierre, patrones
    (pipeline, fan-out/fan-in).
16. `go-sync-y-context` — sync.Mutex/WaitGroup, el race detector (`-race`),
    context para cancelación y timeouts. Cruza concurrencia (race conditions).

### Módulo 5 — Backend con Go (4)
17. `go-http` — net/http de la stdlib (un servidor en 10 líneas), handlers,
    routing (mux de 1.22+), middleware como composición de handlers. Cruza
    http-a-fondo, rest-que-es.
18. `go-json-y-bd` — encoding/json (struct tags), database/sql + driver
    (paralelo PDO), mención sqlc/GORM y el sabor anti-ORM de la comunidad.
    Cruza acceso-a-datos, orm-vs-sql.
19. `go-testing` — go test integrado (sin instalar nada), table-driven tests
    (EL idioma), t.Run, benchmarks. Cruza tdd-ciclo, tipos-de-test.
20. `go-a-produccion` — binario estático + compilación cruzada → imagen
    multi-stage con FROM scratch/distroless (el final feliz de
    docker-buenas-practicas); gofmt/vet/golangci-lint; Go en el pipeline de CI.
    Cruza dockerfile-y-capas, ci-para-php (contraste).

## Dependencias técnicas previas
- **Lexer `go` en `assets/js/modules/syntax.js`** (LANGUAGES.go): keywords
  (func/go/chan/defer/select/interface/struct/range...), strings con backticks,
  comentarios //  y /* */, números. Mismo flujo que cuando se añadió `sql`.
  Añadirlo y probarlo ANTES del primer tutorial.
- Bloques compose/YAML sin data-lang (criterio de docker/ci-cd); bash con lexer.

## Encaje en el catálogo
- Categoría nueva `go` → chip automático + label en CATEGORY_LABELS.
- paths.js: no encaja en rutas actuales; valorar ruta propia "Go de cero a
  servicio" cuando esté publicado, o paso en una futura ruta de políglota.
- Es el curso más largo tras `fundamentos` (22): asumir autoría por módulos,
  varios en cola por sesión.

## Prioridad
Encolado tras lo ya comprometido (rutas pendientes, testing/observabilidad,
huecos de versatilidad) **salvo que el usuario lo suba**: al encolarlo no fijó
prioridad. Preguntar al arrancar la siguiente tanda de autoría.

## Estado
**CERRADO.** Curso `go` publicado (21 lecciones), en la ruta
`mas-alla-de-php`. Nada pendiente aquí.
