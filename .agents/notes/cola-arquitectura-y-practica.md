# Cola — Testing, IA y arquitectura (análisis previo)

Pedido del usuario (2026-06-22): encolar **TDD, programar con IA, hexagonal,
DDD y CQRS** con un análisis previo de en cuántos tutoriales se descompone cada
uno. Esta nota es ese análisis: la cola, no la implementación. Cada tema sigue
el patrón del proyecto (un `.html` desde `_PLANTILLA.html` + entrada en
`manifest.js`, estilo de `opcache.html`). Ejemplos en PHP donde apliquen.

## Resumen del análisis

| Tema | Tutoriales | Categoría | Chip nuevo |
| --- | --- | --- | --- |
| TDD / testing | 4 | `testing` | sí → "Testing" |
| Programar con IA | 4 | `ia` | sí → "Programar con IA" |
| Hexagonal | 2 | `arquitectura` | no (ya existe) |
| DDD | 4 | `arquitectura` | no |
| CQRS | 2 | `arquitectura` | no |
| **Total** | **16** | | |

Rango realista 14-18 según cuánto se funda o divida (notas por tema). Dos chips
nuevos: `testing` y `ia` (labels en `CATEGORY_LABELS` de `main.js`). El bloque de
arquitectura reusa el chip `arquitectura` que ya estrenó `inyeccion-dependencias`.

## Orden lógico sugerido

TDD y "programar con IA" son **transversales** (sostienen todo lo demás): irían
primero. El bloque de arquitectura tiene dependencia interna fuerte:
**hexagonal → DDD → CQRS** (cada uno asume el anterior). CQRS+ES cierra cruzando
con `eventos-de-dominio` y `cap-consistencia`.

---

## 1. TDD — 4 tutoriales  (`cat: ["testing"]`)

1. **El ciclo TDD: red-green-refactor** (`tdd-ciclo`) — qué es TDD, por qué se
   escribe el test primero, el ritmo rojo→verde→refactor, baby steps, qué te da
   (diseño emergente, red de seguridad). Principiante/Intermedio.
2. **La pirámide de tests** (`tipos-de-test`) — unit vs integration vs e2e, el
   trade-off velocidad/confianza/coste, qué cubrir en cada nivel, antipatrón del
   cono de helado. Intermedio.
3. **Dobles de test** (`test-doubles`) — dummy/stub/spy/mock/fake, cuándo cada
   uno, sobre-mockear, no mockear lo que no es tuyo. Intermedio. Cruza
   `inyeccion-dependencias` (los dobles entran por el constructor).
4. **Tests que no estorban** (`tests-que-no-estorban`) — testear comportamiento
   no implementación, principios FIRST, tests frágiles, qué NO testear, la
   cobertura como métrica engañosa. Intermedio/Avanzado.
   - Nota: el "TDD aplicado en PHPUnit" no es un 5º; se reparte como ejemplos PHP
     en los cuatro. Si se quiere uno explícito de herramienta, sería +1.

## 2. Programar con IA — 4 tutoriales  (`cat: ["ia"]`)

1. **Cómo "piensa" un LLM al programar** (`como-piensa-un-llm`) — tokens, ventana
   de contexto, predicción del siguiente token, por qué alucina, qué sabe y qué
   no. Fundamento sin humo. Principiante.
2. **Prompting para código** (`prompting-para-codigo`) — dar contexto, ser
   específico, ejemplos, descomponer, iterar sobre el resultado, pedir el porqué.
   Intermedio.
3. **Flujo de trabajo con agentes** (`flujo-con-agentes`) — agentes de código
   (Claude Code y similares): plan → implementar → revisar, darle el contexto del
   repo, no delegar el criterio. Intermedio.
4. **Criterio y riesgos** (`criterio-y-riesgos`) — revisar siempre lo generado,
   seguridad y licencias, deuda técnica silenciosa, los tests como red, cuándo NO
   usar IA. Intermedio. Cruza `owasp` (revisar vulnerabilidades) y el bloque TDD.
   - Posible fusión 1+2 si se quiere un bloque de 3.

## 3. Arquitectura hexagonal — 2 tutoriales  (`cat: ["arquitectura"]`)

1. **Puertos y adaptadores** (`hexagonal`) — el problema del acoplamiento al
   mundo exterior (BBDD, framework, API), dominio en el centro, lados driving vs
   driven, inversión de dependencias. Avanzado. Cruza `inyeccion-dependencias`
   (la DIP es el motor del patrón).
2. **Hexagonal en PHP** (`hexagonal-en-php`) — aplicado: estructura de carpetas,
   un puerto con dos adaptadores (BBDD real + in-memory para test), testar el
   dominio aislado. Avanzado.
   - Podría ser 1 solo tutorial profundo; recomiendo 2 (concepto + aplicado),
     como se hizo con otros pares.

## 4. DDD — 4 tutoriales  (`cat: ["arquitectura"]`)

1. **Qué es DDD (y qué no)** (`ddd-que-es`) — el problema que resuelve (modelar
   dominios complejos), lenguaje ubicuo, "no es solo más capas", cuándo NO
   aplicarlo (CRUD simple). Intermedio.
2. **DDD estratégico** (`ddd-estrategico`) — bounded contexts, context map,
   subdominios (core/supporting/generic), por qué el límite importa más que las
   clases. Avanzado.
3. **DDD táctico (building blocks)** (`ddd-tactico`) — entidad, value object,
   agregado y su raíz, repositorio, servicio de dominio, factory. Con ejemplos
   PHP. Avanzado. Cruza `modelado-relacional` (agregado ≠ tabla).
4. **Eventos de dominio** (`eventos-de-dominio`) — qué son, agregados que los
   emiten, consistencia entre agregados vía eventos, puente a mensajería.
   Avanzado. Cruza `rabbitmq` e `idempotencia`.
   - DDD da para más (specifications, anticorruption layer); 4 cubre lo esencial.

## 5. CQRS — 2 tutoriales  (`cat: ["arquitectura"]`)

1. **CQRS: separar lecturas de escrituras** (`cqrs`) — comando vs query, modelos
   distintos de lectura y escritura, por qué y sobre todo **cuándo NO** (la
   complejidad que añade). Avanzado. Cruza `ddd-tactico`.
2. **CQRS y Event Sourcing** (`cqrs-event-sourcing`) — guardar eventos en vez de
   estado, reconstruir el estado, proyecciones de lectura, relación con CQRS,
   trade-offs. Avanzado. Cruza `eventos-de-dominio` y `cap-consistencia`
   (proyecciones = consistencia eventual).

---

## Dependencias técnicas / encaje en el roadmap

- **Highlighter:** todo es PHP (+ algún bash). No hace falta lenguaje nuevo.
- **Chips nuevos:** `testing` y `ia` → añadir labels en `CATEGORY_LABELS`. El
  bloque arquitectura reusa `arquitectura`.
- **roadmap.js:** encajan como pilares nuevos. Propuesta de 3 pilares:
  "Testing" (4 pasos), "Programar con IA" (4 pasos) y "Diseño y arquitectura"
  (hexagonal → DDD → CQRS, 8 pasos). Decidir al publicar el primero de cada bloque
  (mismo criterio que se siguió con los 7 pilares de fundamentos).

## Estado

**CONSUMIDA (2026-06-26).** Los 16 tutoriales escritos y publicados en una tanda
de autoría ("ataca toda la cola sin parar"). Detalle en `estado.md` → sección
"Cola arquitectura y práctica — COMPLETA". Decisiones de implementación frente al
análisis:
- Se mantuvieron los 16 (no se fusionó ninguno). Slugs tal cual el análisis.
- 2 chips nuevos en CATEGORY_LABELS (`testing`, `ia`) + se añadió label explícito
  para `arquitectura` ("Arquitectura"); el bloque arquitectura reusa ese chip.
- 3 cursos nuevos en `courses.js`: `testing` (4 lecciones planas),
  `programar-con-ia` (4 planas) y `diseno-y-arquitectura` (3 módulos: hexagonal 2,
  DDD 4, CQRS 2 = 8 lecciones). `inyeccion-dependencias` se dejó como artículo
  suelto (no se metió en el curso de arquitectura).
- `featured` movido de owasp a `cqrs-event-sourcing` (el más reciente). Todos con
  `date: 2026-06-26`, `topic` por bloque ("Testing", "Programar con IA",
  "Diseño y arquitectura").
