# Plan — Testing a fondo + Observabilidad (2026-06-27)

Pedido del usuario tras ver que el bloque testing quedó conceptual ("TDD no lo
ves un poco pobre, ¿merece un curso?") y proponer monitoring (Sentry + Grafana/
Loki a fondo). **Decisiones tomadas (AskUserQuestion):**
- Testing: **dos cursos separados** (no ampliar el actual con módulos).
- Monitoring: **observabilidad completa** = Sentry + Grafana/Loki/LogQL +
  Prometheus/PromQL (logs + métricas + errores/trazas).
- Ejecución: **plan primero** (este fichero), autoría después del OK del usuario.

Patrón de siempre: cada tutorial = `tutorials/<slug>.html` desde el molde de los
existentes + entrada en `manifest.js`; cursos en `courses.js`. Verificación:
`node --check`, escapado en `<code data-lang>`, TOC↔h2, cruce courses×manifest,
render headless. **No tocar** el catálogo a mano (se auto-genera).

---

## 1. Reestructurar el curso de testing existente

El curso actual `testing` ("Testing y TDD para backend", 4 lecciones: tdd-ciclo,
tipos-de-test, test-doubles, tests-que-no-estorban) se queda como **curso de
fundamentos**, solo se renombra para diferenciarlo del de PHPUnit:
- `title`: "TDD y fundamentos de testing"
- `summary`: ajustar a "el porqué del testing: ciclo TDD, niveles, dobles y
  cómo no escribir tests que estorban" (lo conceptual).
- Lecciones y slugs: **sin cambios** (no se reescriben los 4 existentes).

No cambian las categorías de esas 4 lecciones (`testing`).

---

## 2. Curso nuevo — PHPUnit a fondo

Curso `phpunit` ("PHPUnit a fondo"), nivel Intermedio, icon `code`. La práctica
que complementa la teoría del curso de fundamentos. Lecciones, categoría
`["php","testing"]`, ejemplos `data-lang="php"`, topic "Testing":

1. **`phpunit-primeros-pasos`** (Int, 14m) — instalar (composer), `phpunit.xml`,
   anatomía de un test (clase `TestCase`, métodos `test_*`), ejecutar y leer la
   salida, convenciones. Aserciones core: `assertSame` vs `assertEquals`
   (identidad vs igualdad — el error típico), `assertTrue/False/Null`,
   `assertCount`, mensajes de fallo. Cruza tdd-ciclo.
2. **`phpunit-data-providers`** (Int, 13m) — tests parametrizados: `#[DataProvider]`
   (atributo PHP 8) / `@dataProvider`, datasets con nombre, por qué un data
   provider > copiar-pegar el test, casos límite en tabla. Cruza tests-que-no-estorban.
3. **`phpunit-fixtures`** (Int, 13m) — ciclo de vida: `setUp`/`tearDown`,
   `setUpBeforeClass`/`tearDownAfterClass`, estado entre tests, por qué los tests
   deben ser independientes (FIRST), no compartir estado mutable. Cruza
   tests-que-no-estorban (independent/repeatable).
4. **`phpunit-mocks`** (Int, 15m) — dobles en PHPUnit en la práctica:
   `createStub` + `willReturn`, `createMock` + `expects($this->once())->method->with`,
   `willThrowException`, `willReturnCallback`. La aplicación concreta de la teoría
   de `test-doubles`. Aviso de sobre-mockear. Cruza test-doubles e
   inyeccion-dependencias.
5. **`phpunit-excepciones-cobertura`** (Avz, 14m) — testear errores:
   `expectException`, `expectExceptionMessage`/`Code`, probar que algo lanza;
   cobertura: pcov/xdebug, `--coverage-html`, leer el informe, líneas vs ramas,
   por qué el 100% no es el objetivo (puente a la cobertura engañosa del curso de
   fundamentos). Cruza tests-que-no-estorban.
6. **`phpunit-integracion-bbdd`** (Avz, 15m) — tests de integración con base de
   datos real: base de datos de test, fixtures, transacción por test que se
   revierte (rollback), por qué son más lentos y van menos (pirámide), qué cubren
   que el unitario finge. Cruza tipos-de-test (integración) y transacciones-acid.

Total bloque: **6 lecciones**. Sin lenguaje nuevo en el highlighter (php basta).

---

## 3. Curso nuevo — Observabilidad y monitoring

Curso `observabilidad` ("Observabilidad y monitoring"), nivel Avanzado, icon
`signal`, con **módulos**. Categoría nueva `observabilidad` (label
"Observabilidad" en `CATEGORY_LABELS` de `catalog.js`), topic "Observabilidad".
Highlighter: PHP donde aplique; **PromQL, LogQL y YAML no tienen lexer → bloques
sin `data-lang`** (texto plano, como se hace con el pseudocódigo). bash para CLI.

**Módulo "Fundamentos"**
1. **`observabilidad-pilares`** (Int, 14m) — monitoring vs observabilidad, los 3
   pilares (logs, métricas, trazas), qué responde cada uno (¿qué pasó? ¿cuánto?
   ¿dónde?), cuándo usar cuál, cardinalidad. Sin código o mínimo.
2. **`logs-estructurados`** (Int, 14m) — logging efectivo: niveles, log
   estructurado (JSON) vs texto, qué loguear y qué nunca (secretos/PII),
   correlación (request id), PSR-3 en PHP. Prepara Loki. 1-2 php.

**Módulo "Errores con Sentry"**
3. **`sentry-error-tracking`** (Int, 14m) — qué es Sentry, captura de excepciones,
   integración (SDK PHP / Symfony / Laravel), agrupación de errores
   (fingerprinting), issues, contexto y breadcrumbs. 2 php.
4. **`sentry-a-fondo`** (Avz, 15m) — releases y regresiones, source maps
   (front), environments, performance monitoring (transactions/tracing, sampling),
   alertas, ruido y cómo reducirlo. 1-2 php/yaml(sin data-lang).

**Módulo "Métricas con Prometheus"**
5. **`metricas-prometheus`** (Avz, 15m) — qué es Prometheus, modelo pull +
   scraping, tipos de métrica (counter, gauge, histogram, summary), labels y
   cardinalidad, exporters, instrumentar una app PHP. yaml de scrape (sin
   data-lang), 1 php de instrumentación.
6. **`promql`** (Avz, 16m) — PromQL a fondo: selectores e instant vs range
   vectors, `rate()`/`irate()`, agregación (`sum by`, `avg`, `max`),
   `histogram_quantile` para percentiles (p95/p99), consultas para alertas, método
   RED/USE. Bloques PromQL **sin data-lang**.

**Módulo "Logs y dashboards con Grafana"**
7. **`grafana-dashboards`** (Int, 14m) — qué es Grafana, fuentes de datos
   (Prometheus, Loki), paneles (time series, stat, table), variables de dashboard,
   organización, buenas prácticas de visualización.
8. **`loki-logql`** (Avz, 17m) — Loki ("Prometheus para logs"): labels vs
   contenido (por qué no indexar todo), LogQL a fondo: stream selectors
   `{app="x"}`, line filters (`|=`, `!=`, `|~`, `!~`), parsers (`json`, `logfmt`,
   `pattern`, `regexp`), label filters, métricas sobre logs (`rate`,
   `count_over_time`, `sum by`), consultas avanzadas. **El objetivo del usuario:
   salir sabiendo escribir consultas avanzadas.** Bloques LogQL **sin data-lang**.

**Módulo "Alerting"**
9. **`alerting`** (Avz, 14m) — alertas en Prometheus (Alertmanager) y Grafana,
   reglas, agrupación/silencios, fatiga de alertas, alertar por síntomas no por
   causas, SLO y error budget. yaml de reglas (sin data-lang).

Total bloque: **9 lecciones**. 1 categoría nueva (`observabilidad`).

---

## Resumen de impacto

- **15 tutoriales nuevos** (6 PHPUnit + 9 Observabilidad).
- **2 cursos nuevos** en courses.js (`phpunit`, `observabilidad`) + renombrar el
  curso `testing`.
- **1 chip/categoría nueva**: `observabilidad` (label en CATEGORY_LABELS). El chip
  `testing` ya existe; `php` ya existe.
- Highlighter: **sin lenguajes nuevos**; PromQL/LogQL/YAML van **sin `data-lang`**.
- `featured` pasará al último que se publique (probablemente `loki-logql` o
  `alerting`); hoy lo tiene `object-calisthenics`.

## Orden de autoría sugerido

PHPUnit primero (cierra el frente de testing que el usuario notó pobre), luego
Observabilidad por módulos en el orden de arriba (fundamentos → Sentry →
Prometheus → Grafana/Loki → alerting). Verificar por tanda como en la cola de
arquitectura.

## Estado

**Plan aprobado en estructura; pendiente de OK para arrancar la autoría.**
