/* ============================================================
   Comprobaciones rápidas por lección
   ------------------------------------------------------------
   Cada clave es el slug de un tutorial. 2-3 preguntas de recuperación
   activa que se responden justo después de leer, con corrección
   inmediata. No bloquean nada: el portero sigue siendo el examen del
   curso (tutorials/quizzes.js).

   Estructura por pregunta:
     q  enunciado
     o  array de opciones (2-4)
     a  índice (0-based) de la correcta — se baraja al pintar
     w  por qué

   Al añadir preguntas nuevas, repartir la posición de `a`: el barajado
   protege al lector, pero los datos deberían ser honestos igualmente.
   ============================================================ */

window.MENTORAI_CHECKS = {

  /* ================= Curso: Git ================= */

  "git-comandos-esenciales": [
    { q: "Has editado tres ficheros pero solo quieres commitear uno. ¿Qué te lo permite?",
      o: ["El staging area: solo entra en el commit lo que hayas añadido con `git add`","Que `git commit` pregunta fichero por fichero","Nada: un commit siempre incluye todo lo modificado"], a: 0,
      w: "Esa es justo la razón de existir del staging: separar «lo que he tocado» de «lo que quiero contar en este commit»." },
    { q: "Necesitas cambiar de rama pero tienes trabajo a medias que no quieres commitear todavía.",
      o: ["`git reset --hard` guarda los cambios para después","`git stash` lo aparta y te deja el directorio limpio","Hay que commitear obligatoriamente antes de cambiar de rama"], a: 1,
      w: "`git stash` guarda y limpia; se recupera con `git stash pop`. `reset --hard` haría lo contrario: descartar los cambios sin posibilidad de recuperarlos." },
    { q: "Quieres ver qué han subido tus compañeros sin que se mezcle aún con tu trabajo.",
      o: ["`git pull`, que descarga sin integrar","`git merge origin/main` sin descargar antes","`git fetch`, que descarga sin integrar"], a: 2,
      w: "`fetch` descarga y ya está; `pull` es `fetch` + `merge`, o sea que sí integra. Mirar antes de integrar es la razón de usar `fetch` suelto." },
  ],

  "git-ramas-y-flujo": [
    { q: "Has hecho push de tu rama y un compañero ya trabaja sobre ella. ¿Puedes hacer rebase de esos commits?",
      o: ["No: reescribiría commits que ya comparte y le romperías el historial","Sí, el rebase no afecta a otros","Sí, siempre que después hagas force push"], a: 0,
      w: "Es la regla de oro del rebase. Reescribir cambia los hashes, y quien tuviera los originales se queda con dos historias que no casan." },
    { q: "En un fichero en conflicto, ¿qué hay entre `<<<<<<< HEAD` y `=======`?",
      o: ["Lo que traía la rama que estás integrando", "Lo que ya tenías en tu rama actual", "El ancestro común de las dos ramas"], a: 1,
      w: "Primero lo tuyo, después lo que entra. Y resolver no es elegir un lado sin mirar: es escribir la versión correcta y borrar los marcadores." },
    { q: "¿Qué aporta un pull request que git por sí solo no da?",
      o: ["Una forma más rápida de hacer merge","La posibilidad de fusionar sin conflictos","Un sitio donde revisar, comentar y pasar CI antes de integrar"], a: 2,
      w: "El PR no es de git, es de la plataforma. Lo que aporta es el proceso alrededor del merge, no el merge en sí." },
  ],

  "git-deshacer": [
    { q: "Acabas de commitear y te has dejado un fichero fuera. Quieres rehacer ese commit.",
      o: ["`git reset --soft HEAD~1`, que deshace el commit dejando los cambios en staging","`git reset --hard HEAD~1` y volver a escribirlo todo","`git revert HEAD`, que crea un commit inverso"], a: 0,
      w: "`--soft` es el modo para rehacer: deshace el commit y te deja todo listo en staging. `--hard` habría descartado el trabajo, y `revert` es para lo ya compartido." },
    { q: "Has hecho `reset --hard` y has perdido un commit que sí necesitabas.",
      o: ["Está perdido: `--hard` es irreversible", "`git reflog` guarda los movimientos de HEAD y te da el hash para volver", "Solo se recupera si habías hecho push"], a: 1,
      w: "El reflog es la red de seguridad de git: registra dónde ha estado HEAD aunque ese commit ya no cuelgue de ninguna rama." },
    { q: "El commit erróneo ya está en el remoto y lo tiene todo el equipo. ¿`reset` o `revert`?",
      o: ["`reset`: limpia la historia y luego force push","Cualquiera de los dos, es indiferente","`revert`: añade un commit que deshace, sin reescribir la historia"], a: 2,
      w: "Reescribir lo que ya tienen otros es el problema que `revert` evita: deja constancia de la marcha atrás en vez de fingir que nunca pasó." },
  ],

  /* ================= Curso: OOP ================= */

  "oop-clases-y-objetos": [
    { q: "¿Qué significa encapsular bien una clase?",
      o: ["Decidir qué promete la clase hacia fuera y proteger el resto para poder cambiarlo","Poner todas las propiedades en private","Añadir getters y setters para todas las propiedades"], a: 0,
      w: "Un getter y un setter por propiedad es la clase abierta de par en par con más ceremonia: el estado sigue siendo parte del contrato." },
    { q: "¿Qué distingue a un objeto de su clase?",
      o: ["Son lo mismo con distinto nombre","La clase es la plantilla; el objeto es una instancia concreta con su propio estado","La clase guarda datos y el objeto guarda comportamiento"], a: 1,
      w: "De una clase salen N objetos, cada uno con sus valores. El comportamiento se define una vez, en la clase." },
  ],

  "herencia": [
    { q: "Llevas cuatro niveles de herencia y tocar la clase base rompe cosas por sitios que no esperabas.",
      o: ["Es normal: la herencia profunda funciona así","Falta declarar más métodos como final","Es el problema de la clase base frágil; suele resolverse pasando a composición"], a: 2,
      w: "Cada nivel hereda todo lo del anterior, necesite o no. Componer deja elegir qué comportamiento entra en vez de heredarlo entero." },
    { q: "Defines un constructor en la clase hija. ¿Se ejecuta el del padre?",
      o: ["No, salvo que llames a `parent::__construct()`","Sí, PHP lo encadena automáticamente","Solo si el padre es abstracto"], a: 0,
      w: "Olvidarlo deja el objeto a medio inicializar, con propiedades del padre sin asignar y un fallo que aparece lejos del origen." },
    { q: "¿Qué ganas al preferir composición sobre herencia?",
      o: ["Menos código escrito", "Poder combinar comportamientos al construir el objeto, y probar cada pieza por separado", "Que el compilador detecte más errores"], a: 1,
      w: "La herencia fija la relación al escribir la clase; la composición la deja abierta hasta el momento de construir." },
  ],

  "interfaces": [
    { q: "Un parámetro tiene type hint de interfaz. ¿Qué te garantiza el compilador?",
      o: ["Que el objeto hace lo correcto en esos métodos","Que el objeto hereda de una clase concreta","Que el objeto implementa esos métodos"], a: 2,
      w: "Garantiza la forma, no el comportamiento. Aun así basta para programar contra la interfaz y no contra la implementación." },
    { q: "¿Cuándo eliges interfaz en vez de clase abstracta?",
      o: ["Cuando solo defines un contrato, sin implementación ni estado que compartir", "Siempre: las clases abstractas están desaconsejadas", "Cuando quieres compartir código entre las implementaciones"], a: 0,
      w: "Si además quieres compartir implementación o estado entre parientes, ahí es donde entra la clase abstracta." },
  ],

  "polimorfismo": [
    { q: "Tienes un `switch` por tipo repetido en cinco sitios y cada tipo nuevo te obliga a tocar los cinco.",
      o: ["Es inevitable sin herencia múltiple", "Es lo que resuelve el polimorfismo: cada tipo responde a su manera tras una interfaz común", "Hay que extraer el switch a una función y ya está"], a: 1,
      w: "Extraerlo a una función reduce la repetición pero no el problema: sigues editando código existente por cada tipo nuevo." },
    { q: "¿Qué es exactamente el polimorfismo?",
      o: ["Que una clase pueda tener varios constructores","Que un método acepte parámetros de varios tipos","Que objetos de distinto tipo respondan al mismo mensaje de forma distinta"], a: 2,
      w: "El código que llama no sabe ni necesita saber qué implementación concreta tiene delante." },
  ],

  "clases-abstractas": [
    { q: "Una clase hija no implementa un método abstracto del padre. ¿Qué pasa?",
      o: ["Error fatal: PHP no deja instanciarla","Se hereda vacío y devuelve null","Un warning y el método queda sin definir"], a: 0,
      w: "Es la gracia de declararlo abstracto: convierte el olvido en un fallo inmediato en vez de un comportamiento raro en producción." },
    { q: "¿Qué puede tener una clase abstracta que una interfaz no?",
      o: ["Métodos públicos", "Implementación parcial y estado", "Constantes"], a: 1,
      w: "La interfaz define qué se puede pedir; la abstracta además aporta cómo se hace una parte y puede guardar propiedades." },
  ],

  "tipos-de-clases-php": [
    { q: "¿Qué consigues marcando una clase como `final`?",
      o: ["Que no se pueda instanciar","Que sus métodos no se puedan sobrescribir pero sí extenderla","Que no se pueda extender"], a: 2,
      w: "Es una declaración de intenciones: esta clase no se diseñó para heredarse, y quien quiera reutilizarla que la componga." },
    { q: "¿Qué ganas con un enum frente a un puñado de constantes de tipo string?",
      o: ["Que el conjunto de valores válidos pasa a ser un tipo, así que un valor imposible no compila","Que ocupa menos memoria","Que se puede recorrer con foreach"], a: 0,
      w: "El error deja de descubrirse en un `if` olvidado y pasa a detectarse antes de ejecutar." },
    { q: "¿Cuándo tiene sentido un trait?",
      o: ["Como alternativa siempre preferible a las interfaces","Para reutilizar código entre clases sin relación jerárquica","Para definir contratos que otras clases deben cumplir"], a: 1,
      w: "Reutilización horizontal. El riesgo de abusar: el método aparece en la clase sin que se vea de dónde sale." },
  ],

  /* ================= Curso: Clean Code ================= */

  "clean-code-intro": [
    { q: "¿Por qué se insiste tanto en optimizar el código para leerlo?",
      o: ["Porque los linters lo exigen","Porque el código legible se ejecuta más rápido","Porque se lee muchas más veces de las que se escribe"], a: 2,
      w: "Y quien más lo relee eres tú dentro de seis meses. Escribir rápido optimiza la parte barata del trabajo." },
    { q: "¿Qué propone la regla del boy scout?",
      o: ["Dejar el código un poco mejor cada vez que lo tocas","Reservar un sprint para refactorizar","No tocar código que ya funciona"], a: 0,
      w: "Es la alternativa realista al «paramos todo y refactorizamos», que casi nunca llega." },
  ],

  "nombres": [
    { q: "¿Qué tiene de malo llamar `$d` a los días transcurridos?",
      o: ["Que rompe el estándar PSR", "Que obliga al lector a deducir el significado por el contexto", "Nada, si hay un comentario al lado"], a: 1,
      w: "El coste no es teclear menos letras: es que cada lector tiene que reconstruir el significado. Y el comentario al lado envejece por su cuenta." },
    { q: "¿Cómo se nombra un booleano según la convención habitual?",
      o: ["Con un sustantivo: `active`, `permission`","En mayúsculas, como las constantes","Con prefijo `is`, `has` o `should`: `isActive`, `hasPermission`"], a: 2,
      w: "El prefijo hace que la condición se lea como una frase: `if (isActive)` en vez de `if (active)`." },
  ],

  "funciones-limpias": [
    { q: "Ves una llamada `generarInforme($datos, true)`. ¿Qué problema tiene ese `true`?",
      o: ["Que en el sitio donde se lee no dice nada, y suele indicar que la función hace dos cosas","Ninguno si está documentado","Que debería ser un entero"], a: 0,
      w: "Si el booleano elige entre dos comportamientos, sepáralas: el nombre de cada función ya dice cuál quieres." },
    { q: "Una función tiene seis parámetros. ¿Qué suele significar?",
      o: ["Que es una función potente y reutilizable", "Que hay un concepto escondido pidiendo ser su propio objeto", "Que faltan valores por defecto"], a: 1,
      w: "Cada parámetro multiplica los casos que probar y las formas de equivocarse en el orden." },
  ],

  "comentarios": [
    { q: "¿Qué comentario merece la pena escribir?",
      o: ["El que explica qué hace la línea siguiente","El que documenta cada parámetro de cada método","El que explica por qué se decidió así, cuando no es deducible del código"], a: 2,
      w: "El código ya dice qué hace; lo que no puede decir es qué restricción externa o decisión de negocio hay detrás." },
    { q: "Necesitas un párrafo para que se entienda un bloque de código.",
      o: ["Es señal de que el problema es el bloque: extraer una función con buen nombre suele eliminarlo","Escribe el comentario, para eso están","Divide el comentario en varias líneas cortas"], a: 0,
      w: "Además el nombre de una función no se puede desincronizar de su cuerpo, y un comentario sí." },
  ],

  "manejo-errores": [
    { q: "Un método devuelve `null` cuando no encuentra nada. ¿Qué provoca?",
      o: ["Un error en tiempo de compilación","Que todos los llamadores tengan que comprobarlo, y alguno se olvidará","Nada, es la forma estándar"], a: 1,
      w: "El null viaja hacia arriba hasta que alguien no lo comprueba. Alternativas: excepción, colección vacía u objeto nulo explícito." },
    { q: "¿Qué propone «fail fast»?",
      o: ["Terminar el programa ante cualquier error","Ejecutar primero los tests más rápidos","Validar las precondiciones al entrar y lanzar cuanto antes, en vez de propagar estado inválido"], a: 2,
      w: "Cuanto más cerca del origen falle, más barato es el diagnóstico. Si no, el error aparece tres capas más allá y sin contexto." },
  ],

  "code-smells-refactoring": [
    { q: "Refactorizas y, de paso, corriges un caso que estaba mal. ¿Sigue siendo un refactor?",
      o: ["No: si cambia el comportamiento es un cambio funcional, y merece su propio commit","Sí, mientras los tests pasen","Sí, si el cambio es pequeño"], a: 0,
      w: "Refactorizar es cambiar la forma sin cambiar el comportamiento. Mezclarlos hace imposible saber qué causó un fallo después." },
    { q: "¿Por qué no conviene refactorizar sin tests?",
      o: ["Porque los linters no detectan errores de lógica", "Porque no hay forma fiable de comprobar que el comportamiento no cambió", "Porque el equipo no aprobará el PR"], a: 1,
      w: "Sin esa red, cada refactor es una apuesta; y como no se puede comprobar, el miedo acaba congelando el código." },
  ],


  "solid-introduccion": [
    { q: "¿Qué dos métricas resumen hacia dónde empujan los cinco principios?",
      o: ["Cohesión alta y acoplamiento bajo","Cobertura y complejidad ciclomática","Líneas por método y número de clases"], a: 0,
      w: "Cohesión mide si lo que está junto tiene que estarlo; acoplamiento, de cuánto ajeno dependes. Casi todo SOLID va de mover esas dos." },
    { q: "¿Para qué sirven realmente los principios SOLID?",
      o: ["Para reducir el número de líneas de código","Para que el código aguante el cambio sin romperse por sitios inesperados","Para cumplir con los estándares PSR"], a: 1,
      w: "Si el código no va a cambiar, SOLID no te devuelve nada. El criterio siempre es el cambio esperado." },
  ],

  "srp-responsabilidad-unica": [
    { q: "Una clase calcula facturas, las guarda en BD y las imprime en PDF. ¿Cuántas razones para cambiar tiene?",
      o: ["Una: todo va sobre facturas","Dos: cálculo y presentación","Tres, y cada una viene de un actor distinto: negocio, infraestructura y diseño"], a: 2,
      w: "«Razón para cambiar» significa actor, no tema. Tres departamentos que pueden pedirte cambios son tres razones." },
    { q: "¿Cómo detectas en la práctica que una clase viola SRP?",
      o: ["Cuando distintas personas o áreas te piden cambios en ella por motivos que no tienen que ver entre sí","Cuando supera las 200 líneas","Cuando tiene más de cinco métodos públicos"], a: 0,
      w: "La longitud es un síntoma, no la definición. Hay clases largas y cohesionadas, y clases cortas que sirven a dos amos." },
  ],

  "ocp-abierto-cerrado": [
    { q: "Cada método de pago nuevo te obliga a añadir un `case` al mismo switch. ¿Qué principio se está violando?",
      o: ["Single Responsibility","Open/Closed: deberías poder extender sin modificar lo que ya funciona","Interface Segregation"], a: 1,
      w: "Cada edición de código probado es una oportunidad de romperlo. Con una interfaz, el caso nuevo es una clase nueva." },
    { q: "¿Qué mecanismo concreto permite cumplir Open/Closed?",
      o: ["Marcar las clases como final","Usar traits para compartir el código común","El polimorfismo tras una interfaz, que es lo que hace Strategy"], a: 2,
      w: "Los patrones GoF no son un tema aparte: la mayoría son formas concretas de aplicar estos principios." },
  ],

  "lsp-sustitucion-liskov": [
    { q: "Una subclase lanza una excepción en un método que el padre nunca lanzaba. ¿Es válido?",
      o: ["No: quien la usa a través del tipo padre no puede saberlo y romperá","Sí, mientras la firma coincida","Sí, si se documenta en el PHPDoc"], a: 0,
      w: "Liskov va de cumplir el contrato, no solo la firma. También lo violan endurecer precondiciones o debilitar postcondiciones." },
    { q: "¿Por qué `Cuadrado extends Rectangulo` es el ejemplo clásico de violación?",
      o: ["Porque un cuadrado no es matemáticamente un rectángulo","Porque el rectángulo mutable promete que ancho y alto son independientes, y el cuadrado rompe esa promesa","Porque duplica código entre las dos clases"], a: 1,
      w: "Matemáticamente sí lo es. Enseña que la herencia debe seguir al comportamiento, no a la taxonomía." },
  ],

  "isp-segregacion-interfaces": [
    { q: "Una interfaz `Dispositivo` obliga a la impresora a implementar `faxear()`. ¿Cuál es el problema real?",
      o: ["Que escribe más código del necesario","Que el nombre de la interfaz es demasiado genérico","Que acaba lanzando excepciones o devolviendo vacío, lo que además rompe Liskov"], a: 2,
      w: "La solución es partirla por roles y que cada dispositivo implemente solo lo que de verdad cumple." },
    { q: "¿Por qué te acopla un método de una interfaz que nunca llamas?",
      o: ["Porque si cambia su firma te toca reajustar igualmente","No te acopla si no lo usas","Porque consume memoria en tiempo de ejecución"], a: 0,
      w: "Interfaces pequeñas y por rol reducen esa superficie de contacto." },
  ],

  "dip-inversion-dependencias": [
    { q: "Un servicio de dominio importa directamente un repositorio MySQL. ¿Qué falla?",
      o: ["Nada, si el repositorio implementa una interfaz","Que el dominio depende de infraestructura: la flecha apunta al revés","Que falta inyectarlo por constructor"], a: 1,
      w: "Inyectarlo por constructor no arregla nada si lo que inyectas sigue siendo la clase concreta." },
    { q: "Según DIP, ¿quién define la interfaz del repositorio?",
      o: ["La capa de infraestructura, que sabe cómo se guarda","Da igual, mientras exista la interfaz","El módulo de alto nivel que la consume, según lo que necesita"], a: 2,
      w: "Este es el detalle que casi todo el mundo se salta: si la interfaz vive con la implementación, no has invertido nada." },
  ],

  "solid-en-conjunto": [
    { q: "¿Cuándo NO merece la pena aplicar SOLID?",
      o: ["En scripts de una vez, migraciones puntuales o código de pegamento","Nunca: siempre compensa","En proyectos con menos de tres desarrolladores"], a: 0,
      w: "Donde no se espera cambio, la abstracción es coste sin retorno. El criterio es el cambio esperado, no la pureza." },
    { q: "¿Por qué se dice que los cinco principios se refuerzan entre sí?",
      o: ["Porque los definió la misma persona","Porque extender sin modificar necesita abstracciones bien cortadas, y que los sustitutos cumplan el contrato","Porque todos hablan de clases"], a: 1,
      w: "No son cinco reglas sueltas: OCP se apoya en ISP y LSP, y todos ellos en que las dependencias apunten a interfaces." },
  ],

  "inyeccion-dependencias": [
    { q: "¿Por qué se prefiere inyectar por constructor antes que por setter?",
      o: ["Porque se escribe menos código","Porque los setters son más lentos","Porque si el objeto existe, está completo: sus dependencias son obligatorias y visibles en la firma"], a: 2,
      w: "Con setters puedes tener un objeto a medio montar, y el fallo aparece al usarlo, lejos de donde se creó." },
    { q: "¿Inyectar dependencias garantiza cumplir DIP?",
      o: ["No: si lo que inyectas son clases concretas de infraestructura, sigues violándolo","Sí, es lo mismo con otro nombre","Sí, siempre que uses un contenedor"], a: 0,
      w: "DIP es el principio (depender de abstracciones); la inyección es solo la técnica de entrega." },
  ],

  "contenedor-di": [
    { q: "Una clase pide sus dependencias llamando al contenedor desde dentro. ¿Cómo se llama eso?",
      o: ["Autowiring","Service locator, y se considera antipatrón porque su firma miente sobre lo que necesita","Lazy loading"], a: 1,
      w: "Parece que no depende de nada y en realidad depende de todo. Además ata el código al contenedor." },
    { q: "Tu app pasa de PHP-FPM a un worker que vive horas. ¿Qué servicios se vuelven peligrosos?",
      o: ["Los que hacen consultas a base de datos","Los que se declaran lazy","Los compartidos que guardan estado: pueden servírselo al siguiente usuario"], a: 2,
      w: "Es un fallo de seguridad, no de rendimiento. En FPM cada petición arrancaba limpia y eso lo tapaba." },
    { q: "¿Por qué Symfony compila el contenedor?",
      o: ["Para generar PHP con las llamadas `new` ya escritas y no pagar reflexión en cada petición","Para validar la configuración antes de desplegar","Para reducir el tamaño de la caché"], a: 0,
      w: "En producción, resolver un servicio acaba costando lo mismo que instanciarlo a mano." },
  ],

  "tdd-ciclo": [
    { q: "Escribes el test y pasa a la primera. ¿Qué significa?",
      o: ["Que el código ya estaba bien, sigue adelante","Que o ya estaba implementado, o el test no comprueba lo que crees","Que el ciclo TDD se ha completado"], a: 1,
      w: "Por eso el rojo es un paso y no un accidente: demuestra que el test puede fallar, o sea que mide algo." },
    { q: "¿Cuándo tiene sentido escribir el test después del código?",
      o: ["Nunca, rompe TDD","Cuando el equipo va con prisa","Cuando exploras una solución desconocida, o caracterizas código legado antes de tocarlo"], a: 2,
      w: "TDD guía el diseño cuando ya sabes qué quieres; explorando, el test se convierte en lastre porque cambia con cada idea." },
  ],

  "tipos-de-test": [
    { q: "¿Por qué la pirámide propone pocos tests E2E y muchos unitarios?",
      o: ["Por economía: los de arriba dan más confianza pero cuestan minutos y se rompen por cualquier cosa","Porque los E2E son menos fiables técnicamente","Porque los unitarios detectan más bugs"], a: 0,
      w: "Muchos unitarios te dan diagnóstico rápido; unos pocos E2E confirman que el conjunto encaja." },
    { q: "¿Qué distingue de verdad a un test unitario de uno de integración?",
      o: ["El número de líneas que ejecuta","Qué partes son reales: el unitario aísla con dobles, el de integración deja colaborar piezas reales","El framework con el que se escribe"], a: 1,
      w: "El unitario aísla para que un fallo señale un culpable exacto; el de integración acepta lentitud a cambio de comprobar que encajan." },
  ],

  "test-doubles": [
    { q: "¿Cuándo eliges un mock en vez de un stub?",
      o: ["Siempre que la dependencia sea externa","Cuando necesitas devolver un valor concreto","Cuando el efecto que quieres verificar ES la llamada, como enviar un correo"], a: 2,
      w: "Verificar la llamada acopla el test a cómo lo hace tu código. Para lo demás, un stub dice mejor lo que pretendes." },
    { q: "Un stub que además verifica cuántas veces fue llamado, ¿sigue siendo un stub?",
      o: ["No: en cuanto verifica comportamiento es un mock","Sí, el nombre es indiferente","Solo si lo verifica al final del test"], a: 0,
      w: "El stub controla el estado (qué devuelve); el mock también el comportamiento (cómo fue llamado)." },
  ],

  "tests-que-no-estorban": [
    { q: "Un test se rompe cada vez que refactorizas, aunque el comportamiento externo no cambie.",
      o: ["Es normal, hay que actualizarlo","Está probando detalles de implementación: te cobra dos veces sin darte seguridad","Falta añadir más aserciones"], a: 1,
      w: "Prueba lo observable desde fuera y el test seguirá valiendo cuando reescribas las tripas." },
    { q: "¿Qué hace que un test sea flaky y por qué importa tanto?",
      o: ["Que tarda mucho; ralentiza el pipeline","Que depende de otro test; basta con reordenarlos","Que su resultado varía entre ejecuciones, y enseña al equipo a ignorar el rojo"], a: 2,
      w: "Un test inestable es peor que ninguno: a partir de ahí, el fallo real pasa desapercibido." },
    { q: "Un test que no puede fallar nunca se llama tautológico. ¿De dónde suele salir?",
      o: ["De aserciones vacías o de mockear tanto que no queda código real ejecutándose","De usar data providers","De probar métodos privados"], a: 0,
      w: "Da una seguridad falsa, que es peor que no tener test. Si no falla al romper el comportamiento, sobra." },
  ],

  "phpunit-primeros-pasos": [
    { q: "¿Qué ordena el patrón AAA dentro de un test?",
      o: ["Assert, Act, Arrange","Arrange, Act, Assert: preparar, ejecutar y comprobar","Act, Arrange, Assert"], a: 1,
      w: "Separarlas hace el test legible de un vistazo. Cuando cuesta separarlas, suele ser que prueba varias cosas a la vez." },
    { q: "¿Qué nombre le pones a un test?",
      o: ["El del método que prueba, como `testCalcular`","`test1`, `test2`… numerados por orden","Uno que describa el comportamiento esperado y el caso"], a: 2,
      w: "Cuando falla en CI, el nombre es lo único que ves: debería contarte qué se rompió sin abrir el fichero." },
  ],

  "phpunit-data-providers": [
    { q: "Tienes el mismo test copiado cinco veces cambiando solo el valor de entrada.",
      o: ["Un data provider los convierte en datos y deja la lógica una sola vez","Es correcto: cada caso merece su test","Habría que meterlos en un bucle dentro del test"], a: 0,
      w: "Con el bucle, un fallo detiene el resto y ves un único test en rojo. El provider los reporta por separado." },
    { q: "¿Qué ventaja tiene el provider frente a un bucle dentro del test?",
      o: ["Se ejecuta más rápido","Cada caso aparece por separado en la salida, así que sabes exactamente cuál falla","Permite usar mocks"], a: 1,
      w: "Y nombrando las claves del array, el informe dice el nombre del caso en vez de un índice." },
  ],

  "phpunit-fixtures": [
    { q: "¿Cada cuánto se ejecuta `setUp()`?",
      o: ["Una vez por clase de test","Solo antes del primero","Antes de cada método de test"], a: 2,
      w: "Es lo que garantiza el aislamiento: ningún test hereda lo que dejó el anterior, y por eso pueden correr en cualquier orden." },
    { q: "¿Qué riesgo tiene poner cosas en `setUpBeforeClass()`?",
      o: ["Que lo que dejes ahí lo comparten todos los tests, y por ahí se cuelan las dependencias de orden","Que es más lento","Que no funciona con data providers"], a: 0,
      w: "Sirve para lo caro y compartido, como abrir una conexión. Para estado mutable, mejor `setUp()`." },
  ],

  "phpunit-mocks": [
    { q: "Quieres comprobar que tu código reacciona bien cuando la dependencia revienta.",
      o: ["Hay que provocar el fallo real en un test de integración","`->willThrowException(...)` en el doble, y compruebas la reacción","No se puede probar sin tocar el código de producción"], a: 1,
      w: "Probar los caminos de error suele ser más valioso que el camino feliz, y con dobles sale barato." },
    { q: "No vas a verificar cómo se llamó a la dependencia, solo qué devuelve. ¿Qué usas?",
      o: ["`createMock()`, que es lo estándar","Una clase anónima escrita a mano","`createStub()`, que expresa mejor la intención y no rompe al refactorizar"], a: 2,
      w: "`createMock()` genera verificaciones automáticas que no necesitas, y esas verificaciones se rompen al reorganizar el código." },
  ],

  "phpunit-excepciones-cobertura": [
    { q: "¿Dónde va `$this->expectException(...)` respecto a la llamada que lanza?",
      o: ["Antes: si va detrás, la excepción escapa y el test falla","Después, como una aserción normal","Da igual, PHPUnit lo detecta"], a: 0,
      w: "Y conviene ser específico con la clase: esperar `Exception` a secas hace pasar el test aunque falle por otro motivo." },
    { q: "Tienes 100 % de cobertura. ¿Qué te garantiza?",
      o: ["Que no hay bugs en las líneas cubiertas","Que todas las líneas se ejecutan, no que se compruebe nada","Que los tests son de buena calidad"], a: 1,
      w: "Un test sin una sola aserción da cobertura. Es útil al revés: la cobertura baja sí señala zonas sin probar." },
  ],

  "phpunit-integracion-bbdd": [
    { q: "¿Por qué no se lanzan los tests de integración contra la BD de desarrollo?",
      o: ["Por rendimiento","Porque no tiene el esquema actualizado","Porque el test falla cuando alguien cambia un dato, y además ensucia lo que estabas mirando"], a: 2,
      w: "Con una base propia y controlada, el resultado depende solo del código." },
    { q: "¿Qué estrategia deja cada test empezando con un estado conocido?",
      o: ["Envolver cada test en una transacción y revertirla al terminar","Borrar todas las tablas en `tearDown()`","Ejecutar los tests siempre en el mismo orden"], a: 0,
      w: "Es rápido y deja la base como estaba pase lo que pase. Su límite: si el código bajo prueba hace su propio commit, deja de servir." },
  ],


  "rest-que-es": [
    { q: "Ves una ruta `/crearPedido` en una API que se llama REST.",
      o: ["El verbo lo aporta HTTP: la URL debería nombrar el recurso, `/pedidos`","Está bien si el método es POST","Debería ser `/crear-pedido` por convención de guiones"], a: 0,
      w: "El recurso es el sustantivo de la API. Si te sale un verbo en la URL, estás modelando acciones, no recursos." },
    { q: "¿Qué implica que REST sea stateless?",
      o: ["Que la API no puede guardar nada en base de datos","Que cada petición trae lo necesario para procesarse, sin sesión en el servidor","Que las respuestas no se pueden cachear"], a: 1,
      w: "El estado no desaparece: se mueve al cliente (un token) o a un almacén compartido. Es lo que permite poner N instancias detrás de un balanceador." },
  ],

  "rest-metodos-y-estados": [
    { q: "Usas PUT para actualizar solo el email de un usuario y el resto de campos se quedan vacíos.",
      o: ["Es un bug del framework","Hay que enviar los campos como null explícito","PUT reemplaza el recurso completo: para un cambio parcial es PATCH"], a: 2,
      w: "Es el error clásico: PUT es idempotente justo porque manda el recurso entero." },
    { q: "El cliente está autenticado pero no tiene permiso para ese recurso. ¿Qué devuelves?",
      o: ["403 Forbidden","401 Unauthorized","404 Not Found para no revelar que existe"], a: 0,
      w: "401 es «no sé quién eres» y tiene sentido reintentar autenticándose; 403 es «sé quién eres y no puedes»." },
    { q: "Acabas de crear un recurso con POST. ¿Qué respondes?",
      o: ["200 OK con el cuerpo del recurso","201 Created, y conviene añadir un `Location` con su URL","204 No Content"], a: 1,
      w: "El 201 comunica que ahora existe algo que antes no; el `Location` dice dónde encontrarlo." },
  ],

  "rest-diseno-de-urls": [
    { q: "Tienes `/usuarios/1/pedidos/5/lineas/2`. ¿Qué problema arrastra?",
      o: ["Ninguno: refleja bien la jerarquía","Es demasiado larga para algunos navegadores","Acopla al cliente a tu modelo interno; si cambia, sus URLs se rompen"], a: 2,
      w: "Si la línea tiene identidad propia, `/lineas/2` basta. Anidar más de un nivel casi nunca compensa." },
    { q: "Paginas con offset y los usuarios ven registros repetidos o se saltan alguno.",
      o: ["Es inherente al offset cuando se insertan filas mientras paginas: el cursor lo evita","Hay que ordenar por id además de por fecha","Falta bloquear la tabla durante la paginación"], a: 0,
      w: "Además `OFFSET 100000` obliga al motor a descartar cien mil filas. El cursor apunta a la última vista y sigue desde ahí." },
  ],

  "rest-errores-y-validacion": [
    { q: "El móvil pierde cobertura justo después de enviar un pago y reintenta. ¿Cómo evitas cobrar dos veces?",
      o: ["Comprobando por importe y fecha en el servidor","Con una `Idempotency-Key` que el cliente repite y el servidor deduplica","Convirtiendo el POST en PUT"], a: 1,
      w: "Es idempotencia añadida a un POST, que por definición no la tiene." },
    { q: "¿Qué aporta usar `problem+json` (RFC 9457) para los errores?",
      o: ["Respuestas más pequeñas","Compatibilidad con GraphQL","Un formato conocido, así que el cliente trata los errores de forma genérica en vez de parsear el JSON de cada API"], a: 2,
      w: "Evita que cada servicio invente su propia forma de contar lo que ha salido mal." },
  ],

  "rest-vs-rpc-vs-graphql": [
    { q: "Comunicación interna entre tus propios servicios, con foco en rendimiento y contratos estrictos.",
      o: ["gRPC: controlas ambos extremos y ganas con binario y contratos generados","REST, por simplicidad","GraphQL, para que cada servicio pida lo que necesita"], a: 0,
      w: "Hacia fuera pesa más que REST se depure con un navegador y lo entienda cualquiera sin herramientas." },
    { q: "¿Qué pierdes al pasar de REST a GraphQL en cuanto a caché?",
      o: ["Nada, GraphQL cachea igual","La caché HTTP intermedia: al ir todo por POST, los proxies no pueden cachear","Solo la caché del navegador"], a: 1,
      w: "GraphQL lo compensa con caché en cliente, pero es caché que gestionas tú, no infraestructura que ya estaba." },
  ],

  "orm-vs-sql": [
    { q: "Necesitas un informe con window functions y CTEs. ¿ORM o SQL?",
      o: ["ORM siempre, por consistencia","Depende del tamaño de la tabla","SQL a mano: es más claro y más rápido para eso"], a: 2,
      w: "No es traicionar al ORM: es usar cada herramienta donde gana. El ORM brilla en el CRUD, que es la mayoría del código." },
    { q: "¿Qué es el desajuste de impedancia entre objetos y tablas?",
      o: ["Que objetos y tablas modelan las relaciones de forma distinta, y ninguna traducción es perfecta","Que las consultas son más lentas desde código","Que los tipos de datos no coinciden entre PHP y SQL"], a: 0,
      w: "El ORM es precisamente la capa que absorbe esa fricción, con los costes que eso trae." },
  ],

  "active-record-vs-data-mapper": [
    { q: "Quieres poder probar el dominio sin levantar una base de datos.",
      o: ["Active Record, si mockeas la conexión","Data Mapper: la entidad es pura y un mapper externo gestiona la persistencia","Da igual, depende del framework"], a: 1,
      w: "En Active Record la entidad se persiste a sí misma, así que arrastra la base de datos allá donde vaya." },
    { q: "¿Qué gana Active Record a cambio?",
      o: ["Mejor rendimiento en consultas","Independencia del motor de base de datos","Rapidez para escribir: menos ceremonia y todo a mano en la entidad"], a: 2,
      w: "Eloquent y Doctrine son los ejemplos de cada escuela, y la elección es un intercambio, no una jerarquía." },
  ],

  "problema-n-mas-1": [
    { q: "Iteras 500 posts y dentro del bucle accedes a `$post->comments`. ¿Cuántas consultas se lanzan?",
      o: ["501: la de la lista más una por post","Una","500"], a: 0,
      w: "Con 10 filas no se nota; con 1.000 la página se cae, y el código es idéntico. Se detecta con un profiler, no leyendo." },
    { q: "¿Qué hace el eager loading y qué cuesta?",
      o: ["Cachea las relaciones en memoria; cuesta RAM","Carga las relaciones por adelantado en 1-2 consultas; cuesta traer datos que quizá no uses","Difiere la carga hasta que se necesita; no cuesta nada"], a: 1,
      w: "Es un intercambio consciente, no una optimización gratis. Lo que difiere la carga es el lazy loading, que es el origen del problema." },
  ],

  "migraciones-de-esquema": [
    { q: "Te has equivocado en una migración que ya aplicaron tus compañeros y producción.",
      o: ["La editas y avisas al equipo de que vuelvan a ejecutarla","Haces rollback en todos los entornos","Añades una migración nueva que corrija: las aplicadas son inmutables"], a: 2,
      w: "Editarla deja la base de los demás sin coincidir con el código, y nadie se entera hasta que algo falla." },
    { q: "¿Por qué en producción se prefiere «roll forward» al `down()`?",
      o: ["Porque revertir un `DROP COLUMN` no devuelve los datos: el rollback suena bien y falla en la práctica","Porque es más rápido de ejecutar","Porque `down()` no está soportado en todos los ORM"], a: 0,
      w: "Se avanza siempre, con una migración nueva que arregle, y se trata el rollback como algo excepcional." },
  ],

  "orm-transacciones-unit-of-work": [
    { q: "Llamas a `flush()` dentro de un bucle de 1.000 entidades.",
      o: ["Es lo correcto para no acumular memoria","Pierdes el agrupamiento: pasas de una transacción a 1.000, con su coste de red y disco","No cambia nada, el ORM lo optimiza"], a: 1,
      w: "Lo habitual es acumular y hacer `flush()` por lotes, equilibrando memoria y número de transacciones." },
    { q: "¿`flush()` y `commit()` son lo mismo?",
      o: ["Sí, `flush()` es el nombre de Doctrine para commit","No: `commit()` solo aplica a transacciones explícitas y `flush()` a las implícitas","No: `flush()` manda el SQL, pero hasta el `commit()` nada es definitivo"], a: 2,
      w: "Confundirlos lleva a creer que los datos están a salvo cuando aún pueden revertirse." },
  ],

  "docker-imagen-vs-contenedor": [
    { q: "Instalas un paquete dentro de un contenedor y luego lo borras y lo vuelves a crear.",
      o: ["Se ha perdido: los cambios dentro del contenedor no se guardan en la imagen","El paquete sigue ahí: forma parte de la imagen","Depende de si hiciste commit del contenedor"], a: 0,
      w: "La imagen es la receta congelada; el contenedor, el plato. Lo que quieras conservar va en un volumen o en el Dockerfile." },
    { q: "¿Por qué un contenedor arranca en milisegundos y una VM en segundos?",
      o: ["Porque el contenedor usa menos memoria","Porque comparte el kernel del anfitrión en vez de virtualizarlo","Porque la imagen está comprimida"], a: 1,
      w: "De ahí también su limitación: no puedes correr un kernel distinto al del anfitrión." },
  ],

  "dockerfile-y-capas": [
    { q: "Cambias una línea de código y el build reinstala todas las dependencias.",
      o: ["Es inevitable, Docker no cachea dependencias","Falta usar `--no-cache` al revés","El `COPY . .` está antes del `composer install`: hay que copiar primero solo el composer.json"], a: 2,
      w: "La caché es en cascada: si una capa cambia, todas las de abajo se invalidan. El orden del Dockerfile determina el tiempo de build." },
    { q: "¿Qué invalida la caché de una capa?",
      o: ["Que esa capa cambie, y entonces también todas las siguientes","Que haya pasado más de un día","Que cambie cualquier capa del Dockerfile"], a: 0,
      w: "Por eso lo que cambia poco (dependencias) va arriba y lo que cambia mucho (tu código) va abajo." },
  ],

  "docker-compose": [
    { q: "Ejecutas `docker-compose down -v` y desaparecen los datos de tu base local.",
      o: ["Es un bug conocido de compose","El `-v` borra también los volúmenes nombrados; sin él los datos sobreviven","Faltaba declarar el volumen como externo"], a: 1,
      w: "Es la diferencia entre reiniciar el entorno y perderlo." },
    { q: "¿Cómo conecta tu app con el contenedor de MySQL en compose?",
      o: ["Por la IP del contenedor, que hay que averiguar","Publicando el puerto 3306 en el anfitrión","Por el nombre del servicio como hostname, en la red privada que crea compose"], a: 2,
      w: "Por eso no hace falta publicar puertos para que los servicios se hablen entre sí; publicar es para llegar tú desde fuera." },
  ],

  "docker-buenas-practicas": [
    { q: "Metes un secreto en una capa y lo borras en la siguiente instrucción del Dockerfile.",
      o: ["Sigue en el historial de capas: cualquiera con la imagen puede recuperarlo","Queda eliminado de la imagen final","Solo es recuperable si la imagen no está comprimida"], a: 0,
      w: "Los secretos entran en tiempo de ejecución, por variables de entorno o montajes." },
    { q: "¿Qué te da un multi-stage build?",
      o: ["Builds paralelos más rápidos","Compilar con todo el herramental y copiar solo el artefacto a una imagen limpia","Poder usar varias imágenes base a la vez en producción"], a: 1,
      w: "Imagen mucho menor y menos superficie de ataque, porque el compilador no viaja a producción." },
    { q: "¿Qué pasa si no tienes `.dockerignore`?",
      o: ["El build falla si hay ficheros binarios","Docker ignora los ficheros ocultos por defecto","Todo el directorio se envía al daemon en cada build, incluidos `.git`, `vendor/` y quizá tu `.env`"], a: 2,
      w: "Además de lentitud, es una vía habitual de acabar con secretos dentro de la imagen." },
  ],

  "php-en-docker": [
    { q: "Recibes un 502 de nginx en tu entorno dockerizado. ¿Dónde miras primero?",
      o: ["Entre nginx y PHP-FPM: PHP no ha llegado a ejecutarse","En los logs de PHP: el código ha fallado","En la base de datos"], a: 0,
      w: "Un 500 significa que tu código corrió y falló; un 502, que nginx no pudo hablar con FPM. Distinguirlo ahorra mucho tiempo." },
    { q: "¿Por qué nginx y PHP-FPM van en contenedores separados?",
      o: ["Porque no pueden compartir el mismo puerto","Por el principio de un proceso por contenedor: escalar y actualizar cada uno por su cuenta","Porque nginx necesita más memoria"], a: 1,
      w: "Encaja con cómo Docker entiende un contenedor: un proceso en primer plano cuyo ciclo de vida es el del contenedor." },
  ],

  "ci-cd-que-es": [
    { q: "Una rama lleva tres semanas sin integrarse. ¿Por qué es un problema creciente?",
      o: ["Porque git pierde rendimiento con ramas largas","Porque el CI caduca los artefactos","Porque los conflictos crecen más que linealmente y el fallo puede venir de cambios que nadie ha visto juntos"], a: 2,
      w: "Integrar a menudo no es una manía de proceso: reduce el tamaño de cada problema." },
    { q: "¿Qué diferencia hay entre integración continua y entrega continua?",
      o: ["CI valida cada cambio al integrarlo; CD extiende la cinta hasta dejarlo listo para desplegar","Son sinónimos","CI es para código y CD para infraestructura"], a: 0,
      w: "Se nombran juntas pero se adoptan por separado, y CI es la que da valor desde el primer día." },
  ],

  "pipeline-anatomia": [
    { q: "¿Por qué el linter va antes que los tests en el pipeline?",
      o: ["Porque tarda menos en instalarse","Para fallar rápido: no gastas cinco minutos de tests si el código no pasa un check de un segundo","Porque los tests dependen del linter"], a: 1,
      w: "Acorta la realimentación en el caso más común, que es el error tonto." },
    { q: "¿Qué diferencia a un artefacto de una caché en CI?",
      o: ["El artefacto se guarda más tiempo","La caché es para dependencias y el artefacto para logs","El artefacto es salida que quieres conservar o pasar a otro job; la caché es una optimización que puede fallar sin consecuencias"], a: 2,
      w: "Si tu pipeline se rompe cuando la caché no está, la estás usando como artefacto." },
  ],

  "ci-para-php": [
    { q: "Los tests fallan en CI de forma intermitente al conectar con MySQL.",
      o: ["Falta un healthcheck: el contenedor arranca antes de aceptar conexiones","Falta aumentar el timeout de conexión","El runner no tiene suficiente memoria"], a: 0,
      w: "Es una carrera de arranque, y de las causas clásicas de tests inestables en CI." },
    { q: "¿Qué hace `needs: [lint, test]` en un job de GitHub Actions?",
      o: ["Instala lint y test como dependencias","Espera a que ambos terminen con éxito; si uno falla, el job ni se intenta","Ejecuta los tres en paralelo"], a: 1,
      w: "Es lo que convierte una lista de jobs en un grafo: sin `needs` correrían todos a la vez." },
  ],

  "despliegue-continuo": [
    { q: "Vas a borrar una columna que la versión actual todavía usa, y el despliegue es gradual.",
      o: ["Se despliega y se borra a la vez, es atómico","Se para el servicio durante la migración","Expand and contract: primero añades, migras, y solo cuando nadie usa la vieja, contraes"], a: 2,
      w: "Durante el despliegue conviven dos versiones contra la misma base. Borrar antes de tiempo rompe producción a mitad." },
    { q: "¿Qué te da blue-green que no da un despliegue directo?",
      o: ["Rollback instantáneo: basta con redirigir el tráfico al entorno anterior","Despliegues más rápidos","Menos consumo de recursos"], a: 0,
      w: "Tienes dos entornos idénticos y solo uno recibe tráfico; despliegas en el dormido y conmutas." },
  ],

  "sql-joins": [
    { q: "Quieres listar todos los clientes, tengan pedidos o no.",
      o: ["INNER JOIN, que trae todo","LEFT JOIN desde clientes","RIGHT JOIN desde pedidos"], a: 1,
      w: "El INNER solo devuelve la intersección: los clientes sin pedidos desaparecerían del listado." },
    { q: "¿Cómo encuentras solo los clientes SIN pedidos?",
      o: ["`WHERE pedidos.id != clientes.id`","Con un INNER JOIN negado","`LEFT JOIN ... WHERE pedidos.id IS NULL`"], a: 2,
      w: "El LEFT JOIN trae las filas huérfanas con NULL en el lado derecho; filtrar por ese NULL las aísla." },
  ],

  "sql-agregacion": [
    { q: "Quieres quedarte solo con los grupos que tienen más de 5 pedidos.",
      o: ["`HAVING COUNT(*) > 5`","`WHERE COUNT(*) > 5`","`WHERE` con una subconsulta"], a: 0,
      w: "WHERE filtra filas antes de agrupar; HAVING filtra grupos ya formados. Por eso el agregado solo vale en HAVING." },
    { q: "`COUNT(email)` te da menos que `COUNT(*)` sobre la misma tabla.",
      o: ["Es un error del motor","Normal: `COUNT(columna)` no cuenta los NULL","Falta un DISTINCT"], a: 1,
      w: "Solo se nota cuando hay NULL, y entonces se nota mucho: es una fuente clásica de informes que no cuadran." },
  ],

  "sql-subqueries-ctes": [
    { q: "Una subconsulta referencia una columna de la consulta exterior y la query se degrada al crecer la tabla.",
      o: ["Falta un índice en la subconsulta","Hay que convertirla en CTE y ya está resuelto","Es correlacionada: se evalúa una vez por fila de la exterior"], a: 2,
      w: "A veces el planificador la reescribe, pero es el sospechoso habitual cuando algo escala mal." },
    { q: "¿Qué ganas al pasar una subconsulta anidada a un CTE?",
      o: ["Legibilidad: pasos con nombre que se leen de arriba abajo y se pueden reutilizar","Siempre más rendimiento","Que el motor la cachea entre ejecuciones"], a: 0,
      w: "Ojo: en algunos motores el CTE actúa como barrera de optimización, así que legibilidad y plan no siempre van juntos." },
  ],

  "sql-window-functions": [
    { q: "Quieres el salario de cada empleado y, al lado, la media de su departamento, sin perder filas.",
      o: ["GROUP BY departamento","`AVG(salario) OVER (PARTITION BY departamento)`","Un self-join de la tabla consigo misma"], a: 1,
      w: "Ahí está la diferencia: GROUP BY colapsa las filas, la window function conserva el detalle y añade el agregado al lado." },
    { q: "Necesitas los 3 mejores de cada categoría. ¿Dónde va el filtro `rn <= 3`?",
      o: ["En el WHERE de la misma consulta","En un HAVING","Fuera, envolviendo en subconsulta o CTE: la window function se calcula después del WHERE"], a: 2,
      w: "Es el orden de evaluación de SQL: cuando el WHERE actúa, el número de fila todavía no existe." },
  ],

};
