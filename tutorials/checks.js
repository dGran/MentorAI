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

};
