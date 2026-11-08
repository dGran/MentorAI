# Plan: el glosario de IA en la Academia (#193 → #194, #195)

**Estado (2026-11-08): inventario hecho y reparto validado por el usuario (§ Decidido con el usuario).** Al cerrar #194 y #195, esta nota pasa a `archivo/` con el veredicto aquí arriba.

Fuente: «Glosario de IA: Harness», un Claude Doc del usuario (5 bloques, 156 apartados, 69 ejemplos en tablas o bloques de código, ~108 KB de texto). La copia fiel en Markdown y los scripts que generan este inventario viven en `.agents/tasks/glosario-ia/` (gitignored: el documento es del usuario y no se versiona). Para regenerar las filas: `python3 -I .agents/tasks/glosario-ia/estructura.py <glosario.md> <estructura.json>` y `python3 -I .agents/tasks/glosario-ia/inventario.py`.

**Condición del usuario: no se pierde nada, y los ejemplos son esenciales.** Cada fila de la tabla final tiene un destino, y el cierre de #194 y #195 se comprueba fila a fila contra ella.

## Recuento

225 filas = 156 apartados (6 `h1`, 41 `h2`, 109 `h3`) + 69 ejemplos (25 bloques de código y 44 tablas). El HTML del glosario tiene 164 encabezados (11/44/109, como dice el comentario de refinado de #193): los 8 de más (5 `h1` y 3 `h2`) están dentro de ejemplos de Markdown renderizado (rules y skills de muestra), así que forman parte de su ejemplo y no son apartados.

Destinos: **renovado** 117 apartados, **enriquecer** 27, **cubierto** 5 y **estructura** 7. «Estructura» es una cuarta categoría que #193 no preveía, para lo que no es contenido: el título y el índice del glosario (pasan a la ficha del curso), las cuatro cabeceras de bloque (pasan a ser módulos) y la cabecera de pendientes del autor. El único contenido de los pendientes, su «punto final», va como reto (S156, renovado).

**Cubierto** (comprobado en la review de #196): la configuración y la comunicación de los hooks (S056, S057) en `cc-hooks-y-permisos`, los worktrees (S090) en `git-worktrees`, y las piezas y formas de puntuar una eval (S124, S125) en `ia-coste-y-evaluacion`. Otros apartados solapan en parte con una lección a fondo, pero se quedan como renovado porque traen algo que esa lección no tiene. Por ejemplo, la temperatura (S018) frente a `llm-muestreo`: el caso del front, la tabla de rangos y «no arregla alucinaciones».

## Criterio del reparto

- **Renovado**: el curso `programar-con-ia` adopta los cuatro bloques del glosario como módulos y recoge todo lo que no tiene una lección propia a fondo. Cuando el tema sí la tiene (contexto, temperatura, alucinaciones, coste, flujo de equipo, seguridad del producto), la lección renovada lo cuenta con los ejemplos del glosario desde el punto de vista de quien usa el agente, y enlaza a la lección a fondo para el mecanismo.
- **Enriquecer**: la mecánica concreta de Claude Code (dónde vive cada fichero, el frontmatter, settings.json, los eventos de hooks) va a la lección del curso `claude-code` que ya trata esa pieza, porque allí falta y allí la busca quien configura. Así el curso renovado no repite `cc-rules`, `cc-skills`, `cc-subagentes`, `cc-mcp` ni `cc-hooks-y-permisos`, sino que los enlaza.
- **Las cinco lecciones actuales no pierden su contenido**: se reescriben y conservan lo que ya enseñan (§ Contenido actual).

## El curso renovado

`programar-con-ia`, «Programar con IA», 12 lecciones en 4 módulos. Los 5 slugs actuales se conservan (21 enlaces entrantes, examen e historial de repaso). Las 7 nuevas llevan el prefijo **`pci-`**, porque `ia-` ya es de `construir-con-ia`.

| Módulo | Lección | Recoge del glosario |
|---|---|---|
| Fundamentos | `conceptos-ia` · Harness, LLM y agente | Qué es un harness, ejemplos, partes de un harness propio, LLM, agente |
| Fundamentos | `pci-modelos-y-coste` · Modelos, esfuerzo y coste | Haiku/Sonnet/Opus, esfuerzo, tokens, suscripción vs API, prompt caching, cómo ahorrar, nota de traspaso |
| Fundamentos | `como-piensa-un-llm` · Contexto, temperatura y alucinaciones | Ventana de contexto, temperatura (y el caso del front), alucinaciones con su regla anti-invención |
| Configurar el agente | `pci-piezas-del-agente` · Rules, skills, subagentes, MCP y hooks | Qué es cada pieza y cuándo se carga, rules que apuntan a skills, los tres casos prácticos (tests, convenciones de equipo, convenciones por capa), MCP completo |
| Configurar el agente | `pci-entorno-claude-code` · Carpetas, comandos y atajos | Estructura de proyecto y usuario, qué va a Git, AGENTS.md, todos los comandos y atajos, comandos personalizados |
| Configurar el agente | `pci-plugins-mods-worktrees` · Plugins, mods y worktrees | Plugins y marketplaces, mods (con sus tablas), worktrees |
| Trabajar con agentes | `prompting-para-codigo` · Prompts y contexto | Qué lleva un prompt, los tres ejemplos malo/bueno, context engineering, quién escribe rules y skills |
| Trabajar con agentes | `flujo-con-agentes` · SDD y flujo agéntico | SDD (fases, specs/, herramientas), flujo agéntico (etapas, niveles, principios, riesgos), ciclo de mejora y Deptrac |
| Trabajar con agentes | `pci-multiagente-y-evals` · Multiagente y evals | Multiagente, agente de QA con Playwright, evals, skill de retro, benchmarks |
| Trabajar con agentes | `criterio-y-riesgos` · Criterio, riesgos y stacks ajenos | Prompt injection y tríada letal, stacks que dominas menos, criterios de aceptación, UX |
| Más allá | `pci-ia-local` · IA local | Parámetros, memoria, cuantización, MoE, herramientas, tabla por hardware, comparación con Claude |
| Más allá | `pci-rag-y-fine-tuning` · Embeddings, RAG y fine-tuning | Embeddings, RAG (cómo, para qué, vs búsqueda agéntica, caso de la documentación en Markdown), fine-tuning con sus ejemplos |

Retos (`practica.js`): uno es la **checklist de auditoría de la configuración de agentes, convertida en skill** (el «punto final» de los pendientes del glosario). Los otros dos salen al escribir.

## Lo que enriquece #195

| Lección | Qué entra (filas) |
|---|---|
| `cc-rules` | Niveles de memoria y su tabla, `.claude/rules/` con `paths` y su ejemplo, imports con `@`, rules en otros harnesses (S025-S027, S029) |
| `cc-skills` | Estructura de carpetas, SKILL.md con frontmatter, las tres capas de carga, cómo se localiza, dónde viven, buenas prácticas de activación, una skill que usa otra (S035-S042) |
| `cc-subagentes` | Definición en `.claude/agents/` con ejemplo, limitaciones, patrones (abanico, cadena, implementar y revisar, explorador), cómo escribir el encargo, sin anidar y `/agents` (S046, S048-S051) |
| `cc-mcp` | Caso práctico: ¿MCP para la herramienta interna?, con la tabla de credenciales (S053) |
| `cc-hooks-y-permisos` | Tabla de eventos completa, precauciones, pre-commit vs hooks con `--no-verify`; settings.json: niveles, campos, sintaxis de permisos, ejemplo Symfony en Docker y modos (S055, S058, S059, S073-S077) |
| `ia-embeddings-y-rag` | Problemas habituales: troceado, reranking, búsqueda híbrida, reindexado (S149) |

## Contenido actual de las cinco lecciones

| Lección | Apartados de hoy | Dónde quedan |
|---|---|---|
| `conceptos-ia` | Mapa del ecosistema, LLM, prompt/tokens/contexto, herramientas, agente, MCP, RAG, fine-tuning vs contexto | Mapa, LLM, herramientas y agente siguen aquí; tokens y contexto pasan a `pci-modelos-y-coste` y `como-piensa-un-llm`; MCP a `pci-piezas-del-agente`; RAG y fine-tuning a `pci-rag-y-fine-tuning` |
| `como-piensa-un-llm` | Predecir la siguiente palabra, tokens, ventana de contexto, qué sabe y qué no, por qué alucina, qué implica al programar | Siguen todos aquí, ampliados con el glosario |
| `prompting-para-codigo` | El prompt como especificación, contexto, ser específico, ejemplos, descomponer, iterar, pedir el porqué | Siguen todos aquí, con los tres ejemplos del glosario |
| `flujo-con-agentes` | Qué es un agente de código, herramientas, plan-implementar-revisar, contexto del repo, no delegues el criterio, dónde encaja | Plan-implementar-revisar, criterio y dónde encaja siguen aquí; qué es un agente y sus herramientas pasan a `conceptos-ia`; el contexto del repositorio a `pci-piezas-del-agente` |
| `criterio-y-riesgos` | El criterio no se delega, revisar lo generado, seguridad y secretos, licencias, deuda técnica silenciosa, tests como red, cuándo no usar IA | Siguen todos aquí, con prompt injection y stacks ajenos |

## Decidido con el usuario (2026-11-08)

1. **Las convenciones de los ejemplos son de su trabajo** (respuesta: «si»). Se reescriben en el proyecto ficticio «tienda» (PHP, como en `metodo-con-agentes`), conservando la estructura y la lección de cada ejemplo, con convenciones y nombres propios de la tienda: las reglas por capa (arquitectura, controllers, services, managers: E010-E012), la skill `crear-migracion-doctrine` y sus reglas (E014, E015, E008, E017 y S034) y el `settings.json` del proyecto Symfony en Docker (E039). Jira, GitLab, Sentry, Symfony, Doctrine, Deptrac y PhpStorm son tecnologías públicas y se quedan.
2. **El mod `agent-flow`** (tabla E044 y recomendación en S088) no aparece en ninguna fuente pública. Los mods sí existen: Claude Code 2.1.287 y los tres de ejemplo del repo `claude-code-playground` (token-weather, blast-radius, replay-theater). Como no se puede verificar y además se llama igual que el método privado del autor, que `metodo-con-agentes` decidió no nombrar, sale su nombre. Lo que hace, un panel con los subagentes en marcha, se queda como fila sin nombre de mod, y la recomendación «agent-flow si usas subagentes» pasa a «un panel de subagentes». El usuario lo dejó a criterio del agente («no lo sé, revísalo»).
3. **Datos con fecha**: se contrastan con fuentes al escribir. Lo que no se pueda comprobar se marca como orientativo y no se omite sin preguntar.
4. **Prefijo `pci-` y los doce títulos**: aprobados a criterio del agente («como lo veas mejor»).

## Inventario fila a fila

| Id | Apartado o ejemplo | Nivel o contexto | Destino | Dónde | Nota |
|---|---|---|---|---|---|
| S001 | Glosario de IA para desarrollo | h1 | **estructura** | `índice del curso renovado` | título e índice del glosario: pasan a la ficha del curso |
| S002 | Índice | h2 | **estructura** | `índice del curso renovado` | título e índice del glosario: pasan a la ficha del curso |
| S003 | 1. Fundamentos | h1 | **estructura** | `módulo «Fundamentos»` |  |
| S004 | Qué es un harness | h2 | **renovado** | `conceptos-ia` | enlaza a cc-agente-por-dentro e ia-agente-en-producto (harness propio en PHP) |
| S005 | Ejemplos de harness | h2 | **renovado** | `conceptos-ia` | enlaza a cc-agente-por-dentro e ia-agente-en-producto (harness propio en PHP) |
| S006 | Partes de un harness propio | h2 | **renovado** | `conceptos-ia` | enlaza a cc-agente-por-dentro e ia-agente-en-producto (harness propio en PHP) |
| S007 | LLM | h2 | **renovado** | `conceptos-ia` | enlaza a cc-agente-por-dentro e ia-agente-en-producto (harness propio en PHP) |
| S008 | Agente | h2 | **renovado** | `conceptos-ia` | enlaza a cc-agente-por-dentro e ia-agente-en-producto (harness propio en PHP) |
| S009 | Familias de modelos: Haiku, Sonnet, Opus | h2 | **renovado** | `pci-modelos-y-coste` | enlaza a ia-coste-y-evaluacion, llm-atencion-y-contexto y cc-memoria-y-continuidad |
| E001 | tabla: \| Modelo \| Tamaño \| Punto fuerte \| Uso típico \| | 1. Fundamentos › Familias de modelos: Haiku, Sonnet, Opus | **renovado** | `pci-modelos-y-coste` | ejemplo completo, con el destino de su apartado (S009) |
| S010 | Esfuerzo y razonamiento (thinking) | h2 | **renovado** | `pci-modelos-y-coste` | enlaza a ia-coste-y-evaluacion, llm-atencion-y-contexto y cc-memoria-y-continuidad |
| S011 | Context window (ventana de contexto) | h2 | **renovado** | `como-piensa-un-llm` | enlaza a cc-contexto-finito |
| S012 | Tokens y costes | h2 | **renovado** | `pci-modelos-y-coste` | enlaza a ia-coste-y-evaluacion, llm-atencion-y-contexto y cc-memoria-y-continuidad |
| S013 | Qué consume tokens en una sesión de agente | h3 | **renovado** | `pci-modelos-y-coste` | enlaza a ia-coste-y-evaluacion, llm-atencion-y-contexto y cc-memoria-y-continuidad |
| S014 | Suscripción vs. API | h3 | **renovado** | `pci-modelos-y-coste` | enlaza a ia-coste-y-evaluacion, llm-atencion-y-contexto y cc-memoria-y-continuidad |
| S015 | Prompt caching | h2 | **renovado** | `pci-modelos-y-coste` | enlaza a ia-coste-y-evaluacion, llm-atencion-y-contexto y cc-memoria-y-continuidad |
| S016 | Cómo ahorrar | h3 | **renovado** | `pci-modelos-y-coste` | enlaza a ia-coste-y-evaluacion, llm-atencion-y-contexto y cc-memoria-y-continuidad |
| S017 | Nota de traspaso (handoff) entre sesiones | h3 | **renovado** | `pci-modelos-y-coste` | enlaza a ia-coste-y-evaluacion, llm-atencion-y-contexto y cc-memoria-y-continuidad |
| E002 | tabla: \| Opción \| Qué hace \| Cuándo \| | 1. Fundamentos › Prompt caching › Nota de traspaso (handoff) | **renovado** | `pci-modelos-y-coste` | ejemplo completo, con el destino de su apartado (S017) |
| S018 | Temperatura | h2 | **renovado** | `como-piensa-un-llm` | solapa con llm-muestreo (top-p/top-k, temperatura cero, el proveedor la fija), que se enlaza; se queda como renovado por la tabla de rangos, «no arregla alucinaciones» y el caso del front, que llm-muestreo no trae |
| E003 | tabla: \| Temperatura \| Comportamiento \| Uso típico \| | 1. Fundamentos › Temperatura | **renovado** | `como-piensa-un-llm` | ejemplo completo, con el destino de su apartado (S018) |
| S019 | Alucinaciones | h2 | **renovado** | `como-piensa-un-llm` | enlaza a llm-alucinacion-y-razonamiento |
| S020 | Por qué ocurren | h3 | **renovado** | `como-piensa-un-llm` | enlaza a llm-alucinacion-y-razonamiento |
| S021 | Alucinaciones típicas en código | h3 | **renovado** | `como-piensa-un-llm` | enlaza a llm-alucinacion-y-razonamiento |
| E004 | tabla: \| Tipo \| Ejemplo \| | 1. Fundamentos › Alucinaciones › Alucinaciones típicas en có | **renovado** | `como-piensa-un-llm` | ejemplo completo, con el destino de su apartado (S021) |
| S022 | Cómo reducirlas | h3 | **renovado** | `como-piensa-un-llm` | enlaza a llm-alucinacion-y-razonamiento |
| E005 | código texto: - Antes de usar un método, clase u opción de configuración,  | 1. Fundamentos › Alucinaciones › Cómo reducirlas | **renovado** | `como-piensa-un-llm` | ejemplo completo, con el destino de su apartado (S022) |
| S023 | 2. Configurar el agente | h1 | **estructura** | `módulo «Configurar el agente»` |  |
| S024 | Rules (reglas) | h2 | **renovado** | `pci-piezas-del-agente` | definición de rule y el reparto rule/skill; enlaza a cc-rules |
| S025 | Rules en Claude Code | h3 | **enriquecer** | `cc-rules` | niveles de memoria, .claude/rules con paths, imports y otros harnesses: cc-rules no los menciona (0 apariciones de «paths», «@», «Cursor») |
| E006 | tabla: \| Nivel \| Ubicación \| Alcance \| | 2. Configurar el agente › Rules (reglas) › Rules en Claude C | **enriquecer** | `cc-rules` | ejemplo completo, con el destino de su apartado (S025) |
| S026 | La carpeta .claude/rules/ | h3 | **enriquecer** | `cc-rules` | niveles de memoria, .claude/rules con paths, imports y otros harnesses: cc-rules no los menciona (0 apariciones de «paths», «@», «Cursor») |
| E007 | código texto: --- | 2. Configurar el agente › Rules (reglas) › La carpeta .claud | **enriquecer** | `cc-rules` | ejemplo completo, con el destino de su apartado (S026) |
| S027 | Imports | h3 | **enriquecer** | `cc-rules` | niveles de memoria, .claude/rules con paths, imports y otros harnesses: cc-rules no los menciona (0 apariciones de «paths», «@», «Cursor») |
| S028 | Rules que apuntan a skills | h3 | **renovado** | `pci-piezas-del-agente` | definición de rule y el reparto rule/skill; enlaza a cc-rules |
| E008 | código texto: # Reglas de flujo | 2. Configurar el agente › Rules (reglas) › Rules que apuntan | **renovado** | `pci-piezas-del-agente` | ejemplo completo, con el destino de su apartado (S028) |
| S029 | Rules en otros harnesses | h3 | **enriquecer** | `cc-rules` | niveles de memoria, .claude/rules con paths, imports y otros harnesses: cc-rules no los menciona (0 apariciones de «paths», «@», «Cursor») |
| S030 | Buenas prácticas | h3 | **renovado** | `pci-piezas-del-agente` | definición de rule y el reparto rule/skill; enlaza a cc-rules |
| S031 | Caso práctico: tests unitarios, ¿rule o skill? | h3 | **renovado** | `pci-piezas-del-agente` | casos de decisión rule o skill, con sus ejemplos completos |
| E009 | tabla: \| Va en la regla (`.claude/rules/testing.md`) \| Va en la skill (`tests | 2. Configurar el agente › Rules (reglas) › Caso práctico: te | **renovado** | `pci-piezas-del-agente` | ejemplo completo, con el destino de su apartado (S031) |
| S032 | Caso práctico: convenciones de equipo | h3 | **renovado** | `pci-piezas-del-agente` | casos de decisión rule o skill, con sus ejemplos completos |
| S033 | Caso práctico: convenciones por capa (controllers, services, managers) | h3 | **renovado** | `pci-piezas-del-agente` | casos de decisión rule o skill, con sus ejemplos completos |
| E010 | código texto: .claude/rules/ | 2. Configurar el agente › Rules (reglas) › Caso práctico: co | **renovado** | `pci-piezas-del-agente` | ejemplo completo, con el destino de su apartado (S033) |
| E011 | código texto: # Arquitectura | 2. Configurar el agente › Rules (reglas) › Caso práctico: co | **renovado** | `pci-piezas-del-agente` | ejemplo completo, con el destino de su apartado (S033) |
| E012 | código texto: --- | 2. Configurar el agente › Rules (reglas) › Caso práctico: co | **renovado** | `pci-piezas-del-agente` | ejemplo completo, con el destino de su apartado (S033) |
| S034 | Skills | h2 | **renovado** | `pci-piezas-del-agente` | enlaza a cc-skills |
| E013 | tabla: \| Pieza \| Qué aporta \| Cuándo se carga \| | 2. Configurar el agente › Skills | **renovado** | `pci-piezas-del-agente` | ejemplo completo, con el destino de su apartado (S034) |
| S035 | Skills en profundidad: estructura, descubrimiento y carga | h2 | **enriquecer** | `cc-skills` | estructura, SKILL.md, las tres capas y el encadenado: cc-skills no trae frontmatter ni references/ |
| S036 | Estructura de carpetas | h3 | **enriquecer** | `cc-skills` | estructura, SKILL.md, las tres capas y el encadenado: cc-skills no trae frontmatter ni references/ |
| E014 | código texto: crear-migracion-doctrine/ | 2. Configurar el agente › Skills en profundidad: estructura, | **enriquecer** | `cc-skills` | ejemplo completo, con el destino de su apartado (S036) |
| S037 | El archivo SKILL.md | h3 | **enriquecer** | `cc-skills` | estructura, SKILL.md, las tres capas y el encadenado: cc-skills no trae frontmatter ni references/ |
| E015 | código texto: --- | 2. Configurar el agente › Skills en profundidad: estructura, | **enriquecer** | `cc-skills` | ejemplo completo, con el destino de su apartado (S037) |
| S038 | Las tres capas de carga | h3 | **enriquecer** | `cc-skills` | estructura, SKILL.md, las tres capas y el encadenado: cc-skills no trae frontmatter ni references/ |
| E016 | tabla: \| Capa \| Qué se carga \| Cuándo \| Coste en contexto \| | 2. Configurar el agente › Skills en profundidad: estructura, | **enriquecer** | `cc-skills` | ejemplo completo, con el destino de su apartado (S038) |
| S039 | Cómo localiza el agente la skill adecuada | h3 | **enriquecer** | `cc-skills` | estructura, SKILL.md, las tres capas y el encadenado: cc-skills no trae frontmatter ni references/ |
| S040 | Dónde viven (Claude Code) | h3 | **enriquecer** | `cc-skills` | estructura, SKILL.md, las tres capas y el encadenado: cc-skills no trae frontmatter ni references/ |
| S041 | Buenas prácticas para que se active bien | h3 | **enriquecer** | `cc-skills` | estructura, SKILL.md, las tres capas y el encadenado: cc-skills no trae frontmatter ni references/ |
| S042 | ¿Una skill puede usar otra? | h3 | **enriquecer** | `cc-skills` | estructura, SKILL.md, las tres capas y el encadenado: cc-skills no trae frontmatter ni references/ |
| E017 | código texto: ## Pasos | 2. Configurar el agente › Skills en profundidad: estructura, | **enriquecer** | `cc-skills` | ejemplo completo, con el destino de su apartado (S042) |
| S043 | Subagentes | h2 | **renovado** | `pci-piezas-del-agente` | qué es, cómo funciona y subagente vs skill; enlaza a cc-subagentes |
| S044 | Cómo funciona | h3 | **renovado** | `pci-piezas-del-agente` | qué es, cómo funciona y subagente vs skill; enlaza a cc-subagentes |
| S045 | Para qué sirven | h3 | **renovado** | `pci-piezas-del-agente` | qué es, cómo funciona y subagente vs skill; enlaza a cc-subagentes |
| E018 | tabla: \| Uso \| Ejemplo \| | 2. Configurar el agente › Subagentes › Para qué sirven | **renovado** | `pci-piezas-del-agente` | ejemplo completo, con el destino de su apartado (S045) |
| S046 | Definir un subagente en Claude Code | h3 | **enriquecer** | `cc-subagentes` | definición en .claude/agents, límites, patrones, encargo y «sin anidar»: cc-subagentes no los trae |
| E019 | código texto: --- | 2. Configurar el agente › Subagentes › Definir un subagente  | **enriquecer** | `cc-subagentes` | ejemplo completo, con el destino de su apartado (S046) |
| S047 | Subagente vs. skill | h3 | **renovado** | `pci-piezas-del-agente` | qué es, cómo funciona y subagente vs skill; enlaza a cc-subagentes |
| E020 | tabla: \|  \| Skill \| Subagente \| | 2. Configurar el agente › Subagentes › Subagente vs. skill | **renovado** | `pci-piezas-del-agente` | ejemplo completo, con el destino de su apartado (S047) |
| S048 | Limitaciones | h3 | **enriquecer** | `cc-subagentes` | definición en .claude/agents, límites, patrones, encargo y «sin anidar»: cc-subagentes no los trae |
| S049 | Patrones habituales con subagentes | h3 | **enriquecer** | `cc-subagentes` | definición en .claude/agents, límites, patrones, encargo y «sin anidar»: cc-subagentes no los trae |
| E021 | tabla: \| Patrón \| Cómo funciona \| Ejemplo \| | 2. Configurar el agente › Subagentes › Patrones habituales c | **enriquecer** | `cc-subagentes` | ejemplo completo, con el destino de su apartado (S049) |
| S050 | Cómo escribir un buen encargo | h3 | **enriquecer** | `cc-subagentes` | definición en .claude/agents, límites, patrones, encargo y «sin anidar»: cc-subagentes no los trae |
| S051 | Otros detalles | h3 | **enriquecer** | `cc-subagentes` | definición en .claude/agents, límites, patrones, encargo y «sin anidar»: cc-subagentes no los trae |
| S052 | MCP (Model Context Protocol) | h2 | **renovado** | `pci-piezas-del-agente` | presentación completa de MCP; enlaza a cc-mcp para el servidor propio |
| S053 | Caso práctico: ¿MCP para la herramienta interna? | h2 | **enriquecer** | `cc-mcp` | caso de la herramienta interna y tabla de credenciales |
| E022 | tabla: \| Integración \| Credencial \| Por qué \| | 2. Configurar el agente › Caso práctico: ¿MCP para la herram | **enriquecer** | `cc-mcp` | ejemplo completo, con el destino de su apartado (S053) |
| S054 | Hooks | h2 | **renovado** | `pci-piezas-del-agente` | qué es un hook y rule vs hook; enlaza a cc-hooks-y-permisos |
| S055 | Eventos principales en Claude Code | h3 | **enriquecer** | `cc-hooks-y-permisos` | tabla de eventos completa (falta Notification), precauciones y pre-commit vs hooks con --no-verify |
| E023 | tabla: \| Evento \| Cuándo se dispara \| Uso típico \| | 2. Configurar el agente › Hooks › Eventos principales en Cla | **enriquecer** | `cc-hooks-y-permisos` | ejemplo completo, con el destino de su apartado (S055) |
| S056 | Cómo se configura | h3 | **cubierto** | `cc-hooks-y-permisos#hooks` | ya trae `"matcher": "Edit|Write"`, la entrada del evento por stdin, `exit 2` y la trampa de `exit 1` |
| E024 | código texto: { | 2. Configurar el agente › Hooks › Cómo se configura | **cubierto** | `cc-hooks-y-permisos#hooks` | ejemplo completo, con el destino de su apartado (S056) |
| S057 | Cómo se comunica con el agente | h3 | **cubierto** | `cc-hooks-y-permisos#hooks` | ya trae `"matcher": "Edit|Write"`, la entrada del evento por stdin, `exit 2` y la trampa de `exit 1` |
| S058 | Precauciones | h3 | **enriquecer** | `cc-hooks-y-permisos` | tabla de eventos completa (falta Notification), precauciones y pre-commit vs hooks con --no-verify |
| S059 | Pre-commit de Git vs. hooks de Claude Code | h3 | **enriquecer** | `cc-hooks-y-permisos` | tabla de eventos completa (falta Notification), precauciones y pre-commit vs hooks con --no-verify |
| E025 | tabla: \|  \| Pre-commit (Git) \| Hooks de Claude Code \| | 2. Configurar el agente › Hooks › Pre-commit de Git vs. hook | **enriquecer** | `cc-hooks-y-permisos` | ejemplo completo, con el destino de su apartado (S059) |
| S060 | Estructura de carpetas de Claude Code (y AGENTS.md) | h2 | **renovado** | `pci-entorno-claude-code` | referencia de carpetas, AGENTS.md, comandos, atajos y comandos propios |
| S061 | Nivel proyecto | h3 | **renovado** | `pci-entorno-claude-code` | referencia de carpetas, AGENTS.md, comandos, atajos y comandos propios |
| E026 | código texto: mi-proyecto/ | 2. Configurar el agente › Estructura de carpetas de Claude C | **renovado** | `pci-entorno-claude-code` | ejemplo completo, con el destino de su apartado (S061) |
| S062 | Nivel usuario | h3 | **renovado** | `pci-entorno-claude-code` | referencia de carpetas, AGENTS.md, comandos, atajos y comandos propios |
| E027 | código texto: ~/.claude/ | 2. Configurar el agente › Estructura de carpetas de Claude C | **renovado** | `pci-entorno-claude-code` | ejemplo completo, con el destino de su apartado (S062) |
| S063 | Qué va en Git y qué no | h3 | **renovado** | `pci-entorno-claude-code` | referencia de carpetas, AGENTS.md, comandos, atajos y comandos propios |
| E028 | tabla: \| Archivo \| ¿A Git? \| Para qué \| | 2. Configurar el agente › Estructura de carpetas de Claude C | **renovado** | `pci-entorno-claude-code` | ejemplo completo, con el destino de su apartado (S063) |
| S064 | AGENTS.md y el estándar multi-harness | h3 | **renovado** | `pci-entorno-claude-code` | referencia de carpetas, AGENTS.md, comandos, atajos y comandos propios |
| S065 | Comandos de Claude Code | h2 | **renovado** | `pci-entorno-claude-code` | referencia de carpetas, AGENTS.md, comandos, atajos y comandos propios |
| S066 | Contexto y sesión | h3 | **renovado** | `pci-entorno-claude-code` | referencia de carpetas, AGENTS.md, comandos, atajos y comandos propios |
| E029 | tabla: \| Comando \| Qué hace \| Cuándo usarlo \| | 2. Configurar el agente › Comandos de Claude Code › Contexto | **renovado** | `pci-entorno-claude-code` | ejemplo completo, con el destino de su apartado (S066) |
| S067 | Modelo, coste y uso | h3 | **renovado** | `pci-entorno-claude-code` | referencia de carpetas, AGENTS.md, comandos, atajos y comandos propios |
| E030 | tabla: \| Comando \| Qué hace \| | 2. Configurar el agente › Comandos de Claude Code › Modelo,  | **renovado** | `pci-entorno-claude-code` | ejemplo completo, con el destino de su apartado (S067) |
| S068 | Configuración del proyecto | h3 | **renovado** | `pci-entorno-claude-code` | referencia de carpetas, AGENTS.md, comandos, atajos y comandos propios |
| E031 | tabla: \| Comando \| Qué hace \| | 2. Configurar el agente › Comandos de Claude Code › Configur | **renovado** | `pci-entorno-claude-code` | ejemplo completo, con el destino de su apartado (S068) |
| S069 | Extensiones | h3 | **renovado** | `pci-entorno-claude-code` | referencia de carpetas, AGENTS.md, comandos, atajos y comandos propios |
| E032 | tabla: \| Comando \| Qué hace \| | 2. Configurar el agente › Comandos de Claude Code › Extensio | **renovado** | `pci-entorno-claude-code` | ejemplo completo, con el destino de su apartado (S069) |
| S070 | Revisión y Git | h3 | **renovado** | `pci-entorno-claude-code` | referencia de carpetas, AGENTS.md, comandos, atajos y comandos propios |
| E033 | tabla: \| Comando \| Qué hace \| | 2. Configurar el agente › Comandos de Claude Code › Revisión | **renovado** | `pci-entorno-claude-code` | ejemplo completo, con el destino de su apartado (S070) |
| S071 | Utilidades | h3 | **renovado** | `pci-entorno-claude-code` | referencia de carpetas, AGENTS.md, comandos, atajos y comandos propios |
| E034 | tabla: \| Comando \| Qué hace \| | 2. Configurar el agente › Comandos de Claude Code › Utilidad | **renovado** | `pci-entorno-claude-code` | ejemplo completo, con el destino de su apartado (S071) |
| S072 | Atajos y prefijos útiles | h3 | **renovado** | `pci-entorno-claude-code` | referencia de carpetas, AGENTS.md, comandos, atajos y comandos propios |
| E035 | tabla: \| Atajo \| Qué hace \| | 2. Configurar el agente › Comandos de Claude Code › Atajos y | **renovado** | `pci-entorno-claude-code` | ejemplo completo, con el destino de su apartado (S072) |
| S073 | Configuración en detalle: settings.json | h3 | **enriquecer** | `cc-hooks-y-permisos` | settings.json: niveles, campos, sintaxis de permisos, ejemplo Symfony y modos |
| E036 | tabla: \| Prioridad \| Archivo \| Para qué \| | 2. Configurar el agente › Comandos de Claude Code › Configur | **enriquecer** | `cc-hooks-y-permisos` | ejemplo completo, con el destino de su apartado (S073) |
| S074 | Campos principales | h3 | **enriquecer** | `cc-hooks-y-permisos` | settings.json: niveles, campos, sintaxis de permisos, ejemplo Symfony y modos |
| E037 | tabla: \| Campo \| Qué controla \| | 2. Configurar el agente › Comandos de Claude Code › Campos p | **enriquecer** | `cc-hooks-y-permisos` | ejemplo completo, con el destino de su apartado (S074) |
| S075 | Sintaxis de permisos | h3 | **enriquecer** | `cc-hooks-y-permisos` | settings.json: niveles, campos, sintaxis de permisos, ejemplo Symfony y modos |
| E038 | tabla: \| Regla \| Significado \| | 2. Configurar el agente › Comandos de Claude Code › Sintaxis | **enriquecer** | `cc-hooks-y-permisos` | ejemplo completo, con el destino de su apartado (S075) |
| S076 | Ejemplo para un proyecto Symfony en Docker | h3 | **enriquecer** | `cc-hooks-y-permisos` | settings.json: niveles, campos, sintaxis de permisos, ejemplo Symfony y modos |
| E039 | código texto: { | 2. Configurar el agente › Comandos de Claude Code › Ejemplo  | **enriquecer** | `cc-hooks-y-permisos` | ejemplo completo, con el destino de su apartado (S076) |
| S077 | Modos de permisos | h3 | **enriquecer** | `cc-hooks-y-permisos` | settings.json: niveles, campos, sintaxis de permisos, ejemplo Symfony y modos |
| E040 | tabla: \| Modo \| Comportamiento \| Cuándo \| | 2. Configurar el agente › Comandos de Claude Code › Modos de | **enriquecer** | `cc-hooks-y-permisos` | ejemplo completo, con el destino de su apartado (S077) |
| S078 | Comandos personalizados | h3 | **renovado** | `pci-entorno-claude-code` | referencia de carpetas, AGENTS.md, comandos, atajos y comandos propios |
| E041 | código texto: --- | 2. Configurar el agente › Comandos de Claude Code › Comandos | **renovado** | `pci-entorno-claude-code` | ejemplo completo, con el destino de su apartado (S078) |
| S079 | Plugins de Claude Code | h2 | **renovado** | `pci-plugins-mods-worktrees` |  |
| S080 | Estructura | h3 | **renovado** | `pci-plugins-mods-worktrees` |  |
| E042 | código texto: mi-plugin/ | 2. Configurar el agente › Plugins de Claude Code › Estructur | **renovado** | `pci-plugins-mods-worktrees` | ejemplo completo, con el destino de su apartado (S080) |
| S081 | Marketplaces | h3 | **renovado** | `pci-plugins-mods-worktrees` |  |
| S082 | Para qué te sirve | h3 | **renovado** | `pci-plugins-mods-worktrees` |  |
| S083 | Precauciones | h3 | **renovado** | `pci-plugins-mods-worktrees` |  |
| S084 | Mods de Claude Code | h2 | **renovado** | `pci-plugins-mods-worktrees` |  |
| S085 | Mod vs. hook vs. plugin | h3 | **renovado** | `pci-plugins-mods-worktrees` |  |
| E043 | tabla: \|  \| Hook de settings \| Mod \| | 2. Configurar el agente › Mods de Claude Code › Mod vs. hook | **renovado** | `pci-plugins-mods-worktrees` | ejemplo completo, con el destino de su apartado (S085) |
| S086 | Ejemplos | h3 | **renovado** | `pci-plugins-mods-worktrees` |  |
| S087 | Más ejemplos, por categoría | h3 | **renovado** | `pci-plugins-mods-worktrees` |  |
| E044 | tabla: \| Categoría \| Mod \| Qué hace \| | 2. Configurar el agente › Mods de Claude Code › Más ejemplos | **renovado** | `pci-plugins-mods-worktrees` | ejemplo completo, con el destino de su apartado (S087) |
| S088 | Para qué te puede servir | h3 | **renovado** | `pci-plugins-mods-worktrees` |  |
| S089 | Precauciones | h3 | **renovado** | `pci-plugins-mods-worktrees` |  |
| S090 | Worktrees | h2 | **cubierto** | `git-worktrees` | `git worktree add`, `remove` y worktrees con Docker Compose ya están; `pci-plugins-mods-worktrees` añade solo `--worktree` de Claude Code y subagentes aislados, y enlaza |
| S091 | 3. Trabajar con agentes | h1 | **estructura** | `módulo «Trabajar con agentes»` |  |
| S092 | Prompts: cómo escribir una buena petición | h2 | **renovado** | `prompting-para-codigo` | context engineering enlaza a ag-como-lee-el-agente |
| S093 | Qué debe tener un prompt | h3 | **renovado** | `prompting-para-codigo` | context engineering enlaza a ag-como-lee-el-agente |
| E045 | tabla: \| Elemento \| ¿Necesario? \| Qué aporta \| Ejemplo \| | 3. Trabajar con agentes › Prompts: cómo escribir una buena p | **renovado** | `prompting-para-codigo` | ejemplo completo, con el destino de su apartado (S093) |
| S094 | Lo que importa y lo que no | h3 | **renovado** | `prompting-para-codigo` | context engineering enlaza a ag-como-lee-el-agente |
| E046 | tabla: \| Importa \| Ya no importa (o poco) \| | 3. Trabajar con agentes › Prompts: cómo escribir una buena p | **renovado** | `prompting-para-codigo` | ejemplo completo, con el destino de su apartado (S094) |
| S095 | Ejemplo 1: corregir un bug | h3 | **renovado** | `prompting-para-codigo` | context engineering enlaza a ag-como-lee-el-agente |
| E047 | código texto: Arregla el bug de los pedidos. | 3. Trabajar con agentes › Prompts: cómo escribir una buena p | **renovado** | `prompting-para-codigo` | ejemplo completo, con el destino de su apartado (S095) |
| E048 | código texto: Al filtrar pedidos por fecha en /admin/orders, los del últim | 3. Trabajar con agentes › Prompts: cómo escribir una buena p | **renovado** | `prompting-para-codigo` | ejemplo completo, con el destino de su apartado (S095) |
| S096 | Ejemplo 2: nueva funcionalidad | h3 | **renovado** | `prompting-para-codigo` | context engineering enlaza a ag-como-lee-el-agente |
| E049 | código texto: Haz un endpoint para exportar usuarios a CSV, que sea rápido | 3. Trabajar con agentes › Prompts: cómo escribir una buena p | **renovado** | `prompting-para-codigo` | ejemplo completo, con el destino de su apartado (S096) |
| E050 | código texto: Necesito un endpoint GET /api/users/export que devuelva los  | 3. Trabajar con agentes › Prompts: cómo escribir una buena p | **renovado** | `prompting-para-codigo` | ejemplo completo, con el destino de su apartado (S096) |
| S097 | Ejemplo 3: refactor | h3 | **renovado** | `prompting-para-codigo` | context engineering enlaza a ag-como-lee-el-agente |
| E051 | código texto: Refactoriza este servicio, que está fatal. | 3. Trabajar con agentes › Prompts: cómo escribir una buena p | **renovado** | `prompting-para-codigo` | ejemplo completo, con el destino de su apartado (S097) |
| E052 | código texto: InvoiceService tiene 900 líneas y mezcla cálculo de impuesto | 3. Trabajar con agentes › Prompts: cómo escribir una buena p | **renovado** | `prompting-para-codigo` | ejemplo completo, con el destino de su apartado (S097) |
| S098 | Reparto con el entorno | h3 | **renovado** | `prompting-para-codigo` | context engineering enlaza a ag-como-lee-el-agente |
| S099 | Context engineering (ingeniería de contexto) | h2 | **renovado** | `prompting-para-codigo` | context engineering enlaza a ag-como-lee-el-agente |
| S100 | ¿Quién escribe las rules y skills: el agente o tú? | h2 | **renovado** | `prompting-para-codigo` | context engineering enlaza a ag-como-lee-el-agente |
| S101 | Qué hace bien el agente | h3 | **renovado** | `prompting-para-codigo` | context engineering enlaza a ag-como-lee-el-agente |
| S102 | Qué tiene que aportar el humano | h3 | **renovado** | `prompting-para-codigo` | context engineering enlaza a ag-como-lee-el-agente |
| S103 | Flujo recomendado | h3 | **renovado** | `prompting-para-codigo` | context engineering enlaza a ag-como-lee-el-agente |
| S104 | Señales de una regla bien escrita | h3 | **renovado** | `prompting-para-codigo` | context engineering enlaza a ag-como-lee-el-agente |
| S105 | Spec-driven development (SDD) | h2 | **renovado** | `flujo-con-agentes` | enlaza a cc-flujo-de-equipo y al curso metodo-con-agentes |
| S106 | Las fases | h3 | **renovado** | `flujo-con-agentes` | enlaza a cc-flujo-de-equipo y al curso metodo-con-agentes |
| S107 | Archivos típicos | h3 | **renovado** | `flujo-con-agentes` | enlaza a cc-flujo-de-equipo y al curso metodo-con-agentes |
| E053 | código texto: specs/ | 3. Trabajar con agentes › Spec-driven development (SDD) › Ar | **renovado** | `flujo-con-agentes` | ejemplo completo, con el destino de su apartado (S107) |
| S108 | Herramientas | h3 | **renovado** | `flujo-con-agentes` | enlaza a cc-flujo-de-equipo y al curso metodo-con-agentes |
| S109 | Cómo encaja con lo demás | h3 | **renovado** | `flujo-con-agentes` | enlaza a cc-flujo-de-equipo y al curso metodo-con-agentes |
| E054 | tabla: \| Pieza \| Papel en SDD \| | 3. Trabajar con agentes › Spec-driven development (SDD) › Có | **renovado** | `flujo-con-agentes` | ejemplo completo, con el destino de su apartado (S109) |
| S110 | Cuándo compensa y cuándo no | h3 | **renovado** | `flujo-con-agentes` | enlaza a cc-flujo-de-equipo y al curso metodo-con-agentes |
| S111 | SDD vs. flujo completo de una tarea | h3 | **renovado** | `flujo-con-agentes` | enlaza a cc-flujo-de-equipo y al curso metodo-con-agentes |
| E055 | código texto: Flujo agéntico completo | 3. Trabajar con agentes › Spec-driven development (SDD) › SD | **renovado** | `flujo-con-agentes` | ejemplo completo, con el destino de su apartado (S111) |
| E056 | tabla: \|  \| Spec-driven development \| Flujo agéntico \| | 3. Trabajar con agentes › Spec-driven development (SDD) › SD | **renovado** | `flujo-con-agentes` | ejemplo completo, con el destino de su apartado (S111) |
| S112 | Flujo agéntico (agentic workflow / agentic SDLC) | h2 | **renovado** | `flujo-con-agentes` | enlaza a cc-flujo-de-equipo y al curso metodo-con-agentes |
| S113 | Etapas | h3 | **renovado** | `flujo-con-agentes` | enlaza a cc-flujo-de-equipo y al curso metodo-con-agentes |
| E057 | tabla: \| # \| Etapa \| Quién la hace \| Piezas \| Punto de control humano \| | 3. Trabajar con agentes › Flujo agéntico (agentic workflow / | **renovado** | `flujo-con-agentes` | ejemplo completo, con el destino de su apartado (S113) |
| S114 | Niveles de automatización | h3 | **renovado** | `flujo-con-agentes` | enlaza a cc-flujo-de-equipo y al curso metodo-con-agentes |
| S115 | Principios | h3 | **renovado** | `flujo-con-agentes` | enlaza a cc-flujo-de-equipo y al curso metodo-con-agentes |
| S116 | Riesgos | h3 | **renovado** | `flujo-con-agentes` | enlaza a cc-flujo-de-equipo y al curso metodo-con-agentes |
| S117 | Del code review a la autonomía: el ciclo de mejora | h3 | **renovado** | `flujo-con-agentes` | enlaza a cc-flujo-de-equipo y al curso metodo-con-agentes |
| E058 | código texto: Review → comentario repetido → ¿se puede comprobar con códig | 3. Trabajar con agentes › Flujo agéntico (agentic workflow / | **renovado** | `flujo-con-agentes` | ejemplo completo, con el destino de su apartado (S117) |
| S118 | Multiagente (sistemas multiagente) | h2 | **renovado** | `pci-multiagente-y-evals` | enlaza a cc-subagentes, ag-roles-de-subagente, ag-qa-con-evidencias e ia-coste-y-evaluacion |
| S119 | Cuándo sí aporta | h3 | **renovado** | `pci-multiagente-y-evals` | enlaza a cc-subagentes, ag-roles-de-subagente, ag-qa-con-evidencias e ia-coste-y-evaluacion |
| E059 | tabla: \| Motivo \| Ejemplo \| | 3. Trabajar con agentes › Multiagente (sistemas multiagente) | **renovado** | `pci-multiagente-y-evals` | ejemplo completo, con el destino de su apartado (S119) |
| S120 | Costes | h3 | **renovado** | `pci-multiagente-y-evals` | enlaza a cc-subagentes, ag-roles-de-subagente, ag-qa-con-evidencias e ia-coste-y-evaluacion |
| S121 | Subagentes vs. multiagente | h3 | **renovado** | `pci-multiagente-y-evals` | enlaza a cc-subagentes, ag-roles-de-subagente, ag-qa-con-evidencias e ia-coste-y-evaluacion |
| E060 | tabla: \|  \| Subagentes \| Multiagente con roles \| | 3. Trabajar con agentes › Multiagente (sistemas multiagente) | **renovado** | `pci-multiagente-y-evals` | ejemplo completo, con el destino de su apartado (S121) |
| S122 | Caso práctico: agente de QA con Playwright | h3 | **renovado** | `pci-multiagente-y-evals` | enlaza a cc-subagentes, ag-roles-de-subagente, ag-qa-con-evidencias e ia-coste-y-evaluacion |
| E061 | tabla: \| Debe recibir \| No debe recibir \| | 3. Trabajar con agentes › Multiagente (sistemas multiagente) | **renovado** | `pci-multiagente-y-evals` | ejemplo completo, con el destino de su apartado (S122) |
| S123 | Evals (evaluaciones) | h2 | **renovado** | `pci-multiagente-y-evals` | enlaza a cc-subagentes, ag-roles-de-subagente, ag-qa-con-evidencias e ia-coste-y-evaluacion |
| S124 | Piezas de una eval | h3 | **cubierto** | `ia-coste-y-evaluacion#evals` | golden set, coincidencia exacta y modelo como juez ya están; su tabla de ejemplo (E062) sí va al curso renovado |
| S125 | Formas de puntuar | h3 | **cubierto** | `ia-coste-y-evaluacion#evals` | golden set, coincidencia exacta y modelo como juez ya están; su tabla de ejemplo (E062) sí va al curso renovado |
| E062 | tabla: \| Tipo \| Cómo funciona \| Ejemplo \| Fiabilidad \| | 3. Trabajar con agentes › Evals (evaluaciones) › Formas de p | **renovado** | `pci-multiagente-y-evals` | tabla de formas de puntuar con su fiabilidad: no está en ia-coste-y-evaluacion |
| S126 | Evals en el día a día con agentes | h3 | **renovado** | `pci-multiagente-y-evals` | enlaza a cc-subagentes, ag-roles-de-subagente, ag-qa-con-evidencias e ia-coste-y-evaluacion |
| S127 | Caso práctico: skill de retro tras la review | h3 | **renovado** | `pci-multiagente-y-evals` | enlaza a cc-subagentes, ag-roles-de-subagente, ag-qa-con-evidencias e ia-coste-y-evaluacion |
| E063 | tabla: \|  \| Skill de retro \| Eval \| | 3. Trabajar con agentes › Evals (evaluaciones) › Caso prácti | **renovado** | `pci-multiagente-y-evals` | ejemplo completo, con el destino de su apartado (S127) |
| S128 | Benchmarks | h3 | **renovado** | `pci-multiagente-y-evals` | enlaza a cc-subagentes, ag-roles-de-subagente, ag-qa-con-evidencias e ia-coste-y-evaluacion |
| S129 | Prompt injection | h2 | **renovado** | `criterio-y-riesgos` | prompt injection enlaza a ia-seguridad (lado producto) |
| S130 | Tipos | h3 | **renovado** | `criterio-y-riesgos` | prompt injection enlaza a ia-seguridad (lado producto) |
| S131 | La "tríada letal" | h3 | **renovado** | `criterio-y-riesgos` | prompt injection enlaza a ia-seguridad (lado producto) |
| S132 | Por qué te afecta | h3 | **renovado** | `criterio-y-riesgos` | prompt injection enlaza a ia-seguridad (lado producto) |
| S133 | Cómo protegerse | h3 | **renovado** | `criterio-y-riesgos` | prompt injection enlaza a ia-seguridad (lado producto) |
| S134 | Buenas prácticas en stacks que dominas menos | h2 | **renovado** | `criterio-y-riesgos` | prompt injection enlaza a ia-seguridad (lado producto) |
| S135 | Estrategias, de más a menos fiable | h3 | **renovado** | `criterio-y-riesgos` | prompt injection enlaza a ia-seguridad (lado producto) |
| S136 | Criterios de aceptación: ¿los puede definir el modelo? | h3 | **renovado** | `criterio-y-riesgos` | prompt injection enlaza a ia-seguridad (lado producto) |
| S137 | UX y diseño: ¿dónde mira el modelo? | h3 | **renovado** | `criterio-y-riesgos` | prompt injection enlaza a ia-seguridad (lado producto) |
| S138 | 4. Más allá: IA local, RAG y fine-tuning | h1 | **estructura** | `módulo «Más allá: IA local, RAG y fine-tuning»` |  |
| S139 | IA local | h2 | **renovado** | `pci-ia-local` |  |
| E064 | tabla: \| Tamaño \| Memoria aprox. (4 bits) \| Nivel orientativo \| | 4. Más allá: IA local, RAG y fine-tuning › IA local | **renovado** | `pci-ia-local` | ejemplo completo, con el destino de su apartado (S139) |
| S140 | IA local según el hardware (noviembre 2026) | h2 | **renovado** | `pci-ia-local` |  |
| E065 | tabla: \| Hardware \| Hasta dónde llega \| Modelo de ejemplo \| | 4. Más allá: IA local, RAG y fine-tuning › IA local según el | **renovado** | `pci-ia-local` | ejemplo completo, con el destino de su apartado (S140) |
| S141 | Comparación con Claude (orientativa) | h2 | **renovado** | `pci-ia-local` |  |
| E066 | tabla: \| Local \| Comparable a grandes rasgos \| Para qué sirve \| | 4. Más allá: IA local, RAG y fine-tuning › Comparación con C | **renovado** | `pci-ia-local` | ejemplo completo, con el destino de su apartado (S141) |
| S142 | Embeddings | h2 | **renovado** | `pci-rag-y-fine-tuning` | enlaza a llm-de-texto-a-tokens e ia-embeddings-y-rag |
| S143 | RAG (Retrieval-Augmented Generation) | h2 | **renovado** | `pci-rag-y-fine-tuning` | enlaza a llm-de-texto-a-tokens e ia-embeddings-y-rag |
| S144 | Cómo funciona | h3 | **renovado** | `pci-rag-y-fine-tuning` | enlaza a llm-de-texto-a-tokens e ia-embeddings-y-rag |
| S145 | Para qué sirve | h3 | **renovado** | `pci-rag-y-fine-tuning` | enlaza a llm-de-texto-a-tokens e ia-embeddings-y-rag |
| S146 | RAG vs. búsqueda agéntica | h3 | **renovado** | `pci-rag-y-fine-tuning` | enlaza a llm-de-texto-a-tokens e ia-embeddings-y-rag |
| E067 | tabla: \|  \| RAG con embeddings \| Búsqueda agéntica \| | 4. Más allá: IA local, RAG y fine-tuning › RAG (Retrieval-Au | **renovado** | `pci-rag-y-fine-tuning` | ejemplo completo, con el destino de su apartado (S146) |
| S147 | ¿Me afecta en el día a día? | h3 | **renovado** | `pci-rag-y-fine-tuning` | enlaza a llm-de-texto-a-tokens e ia-embeddings-y-rag |
| S148 | Caso práctico: documentación funcional por módulos en Markdown | h3 | **renovado** | `pci-rag-y-fine-tuning` | enlaza a llm-de-texto-a-tokens e ia-embeddings-y-rag |
| S149 | Problemas habituales | h3 | **enriquecer** | `ia-embeddings-y-rag` | reranking y búsqueda híbrida con identificadores: ia-embeddings-y-rag no trae reranking |
| S150 | Fine-tuning (ajuste fino) | h2 | **renovado** | `pci-rag-y-fine-tuning` | enlaza a llm-de-texto-a-tokens e ia-embeddings-y-rag |
| S151 | Fine-tuning vs. RAG vs. contexto | h3 | **renovado** | `pci-rag-y-fine-tuning` | enlaza a llm-de-texto-a-tokens e ia-embeddings-y-rag |
| E068 | tabla: \|  \| Contexto (rules, skills, prompt) \| RAG \| Fine-tuning \| | 4. Más allá: IA local, RAG y fine-tuning › Fine-tuning (ajus | **renovado** | `pci-rag-y-fine-tuning` | ejemplo completo, con el destino de su apartado (S151) |
| S152 | Cuándo compensa | h3 | **renovado** | `pci-rag-y-fine-tuning` | enlaza a llm-de-texto-a-tokens e ia-embeddings-y-rag |
| S153 | Cuándo no | h3 | **renovado** | `pci-rag-y-fine-tuning` | enlaza a llm-de-texto-a-tokens e ia-embeddings-y-rag |
| S154 | Ejemplos prácticos | h3 | **renovado** | `pci-rag-y-fine-tuning` | enlaza a llm-de-texto-a-tokens e ia-embeddings-y-rag |
| E069 | tabla: \| Caso \| Entrada → salida \| Por qué encaja \| | 4. Más allá: IA local, RAG y fine-tuning › Fine-tuning (ajus | **renovado** | `pci-rag-y-fine-tuning` | ejemplo completo, con el destino de su apartado (S154) |
| S155 | 5. Pendientes | h1 | **estructura** | `fuera del curso` | bloque de trabajo del autor, no contenido |
| S156 | Temas pendientes | h2 | **renovado** | `reto de práctica del curso renovado` | los temas listados ya están desarrollados en el propio glosario; el «punto final» (checklist de auditoría convertida en skill) es un reto de practica.js |

<!-- filas=225 apartados=156 ejemplos=69 {'estructura': 7, 'renovado': 117, 'enriquecer': 27, 'cubierto': 5} -->
