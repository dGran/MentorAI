# Visión — "La carrera que no hiciste" (2026-06-27)

Nota paraguas que captura el **norte del proyecto** tal como lo formuló el usuario,
para no perderlo entre sesiones. Es la lente con la que mirar todo el roadmap.

## El norte
El usuario es **backend senior autodidacta sin base universitaria** (FP en su día,
nada de web; formado en el trabajo). Quiere que MentorAI llegue a ser **"como una
carrera universitaria"** que le dé la base formal que no tuvo y le **elimine la
barrera psicológica** que aún siente con los fundamentos. Implicación para el
roadmap: aspirar a un **temario completo y coherente de grado**, no a tutoriales
sueltos. Ver memoria `user-perfil`.

**Insight clave (para reforzar, ataca la barrera):** ya tiene construido el
**núcleo teórico de una carrera** (~70-80% del temario troncal). Y lo que aprendió
en el trabajo (Git, APIs, Docker, deploy) es justo lo que las carreras NO enseñan
bien. Está juntando las dos mitades que casi nadie tiene completas.

## Mapeo asignaturas de grado → estado en MentorAI
- Representación de la información → ✅ bits-y-bytes, texto-unicode, numeros-flotantes
- Estructuras de datos y algoritmos → ✅ big-o, estructuras-datos, hashing
- Bases de datos → ✅ indices-btree, transacciones-acid, modelado-relacional
  (FALTA la parte práctica: ORM, SQL aplicado → en plan-practica-backend)
- Sistemas operativos → ✅ procesos-hilos, concurrencia, async-event-loop, memoria
- Redes → ✅ url-a-fondo, http-a-fondo, tcp-ip
- Sistemas distribuidos → ✅ idempotencia, cap-consistencia, redis-cache
- Seguridad → ✅ hashing-vs-cifrado, autenticacion, owasp
- Programación orientada a objetos → ✅ curso oop (2026-06-27)
- Ingeniería del software / diseño → ✅ solid, clean-code, object-calisthenics,
  hexagonal, ddd, cqrs, di-contenedores
- Verificación y validación → ✅ testing (TDD) + PHPUnit pendiente
  (plan-testing-y-observabilidad)

## Lo que falta para sentirlo "carrera completa"
Dos frentes complementarios:

### A) Capa práctica (el día a día que las carreras no dan)
Detalle en `plan-practica-backend.md`: Git, APIs REST, acceso a datos/ORM, Docker,
CI/CD + config y Composer sueltos. **Arrancamos por aquí (Git primero).**

### B) Asignaturas teóricas que aún faltan
- **Paradigmas de programación**, sobre todo **programación funcional**
  (inmutabilidad, funciones puras, map/filter/reduce, efectos, composición). Hoy se
  toca de pasada (clean code, value objects) pero no como tema propio. Posible curso.
- **Metodologías y proceso de software** (ágil, scrum/kanban, code review,
  estimación, control de versiones como práctica de equipo). Hoy solo en el glosario
  `jerga`. Posible curso o artículos. Git conecta aquí (flujo de trabajo en equipo).
- (Menores / nice-to-have, valorar): matemática discreta/lógica, teoría de la
  computación/autómatas, compiladores — más de grado clásico, probablemente fuera de
  alcance salvo que el usuario los pida.

## Idea de producto: ruta "El grado que no hiciste"
Aprovechar la capa de **Rutas** (`paths.js`) para crear un itinerario ordenado de
principio a fin que recorra todo el temario como un plan de estudios:
fundamentos → datos/algoritmos → BBDD → sistemas → redes → distribuidos →
seguridad → OOP → diseño/arquitectura → testing → (práctica: git/apis/docker...).
Verlo entero, con el progreso de lectura, es lo que más desactiva la barrera
psicológica. **Pendiente de montar** (decidido: se hará en paralelo a Git).
Ojo: las rutas actuales son temáticas y acotadas; esta sería la "macro-ruta"
transversal. Revisar si conviene un tipo visual distinto o reusar `.path-card`.

## Estado / orden acordado
1. **Git** (curso, enfoque chuleta de comandos) — EN CURSO, arrancando.
2. Montar la ruta "carrera completa" (en paralelo).
3. Seguir con plan-practica-backend (APIs REST → ORM → Docker → CI/CD).
4. plan-testing-y-observabilidad (PHPUnit + Observabilidad).
5. Asignaturas teóricas que faltan (funcional, metodologías).
Todo pendiente de aprobar estructura curso a curso, como hasta ahora.
