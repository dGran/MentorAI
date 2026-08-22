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

  /* ================= Curso: Protocolos y tiempo real ================= */

  "pr-http1-a-http3": [
    { q: "¿Qué persiguen las tres versiones de HTTP?",
      o: ["Empujar el bloqueo por cabeza de línea una capa más abajo", "Reducir el tamaño de las cabeceras", "Mejorar el cifrado"], a: 0,
      w: "De la capa de aplicación en HTTP/1.1, a la de transporte en HTTP/2, y fuera de TCP con QUIC en HTTP/3." },
    { q: "Con HTTP/2, ¿qué pasa con un bundle único gigante de JavaScript?",
      o: ["Sigue siendo lo óptimo", "Conviene partirlo: mejor caché y descargas en paralelo", "Hay que meterlo en base64"], a: 1,
      w: "Un fichero enorme invalida la caché entera por un cambio de una línea, y ya no hay límite de conexiones que justifique concatenarlo todo." },
  ],

  "pr-tls-handshake": [
    { q: "¿Qué garantía da el intercambio de claves efímero?",
      o: ["Que el handshake es más rápido", "Que no hace falta certificado", "Forward secrecy: robar la clave privada mañana no descifra el tráfico grabado ayer"], a: 2,
      w: "Cada sesión deriva su propia clave, y esa clave no se puede reconstruir a partir de la privada del servidor." },
    { q: "¿Qué pierdes al poner `verify_peer => false`?",
      o: ["La autenticación: cualquiera en medio puede presentar su certificado y leerlo todo", "Nada, sigue cifrado", "El rendimiento"], a: 0,
      w: "Conservas el beneficio menor y tiras el importante. Si el problema es un certificado interno, se añade tu autoridad al almacén de confianza." },
  ],

  "pr-cabeceras-que-importan": [
    { q: "¿Cuándo dispara el navegador un preflight?",
      o: ["Siempre que hay CORS", "Cuando la petición lleva JSON o cabeceras propias", "Solo en peticiones DELETE"], a: 1,
      w: "Un GET o un POST de formulario van directos. El preflight añade una ida y vuelta que se puede cachear con `Access-Control-Max-Age`." },
    { q: "¿Qué cabecera de seguridad ya no hace falta poner?",
      o: ["`Content-Security-Policy`", "`X-Content-Type-Options`", "`X-XSS-Protection`"], a: 2,
      w: "Está obsoleta y algunos navegadores la ignoran o la consideran contraproducente. Copiar listas de artículos viejos añade ruido sin aportar nada." },
  ],

  "pr-serializacion": [
    { q: "¿Cómo debe viajar un importe en JSON?",
      o: ["Como entero de céntimos o como cadena", "Como número decimal", "Como float con dos decimales"], a: 0,
      w: "JSON no tiene tipo decimal, así que un importe en coma flotante puede volver con un céntimo de menos tras cruzar dos lenguajes." },
    { q: "¿Por qué el esquema importa más en colas que en HTTP?",
      o: ["Porque las colas son más rápidas", "Porque los mensajes persisten y los releerán consumidores que hoy no existen", "Porque HTTP ya valida los tipos"], a: 1,
      w: "Un evento publicado hoy puede releerse dentro de seis meses, y para entonces el esquema habrá cambiado. Por eso existen los registros de esquemas." },
  ],

  "pr-grpc": [
    { q: "¿Por qué el streaming viene de serie en gRPC?",
      o: ["Porque usa WebSockets por debajo", "Porque Protobuf lo incluye", "Porque HTTP/2 multiplexa: es otra firma en el mismo fichero .proto"], a: 2,
      w: "En REST, mantener un flujo abierto exige montar SSE o WebSockets aparte. Aquí es un modo más de llamada." },
    { q: "¿Se puede llamar a gRPC desde un navegador?",
      o: ["Solo con gRPC-Web y un proxy que traduzca, perdiendo modos de streaming", "Sí, directamente", "Solo con HTTP/3"], a: 0,
      w: "Los navegadores no exponen el control de HTTP/2 que gRPC necesita. Si tu consumidor principal es una web, gRPC te complica la vida." },
  ],

  "pr-compatibilidad": [
    { q: "¿Qué compatibilidad necesitas al desplegar el servidor?",
      o: ["Hacia adelante", "Hacia atrás: que un cliente viejo funcione con el servidor nuevo", "Las dos siempre"], a: 1,
      w: "Hacia adelante la necesitas si el cliente se actualiza antes que el servidor, o durante un rolling update donde conviven las dos versiones." },
    { q: "¿Con qué se abre una versión nueva de una API?",
      o: ["Con su documentación", "Con un anuncio a los clientes", "Con la fecha de retirada de la anterior ya decidida"], a: 2,
      w: "Sin esa fecha, la v1 seguirá viva dentro de cinco años porque siempre habrá un cliente que no migró. Cada versión viva es mantenimiento duplicado." },
  ],

  "pr-polling": [
    { q: "¿Cuál es la latencia media del polling?",
      o: ["La mitad del intervalo", "El intervalo completo", "Cero"], a: 0,
      w: "Con un intervalo de 10 segundos, de media el usuario espera 5. Suficiente para la mayoría de lo que se pide «en tiempo real» en una aplicación de negocio." },
    { q: "¿Qué ventaja operativa tiene el polling que se olvida?",
      o: ["Es más rápido", "Sin estado: cualquier servidor atiende, y si el cliente se va no hay nada que limpiar", "Consume menos ancho de banda"], a: 1,
      w: "No hay conexiones que drenar al desplegar, ni presencia que caducar, ni fan-out que montar. Es la razón principal de que aguante tanto." },
  ],

  "pr-sse": [
    { q: "¿Cuáles son las dos limitaciones reales de SSE?",
      o: ["No funciona en móviles y no se puede cifrar", "No reconecta y no soporta autenticación", "Es unidireccional y solo transporta texto"], a: 2,
      w: "Lo de unidireccional casi nunca molesta —enviar es puntual y recibir continuo—. Para binario habría que codificar en base64, con un 33 % de sobrecoste." },
    { q: "En PHP, ¿por qué se cierra el flujo SSE a propósito cada minuto?",
      o: ["Para convertir el worker ocupado en un ciclo controlado, aprovechando la reconexión automática", "Porque el navegador lo exige", "Para renovar la autenticación"], a: 0,
      w: "Aun así, para cientos de conexiones simultáneas la salida real es sacar el endpoint de FPM: un runtime asíncrono o un componente aparte." },
  ],

  "pr-websockets": [
    { q: "¿Qué es una conexión zombi?",
      o: ["Una conexión sin autenticar", "Una que parece abierta desde el servidor cuando el cliente ya no está", "Una que consume demasiada memoria"], a: 1,
      w: "Un móvil que entra en un túnel no manda ningún aviso. Crees que el usuario está conectado y le mandas mensajes que se pierden. Hace falta un ping con plazo de respuesta." },
    { q: "La autorización de un WebSocket se comprueba en el saludo. ¿Qué problema tiene?",
      o: ["Que es lenta", "Que no soporta OAuth", "Que la conexión dura horas: si revocan permisos o expira el token, sigue recibiendo"], a: 2,
      w: "Hace falta revalidar periódicamente o cerrar la conexión cuando cambian los permisos del usuario." },
  ],

  "pr-elegir-transporte": [
    { q: "¿Qué criterio decide en la práctica y casi nunca se discute?",
      o: ["Quién va a operar la flota con estado", "La latencia teórica de cada protocolo", "La elegancia de la solución"], a: 0,
      w: "Conexiones persistentes necesitan monitorización propia, despliegues que drenen y alguien que entienda por qué un servidor tiene el triple de conexiones. Sin eso, la decisión ya está tomada." },
    { q: "¿Es deuda técnica empezar por polling?",
      o: ["Sí, siempre hay que hacerlo bien desde el principio", "No, si el transporte está detrás de una interfaz: es aplazar la decisión hasta tener datos", "Sí, porque migrar después es imposible"], a: 1,
      w: "Encapsular «suscribirse a cambios de X» permite cambiar el transporte de debajo sin tocar el resto de la aplicación." },
  ],

  "pr-escalar-tiempo-real": [
    { q: "¿Por dónde se empieza para mandar un mensaje a un usuario conectado a otro servidor?",
      o: ["Montando un directorio desde el principio", "Particionando por usuario", "Difundiendo a todos los servidores por pub/sub"], a: 2,
      w: "Con diez servidores, mandar cada mensaje a los diez cuesta poco y te ahorra mantener un directorio que puede desincronizarse. El directorio llega cuando la difusión sea medible." },
    { q: "¿Qué pasa en cada despliegue con conexiones persistentes?",
      o: ["Se cierran todas y los clientes reconectan a la vez, pudiendo tumbar lo que acaba de arrancar", "Se mantienen abiertas", "Solo se cierran las inactivas"], a: 0,
      w: "Se maneja drenando, avisando al cliente antes de cerrar y sobre todo con jitter en el cliente, que es lo que reparte la avalancha." },
  ],

  "pr-webhooks": [
    { q: "¿Cómo se descartan los eventos duplicados?",
      o: ["Comparando el contenido con el último recibido", "Con un índice único sobre el identificador del evento, devolviendo 200 al chocar", "Rechazándolos con un 409"], a: 1,
      w: "Se devuelve 200 porque para el emisor el evento está entregado; devolver error provocaría más reintentos del mismo duplicado." },
    { q: "¿Por qué guardar el evento en crudo?",
      o: ["Por requisitos legales", "Para ahorrar consultas", "Para reprocesar tras arreglar un bug y para ganar discusiones de «yo te lo mandé»"], a: 2,
      w: "Con su firma y sus cabeceras, para poder reverificar. Ojo con la retención si lleva datos personales y con que la tabla crezca sin límite." },
  ],

  "pr-firmas-y-replay": [
    { q: "¿Dónde debe ir la marca de tiempo respecto a la firma?",
      o: ["Dentro de lo que se firma", "En una cabecera aparte", "No hace falta marca de tiempo"], a: 0,
      w: "Si va aparte, un atacante la cambia y reutiliza la misma firma. Firmada, cualquier manipulación invalida la comprobación." },
    { q: "¿Cómo se rota un secreto compartido sin cortar?",
      o: ["Avisando con un mes de antelación", "Aceptando el secreto nuevo y el anterior durante la transición", "Cambiándolo de madrugada"], a: 1,
      w: "El receptor prueba con el actual y, si falla, con el anterior. Por eso los proveedores serios mandan varias firmas en la misma cabecera." },
  ],

  "pr-streaming-http": [
    { q: "¿Qué problema resuelve NDJSON que un JSON grande no?",
      o: ["Ocupa menos", "Es más rápido de generar", "Se puede consumir línea a línea con memoria constante, sin esperar al cierre del array"], a: 2,
      w: "Y si la conexión se corta a la mitad, todo lo recibido hasta la última línea completa sigue siendo válido." },
    { q: "El streaming funciona en local y en producción llega todo de golpe al final. ¿Por qué?",
      o: ["Alguna pieza del camino acumula: el buffer de PHP, `fastcgi_buffering` o la CDN", "El navegador lo acumula", "Falta `Content-Length`"], a: 0,
      w: "Basta con que una sola pieza acumule para que el streaming desaparezca, y no da ningún error: solo deja de comportarse como esperabas." },
  ],

  "pr-cuando-no-tiempo-real": [
    { q: "Detrás de «que se vea al momento», ¿qué suele haber?",
      o: ["Un requisito de latencia medido", "No tener que recargar la página a mano", "Un problema de rendimiento"], a: 1,
      w: "Refrescar cada diez segundos resuelve esa petición entera, sin flota con estado, sin fan-out y sin presencia que mantener." },
    { q: "¿Cuándo el tiempo real no se discute?",
      o: ["Cuando lo pide el cliente", "Cuando hay muchos usuarios", "Cuando la interacción entre personas ocurre dentro del sistema y en el momento"], a: 2,
      w: "Chat, edición colaborativa, juegos, subastas. Si lo que muestras es el avance de un proceso, casi siempre estás en el otro grupo." },
  ],

  /* ================= Curso: Infraestructura ================= */

  "inf-servidor-por-dentro": [
    { q: "Un servicio desaparece sin dejar ninguna excepción en sus logs. ¿Dónde miras?",
      o: ["En el log del núcleo, buscando al OOM killer", "En el log de nginx", "En el journal del servicio"], a: 0,
      w: "Cuando no queda memoria, el núcleo mata un proceso sin avisar a la aplicación. `dmesg -T | grep -i oom` lo confirma." },
    { q: "Dentro de un contenedor con 512 MB de límite, ¿qué dice `free`?",
      o: ["512 MB", "La memoria del anfitrión entero", "Cero"], a: 1,
      w: "El contenedor comparte núcleo, así que las herramientas ven la máquina completa. La cuota real está en los ficheros de cgroup." },
  ],

  "inf-systemd": [
    { q: "Editas una unidad y el cambio no surte efecto. ¿Qué falta?",
      o: ["Reiniciar la máquina", "Volver a hacer `enable`", "`systemctl daemon-reload`"], a: 2,
      w: "Sin recargar, systemd sigue usando la versión anterior del fichero en memoria y te vuelves loco viendo que tu cambio no hace nada." },
    { q: "¿Por qué se pone `--time-limit` a un worker de PHP?",
      o: ["Porque los procesos de larga vida acumulan memoria: se recicla y systemd lo relanza", "Para que no procese mensajes muy largos", "Para limitar el número de mensajes"], a: 0,
      w: "Es reciclaje preventivo, no una limitación: el proceso sale limpiamente y arranca otro fresco sin que nadie note nada." },
  ],

  "inf-hardening": [
    { q: "¿Qué haces antes de recargar SSH tras endurecer su configuración?",
      o: ["Reiniciar la máquina", "Dejar una segunda sesión abierta y verificar el acceso desde otra terminal", "Hacer una copia del fichero"], a: 1,
      w: "Es el error que todo el mundo comete una vez: aplicar, cerrar la terminal y descubrir que tu clave no estaba donde creías." },
    { q: "¿Qué aporta cambiar el puerto de SSH del 22 a otro?",
      o: ["Impide los ataques de fuerza bruta", "Cifra mejor la conexión", "Reduce el ruido en los logs, no el riesgo"], a: 2,
      w: "Un escaneo de puertos lo encuentra igual. Es cosmética útil; lo que sí aporta es limitar por IP de origen o entrar por VPN." },
  ],

  "inf-nginx": [
    { q: "¿A qué debe apuntar el `root` de nginx en un proyecto PHP moderno?",
      o: ["Al directorio `public/`", "A la raíz del proyecto", "Al directorio del framework"], a: 0,
      w: "Si apunta a la raíz, cualquiera puede pedir `/.env` o los ficheros de configuración por HTTP: todo el repositorio es público." },
    { q: "¿Por qué limitar la tasa en nginx y no solo en la aplicación?",
      o: ["Porque nginx es más preciso", "Porque rechazar ahí cuesta microsegundos, y en PHP cuesta un worker, una conexión y el arranque del framework", "Porque la aplicación no puede hacerlo"], a: 1,
      w: "Son defensas complementarias: la de la aplicación sabe de usuarios, la de nginx aguanta cuando llegan diez mil peticiones por segundo." },
  ],

  "inf-tls": [
    { q: "¿Qué prueba exactamente un certificado TLS válido?",
      o: ["Que el sitio es de fiar", "Que la empresa está registrada", "Que quien lo presenta controla ese nombre de dominio"], a: 2,
      w: "Un sitio fraudulento puede tener un certificado válido perfectamente. Lo que no puede es presentar el de otro dominio." },
    { q: "¿Qué riesgo tiene poner HSTS con `max-age` de un año desde el primer día?",
      o: ["Que si tienes un problema con el certificado no puedes volver a HTTP mientras lo arreglas", "Ninguno: es lo recomendado", "Que ralentiza la primera visita"], a: 0,
      w: "Esa instrucción vive en el navegador del usuario y no se puede retirar rápido. Se empieza con un valor pequeño y se sube cuando estás seguro." },
  ],

  "inf-dns": [
    { q: "¿Por qué no se puede poner un CNAME en la raíz del dominio?",
      o: ["Porque los navegadores no lo soportan", "Porque la raíz necesita registros NS y SOA, y un CNAME no admite convivir con nadie", "Porque el TTL sería demasiado alto"], a: 1,
      w: "Los proveedores lo resuelven con ALIAS o ANAME, que son extensiones propias: si cambias de proveedor, eso hay que rehacerlo." },
    { q: "¿Cómo compruebas si tu cambio de DNS se guardó de verdad?",
      o: ["Esperando 48 horas", "Vaciando la caché del navegador", "Preguntando al servidor autoritativo con `dig @ns1...`"], a: 2,
      w: "Saltarse las cachés intermedias es la única forma de distinguir «no se guardó» de «se guardó y aún no ha caducado la respuesta vieja»." },
  ],

  "inf-balanceo": [
    { q: "¿Qué decide el endpoint «vivo» frente al endpoint «listo»?",
      o: ["«Vivo» decide si reiniciar el proceso; «listo» decide si mandarle tráfico", "«Vivo» es para el balanceador y «listo» para el monitoreo", "Son equivalentes"], a: 0,
      w: "La comprobación cara —base de datos, dependencias— va en «listo», para que una caída de la base de datos saque servidores del balanceo sin reiniciarlos en bucle." },
    { q: "¿Por qué la sesión pegajosa es una solución temporal?",
      o: ["Porque es lenta", "Porque desequilibra el reparto y quitar un servidor tira las sesiones de todos sus usuarios", "Porque no funciona con HTTPS"], a: 1,
      w: "El arreglo de verdad es sacar el estado del servidor: sesiones en Redis, ficheros en almacenamiento de objetos. Entonces todo lo demás se vuelve trivial." },
  ],

  "inf-vm-contenedor-funcion": [
    { q: "¿Qué debe hacer un worker al recibir SIGTERM?",
      o: ["Salir inmediatamente", "Ignorarlo", "Marcar una bandera, terminar el mensaje en curso y salir por su propio pie"], a: 2,
      w: "Salir dentro del manejador de la señal es justo el fallo que intentas evitar: dejas el trabajo a medias que querías proteger." },
    { q: "¿Qué disciplina hace barato cambiar entre máquina, contenedor y función?",
      o: ["Config por variables, logs a stdout, sin estado local y parada limpia", "Usar el mismo lenguaje en todas", "Tener tests unitarios"], a: 0,
      w: "No seguirla te ata a la opción que elegiste primero, aunque técnicamente pudieras moverte." },
  ],

  "inf-orquestacion": [
    { q: "¿Qué significa que un orquestador sea declarativo?",
      o: ["Que la configuración va en YAML", "Que declaras el estado deseado y él trabaja continuamente para que la realidad se le parezca", "Que hay que declarar los recursos antes de usarlos"], a: 1,
      w: "Esa diferencia es la que hace que la infraestructura se recupere sola en vez de esperar a que alguien ejecute algo." },
    { q: "¿Qué te quita un clúster gestionado por el proveedor?",
      o: ["Todo el coste operativo", "Solo el coste de las máquinas", "La parte más difícil —el plano de control—, dejándote la red, los recursos y la depuración"], a: 2,
      w: "Es la diferencia entre un coste alto y uno medio, no entre alto y cero." },
  ],

  "inf-despliegues-sin-caida": [
    { q: "¿Cuál es la ventaja real de un despliegue canario?",
      o: ["Que un fallo que solo aparece con tráfico real lo sufre el 1 % y tú lo ves antes de seguir", "Que es más rápido", "Que no necesita health checks"], a: 0,
      w: "Y exige métricas separadas por versión: sin eso, un canario es un despliegue lento y nada más." },
    { q: "¿Qué hace un interruptor de funcionalidad por tus reversiones?",
      o: ["Las acelera un 50 %", "Las convierte en un cambio de configuración, sin desplegar", "Permite revertir migraciones"], a: 1,
      w: "Separar desplegar de activar es lo que hace que revertir sea aburrido, que es exactamente lo que quieres que sea." },
  ],

  "inf-configuracion-y-secretos": [
    { q: "¿Cómo distingues configuración de código?",
      o: ["Por el formato del fichero", "Si está en el repositorio es código", "Si cambia entre entornos es configuración; si es igual en todos es código"], a: 2,
      w: "Las rutas y el cableado del contenedor son código aunque estén en un YAML. Y un valor que no has cambiado en dos años es una constante, no flexibilidad." },
    { q: "¿Están cifrados los Secrets de Kubernetes por defecto?",
      o: ["No: van en base64, que es codificación y no cifrado", "Sí, con AES", "Solo los de tipo TLS"], a: 0,
      w: "Cualquiera con permiso de lectura sobre ese objeto los ve en claro. Hay que activar el cifrado en reposo del almacén o integrar un gestor externo." },
  ],

  "inf-iac": [
    { q: "¿Qué capa cubre Terraform y cuál Ansible?",
      o: ["Son intercambiables", "Terraform los recursos del proveedor; Ansible lo de dentro de la máquina", "Terraform la aplicación; Ansible la red"], a: 1,
      w: "Se comparan como si compitieran y en realidad se complementan: uno crea la máquina y el otro la configura." },
    { q: "¿Qué te dice `terraform plan` que hay que leer entero?",
      o: ["El tiempo estimado", "El coste mensual", "Qué va a crear, cambiar y sobre todo destruir"], a: 2,
      w: "Un cambio aparentemente inocente como renombrar un recurso puede traducirse en «destruir la base de datos y crear otra»." },
  ],

  "inf-backups": [
    { q: "¿Qué mide el RTO?",
      o: ["Cuánto puedes estar caído, contando localizar, descargar, importar y verificar", "Cuántos datos puedes perder", "Cada cuánto se hace la copia"], a: 0,
      w: "Si nunca has cronometrado una restauración completa, tu RTO es un número inventado." },
    { q: "¿Qué protege el «1» de la regla 3-2-1?",
      o: ["De que la copia esté corrupta", "De que el desastre se lleve la instalación entera: incendio, borrado de cuenta, ransomware", "De un fallo del tipo de almacenamiento"], a: 1,
      w: "Por eso las copias deben ser inmutables o estar en una cuenta separada: si las credenciales del servidor pueden borrarlas, no tienes copias." },
  ],

  "inf-capacidad": [
    { q: "¿Qué pasa con el rendimiento total pasado el punto de saturación?",
      o: ["Se mantiene y solo sube la latencia", "Sube más despacio", "Baja: los recursos se van en gestionar la contención"], a: 2,
      w: "Cambios de contexto, competencia por bloqueos y reintentos de clientes impacientes: el sistema atiende menos peticiones por segundo que cuando estaba al 80 %." },
    { q: "¿Qué mide golpear diez mil veces el mismo endpoint con el mismo parámetro?",
      o: ["Tu caché", "La capacidad real del sistema", "La latencia de red"], a: 0,
      w: "Una prueba útil recorre un escenario con datos variados: entrar, buscar, ver fichas distintas, añadir al carrito." },
  ],

  "inf-guardias-y-postmortem": [
    { q: "¿Cuál es la prueba de que un runbook sirve?",
      o: ["Que esté actualizado", "Que alguien que no lo escribió lo siga entero sin preguntar", "Que lo haya revisado el equipo"], a: 1,
      w: "Se escriben en frío y dan por hechas cosas que no lo son: rutas que cambiaron, permisos que no tienes, comandos que ya no existen." },
    { q: "Durante un incidente, ¿qué va primero?",
      o: ["Encontrar la causa raíz", "Escribir el post mortem", "Mitigar y restaurar el servicio"], a: 2,
      w: "Si revertir el despliegue devuelve el servicio, se revierte y luego se investiga con calma. La tentación de entender primero cuesta minutos de caída." },
  ],

  /* ================= Curso: Caché y rendimiento ================= */

  "cr-medir-primero": [
    { q: "Si una página hace 20 peticiones internas, ¿qué probabilidad hay de que alguna caiga en el p99?",
      o: ["Alrededor del 18 %, casi una de cada cinco cargas", "Casi ninguna: es 1 de cada 100", "Exactamente un 1 %"], a: 0,
      w: "0,99²⁰ ≈ 82 % de que ninguna lo toque. La cola de la distribución no es un caso raro: es la experiencia habitual de tus usuarios más activos." },
    { q: "Tus métricas internas dicen 40 ms y los usuarios se quejan. ¿Dónde miras?",
      o: ["En la base de datos", "Delante: el tiempo en cola esperando un worker es invisible desde tu código", "En el navegador del usuario"], a: 1,
      w: "Cuando el pool de FPM se agota, las peticiones esperan turno antes de que tu código empiece. Tu métrica interna sigue diciendo la verdad mientras el usuario espera un segundo." },
  ],

  "cr-perfilado": [
    { q: "¿Qué columna del perfil te dice qué arreglar?",
      o: ["El tiempo total (inclusive)", "El número de llamadas", "El tiempo propio (self)"], a: 2,
      w: "El total sirve para navegar el árbol hacia abajo; el propio identifica al culpable. Tu controlador siempre tendrá el 100 % del total y casi nada de propio." },
    { q: "¿Cuál de los cuatro hallazgos típicos es el más rentable?",
      o: ["El trabajo que no hacía falta hacer en esa petición", "La función con más tiempo propio", "La consulta más lenta"], a: 0,
      w: "Es el que menos se busca: no optimizar algo, sino descubrir que se ejecutaba y se descartaba, o que no hacía falta en ese caso." },
  ],

  "cr-presupuesto": [
    { q: "¿Qué le falta a «la búsqueda responde en 300 ms»?",
      o: ["El número de usuarios concurrentes", "El percentil sobre el que se mide", "El servidor donde se mide"], a: 1,
      w: "Sin percentil no se puede verificar, no se puede alertar y cada persona entiende una cosa distinta. La versión útil es «el p95 está por debajo de 300 ms»." },
    { q: "El presupuesto no cuadra. ¿Cuál es la primera pregunta?",
      o: ["¿Compramos más máquinas?", "¿Podemos subir el objetivo?", "¿Por qué está en serie?"], a: 2,
      w: "Tres llamadas independientes de 200 ms cuestan 600 ms encadenadas y 200 ms lanzadas a la vez. En paralelo el coste pasa de la suma al máximo." },
  ],

  "cr-consultas-lentas": [
    { q: "¿Qué indicador de un EXPLAIN dice más que ninguna columna suelta?",
      o: ["La relación entre filas examinadas y filas devueltas", "El valor de la columna `type`", "El nombre del índice elegido"], a: 0,
      w: "Recorrer 400.000 para devolver 20 significa que el índice no hace su trabajo, aunque el motor diga que usa uno." },
    { q: "¿Por qué hay que probar con los parámetros reales del log?",
      o: ["Porque los parámetros de ejemplo no compilan", "Porque el plan cambia según cuántas filas crea el optimizador que va a tocar", "Porque el log los guarda cifrados"], a: 1,
      w: "La misma consulta con un estado que cubre el 90 % de la tabla y con otro que cubre el 0,3 % puede tener planes distintos. Probar con el valor raro es cómo se despliega una consulta que arrasa." },
  ],

  "cr-indices-en-practica": [
    { q: "¿Dónde va la columna del rango en un índice compuesto?",
      o: ["La primera, porque filtra más", "Da igual el orden", "Al final, porque corta el índice para lo que venga detrás"], a: 2,
      w: "Las columnas que van después de una comparación por rango ya no se pueden usar para filtrar. El orden es: igualdades, luego el ORDER BY, y el rango al final." },
    { q: "Un índice sin uso según `count_star = 0`. ¿Lo borras?",
      o: ["Solo tras comprobar el uptime y que ha pasado un ciclo completo de negocio", "Sí, inmediatamente", "Nunca se borran índices"], a: 0,
      w: "Los contadores se reinician con el servidor. Un cero en una instancia que arrancó anteayer puede ser el índice del informe mensual." },
  ],

  "cr-paginacion": [
    { q: "Además de lenta, ¿qué otro problema tiene la paginación por OFFSET?",
      o: ["Que no funciona con ORDER BY", "Que salta y repite filas cuando hay escrituras concurrentes", "Que consume más memoria en el cliente"], a: 1,
      w: "En un listado da igual. En un proceso que recorre todo para exportar, has duplicado un registro y saltado otro sin que nadie se entere." },
    { q: "¿Qué se hace con el «mostrando 20 de 1.482.303»?",
      o: ["Cachearlo con un TTL largo", "Contarlo en cada petición: es barato", "Pedir 21 filas para saber si hay siguiente, y no contar"], a: 2,
      w: "Casi ningún usuario necesita saber que hay 1.482.303 resultados: necesita saber si hay más. Ese COUNT suele costar más que la consulta de datos." },
  ],

  "cr-conexiones-y-pool": [
    { q: "¿Qué pasa si subes `max_connections` ante un error de «demasiadas conexiones»?",
      o: ["Tratas el síntoma: pasado el punto de saturación, más conexiones bajan el rendimiento", "Se resuelve el problema de raíz", "Mejora la latencia de las consultas"], a: 0,
      w: "Más conexiones son más cambios de contexto, más competencia por los bloqueos y más memoria reservada. El rendimiento sube hasta un punto y baja después." },
    { q: "¿Qué regla evita ocupar una conexión de más?",
      o: ["Cerrar la conexión tras cada consulta", "Ninguna llamada de red dentro de una transacción", "Usar siempre conexiones persistentes"], a: 1,
      w: "Una transacción abierta mientras esperas a la pasarela de pagos mantiene bloqueos y ocupa una conexión durante todo lo que tarde el tercero." },
  ],

  "cr-capas-de-cache": [
    { q: "¿Qué regla ordena las cinco capas de caché?",
      o: ["Cuanto más lejos, más rápido", "Todas cuestan lo mismo", "Cuanto más cerca del usuario, más ahorras y menos control tienes"], a: 2,
      w: "Una respuesta cacheada en el navegador cuesta cero y no la puedes borrar; una en tu aplicación cuesta una petición completa y la invalidas cuando quieras." },
    { q: "¿Qué se descarta antes de decidir cachear?",
      o: ["No hacer el trabajo, y hacerlo rápido", "Nada: cachear siempre ayuda", "Comprar más memoria"], a: 0,
      w: "Una caché sobre una consulta mal indexada esconde el problema hasta que la caché falla, y entonces se cae todo a la vez." },
  ],

  "cr-patrones-de-cache": [
    { q: "¿Cuál es la forma limpia de añadir caché a un repositorio?",
      o: ["Meter los if de caché dentro del repositorio", "Un decorador que implementa la misma interfaz", "Una clase estática global"], a: 1,
      w: "Quien lo usa no sabe que hay caché, y quitarla es cambiar un cableado en el contenedor. Meterla dentro mezcla dos responsabilidades y hace imposible testear una sin la otra." },
    { q: "¿Qué riesgo tiene write-behind (escribir solo en caché y volcar después)?",
      o: ["Que es más lento al escribir", "Que no funciona con Redis", "Que una caída de la caché pierde escrituras ya confirmadas"], a: 2,
      w: "Solo tiene sentido para datos que puedes permitirte perder —contadores de visitas, telemetría—, nunca para nada que el usuario crea guardado." },
  ],

  "cr-invalidacion": [
    { q: "¿Cuál es la pregunta correcta al elegir un TTL?",
      o: ["¿Cuánto puedo servirlo viejo sin que pase nada malo?", "¿Cuánto tarda en cambiar el dato?", "¿Cuánta memoria tengo?"], a: 0,
      w: "Y esa respuesta la da el negocio, no la infraestructura. Un precio viejo unos minutos es tolerable si se valida al pagar; un stock viejo al vender, no." },
    { q: "¿Qué ventaja tiene una clave versionada frente a borrar entradas?",
      o: ["Ocupa menos memoria", "La invalidación es un INCR atómico e instantáneo, aunque afecte a diez mil entradas", "Evita tener que usar TTL"], a: 1,
      w: "No hay que recorrer ni borrar nada: las entradas viejas quedan huérfanas y caducan solas. El coste es una lectura extra para obtener la versión." },
  ],

  "cr-estampida": [
    { q: "¿Qué diferencia hay entre estampida y avalancha?",
      o: ["Son sinónimos", "La estampida solo pasa en Redis", "La estampida es sobre la misma clave; la avalancha es sobre muchas claves a la vez"], a: 2,
      w: "La estampida se arregla con bloqueo o expiración temprana; la avalancha, con TTL aleatorizado para que lo que se creó junto no caduque junto." },
    { q: "¿Qué consigue la expiración temprana probabilística?",
      o: ["Que nunca haya un instante sin valor servible en caché", "Reducir la memoria usada", "Que las claves caduquen antes y se ahorre espacio"], a: 0,
      w: "Conforme se acerca la caducidad, cada lector tiene más probabilidad de refrescar. Una sola petición paga el coste y la entrada se renueva antes de vaciarse." },
  ],

  "cr-http-cache": [
    { q: "¿Qué diferencia hay entre frescura y validación?",
      o: ["Son lo mismo con nombres distintos", "La frescura ahorra la petición entera; la validación solo ahorra el cuerpo", "La validación es más rápida siempre"], a: 1,
      w: "Con max-age el navegador no sale de la máquina. Con ETag hace la petición igual, pero recibe un 304 vacío: ahorras ancho de banda y serialización, no latencia." },
    { q: "Tu respuesta depende del idioma que manda el cliente en `Accept-Language`. ¿Qué falta?",
      o: ["Poner `no-store`", "Meter el idioma en el ETag", "Declarar `Vary: Accept-Language`"], a: 2,
      w: "Una caché indexa por URL. Si la respuesta depende de algo que no está en la URL y no lo declaras, servirá la versión equivocada a todo el mundo." },
  ],

  "cr-payload-y-serializacion": [
    { q: "¿Cuántas veces se paga un `SELECT *`?",
      o: ["Tres: leyendo columnas de más, moviéndolas y construyendo objetos con ellas", "Una: en la red", "Ninguna si hay índice de cobertura"], a: 0,
      w: "Y las columnas TEXT gordas que no usas se leen igual. Pedir las columnas concretas es de las optimizaciones que además dejan el código más claro." },
    { q: "¿Por qué el N+1 de red es más peligroso que el de base de datos?",
      o: ["Porque los ORM no lo soportan", "Porque cada salto son milisegundos y no hay contador de consultas que lo delate", "Porque consume más memoria"], a: 1,
      w: "Veinte llamadas HTTP de 200 ms en un bucle son cuatro segundos que ninguna herramienta te va a señalar automáticamente." },
  ],

  "cr-fuera-del-camino-critico": [
    { q: "¿Qué técnica para sacar trabajo de la petición se olvida más a menudo?",
      o: ["Encolar en un worker", "Precalcular al escribir", "Diferir al cliente con una segunda petición"], a: 2,
      w: "Si la página muestra el pedido y abajo unas recomendaciones lentas y prescindibles, no hace falta que retrasen la parte que importa: se pintan aparte." },
    { q: "¿Qué necesita un precálculo denormalizado para ser fiable?",
      o: ["Un proceso que recalcule desde cero y compare, aunque sea semanal", "Un TTL corto", "Una réplica de solo lectura"], a: 0,
      w: "Una caché desactualizada se arregla borrándola. Un contador desviado se queda mal para siempre, y nadie se entera hasta que un cliente dice que las cuentas no cuadran." },
  ],

  "cr-cuando-parar": [
    { q: "¿Qué optimizaciones hay que agotar antes de las que añaden complejidad?",
      o: ["Las que más porcentaje ganan sobre el papel", "Las que dejan el código igual o más claro: un índice, quitar un N+1, pedir las columnas que usas", "Las que se pueden hacer en un día"], a: 1,
      w: "Solo cuando esa lista está vacía tiene sentido pagar el coste permanente de una caché más que invalidar o un precálculo que se puede desviar." },
    { q: "¿Qué decía Knuth realmente sobre la optimización prematura?",
      o: ["Que nunca hay que pensar en rendimiento hasta que falle", "Que hay que optimizarlo todo desde el principio", "Que hay que olvidarse de las *pequeñas* eficiencias, sin dejar pasar el 3 % crítico"], a: 2,
      w: "Micro-optimizar sin medir es el mal. Elegir el modelo de datos, la clave de particionado o si una API pagina no es optimización prematura: es diseño que después cuesta una migración." },
  ],

  /* ================= Curso: Sistemas distribuidos ================= */

  "sd-falacias": [
    { q: "¿Por qué las ocho falacias se siguen cometiendo después de leerlas?",
      o: ["Porque son el estado por defecto de todo código que no se escribió explícitamente en su contra", "Porque están mal explicadas en la literatura", "Porque solo afectan a sistemas muy grandes"], a: 0,
      w: "No son errores conceptuales que se corrijan una vez: dentro de un proceso las ocho son ciertas, y el código que las asume sigue funcionando hasta que cruza la red." },
    { q: "En latencia de red, ¿qué pesa más?",
      o: ["El tamaño de cada mensaje", "El número de saltos", "El lenguaje de programación"], a: 1,
      w: "Un bucle con 200 llamadas de 2 ms tarda 400 ms aunque muevas cuatro bytes en cada una. Es el N+1 de siempre, pero sobre la red y sin profiler que te lo cante." },
  ],

  "sd-fallos-parciales": [
    { q: "Ante un timeout, ¿cuántos de los cuatro escenarios posibles dejan el trabajo hecho?",
      o: ["Ninguno", "Los cuatro", "Dos: si se procesó y murió al responder, o si la respuesta se perdió"], a: 2,
      w: "Y desde el cliente los cuatro son indistinguibles. Por eso tratar el timeout como un fallo es lo que produce cobros duplicados." },
    { q: "¿Dónde suele estar el error de diseño de fondo?",
      o: ["En el modelo de datos: un booleano `pagado` no tiene dónde guardar «no sé»", "En la configuración del cliente HTTP", "En la falta de logs"], a: 0,
      w: "Un enum con un estado incierto explícito sí lo tiene. Y ese estado necesita un proceso de conciliación que lo cierre, o solo es una forma elegante de perder dinero." },
  ],

  "sd-relojes-y-orden": [
    { q: "¿Qué reloj usas para medir cuánto tarda una operación?",
      o: ["El de pared: `time()`", "El monotónico: `hrtime(true)`", "Cualquiera, si sincronizas con NTP"], a: 1,
      w: "El monotónico nunca retrocede porque NTP no lo toca. El de pared puede saltar hacia atrás y darte duraciones negativas." },
    { q: "¿Qué garantiza un reloj de Lamport?",
      o: ["Que dos eventos con contadores distintos están causalmente relacionados", "Que todos los nodos tienen la misma hora", "Que si A causó B, el contador de A es menor que el de B"], a: 2,
      w: "La implicación no vale al revés: dos contadores distintos pueden ser eventos concurrentes sin relación. Para distinguirlo hacen falta relojes vectoriales." },
  ],

  "sd-sincrono-vs-asincrono": [
    { q: "¿Cuál es la pregunta que decide entre síncrono y asíncrono?",
      o: ["¿Necesitas la respuesta para poder seguir?", "¿Cuántos mensajes por segundo hay?", "¿Tienes un broker desplegado?"], a: 0,
      w: "Si el usuario espera el resultado para decidir, es síncrono. Si solo hace falta que alguien se entere de que pasó algo, es asíncrono. Casi todo lo demás son detalles." },
    { q: "¿Qué hace más daño, un servicio caído o uno lento?",
      o: ["Uno caído: no responde a nada", "Uno lento: consume tus workers fingiendo que todo va bien", "Los dos igual"], a: 1,
      w: "El caído falla rápido y tu código lo maneja. El lento agota el pool de workers esperando, y acabas sin responder ni a lo que no dependía de él." },
  ],

  "sd-garantias-de-entrega": [
    { q: "Si confirmas el mensaje antes de procesarlo, ¿qué garantía tienes?",
      o: ["At-least-once: puede repetirse", "Exactly-once", "At-most-once: si te caes en medio, se pierde"], a: 2,
      w: "Confirmar antes pierde; confirmar después duplica. Casi siempre quieres duplicar, porque un duplicado se puede detectar y un mensaje perdido no." },
    { q: "Entre «marca el pedido como enviado» y «suma uno al contador de envíos», ¿cuál aguanta duplicados?",
      o: ["La primera: es un efecto absoluto", "La segunda: es más rápida", "Las dos igual"], a: 0,
      w: "Fijar un valor se puede repetir cien veces con el mismo resultado; incrementar, no. Cuando puedas elegir cómo expresar el efecto, elige la forma absoluta." },
  ],

  "sd-outbox": [
    { q: "¿Arregla algo meter el `publicar` dentro de la transacción?",
      o: ["Sí: el rollback deshace la publicación", "No: si el publicar tiene éxito y el COMMIT falla después, el evento ya salió", "Sí, si el broker soporta XA"], a: 1,
      w: "Encima mantienes la transacción abierta durante una llamada de red, que es su propio problema. La transacción solo cubre la base de datos." },
    { q: "¿Qué garantiza el outbox?",
      o: ["Que cada evento se publica exactamente una vez", "Que los eventos llegan en orden a todos los consumidores", "Que ningún evento se pierde, pero puede repetirse"], a: 2,
      w: "Si el publicador muere entre publicar y marcar la fila, el evento sale dos veces. Por eso el outbox necesita al consumidor idempotente al otro lado: son dos piezas del mismo mecanismo." },
  ],

  "sd-colas-y-topicos": [
    { q: "¿Qué pasa con un mensaje después de leerlo?",
      o: ["En una cola desaparece al confirmarlo; en un registro de eventos sigue ahí", "En los dos desaparece", "En los dos sigue ahí hasta que caduque"], a: 0,
      w: "Esa es la diferencia de fondo entre RabbitMQ y Kafka, y de ella salen todas las demás: quién lleva la cuenta, si puedes rebobinar y cómo se decide el paralelismo." },
    { q: "En Kafka, ¿qué topa el paralelismo de un grupo de consumidores?",
      o: ["El número de brokers", "El número de particiones del topic", "La memoria del consumidor"], a: 1,
      w: "Con 6 particiones, el séptimo consumidor se queda parado. Y ampliar particiones después rompe el orden por clave, así que conviene empezar con margen." },
  ],

  "sd-replicacion": [
    { q: "¿Qué patrón de código destapa el replication lag?",
      o: ["Leer muchas veces seguidas el mismo dato", "Escribir dentro de una transacción larga", "Escribir y leer inmediatamente después"], a: 2,
      w: "La escritura va al líder y la lectura a una réplica que aún no la aplicó. El usuario ve el dato viejo justo después de guardarlo, recarga y ya sale bien: nadie reproduce el fallo." },
    { q: "¿Qué pierdes al promocionar un seguidor con replicación asíncrona?",
      o: ["Las escrituras que el líder confirmó y no llegó a propagar", "Nada: la promoción es transparente", "Todo el historial de la tabla"], a: 0,
      w: "Y si algún identificador de esos ya se lo diste a un sistema externo, ahora apunta a una fila que no existe. Por eso la semi-síncrona es el punto razonable para lo que no puedes perder." },
  ],

  "sd-particionado": [
    { q: "¿Qué problema resuelve particionar que replicar no resuelve?",
      o: ["La latencia de las lecturas", "El volumen de escritura y el tamaño de los datos", "La tolerancia a fallos"], a: 1,
      w: "Cada réplica sigue teniendo que aplicar todas las escrituras y almacenarlo todo. Cuando eso es lo que no cabe, replicar no ayuda." },
    { q: "¿Qué tiene de malo `crc32($clave) % $numeroDeParticiones`?",
      o: ["Que crc32 es criptográficamente débil", "Que no funciona con claves numéricas", "Que al añadir una máquina cambia el destino de casi todas las claves"], a: 2,
      w: "Pasar de 4 a 5 particiones obliga a mover casi todos los datos. El hashing consistente coloca claves y nodos en un anillo para que añadir un nodo solo mueva su fracción." },
  ],

  "sd-transacciones-distribuidas": [
    { q: "¿Qué significa que un participante vote «sí» en la primera fase?",
      o: ["Que se compromete irrevocablemente: tiene que poder confirmar aunque se reinicie", "Que puede cambiar de opinión al confirmar", "Que ya ha aplicado los cambios"], a: 0,
      w: "Ese compromiso es lo que hace correcto al protocolo, y también lo que lo bloquea: tras votar sí, el participante no puede decidir por su cuenta si el coordinador desaparece." },
    { q: "¿Por qué 2PC no sirve con una pasarela de pagos?",
      o: ["Porque son demasiado lentas", "Porque exige soporte XA en todos los participantes, y una API HTTP no lo tiene", "Porque cobran por operación"], a: 1,
      w: "Puedes hacer 2PC entre dos MySQL, pero no entre tu base de datos y Stripe. Y la mayoría de operaciones que te preocupan cruzan justo esa frontera." },
  ],

  "sd-sagas": [
    { q: "¿Cuándo pasa de coreografía a orquestación?",
      o: ["En cuanto hay más de dos servicios", "Nunca: la coreografía siempre escala mejor", "Cuando hay cinco o seis pasos con ramas y nadie sabe ya cuál es el flujo completo"], a: 2,
      w: "Para tres pasos la coreografía va bien. El problema aparece cuando el flujo no está escrito en ningún sitio y hay que reconstruirlo leyendo suscripciones de seis repositorios." },
    { q: "¿Qué distingue una saga de un método largo con try/catch?",
      o: ["Que la saga persiste su estado tras cada paso y se puede retomar", "Que la saga usa excepciones tipadas", "Que la saga corre en segundo plano"], a: 0,
      w: "Si el proceso muere entre el paso 2 y el 3, el estado guardado dice exactamente dónde estaba y un proceso de recuperación la retoma. Sin eso, se pierde." },
    { q: "¿Qué pierdes con una saga que sí tenías con una transacción?",
      o: ["La durabilidad", "El aislamiento: los estados intermedios son visibles para otras operaciones", "La atomicidad de cada paso individual"], a: 1,
      w: "Otra operación concurrente puede ver que el stock está reservado y el pago hecho mientras el pedido «no existe» todavía. Se mitiga con estados explícitos que digan al resto que ahí no se toca." },
  ],

  "sd-timeouts-y-reintentos": [
    { q: "¿Cuál de estos NO se debe reintentar?",
      o: ["Un 503", "Un timeout de conexión", "Un 422"], a: 2,
      w: "Un error de cliente es determinista: la petición está mal formada y lo estará en el segundo intento. Reintentarlo multiplica la carga sin ninguna posibilidad de éxito." },
    { q: "Cuatro capas reintentando 3 veces cada una, ¿cuántas peticiones llegan al fondo por cada una del usuario?",
      o: ["27", "12", "3"], a: 0,
      w: "3×3×3 contra un sistema que ya estaba saturado. La regla es reintentar en una sola capa, la más cercana al fallo, y que las de arriba propaguen el error." },
  ],

  "sd-circuit-breaker": [
    { q: "¿Para qué sirve el estado medio abierto?",
      o: ["Para registrar métricas sin afectar al tráfico", "Para probar con unas pocas peticiones antes de soltar toda la carga sobre un servicio que apenas se levanta", "Para permitir solo las peticiones críticas"], a: 1,
      w: "Sin él tendrías que elegir entre quedarte abierto para siempre o volver de golpe al 100 % y tumbar otra vez lo que estaba recuperándose." },
    { q: "¿Deben contar los 404 y los 422 para abrir el circuito?",
      o: ["Sí: cualquier error indica un problema", "Sí, pero con menos peso", "No: un cliente mandando peticiones mal formadas abriría el circuito para todos"], a: 2,
      w: "Los errores de cliente no dicen nada sobre la salud del servicio. Contarlos convierte el error de un usuario en una caída general." },
  ],

  "sd-dlq-y-reproceso": [
    { q: "¿Qué distingue un fallo transitorio de uno permanente?",
      o: ["Que el transitorio volverá a funcionar solo y el permanente fallará igual dentro de una hora", "El código HTTP", "Cuántas veces ha fallado ya"], a: 0,
      w: "Un JSON que no se puede deserializar no mejora con el tiempo: va a la cola de muertos en el primer intento, sin gastar cinco reintentos para nada." },
    { q: "¿Qué hay que vigilar en una cola de muertos?",
      o: ["El tamaño en disco", "Una alerta cuando pasa de cero mensajes", "El ratio respecto al total procesado"], a: 1,
      w: "No es un vertedero, es una bandeja de entrada. Si un mensaje llega ahí, hay trabajo de negocio sin hacer, y una gráfica que nadie mira no sirve de nada." },
  ],

  "sd-backpressure": [
    { q: "¿Qué pasa con la contrapresión al pasar de síncrono a asíncrono?",
      o: ["Mejora: la cola absorbe todo", "No cambia", "Desaparece: el emisor publica y se olvida, y hay que reconstruirla"], a: 2,
      w: "En síncrono es automática: si tardas en responder, el cliente espera y no manda más. En asíncrono nada frena al emisor, así que las colas acotadas y los límites hay que ponerlos a mano." },
    { q: "Bajo sobrecarga, ¿qué es mejor?",
      o: ["Rechazar rápido con un 429 y `Retry-After`", "Aceptar todo y procesarlo cuando se pueda", "Escalar automáticamente sin límite"], a: 0,
      w: "Aceptar, encolar, procesar treinta segundos después y devolver un timeout te cuesta todos los recursos del camino para acabar en el mismo sitio, con el sistema entero degradado." },
  ],

  "sd-consenso": [
    { q: "¿Por qué el quórum impide que haya dos líderes?",
      o: ["Porque el líder viejo se apaga automáticamente", "Porque dos mayorías del mismo conjunto siempre comparten al menos un nodo", "Porque los relojes están sincronizados"], a: 1,
      w: "Ese nodo compartido no puede votar dos decisiones contradictorias. Es aritmética, no un mecanismo: por eso el lado minoritario de una partición se para solo." },
    { q: "¿Qué deberías hacer si necesitas consenso?",
      o: ["Implementar Raft siguiendo el paper", "Elegir líder con un campo en la base de datos", "Usar una pieza probada: etcd, Consul o el propio gestor de tu base de datos"], a: 2,
      w: "Lo que hace correcto a un algoritmo de consenso vive en los casos extremos: mensajes viejos que reaparecen, nodos con registros divergentes, líderes que no saben que ya no lo son. Eso son años de pruebas." },
  ],

  "sd-locks-distribuidos": [
    { q: "¿Por qué hay que comprobar el testigo antes de soltar el bloqueo?",
      o: ["Porque si el tuyo caducó, el `del` borra el bloqueo de otro que sigue trabajando", "Para poder registrar quién lo tenía", "Para renovar la caducidad"], a: 0,
      w: "Y entra un tercero. Ahora hay tres procesos en la sección crítica sin que el bloqueo haya «fallado» en ningún momento visible. La comprobación y el borrado tienen que ser atómicos." },
    { q: "¿Qué garantiza de verdad la exclusión mutua distribuida?",
      o: ["Redlock con cinco instancias de Redis", "Un token de barrera que el recurso valida, rechazando números menores que el último aceptado", "Una caducidad suficientemente larga"], a: 1,
      w: "El problema no está en dónde se guarda el bloqueo, sino en que un proceso pausado no puede saber si el suyo sigue vivo. La única salida es que el recurso también se defienda." },
  ],

  "sd-trazas-distribuidas": [
    { q: "¿Dónde se rompe casi siempre la propagación del contexto?",
      o: ["En las llamadas HTTP entre servicios", "En las consultas a la base de datos", "En las colas: hay que meter el contexto en el mensaje y recuperarlo a mano"], a: 2,
      w: "En HTTP suele venir hecho por la librería. Si no lo haces en mensajería, todas tus trazas terminan justo donde empieza lo asíncrono, que es donde más falta te hacían." },
    { q: "¿Qué versión reducida resuelve buena parte del problema en una tarde?",
      o: ["Propagar un identificador de correlación y meterlo en todos los logs", "Aumentar el nivel de detalle de los logs", "Sincronizar los relojes con NTP"], a: 0,
      w: "No te da la jerarquía de tiempos, pero te deja filtrar los seis logs por un mismo valor y leer la historia en orden, que es el 70 % del dolor." },
  ],

  "sd-cuando-no-distribuir": [
    { q: "¿Qué es un monolito distribuido?",
      o: ["Un monolito desplegado en varias máquinas", "Servicios que se llaman en cadena, comparten esquema y hay que desplegar juntos: el coste de lo distribuido con el acoplamiento del monolito", "Un monolito con módulos bien separados"], a: 1,
      w: "Es el resultado más común de repartir por las razones malas: tienes las dos facturas y ninguna de las dos ventajas." },
    { q: "¿Qué ventaja tiene empezar por un monolito modular?",
      o: ["Que es más rápido de ejecutar", "Que no necesita tests", "Que valida las fronteras gratis: si un módulo no se puede aislar dentro, tampoco funcionaría como servicio"], a: 2,
      w: "Y lo descubres sin desplegar nada. Da el 80 % del beneficio organizativo por el 5 % del coste operativo." },
  ],

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


  "patrones-introduccion": [
    { q: "Reconoces un patrón y te apetece aplicarlo, aunque el problema es sencillo.",
      o: ["Si la tensión que resuelve no existe todavía, solo estás añadiendo indirección","Aplícalo: es la forma de practicar","Aplícalo solo si el equipo lo conoce"], a: 0,
      w: "Cada patrón resuelve una tensión concreta. Sin esa tensión, el siguiente que lea el código tendrá que atravesar la abstracción para nada." },
    { q: "¿Para qué sirve conocer los nombres de los patrones, más allá del código?",
      o: ["Para las entrevistas técnicas","Para tener vocabulario común: decir «aquí hay un Strategy» ahorra un párrafo entero","Para poder aplicarlos automáticamente"], a: 1,
      w: "Los patrones son tanto vocabulario como solución; buena parte de su valor está en la conversación de diseño." },
  ],

  "patrones-creacionales": [
    { q: "Tu constructor ha acabado con siete parámetros, cinco de ellos opcionales.",
      o: ["Añade sobrecargas del constructor","Pásalos en un array asociativo","Builder: nombra cada paso, deja construir por fases y valida al final"], a: 2,
      w: "El array asociativo quita el problema de vista pero pierde el tipado: sigues sin saber qué se puede pasar." },
    { q: "¿Por qué el Singleton complica los tests?",
      o: ["Porque es estado global: un test deja la instancia tocada y el siguiente hereda la resaca","Porque es más lento de instanciar","Porque no se puede documentar"], a: 0,
      w: "Y además no se puede sustituir por un doble, porque la clase controla su propia creación." },
  ],

  "patrones-estructurales": [
    { q: "Decorator y Proxy tienen la misma estructura. ¿Qué los distingue?",
      o: ["El número de clases que envuelven","La intención: Decorator amplía lo que hace, Proxy decide si y cuándo se llega a hacer","Que Proxy requiere una interfaz y Decorator no"], a: 1,
      w: "Misma forma, propósito distinto. Es el ejemplo de por qué los patrones no se distinguen por su diagrama." },
    { q: "Tienes que integrar una librería externa cuya interfaz no encaja con tu código.",
      o: ["Facade, para simplificar su uso","Modificas la librería en tu fork","Adapter: la envuelves y le das la forma que tu código espera"], a: 2,
      w: "La clave del Adapter es «sin modificar el código existente»: es el patrón de integración por excelencia." },
  ],

  "patrones-comportamiento-1": [
    { q: "Un `switch` elige entre cinco formas de calcular el envío, y cada país nuevo lo toca.",
      o: ["Strategy: cada algoritmo en su clase, y añadir uno no toca al cliente","Extrae cada rama a un método privado","Observer, para notificar el cambio de país"], a: 0,
      w: "Extraer a métodos privados reduce el ruido pero no el problema: sigues editando código existente por cada caso nuevo." },
    { q: "¿Qué permite el Observer que una llamada directa no?",
      o: ["Mejor rendimiento","Que quien publica no sepa quién escucha, así que se añade comportamiento sin tocarlo","Ejecución en segundo plano"], a: 1,
      w: "Esa es la gracia y también el peligro: el flujo real deja de leerse en un solo sitio." },
  ],

  "patrones-comportamiento-2": [
    { q: "Necesitas poder encolar una operación, reintentarla y deshacerla.",
      o: ["Strategy, encapsulando el algoritmo","Template Method","Command: la operación pasa a ser un objeto, y por eso se puede guardar y reintentar"], a: 2,
      w: "Strategy responde a «cómo hacerlo»; Command a «qué hay que hacer», empaquetado." },
    { q: "¿Dónde reconoces Chain of Responsibility en Symfony o Laravel?",
      o: ["En el middleware HTTP: la petición pasa por una cadena y cada eslabón decide si sigue","En el contenedor de servicios","En los eventos del kernel"], a: 0,
      w: "Reconocerlo explica por qué el orden importa tanto, y por qué un middleware que no llama al siguiente corta la petición." },
  ],

  "patrones-en-el-framework": [
    { q: "El contenedor entrega un proxy para un servicio lazy. ¿Qué patrón es y por qué?",
      o: ["Decorator, porque añade la carga diferida","Proxy: controla el acceso, instanciando la clase real al primer método","Factory, porque lo construye"], a: 1,
      w: "El proxy cumple la misma interfaz y es barato de crear; controlar el acceso es exactamente la definición del patrón." },
    { q: "¿Qué patrón hay detrás de los tagged services y por qué encaja con OCP?",
      o: ["Observer: los servicios se suscriben","Ninguno en concreto; es una utilidad del contenedor","El consumidor recibe todos los etiquetados sin conocerlos, así que añadir uno es solo registrarlo"], a: 2,
      w: "Es OCP implementado por el framework, y el mecanismo detrás de validadores, normalizadores y comandos." },
  ],

  "hexagonal": [
    { q: "¿Qué prueba de fuego dice si tu hexagonal es real?",
      o: ["Que ninguna clase de dominio importe nada de infraestructura","Que existan carpetas Domain, Application e Infrastructure","Que uses interfaces para los repositorios"], a: 0,
      w: "Las carpetas y las interfaces se pueden tener y seguir apuntando al revés. La regla de dependencia es lo que sostiene todo lo demás." },
    { q: "¿Quién define el puerto?",
      o: ["La infraestructura, que sabe cómo se implementa","El dominio, según lo que necesita","El framework, por convención"], a: 1,
      w: "Si la interfaz la escribe la infraestructura pensando en su tecnología, la flecha sigue apuntando hacia dentro y no has invertido nada." },
  ],

  "hexagonal-en-php": [
    { q: "Tu entidad de dominio extiende de la clase base del ORM.",
      o: ["Es lo habitual y no pasa nada","Solo es un problema si usas Active Record","El dominio acaba de depender de infraestructura: eso rompe la regla de dependencia"], a: 2,
      w: "Es justo el punto donde la arquitectura se queda en el diagrama: el dominio deja de poder probarse ni existir sin el ORM." },
    { q: "¿Qué ganas de verdad al proteger el dominio?",
      o: ["Poder probar el núcleo sin levantar base de datos ni servidor, y cambiar lo de fuera sin tocarlo","Mejor rendimiento","Menos clases en total"], a: 0,
      w: "Cuesta más clases, no menos. Lo que compras es independencia del detalle externo." },
  ],

  "ddd-que-es": [
    { q: "En las reuniones dicen «póliza» y en el código la clase se llama `Contract`.",
      o: ["Es normal, el código usa inglés","Es una fuga del lenguaje ubicuo: cada traducción es donde se cuelan los malentendidos","Basta con documentar la equivalencia"], a: 1,
      w: "El lenguaje ubicuo no es un glosario: es que el código hable el idioma del negocio para que no haya traducción constante." },
    { q: "¿Qué NO es DDD?",
      o: ["Una forma de modelar el dominio con el negocio","Una manera de decidir dónde poner los límites","Una estructura de carpetas y un conjunto de clases base"], a: 2,
      w: "La parte táctica (entidades, agregados) es la visible, pero sin la conversación con el negocio es solo ceremonia." },
  ],

  "ddd-estrategico": [
    { q: "«Cliente» significa cosas distintas en facturación y en soporte.",
      o: ["Son bounded contexts distintos: cada uno puede tener su propio modelo","Hay que unificar el modelo en una sola clase Cliente","Hay que renombrarlas para distinguirlas"], a: 0,
      w: "Forzar un modelo único produce una clase enorme que no sirve bien a nadie. El contexto acotado admite la diferencia." },
    { q: "¿Para qué sirve distinguir subdominio core de los de soporte?",
      o: ["Para repartir el trabajo por seniority","Para saber dónde merece la pena invertir diseño y dónde basta con comprar o hacer lo simple","Para decidir qué se documenta"], a: 1,
      w: "No todo el sistema merece el mismo cuidado: el core es donde compites, el resto es coste." },
  ],

  "ddd-tactico": [
    { q: "¿Entidad o value object para un importe de dinero?",
      o: ["Entidad: cada importe es distinto","Depende de si se guarda en base de datos","Value object: se define por sus atributos y da igual cuál es cuál"], a: 2,
      w: "El criterio es si importa la identidad. Dos billetes de 10 € son intercambiables; dos personas con el mismo nombre no." },
    { q: "Un agregado enorme está provocando bloqueos y conflictos al guardar.",
      o: ["Suele indicar que hay que hacerlo más pequeño y relacionar por identificador","Es inevitable si el dominio es complejo","Hay que subir el nivel de aislamiento de la transacción"], a: 0,
      w: "El agregado es la unidad de consistencia: lo que debe cuadrar a la vez. Todo lo demás puede ser eventual." },
    { q: "¿Por qué solo se accede al agregado por su raíz?",
      o: ["Por rendimiento del ORM","Porque si se puede tocar una pieza interna por fuera, la regla que protege la raíz se salta sin querer","Por convención de nomenclatura"], a: 1,
      w: "Un pedido que valida su total no sirve de nada si alguien puede modificar sus líneas por su cuenta." },
  ],

  "eventos-de-dominio": [
    { q: "¿Por qué los eventos de dominio se nombran en pasado (`PedidoConfirmado`)?",
      o: ["Por convención estética","Porque se procesan de forma asíncrona","Porque describen un hecho consumado, y por eso nadie puede rechazarlo"], a: 2,
      w: "Un comando puede fallar; un evento ya ocurrió. De ahí que quien lo publica no espere respuesta." },
    { q: "¿Qué ganas publicando un evento en vez de llamar directamente al otro servicio?",
      o: ["Que quien publica no sabe quién escucha: añadir reacciones no le obliga a cambiar","Rendimiento","Garantía de entrega"], a: 0,
      w: "La garantía de entrega no viene gratis con el evento: eso lo aporta el transporte, y es otro problema." },
  ],

  "cqrs": [
    { q: "¿Obliga CQRS a tener dos bases de datos?",
      o: ["Sí, es lo que define el patrón","No: en su versión simple son dos caminos dentro de la misma aplicación y la misma base","Solo si usas Event Sourcing"], a: 1,
      w: "Confundirlo con la versión extrema es lo que hace que suene desproporcionado para casi todo." },
    { q: "¿Por qué separar el modelo de lectura del de escritura?",
      o: ["Porque las lecturas son más frecuentes","Para poder escalar la base de datos","Porque sus necesidades son opuestas: escribir quiere invariantes, leer quiere datos ya masticados"], a: 2,
      w: "Separarlos permite desnormalizar el lado de lectura sin ensuciar el dominio." },
  ],

  "cqrs-event-sourcing": [
    { q: "Con Event Sourcing, ¿dónde vive el estado actual de un agregado?",
      o: ["No se guarda: se deriva reproduciendo sus eventos","En una tabla de estado que se actualiza con cada evento","En la caché"], a: 0,
      w: "El estado deja de ser el dato y pasa a ser una consecuencia. Las proyecciones son estado derivado, y por eso se pueden regenerar." },
    { q: "¿Cuándo NO usar CQRS + Event Sourcing?",
      o: ["En sistemas con muchos usuarios","En un CRUD: multiplica el código sin resolver ningún problema que tuvieras","Cuando no se usa DDD"], a: 1,
      w: "Son herramientas para dominios complejos y auditables, no una meta. Y los eventos son inmutables: versionarlos duele." },
  ],

  "framework-ciclo-http": [
    { q: "¿Qué te dice un 502 frente a un 500?",
      o: ["Que la base de datos no responde","Que la ruta no existe","Que nginx no pudo hablar con PHP-FPM: tu código no llegó a ejecutarse"], a: 2,
      w: "El 500 significa que tu código corrió y falló. Distinguirlos te ahorra mirar en el sitio equivocado." },
    { q: "¿Qué aporta el front controller frente al PHP clásico de un fichero por página?",
      o: ["Un único punto de entrada, y por eso puede haber arranque, enrutado y middlewares comunes","Mejor rendimiento","URLs más cortas"], a: 0,
      w: "Sin él cada script se apañaba solo, y no había dónde poner lo transversal." },
  ],

  "framework-extension-points": [
    { q: "Necesitas enganchar a un evento desde una clase de una librería que no puedes modificar.",
      o: ["Un Event Subscriber, que declara en sí mismo lo que escucha","Un Event Listener, que se configura desde fuera","Un compiler pass"], a: 1,
      w: "El subscriber lleva su configuración dentro y se lee de un vistazo; el listener sirve justo cuando no puedes tocar la clase." },
    { q: "¿Cuándo se ejecuta un compiler pass?",
      o: ["En cada petición, antes del controlador","Al arrancar cada worker","Una vez, al compilar el contenedor"], a: 2,
      w: "Por eso puede hacer trabajo caro sin coste en producción, y por eso hay que limpiar caché para que se aplique." },
  ],


  "linux-filesystem": [
    { q: "¿Qué implica que «todo sea un fichero» en Linux?",
      o: ["Que dispositivos, procesos y conexiones se leen y escriben con las mismas herramientas","Que la configuración está siempre en texto plano","Que no existen las carpetas, solo rutas"], a: 0,
      w: "`/proc/1234/status` es un proceso y `/dev/null` un dispositivo, y a los dos los lees con `cat`. Por eso un puñado de herramientas sirve para todo." },
    { q: "¿Dónde vive la configuración del sistema y de las aplicaciones?",
      o: ["/var","/etc","/usr/local"], a: 1,
      w: "La regla que ordena el árbol: `/etc` configura, `/var` cambia (logs, colas), `/usr` es software instalado, `/tmp` se puede borrar sin miedo." },
  ],

  "linux-navegacion": [
    { q: "Quieres volver al directorio en el que estabas antes del último `cd`.",
      o: ["`cd ..`","`cd ~`","`cd -`"], a: 2,
      w: "`cd -` alterna entre el actual y el anterior. `..` sube un nivel y `~` va a tu home, que son otras cosas." },
    { q: "¿Qué te dice `ls -la` que no te dice `ls`?",
      o: ["Los ficheros ocultos y los permisos, propietario y fecha de cada uno","El tamaño en formato legible","El tipo MIME"], a: 0,
      w: "El tamaño legible es `-h`. Los ocultos (los que empiezan por punto) son justo los de configuración que sueles buscar." },
  ],

  "linux-permisos": [
    { q: "Un fichero tiene 644. ¿Qué puede hacer el grupo?",
      o: ["Leer y escribir","Solo leer","Leer y ejecutar"], a: 1,
      w: "6 es lectura+escritura para el propietario; 4 es solo lectura para grupo y otros. El bit de ejecución sería 1." },
    { q: "Tienes permiso de lectura sobre un fichero pero «permiso denegado» al abrirlo.",
      o: ["El fichero está corrupto","Hay que ser root","Probablemente falta el bit de ejecución en algún directorio del camino: en directorios significa poder entrar"], a: 2,
      w: "Es la confusión clásica: en ficheros `x` es ejecutar, en directorios es atravesarlos." },
  ],

  "linux-usuarios": [
    { q: "Ejecutas `usermod -G docker david` y el usuario pierde sudo.",
      o: ["Sin `-a` reemplaza TODOS sus grupos por `docker`","Es un bug de usermod","Falta reiniciar el servicio"], a: 0,
      w: "La `-a` es de append. Es el clásico que deja a alguien fuera hasta que otro lo arregla desde otra sesión." },
    { q: "Añades a un usuario a un grupo y sigue sin tener el permiso.",
      o: ["Hay que reiniciar la máquina","Hay que reabrir sesión: los grupos se resuelven al iniciarla","El grupo no existe"], a: 1,
      w: "La sesión abierta conserva los grupos con los que arrancó; `newgrp` o volver a entrar es lo que lo aplica." },
  ],

  "linux-busquedas": [
    { q: "¿Qué hace `find . -name '*.log' -mtime +7 -delete`?",
      o: ["Borra los .log modificados en los últimos 7 días","Lista los .log de la última semana","Borra los .log con más de 7 días"], a: 2,
      w: "`+7` es «más de 7 días». Conviene ejecutarlo primero sin `-delete`: es muy fácil lanzarlo desde el directorio equivocado." },
    { q: "Buscas un texto dentro de todos los ficheros de un árbol de directorios.",
      o: ["`grep -r texto .`","`find . -name texto`","`ls -R | grep texto`"], a: 0,
      w: "`find` busca por nombre y metadatos; `grep` busca por contenido. El `ls -R | grep` solo mira los nombres." },
  ],

  "linux-texto-y-pipes": [
    { q: "Rediriges la salida a un fichero pero los errores siguen apareciendo en pantalla.",
      o: ["Hay que usar `>>` en vez de `>`","Falta `2>&1`: stderr va por otro descriptor","Hay que ejecutarlo con sudo"], a: 1,
      w: "Y el orden importa: primero rediriges stdout y después enganchas stderr a donde apunte." },
    { q: "¿Qué diferencia hay entre `>` y `>>`?",
      o: ["`>` es para texto y `>>` para binario","Ninguna, son sinónimos","`>` sobrescribe el fichero; `>>` añade al final"], a: 2,
      w: "Confundirlos cuesta caro: un `>` sobre un log lo deja vacío al instante." },
  ],

  "linux-scripting": [
    { q: "¿Qué evita `set -euo pipefail` al principio de un script?",
      o: ["Que siga adelante tras un error y que una variable vacía se trate como cadena vacía","Que el script se ejecute sin permisos","Que se ejecute más de una vez a la vez"], a: 0,
      w: "Así nacen los `rm -rf $DIR/` catastróficos: sin esto, `$DIR` vacío no es un error, es una cadena vacía." },
    { q: "¿Por qué se entrecomillan las variables en bash, como en `\"$fichero\"`?",
      o: ["Por estilo","Porque sin comillas, un valor con espacios se parte en varios argumentos","Porque bash no acepta variables sin comillas"], a: 1,
      w: "Un fichero llamado «mi informe.txt» se convierte en dos argumentos, y el comando hace algo distinto de lo que crees." },
  ],

  "linux-sistema": [
    { q: "Tu script funciona en la terminal pero falla en cron.",
      o: ["Cron no soporta scripts largos","Falta darle permisos de ejecución","Cron corre con un entorno mínimo: sin tu PATH ni lo que cargue el .bashrc"], a: 2,
      w: "Por eso en cron se usan rutas absolutas y se declaran explícitamente las variables que el script necesita." },
    { q: "¿Qué significa `*/15 * * * *`?",
      o: ["Cada 15 minutos","A las 15 de cada día","El día 15 de cada mes"], a: 0,
      w: "Los cinco campos son minuto, hora, día del mes, mes y día de la semana. Ante la duda, mejor comprobarlo: un cron mal puesto tarda en notarse." },
    { q: "Sincronizas con `rsync -av --delete origen/ destino/` y borra cosas que no esperabas.",
      o: ["rsync nunca borra, es un bug","`--delete` borra en destino lo que no está en origen: si el origen es el equivocado, vacías el destino","Faltaba la opción -z"], a: 1,
      w: "Y ojo con la barra final del origen: con ella copia el contenido, sin ella copia el directorio dentro del destino." },
  ],

  "linux-procesos-y-red": [
    { q: "Un proceso no responde a `kill`. ¿Qué señal se está mandando y cuál es la alternativa?",
      o: ["Manda SIGKILL; la alternativa es SIGTERM","Manda SIGHUP; la alternativa es reiniciar","Manda SIGTERM (recoge y vete); si no responde, SIGKILL lo mata sin margen"], a: 2,
      w: "Con SIGTERM el proceso puede cerrar conexiones y guardar. SIGKILL no le da esa oportunidad, así que es el último recurso." },
    { q: "Quieres saber qué proceso está ocupando el puerto 8080.",
      o: ["`ss -tlnp`","`ps aux | grep 8080`","`netstat -r`"], a: 0,
      w: "El `-p` (que suele necesitar sudo) es el que revela el proceso. `ps` no sabe nada de puertos." },
    { q: "¿Qué te ahorra un `~/.ssh/config`?",
      o: ["Tener que introducir la contraseña","Repetir usuario, puerto y clave en cada conexión: `ssh prod` y listo","Abrir el firewall"], a: 1,
      w: "Y lo aprovechan también `scp`, `rsync` y git: se configura una vez y sirve para todo." },
  ],

  "observabilidad-pilares": [
    { q: "Tienes métricas pero ni logs ni trazas. ¿Qué te falta poder responder?",
      o: ["Si algo va mal","Cuántos usuarios hay","Dónde y por qué: las métricas avisan, las trazas localizan y los logs explican"], a: 2,
      w: "Cada pilar responde a una pregunta distinta. Con uno solo siempre te queda media investigación sin poder hacer." },
    { q: "¿Qué diferencia observabilidad de monitorización?",
      o: ["La monitorización vigila lo que ya sabías que podía fallar; la observabilidad te deja preguntar cosas que no previste","Son sinónimos","La observabilidad es solo para microservicios"], a: 0,
      w: "Por eso importa el contexto rico: sin él solo puedes contestar las preguntas que dejaste preparadas." },
  ],

  "logs-estructurados": [
    { q: "¿Qué ganas escribiendo los logs en JSON en vez de texto libre?",
      o: ["Ocupan menos","Puedes filtrar por campo y correlacionar entre servicios, sin regex frágiles sobre líneas que cambian","Se leen mejor en la terminal"], a: 1,
      w: "En la terminal se leen peor, de hecho. La ganancia está en cuanto los consulta una herramienta." },
    { q: "¿Qué campo hace posible seguir una petición a través de varios servicios?",
      o: ["El timestamp","El nivel de log","Un identificador de petición o traza propagado entre servicios"], a: 2,
      w: "Sin él, correlacionar es adivinar por marca de tiempo, que con concurrencia deja de funcionar." },
  ],

  "sentry-error-tracking": [
    { q: "Un bug en un bucle genera diez mil notificaciones del mismo error.",
      o: ["El fingerprinting los agrupa en un solo issue","Hay que bajar el nivel de log","Hay que desactivar Sentry en ese endpoint"], a: 0,
      w: "La huella se puede ajustar cuando agrupa de más (todo junto) o de menos (el mismo bug repartido en veinte issues)." },
    { q: "¿Qué captura Sentry además de la excepción?",
      o: ["Solo el stack trace","El contexto: usuario, petición, release y los breadcrumbs de lo que pasó antes","Una copia de la base de datos"], a: 1,
      w: "La excepción dice qué reventó; el contexto es lo que hace el fallo reproducible." },
  ],

  "sentry-a-fondo": [
    { q: "¿Qué es un breadcrumb?",
      o: ["La ruta del fichero donde ocurrió el error","El identificador del release","El rastro de eventos justo anteriores al fallo, en orden"], a: 2,
      w: "Casi siempre es lo que revela la secuencia que llevó al error, más útil que la propia línea que petó." },
    { q: "¿Para qué sirve asociar los errores a un release?",
      o: ["Para ver si un error es nuevo, si lo introdujo un despliegue concreto y si una versión lo arregló","Para facturar por versión","Para ordenar los issues alfabéticamente"], a: 0,
      w: "Convierte «esto falla» en «esto empezó a fallar con el despliegue del martes», que es una pista y no un lamento." },
  ],

  "metricas-prometheus": [
    { q: "Quieres medir la memoria usada por el proceso. ¿Counter o Gauge?",
      o: ["Counter, porque acumula","Gauge, porque sube y baja","Histogram"], a: 1,
      w: "Elegir mal el tipo estropea las consultas: un contador que baja rompe el cálculo de tasas." },
    { q: "Quieres el percentil 95 de latencia agregando varias instancias del servicio.",
      o: ["Summary, que ya calcula percentiles","Gauge con el valor máximo","Histogram: los percentiles del Summary se calculan por instancia y no se pueden sumar"], a: 2,
      w: "La media de dos percentiles 95 no es el percentil 95 del conjunto. El Histogram guarda cubetas, que sí se agregan." },
  ],

  "promql": [
    { q: "Consultas el valor de un contador y ves un número que solo crece. ¿Qué te interesa en realidad?",
      o: ["Su pendiente: `rate()` sobre un intervalo","El valor absoluto","El máximo histórico"], a: 0,
      w: "`rate()` además maneja los reinicios del proceso, que si no aparecerían como una caída a cero." },
    { q: "¿Para qué sirven las labels en Prometheus?",
      o: ["Para documentar la métrica","Para dividir una métrica en dimensiones (ruta, método, código) y poder filtrar y agregar","Para ordenar los paneles"], a: 1,
      w: "Ojo con la cardinalidad: una label con valores casi únicos, como un id de usuario, multiplica las series y tumba el servidor." },
  ],

  "grafana-dashboards": [
    { q: "¿Dónde guarda Grafana las métricas que pinta?",
      o: ["En su propia base de datos","En ficheros JSON del dashboard","En ningún sitio: consulta datasources como Prometheus o Loki"], a: 2,
      w: "Por eso puede reunir en un mismo panel métricas y logs de sistemas distintos: solo es la capa de consulta y pintura." },
    { q: "¿Qué distingue un buen dashboard de uno que nadie mira?",
      o: ["Que responda a una pregunta concreta y se lea de un vistazo cuando algo va mal","El número de paneles","Que use colores llamativos"], a: 0,
      w: "Un muro de treinta gráficas es tan inútil como no tener ninguna: nadie sabe dónde mirar cuando hay una incidencia." },
  ],

  "loki-logql": [
    { q: "¿Qué hace Loki distinto de Elasticsearch para logs?",
      o: ["Comprime mejor","Solo indexa los labels, no el contenido, así que es mucho más barato de almacenar","Guarda los logs en memoria"], a: 1,
      w: "El precio es que las búsquedas por texto recorren los datos: hay que acotar bien por labels y por tiempo." },
    { q: "Tu consulta LogQL tarda muchísimo.",
      o: ["Hay que añadir más labels a los logs","Loki no sirve para volúmenes grandes","Probablemente no estás acotando por label y rango de tiempo, y está recorriendo todo"], a: 2,
      w: "Añadir labels sin criterio empeora las cosas: dispara la cardinalidad, que es el otro modo de tumbarlo." },
  ],

  "alerting": [
    { q: "Alertas cuando la CPU pasa del 90 %. ¿Qué problema tiene?",
      o: ["Que es una causa, no un síntoma: si las respuestas siguen siendo rápidas, no molesta a nadie","Que el umbral es bajo","Que la CPU no se puede medir con fiabilidad"], a: 0,
      w: "Alertar sobre síntomas de impacto (latencia, errores) reduce el ruido y hace que cada aviso signifique algo." },
    { q: "¿Qué es el error budget y para qué se usa?",
      o: ["El presupuesto de infraestructura","El margen de fallo que permite tu SLO, que sirve para decidir si arriesgas o estabilizas","El número de bugs abiertos"], a: 1,
      w: "Un 99,9 % concede unos 43 minutos al mes. Si queda mucho, puedes desplegar agresivamente; si se agotó, toca frenar." },
    { q: "El equipo ha dejado de mirar las alertas.",
      o: ["Hay que subir la prioridad de todas","Hay que cambiar de herramienta","Es fatiga de alertas: menos avisos y mejores vale más que cobertura total"], a: 2,
      w: "Es el peor final posible: el día que la alerta era de verdad, nadie la mira." },
  ],

  "conceptos-ia": [
    { q: "¿Qué es en el fondo un LLM?",
      o: ["Un modelo que predice el siguiente token a partir del contexto","Una base de datos de código indexado","Un motor de reglas entrenado por expertos"], a: 0,
      w: "Entenderlo explica sus dos caras: por qué escribe código plausible con soltura y por qué se inventa una función con la misma seguridad." },
    { q: "¿Qué es la ventana de contexto?",
      o: ["El tiempo máximo de una respuesta","El texto máximo que el modelo puede tener delante en una inferencia, prompt y respuesta incluidos","El número de mensajes de la conversación"], a: 1,
      w: "Cuando se llena, lo que sobra se cae: por eso en conversaciones largas parece olvidar lo del principio." },
  ],

  "como-piensa-un-llm": [
    { q: "¿Prompting o fine-tuning para adaptar un modelo a tu dominio?",
      o: ["Fine-tuning siempre, es más potente","Da igual, el resultado es el mismo","Empezar por prompting y RAG; el fine-tuning solo compensa para formato o estilo muy específicos"], a: 2,
      w: "El fine-tuning cambia los pesos y cuesta datos, tiempo y dinero; el prompting no toca nada y se itera en segundos." },
    { q: "¿Qué es RAG?",
      o: ["Buscar información relevante y pasársela en el prompt, para que responda con datos actualizados","Reentrenar el modelo con tus datos","Un formato de prompt estructurado"], a: 0,
      w: "Sale más barato que reentrenar y permite citar la fuente, que es lo que hace verificable la respuesta." },
  ],

  "prompting-para-codigo": [
    { q: "Pides «arregla este bug» y te devuelve algo plausible pero equivocado.",
      o: ["El modelo no sirve para depurar","Falta contexto: qué esperabas, qué pasó, qué has probado ya","Hay que repetir la petición varias veces"], a: 1,
      w: "Sin el comportamiento esperado y el observado, solo puede adivinar cuál de los muchos «arreglos» posibles querías." },
    { q: "¿Qué suele mejorar más una respuesta de código?",
      o: ["Pedirle que sea breve","Pedirle varias alternativas siempre","Darle las restricciones reales: versiones, convenciones del proyecto y qué no debe tocar"], a: 2,
      w: "El modelo no conoce tu proyecto salvo que se lo cuentes, y por defecto escribirá código idiomático… de otro proyecto." },
  ],

  "flujo-con-agentes": [
    { q: "¿Qué distingue a un agente de una sola llamada al modelo?",
      o: ["El bucle: planifica, actúa con herramientas, observa el resultado y vuelve a decidir","Que usa un modelo más grande","Que responde más rápido"], a: 0,
      w: "Ahí está su fuerza (puede corregirse solo) y su riesgo (puede irse por las ramas sin que nadie lo pare)." },
    { q: "¿Qué papel tienen las herramientas en un agente?",
      o: ["El modelo las ejecuta directamente","El modelo pide que se ejecuten y tu harness decide: esa frontera es donde viven los permisos","Sustituyen al prompt"], a: 1,
      w: "El modelo nunca ejecuta nada por sí mismo. Todo lo que un agente puede hacer es lo que tú le dejas hacer." },
  ],

  "criterio-y-riesgos": [
    { q: "Un agente lee un issue de GitHub que contiene instrucciones ocultas y las obedece.",
      o: ["Es un fallo del modelo","Solo pasa con modelos pequeños","Es prompt injection: el agente no distingue tus instrucciones del contenido que lee"], a: 2,
      w: "Por eso importa acotar sus permisos y desconfiar de todo lo que entre desde fuera, igual que con cualquier entrada de usuario." },
    { q: "¿Qué hace peligrosas a las alucinaciones?",
      o: ["Que llegan con el mismo tono de seguridad que los aciertos, sin ninguna señal de duda","Que son frecuentes","Que solo ocurren en temas oscuros"], a: 0,
      w: "No hay indicador de confianza en el texto, así que la verificación tiene que venir de fuera: tests, documentación, ejecutarlo." },
  ],


  "bits-y-bytes": [
    { q: "Un contador de un byte sin signo llega a 255 y sumas uno más.",
      o: ["Da 256 y ocupa dos bytes","Vuelve a 0: es el desbordamiento, y 8 bits solo dan 256 combinaciones","Lanza un error"], a: 1,
      w: "De ahí salen los rangos que ves por todas partes: 0-255 sin signo, -128 a 127 con signo." },
    { q: "¿Por qué 1 KB no siempre son 1000 bytes?",
      o: ["Por errores de redondeo","Porque depende del sistema de ficheros","Porque en informática se usa la potencia de 2: 1024, aunque los fabricantes de discos usen 1000"], a: 2,
      w: "Es la razón de que un disco de 1 TB muestre unos 931 GB en el sistema: no falta nada, se está midiendo distinto." },
  ],

  "texto-unicode": [
    { q: "Guardas «ñ» en una base latin1 y lo lees como UTF-8. ¿Qué ves?",
      o: ["Caracteres raros: los mismos bytes interpretados con otra tabla","Un carácter vacío","Un error de la base de datos"], a: 0,
      w: "El texto siempre son bytes más una convención para leerlos. La «ñ» ocupa 1 byte en latin1 y 2 en UTF-8." },
    { q: "`strlen(\"añil\")` en PHP devuelve 5 en vez de 4.",
      o: ["Hay un espacio de más","`strlen` cuenta bytes y la «ñ» ocupa dos en UTF-8; para caracteres es `mb_strlen`","PHP incluye el terminador nulo"], a: 1,
      w: "Es la fuente clásica de textos cortados a mitad de carácter cuando se trunca por bytes." },
  ],

  "numeros-flotantes": [
    { q: "¿Por qué `0.1 + 0.2 !== 0.3`?",
      o: ["Por un bug histórico de los lenguajes","Porque falta redondear a dos decimales","Porque 0,1 en binario es periódico y no cabe exacto, como 1/3 en decimal"], a: 2,
      w: "No es del lenguaje, es de IEEE-754: pasa igual en PHP, JS, Python y Java." },
    { q: "¿Cómo se guarda dinero entonces?",
      o: ["En enteros de céntimos o en un tipo decimal exacto","En float con dos decimales","En string y se convierte al operar"], a: 0,
      w: "Con float, sumar mil importes va acumulando error hasta que el arqueo no cuadra por unos céntimos." },
  ],

  "big-o": [
    { q: "Duplicas los datos y tu algoritmo solo tarda un poco más, no el doble.",
      o: ["Es O(n)","Suena a O(log n): divide el problema a la mitad en cada paso","Es O(1)"], a: 1,
      w: "Buscar en un millón de elementos ordenados son unas 20 comparaciones; en dos millones, 21." },
    { q: "Un bucle dentro de otro sobre la misma colección.",
      o: ["O(n log n)","O(2n), que es lo mismo que O(n)","O(n²): con 1.000 elementos son un millón de iteraciones"], a: 2,
      w: "Es el patrón que funciona en desarrollo con 20 registros y tumba producción con 20.000." },
  ],

  "estructuras-datos": [
    { q: "Necesitas comprobar muchas veces si un elemento está en una colección grande.",
      o: ["Un hashmap o un set: búsqueda O(1) en promedio","Un array, recorriéndolo","Una lista enlazada"], a: 0,
      w: "El «en promedio» importa: con muchas colisiones degenera a O(n), y por eso la función hash y el factor de carga no son un detalle." },
    { q: "¿Qué gana una lista enlazada frente a un array?",
      o: ["Búsqueda más rápida","Insertar y borrar en medio sin desplazar el resto","Menos memoria"], a: 1,
      w: "A cambio pierde el acceso por índice y la localidad de caché, que en la práctica hace que el array gane más veces de las que parece." },
  ],

  "hashing": [
    { q: "¿Cómo encuentra un hashmap una clave sin recorrer nada?",
      o: ["Mantiene las claves ordenadas","Usa un índice B-tree interno","La función hash calcula directamente la posición donde mirar"], a: 2,
      w: "Por eso la clave tiene que ser hasheable e inmutable: si cambia después de insertarla, el mapa ya no la encuentra." },
    { q: "¿Qué es una colisión y por qué importa?",
      o: ["Dos claves distintas con el mismo hash: hay que resolverlas, y muchas degradan la búsqueda a O(n)","Dos claves iguales; se sobrescribe","Un error de la función hash"], a: 0,
      w: "Es inevitable (hay infinitas claves y finitas posiciones); lo que importa es que la función reparta bien." },
  ],

  "indices-btree": [
    { q: "Tienes un índice en `(apellido, nombre)` y filtras solo por `nombre`.",
      o: ["El índice se usa igual","No sirve: solo se aprovecha por el prefijo izquierdo del índice","Hay que reconstruirlo"], a: 1,
      w: "Es como buscar en la guía telefónica por nombre de pila: el orden no te ayuda si no empiezas por el primer campo." },
    { q: "¿Por qué no se indexan todas las columnas por si acaso?",
      o: ["Ocupan mucho espacio","Confunden al planificador","Cada índice hay que mantenerlo en cada INSERT, UPDATE y DELETE: aceleran leer y frenan escribir"], a: 2,
      w: "Un índice es una apuesta: pagas en escritura para cobrar en lectura. Sin consultas que lo usen, es solo coste." },
  ],

  "transacciones-acid": [
    { q: "Restas de una cuenta y falla la suma en la otra. ¿Qué letra de ACID te salva?",
      o: ["Atomicidad: o se hace todo o no se hace nada","Consistencia","Durabilidad"], a: 0,
      w: "Sin ella podrías dejar el dinero desaparecido, que es el ejemplo con el que se explica desde siempre." },
    { q: "Lees un dato de una transacción que luego se revierte.",
      o: ["Es una lectura no repetible","Es una lectura sucia; READ COMMITTED la evita","Es una lectura fantasma"], a: 1,
      w: "Has decidido sobre datos que nunca existieron. Los niveles superiores atacan otras anomalías: no repetibles y fantasmas." },
  ],

  "modelado-relacional": [
    { q: "¿Cuándo tiene sentido desnormalizar a propósito?",
      o: ["Nunca: rompe la integridad","Siempre que la tabla tenga muchos JOINs","Cuando una consulta crítica lo pide y asumes el coste de mantener la copia sincronizada"], a: 2,
      w: "Normalizar es el punto de partida sensato; desnormalizar es una decisión con precio, no un atajo." },
    { q: "¿Qué problema evita la tercera forma normal?",
      o: ["Los datos duplicados que pueden quedar incoherentes al actualizar solo una copia","Las consultas lentas","Los NULL"], a: 0,
      w: "El objetivo de normalizar es que cada hecho esté guardado en un solo sitio, para que no pueda contradecirse consigo mismo." },
  ],

  "procesos-hilos": [
    { q: "Dos hilos del mismo proceso escriben en la misma variable sin sincronizar.",
      o: ["El sistema los serializa automáticamente","Es una condición de carrera: comparten memoria","Cada uno tiene su copia, no pasa nada"], a: 1,
      w: "Compartir memoria es lo que hace a los hilos baratos y peligrosos: comunicarse es gratis, coordinarse es tu problema." },
    { q: "¿Por qué PHP-FPM usa procesos y no hilos?",
      o: ["Porque PHP no soporta hilos","Porque los procesos son más rápidos","Por el modelo shared-nothing: cada petición arranca con estado limpio y un fallo no arrastra a las demás"], a: 2,
      w: "Es lo que hace que PHP perdone tantos errores de estado global, y también lo que hay que replantearse al pasar a workers." },
  ],

  "concurrencia": [
    { q: "Un bug solo aparece en producción bajo carga y no hay forma de reproducirlo en local.",
      o: ["Huele a condición de carrera: depende de cómo se intercalen las operaciones","Es un problema de memoria","Es un bug del framework"], a: 0,
      w: "Por eso se resuelven con diseño (locks, operaciones atómicas) y no depurando: no puedes provocar el intercalado a voluntad." },
    { q: "Lees un contador, le sumas uno y lo guardas. ¿Qué falla con concurrencia?",
      o: ["Nada si la operación es rápida","Dos procesos pueden leer el mismo valor y perder un incremento","El valor se corrompe"], a: 1,
      w: "La solución no es ir más rápido: es hacer la operación atómica (un `UPDATE ... SET n = n + 1`, o un incremento atómico)." },
  ],

  "async-event-loop": [
    { q: "En un event loop haces una llamada síncrona que tarda 5 segundos.",
      o: ["Solo se pausa esa tarea","El runtime la mueve a otro hilo","Se bloquea el bucle entero y nada más avanza"], a: 2,
      w: "El bucle es un solo hilo. Es el error más común al empezar con async, y por eso existen las versiones asíncronas de todo." },
    { q: "¿Para qué tipo de carga brilla el event loop?",
      o: ["Muchas conexiones esperando I/O: red, disco, base de datos","Cálculo intensivo","Procesamiento de imágenes"], a: 0,
      w: "Mientras se espera, el hilo atiende a otro. Con CPU pura no hay espera que aprovechar y el modelo se hunde." },
  ],

  "memoria": [
    { q: "¿Qué distingue al stack del heap?",
      o: ["El stack es más grande","El stack se libera solo al salir de la función; el heap lo gestionas tú o el recolector","El heap es más rápido"], a: 1,
      w: "El stack es rápido justo porque su gestión es trivial: crece y decrece con las llamadas. Por eso es también limitado." },
    { q: "¿Por qué recorrer un array es más rápido que recorrer una lista enlazada del mismo tamaño?",
      o: ["Porque tiene menos elementos","Porque la lista usa punteros de 64 bits","Por la caché: el array está contiguo en memoria y se trae de golpe"], a: 2,
      w: "La localidad de referencia explica muchas diferencias de rendimiento que el Big-O no captura." },
  ],

  "url-a-fondo": [
    { q: "Escribes una URL y el navegador no encuentra la página, pero la IP directa sí funciona.",
      o: ["Problema de DNS: la resolución del nombre","El servidor está caído","El certificado ha caducado"], a: 0,
      w: "Muchos incidentes de «la web no va» son en realidad de DNS, con su caché y su TTL complicando el diagnóstico." },
    { q: "¿Qué parte de la URL NO llega al servidor?",
      o: ["La query string","El fragmento tras la almohadilla (`#seccion`)","El puerto"], a: 1,
      w: "El fragmento lo resuelve el navegador. Por eso las SPA que lo usaban para rutas no aparecían en los logs del servidor." },
  ],

  "http-a-fondo": [
    { q: "¿Qué hace que una respuesta sea cacheable por un proxy intermedio?",
      o: ["Que sea un GET","Que el cuerpo sea JSON","Las cabeceras de caché (`Cache-Control`, `ETag`) junto con un método seguro"], a: 2,
      w: "Ser GET es condición necesaria pero no suficiente: sin cabeceras, cada proxy decide por su cuenta o no cachea." },
    { q: "¿Qué significa que GET sea «seguro» en HTTP?",
      o: ["Que no debe cambiar el estado del servidor","Que va cifrado","Que no se puede interceptar"], a: 0,
      w: "Es una promesa semántica, no una garantía técnica. Romperla es lo que hace que un rastreador borre datos al seguir enlaces." },
  ],

  "tcp-ip": [
    { q: "¿Qué te da TCP que UDP no?",
      o: ["Menos latencia","Entrega ordenada y fiable: retransmite lo perdido y reordena","Cifrado"], a: 1,
      w: "El cifrado lo pone TLS por encima. Y esa fiabilidad cuesta latencia, que es justo por lo que UDP existe." },
    { q: "En una conexión HTTPS, ¿qué añade el certificado sobre el cifrado?",
      o: ["Nada, es parte del cifrado","Compresión de la conexión","La identidad: acredita que hablas con quien crees"], a: 2,
      w: "Sin lo segundo, cifrarías perfectamente con un impostor. Son dos cosas distintas y las dos importan." },
  ],

  "idempotencia": [
    { q: "No sabes si tu petición llegó porque se cortó la conexión.",
      o: ["Si la operación es idempotente, puedes reintentar sin miedo","Hay que consultar antes de reintentar siempre","Hay que asumir que llegó"], a: 0,
      w: "Es lo que hace viables los reintentos automáticos en redes poco fiables, y por eso importa tanto en sistemas distribuidos." },
    { q: "¿Qué métodos HTTP deberían ser idempotentes?",
      o: ["Todos","GET, PUT y DELETE; POST no, y por eso existen las claves de idempotencia","Solo GET"], a: 1,
      w: "DELETE lo es aunque el segundo intento devuelva 404: el efecto final es el mismo, el recurso no está." },
  ],

  "cap-consistencia": [
    { q: "¿Es cierto que CAP te hace elegir dos de tres?",
      o: ["Sí, es la formulación original","No, siempre puedes tener las tres","Es engañoso: las particiones no se eligen, ocurren. La decisión llega cuando la red se parte"], a: 2,
      w: "En ese momento eliges entre responder con datos posiblemente viejos o no responder. El resto del tiempo la disyuntiva no existe." },
    { q: "¿Cuándo es aceptable la consistencia eventual?",
      o: ["Cuando un desfase temporal no causa daño: un contador de «me gusta» sí, un saldo bancario no","Siempre, es lo moderno","Solo en sistemas de solo lectura"], a: 0,
      w: "La pregunta nunca es sobre la tecnología: es sobre qué dato es y qué pasa si dos nodos discrepan un rato." },
  ],

  "redis-cache": [
    { q: "Cacheas el resultado de una consulta y los usuarios ven datos viejos tras una edición.",
      o: ["Hay que bajar el TTL a cero","Falta invalidar al escribir: la caché es fácil, invalidarla es el problema","Redis no sirve para eso"], a: 1,
      w: "TTL cero es no cachear. Las estrategias son invalidar al escribir, escribir a la vez, o aceptar el desfase del TTL a sabiendas." },
    { q: "¿Qué es una estampida de caché?",
      o: ["Escribir demasiado rápido en Redis","Que la caché se llena y desaloja todo","Que expira una clave muy usada y mil peticiones van a la vez a recalcularla"], a: 2,
      w: "Se mitiga con un lock al recalcular, o expirando con algo de aleatoriedad para que no caduquen todas a la vez." },
  ],

  "hashing-vs-cifrado": [
    { q: "Necesitas poder recuperar el dato original más adelante.",
      o: ["Cifrado: el hashing es unidireccional a propósito","Hashing con sal","Codificación base64"], a: 0,
      w: "Base64 no protege nada, es codificación. Y si puedes recuperar una contraseña de tu base, algo va mal en el diseño." },
    { q: "¿Por qué no vale SHA-256 para contraseñas?",
      o: ["Porque tiene colisiones","Porque es rápido a propósito, y eso permite probar miles de millones por segundo","Porque no acepta sal"], a: 1,
      w: "Los algoritmos de contraseñas (bcrypt, argon2) son lentos deliberadamente y llevan sal, para que cada intento cueste." },
  ],

  "autenticacion": [
    { q: "¿Qué diferencia práctica hay entre una sesión y un JWT?",
      o: ["El JWT es más seguro","La sesión no funciona con APIs","La sesión vive en el servidor y se puede revocar al instante; el JWT es autocontenido y vale hasta que caduca"], a: 2,
      w: "Esa revocación es el punto que más se subestima: invalidar un JWT antes de tiempo exige una lista negra, o sea, estado en el servidor." },
    { q: "¿Qué resuelve OAuth?",
      o: ["Delegar el acceso a un tercero sin darle tu contraseña","Guardar contraseñas de forma segura","Cifrar el tráfico"], a: 0,
      w: "Es autorización, no autenticación: para lo segundo está OIDC, que se construye encima y es lo que usa «entrar con Google»." },
  ],

  "owasp": [
    { q: "¿Qué tienen en común la inyección SQL y el XSS?",
      o: ["Que ambos requieren acceso al servidor","Que mezclan datos con instrucciones: el dato acaba interpretándose como código","Que se previenen con HTTPS"], a: 1,
      w: "La solución es la misma en el fondo: separar ambos mundos. Consultas parametrizadas en un caso, escapado por contexto en el otro." },
    { q: "¿Por qué escapar a mano es peor que usar consultas parametrizadas?",
      o: ["Porque es más lento","Porque no funciona con MySQL","Porque un solo caso olvidado abre el agujero, y el motor ya sabe hacerlo bien"], a: 2,
      w: "Con parámetros, el motor recibe la estructura por un lado y los valores por otro: un valor no puede convertirse en sintaxis." },
    { q: "¿Qué ataque previene un token CSRF?",
      o: ["Que otra web haga que el navegador del usuario envíe una petición con su sesión sin que él lo sepa","Que roben la sesión del usuario","Que inyecten JavaScript"], a: 0,
      w: "El navegador manda las cookies solas; el token demuestra que la petición salió de tu propia página y no de una ajena." },
  ],


  "go-que-es": [
    { q: "¿Para qué encaja especialmente bien Go?",
      o: ["Aplicaciones de escritorio con interfaz","Servicios de red y CLIs: concurrencia barata y un binario sin dependencias","Cálculo científico"], a: 1,
      w: "El binario estático es media razón por la que se usa tanto en contenedores: la imagen final puede ser de unos pocos megas." },
    { q: "¿Qué decisión de diseño explica la mayoría de las «rarezas» de Go?",
      o: ["Ser lo más rápido posible","Compatibilidad con C","Priorizar la simplicidad y la legibilidad, aunque cueste verbosidad"], a: 2,
      w: "De ahí sale que no haya excepciones, ni herencia, ni (hasta hace poco) generics: menos formas de hacer lo mismo." },
  ],

  "go-entorno-docker": [
    { q: "¿Por qué la imagen final de un servicio Go puede ser tan pequeña?",
      o: ["Porque compila a un binario estático: la imagen final no necesita ni runtime ni dependencias","Porque Go comprime el binario","Porque usa una imagen base especial"], a: 0,
      w: "Con multi-stage, compilas en una fase con todo el herramental y copias solo el binario a una imagen mínima." },
    { q: "¿Qué se cachea para que un build de Go no descargue todo cada vez?",
      o: ["El binario compilado","Los módulos: copiar `go.mod` y `go.sum` y hacer `go mod download` antes del código","El directorio /tmp"], a: 1,
      w: "Mismo principio que con `composer.json`: lo que cambia poco va arriba en el Dockerfile." },
  ],

  "go-editores": [
    { q: "¿Qué te da `gofmt` que no es negociable en Go?",
      o: ["Detecta errores de compilación","Optimiza el binario","Un formato único: en Go no hay debates de estilo porque lo decide la herramienta"], a: 2,
      w: "Es una decisión cultural deliberada: elimina una categoría entera de discusiones en los pull requests." },
    { q: "¿Qué hace `go vet` que el compilador no?",
      o: ["Detecta construcciones sospechosas que compilan pero casi seguro son un error","Compila más rápido","Formatea el código"], a: 0,
      w: "Cosas como un `Printf` cuyos verbos no casan con los argumentos: válido para el compilador, casi siempre un bug." },
  ],

  "go-primer-programa": [
    { q: "Declaras una variable y no la usas.",
      o: ["Un warning","No compila: en Go es un error","Se ignora silenciosamente"], a: 1,
      w: "Igual que los imports sin usar. Molesta al principio y evita que el código acumule restos muertos." },
    { q: "¿Qué hace especial al paquete `main`?",
      o: ["Es el único que puede importar otros","Es obligatorio en todo proyecto","Es el que produce un ejecutable, con su función `main()` como punto de entrada"], a: 2,
      w: "Una librería no tiene `package main`: se compila como paquete y no genera binario." },
  ],

  "go-paquetes-y-modulos": [
    { q: "¿Qué determina si un identificador es visible desde fuera del paquete?",
      o: ["La mayúscula inicial: `Nombre` se exporta, `nombre` no","Una palabra clave `public`","Su posición en el fichero"], a: 0,
      w: "Es la regla de visibilidad más simple que existe, y se ve en la propia llamada sin ir a mirar la declaración." },
    { q: "¿Para qué sirve `go.sum` junto a `go.mod`?",
      o: ["Listar las dependencias","Guardar los hashes de cada versión para detectar que el contenido cambió","Definir la versión de Go"], a: 1,
      w: "`go.mod` declara qué quieres; `go.sum` verifica que lo que te bajas es exactamente lo que se bajó la primera vez." },
  ],

  "go-tipos-y-variables": [
    { q: "Declaras `var n int` y no le asignas nada.",
      o: ["Vale nil","Da error hasta que se asigne","Vale 0: en Go todo tipo tiene un zero value"], a: 2,
      w: "String vacío, false, 0 y nil para punteros y slices. Es lo que hace que nunca haya variables «sin inicializar»." },
    { q: "¿Qué diferencia hay entre `:=` y `var`?",
      o: ["`:=` declara e infiere el tipo, y solo vale dentro de funciones","Ninguna","`var` es para constantes"], a: 0,
      w: "A nivel de paquete solo puedes usar `var`. Y `:=` exige que al menos una variable de la izquierda sea nueva." },
  ],

  "go-funciones-y-control": [
    { q: "¿Qué garantiza `defer`?",
      o: ["Que la función se ejecute en otra goroutine","Que la llamada se ejecute al salir, incluso si hay panic","Que se ejecute la primera"], a: 1,
      w: "Por eso el `defer f.Close()` va justo tras abrir: la liberación queda al lado de la reserva y no se olvida en un `return` raro." },
    { q: "¿Por qué Go no tiene `while`?",
      o: ["Se eliminó por rendimiento","Se usa `loop` en su lugar","Porque `for` cubre todos los casos: `for cond {}` es el while"], a: 2,
      w: "Una sola construcción de bucle, coherente con la idea de tener una forma de hacer cada cosa." },
  ],

  "go-structs-y-metodos": [
    { q: "¿Cuándo declaras el receptor de un método como puntero?",
      o: ["Cuando el método debe modificar el struct, o este es grande","Siempre, por rendimiento","Solo si el struct tiene punteros dentro"], a: 0,
      w: "Con receptor por valor trabajas sobre una copia: modificarla no cambia el original, y ahí nacen muchos «no me guarda el cambio»." },
    { q: "¿Qué es un struct tag como `json:\"nombre\"`?",
      o: ["Un comentario","Metadatos que leen las librerías por reflexión, por ejemplo para serializar","Una restricción de tipo"], a: 1,
      w: "El compilador no los interpreta: es `encoding/json` quien los lee. Por eso una errata en el tag no da error, solo no funciona." },
  ],

  "go-punteros": [
    { q: "¿Hay aritmética de punteros en Go?",
      o: ["Sí, como en C","Solo con el paquete unsafe","No: puedes referenciar y desreferenciar, pero no sumar posiciones"], a: 2,
      w: "Es lo que hace los punteros de Go seguros: sirven para compartir y modificar, no para recorrer memoria a mano." },
    { q: "Pasas un struct grande a una función por valor.",
      o: ["Se copia entero: para evitarlo se pasa un puntero","Se pasa la referencia automáticamente","Da error de compilación"], a: 0,
      w: "Go siempre pasa por valor; pasar un puntero es pasar por valor el puntero. Entenderlo evita sorpresas con slices y maps." },
  ],

  "go-slices-y-maps": [
    { q: "Creas un map con `var m map[string]int` y escribes en él.",
      o: ["Funciona","Panic: el map nulo se puede leer pero no escribir; hay que usar `make`","Se crea automáticamente"], a: 1,
      w: "Leer de un map nulo devuelve el zero value, escribir revienta. Es de los primeros tropiezos con Go." },
    { q: "Haces `append` a un slice dentro de una función y fuera no se ve el cambio.",
      o: ["Es un bug","Hay que pasar el slice por puntero siempre","`append` puede realojar y devolver otro slice: hay que asignar el resultado"], a: 2,
      w: "El slice es una cabecera (puntero, longitud, capacidad) que se copia. Por eso `s = append(s, x)` y no solo `append(s, x)`." },
  ],

  "go-interfaces": [
    { q: "¿Cómo declara un tipo que implementa una interfaz?",
      o: ["No lo declara: basta con tener los métodos, Go lo comprueba solo","Con `implements`","Registrándose en un init()"], a: 0,
      w: "Permite definir la interfaz donde se consume y que tipos ya existentes la cumplan sin tocarlos." },
    { q: "¿Qué tamaño debería tener una interfaz en Go?",
      o: ["Cuantos más métodos, más útil","Pequeña: «the bigger the interface, the weaker the abstraction»","Da igual"], a: 1,
      w: "`io.Reader` tiene un solo método y es de las más potentes de la librería estándar." },
  ],

  "go-composicion": [
    { q: "Embebes un tipo en un struct. ¿Es herencia?",
      o: ["Sí, funciona igual","Solo si el embebido es una interfaz","No: promueve campos y métodos, pero no hay polimorfismo por el tipo embebido"], a: 2,
      w: "Es la forma de Go de reutilizar sin jerarquías: no puedes tratar el contenedor como si fuera del tipo embebido." },
    { q: "¿Cómo consigues polimorfismo en Go si no hay herencia?",
      o: ["Con interfaces: el comportamiento común se declara y cada tipo lo implementa","Con embedding","Con generics"], a: 0,
      w: "Composición para reutilizar, interfaces para abstraer. Son dos herramientas distintas y se confunden a menudo." },
  ],

  "go-errores": [
    { q: "¿Qué se hace en Go cuando una función puede fallar?",
      o: ["Lanzar un panic","Devolver el error como último valor y comprobar `if err != nil`","Devolver nil y registrar el fallo"], a: 1,
      w: "Resulta verboso, y a cambio cada punto de fallo es visible en el propio código, sin saltos invisibles en el flujo." },
    { q: "¿Cuándo es aceptable un `panic`?",
      o: ["Cuando falla una consulta a base de datos","Cuando el error se repite","Ante un error irrecuperable de programación, como un estado imposible al arrancar"], a: 2,
      w: "Panic no es la excepción de Go: es el «esto no debería poder pasar». Los errores esperables son valores." },
  ],

  "go-generics": [
    { q: "¿Qué problema venían a resolver los generics en Go?",
      o: ["Escribir la misma función N veces por tipo, o perder el tipado usando `interface{}`","La velocidad de compilación","La concurrencia"], a: 0,
      w: "Antes tenías `MaxInt`, `MaxFloat`… o un `interface{}` con casts. Ahora se escribe una vez con un type parameter." },
    { q: "¿Cuándo NO usar generics?",
      o: ["Cuando el equipo no los conoce","Cuando una interfaz resuelve el caso: si lo que varía es el comportamiento y no el tipo, la interfaz encaja mejor","Nunca, siempre son preferibles"], a: 1,
      w: "El consejo de la propia comunidad: escribe el código concreto primero y generalízalo cuando la repetición aparezca de verdad." },
  ],

  "goroutines": [
    { q: "Lanzas 100.000 goroutines. ¿Es descabellado?",
      o: ["Sí, son hilos del sistema","Solo si la máquina tiene muchos núcleos","No: arrancan con unos 2 KB y el runtime las multiplexa sobre unos pocos hilos"], a: 2,
      w: "Un hilo del sistema pide entre 1 y 8 MB. Esa diferencia de tres órdenes de magnitud es lo que cambia el modelo mental." },
    { q: "Tu `main` termina mientras hay goroutines trabajando.",
      o: ["El programa termina y se las lleva por delante","Espera a que acaben","Se quedan huérfanas ejecutándose"], a: 0,
      w: "Por eso hace falta coordinar la espera con un `WaitGroup` o un canal: nadie lo hace por ti." },
  ],

  "go-channels": [
    { q: "Envías a un canal sin buffer y no hay nadie recibiendo.",
      o: ["El valor se pierde","La goroutine emisora se bloquea hasta que alguien recibe","Da error"], a: 1,
      w: "Un canal sin buffer es un punto de cita, y por eso sirve también como mecanismo de sincronización." },
    { q: "¿Qué añade `select` sobre leer de un canal directamente?",
      o: ["Mejor rendimiento","Lectura no bloqueante siempre","Esperar en varios canales a la vez, que es lo que permite combinar trabajo y cancelación"], a: 2,
      w: "El patrón habitual: un case para el trabajo y otro para `ctx.Done()`. Con `default` deja de bloquear." },
  ],

  "go-sync-y-context": [
    { q: "¿Dónde va el `wg.Add(1)` respecto a lanzar la goroutine?",
      o: ["Antes de lanzarla: si va dentro, `Wait` puede haber pasado ya de largo","Dentro de la goroutine","Da igual"], a: 0,
      w: "Es el fallo clásico con `WaitGroup`, y produce un programa que a veces espera y a veces no." },
    { q: "¿Qué hace el race detector y cuándo se usa?",
      o: ["Optimiza el acceso concurrente","Detecta accesos concurrentes sin sincronizar en tiempo de ejecución: `go test -race`","Analiza el código estáticamente"], a: 1,
      w: "Solo detecta las carreras que ocurren en esa ejecución, así que conviene tenerlo puesto en CI y no solo en local." },
  ],

  "go-http": [
    { q: "¿Qué necesitas para montar un servidor HTTP básico en Go?",
      o: ["Un framework externo","Un servidor delante, como nginx","La librería estándar: `net/http` basta"], a: 2,
      w: "Es una de las razones de que Go se use tanto en servicios: el servidor HTTP viene de serie y es de calidad de producción." },
    { q: "Un `http.Handler` es cualquier cosa con `ServeHTTP`. ¿Qué permite eso?",
      o: ["Ambas cosas","Que se pueda testear sin levantar el servidor","Componer middlewares: cada uno envuelve al siguiente y devuelve otro Handler"], a: 0,
      w: "Es interfaz pequeña llevada al extremo, y de ahí sale el patrón de middleware sin necesitar framework." },
  ],

  "go-json-y-bd": [
    { q: "Serializas un struct a JSON y faltan campos.",
      o: ["Falta el struct tag","Los campos empiezan por minúscula: no se exportan y `encoding/json` no los ve","Hay que implementar Marshaler"], a: 1,
      w: "Es la regla de visibilidad de siempre mordiendo por reflexión: si el paquete json no puede leerlo, no lo escribe." },
    { q: "¿Qué representa `sql.NullString` y por qué existe?",
      o: ["Un string vacío","Un error de lectura","Un valor que puede ser NULL en base de datos, cosa que un `string` de Go no puede expresar"], a: 2,
      w: "El zero value de Go (`\"\"`) y el NULL de SQL son cosas distintas, y confundirlos cambia el significado del dato." },
  ],

  "go-testing": [
    { q: "¿Qué necesita un test en Go para ejecutarse?",
      o: ["Estar en un fichero `_test.go`, con función `TestXxx(t *testing.T)`","Una librería de aserciones","Un fichero de configuración"], a: 0,
      w: "No hay framework ni aserciones de serie: se comprueba con `if` y se falla con `t.Errorf`. Deliberadamente austero." },
    { q: "¿Qué aporta `t.Run` dentro de un table-driven test?",
      o: ["Ejecuta los casos en paralelo","Da nombre a cada caso, así que la salida dice cuál falló","Reintenta los que fallan"], a: 1,
      w: "El paralelismo es `t.Parallel()`, que es otra cosa. Sin `t.Run`, un fallo solo te dice que el test grande falló." },
  ],

  "go-a-produccion": [
    { q: "¿Qué imagen base necesita un binario Go compilado estáticamente?",
      o: ["Una con el runtime de Go","Alpine obligatoriamente","Ninguna: puede correr sobre `scratch` o una distroless"], a: 2,
      w: "Ojo con cgo: si está activo, el binario deja de ser estático y `scratch` ya no vale." },
    { q: "¿Cómo se inyecta la versión en el binario al compilar?",
      o: ["Con `-ldflags` sobre una variable del paquete","En un fichero de configuración","Leyendo el tag de git en tiempo de ejecución"], a: 0,
      w: "Permite que el binario sepa de qué commit salió sin depender de nada externo, que es justo lo que quieres al depurar producción." },
  ],


  "python-que-es": [
    { q: "¿Qué explica que Python domine en datos y scripting pero no en servicios de altísimo rendimiento?",
      o: ["Que es un lenguaje joven","Que prioriza legibilidad y velocidad de desarrollo, a costa de velocidad de ejecución","Que no tiene librerías de red"], a: 1,
      w: "Y cuando el rendimiento importa, se delega en librerías escritas en C: por eso NumPy es rápido aunque Python no lo sea." },
    { q: "¿Qué es el GIL y qué implica?",
      o: ["Un gestor de paquetes","Un recolector de basura","Un bloqueo que impide que varios hilos ejecuten bytecode a la vez: los hilos no paralelizan CPU"], a: 2,
      w: "Para CPU se usan procesos (`multiprocessing`); para I/O, hilos o async, que sí aprovechan la espera." },
  ],

  "python-entorno-docker": [
    { q: "¿Sigue haciendo falta un entorno virtual si trabajas en Docker?",
      o: ["Normalmente no: el contenedor ya te da el aislamiento","Sí, siempre","Solo en producción"], a: 0,
      w: "Fuera de Docker sí importa: sin él, dos proyectos con versiones distintas de la misma librería se pisan." },
    { q: "¿Qué se copia primero en el Dockerfile para aprovechar la caché?",
      o: ["Todo el código","El `requirements.txt` (o `pyproject.toml`) y se instalan las dependencias antes del código","El directorio de tests"], a: 1,
      w: "Mismo principio que en cualquier lenguaje: lo que cambia poco arriba, lo que cambia en cada commit abajo." },
  ],

  "python-editores": [
    { q: "¿Qué aporta un formateador como Black frente a discutir estilo en los PR?",
      o: ["Detecta bugs","Acelera la ejecución","Decide por ti: elimina una categoría entera de comentarios de revisión"], a: 2,
      w: "Misma filosofía que `gofmt`. El formato deja de ser una opinión y pasa a ser una herramienta." },
    { q: "¿Para qué sirve un linter como Ruff o flake8?",
      o: ["Detectar problemas que el intérprete no ve hasta ejecutar: imports sin usar, variables indefinidas, patrones sospechosos","Formatear el código","Ejecutar los tests"], a: 0,
      w: "En un lenguaje dinámico esto importa más: sin linter, un nombre mal escrito no se descubre hasta que se ejecuta esa rama." },
  ],

  "python-primer-programa": [
    { q: "¿Qué hace `if __name__ == \"__main__\":`?",
      o: ["Declara la función principal","Ejecuta ese bloque solo al lanzar el fichero directamente, no al importarlo","Comprueba que el módulo está instalado"], a: 1,
      w: "Al importar, Python ejecuta todo el cuerpo del módulo. Este guardia evita que importar tu script dispare efectos colaterales." },
    { q: "¿Qué delimita un bloque en Python?",
      o: ["Las llaves","El punto y coma","La indentación, que es sintaxis y no estilo"], a: 2,
      w: "Por eso mezclar tabuladores y espacios da error: no es una manía del linter, es que el intérprete no sabe dónde acaba el bloque." },
  ],

  "python-tipos-y-variables": [
    { q: "¿Por qué una tupla puede ser clave de un diccionario y una lista no?",
      o: ["Porque es inmutable y por tanto hasheable","Porque la tupla es más pequeña","Porque la lista admite tipos mezclados"], a: 0,
      w: "Ojo: una tupla que contenga una lista deja de ser hasheable, porque su contenido sí puede cambiar." },
    { q: "Asignas `b = a` con una lista y al modificar `b` cambia `a`.",
      o: ["Es un bug","Ambas apuntan al mismo objeto: para copiar hay que hacerlo explícitamente","Solo pasa con listas de objetos"], a: 1,
      w: "Python asigna referencias. Con inmutables no se nota porque no puedes modificarlos in situ." },
  ],

  "python-control-de-flujo": [
    { q: "¿Qué valores se evalúan como falsos en Python además de `False`?",
      o: ["Solo `None`","Ninguno más","0, cadenas vacías, listas y diccionarios vacíos, y `None`"], a: 2,
      w: "De ahí que `if lista:` sea idiomático para «si no está vacía», y también que `if valor:` falle cuando 0 es un valor legítimo." },
    { q: "¿Qué hace el `else` de un `for`?",
      o: ["Se ejecuta al terminar el bucle sin `break`","Se ejecuta si el bucle no itera ninguna vez","Es un error de sintaxis"], a: 0,
      w: "Es de lo más confuso del lenguaje. Se usa para el patrón «buscar y, si no se encontró, hacer algo»." },
  ],

  "python-funciones": [
    { q: "`def add(x, l=[])` y la lista va acumulando entre llamadas.",
      o: ["Es un bug del intérprete","El valor por defecto se evalúa una vez, al definir la función: se usa `None` y se crea dentro","Hay que declararla global"], a: 1,
      w: "Es de los fallos que más se repiten en Python, y no da ningún aviso: simplemente el comportamiento es otro." },
    { q: "¿Qué son `*args` y `**kwargs`?",
      o: ["Punteros","Marcadores de tipo","Recogen argumentos posicionales y con nombre en número variable"], a: 2,
      w: "Útiles para envolver funciones (decoradores), y peligrosos en una API pública: la firma deja de decir qué se acepta." },
  ],

  "python-clases-y-oop": [
    { q: "¿Qué significa el guion bajo inicial en `_atributo`?",
      o: ["Una convención: «esto es interno», pero se puede acceder igual","Que es privado y el intérprete lo protege","Que es una constante"], a: 0,
      w: "Python confía en el acuerdo, no en el compilador. El doble guion bajo activa name mangling, que tampoco es privacidad real." },
    { q: "¿Qué aporta `@dataclass`?",
      o: ["Hace la clase inmutable","Genera `__init__`, `__repr__` y comparadores a partir de los atributos declarados","Valida los tipos en tiempo de ejecución"], a: 1,
      w: "La validación en ejecución es cosa de Pydantic. `@dataclass` solo te ahorra el código repetitivo." },
  ],

  "python-modulos-y-paquetes": [
    { q: "¿Qué diferencia un import absoluto de uno relativo?",
      o: ["El relativo es más rápido","El relativo solo vale en tests","El absoluto parte de la raíz del proyecto; el relativo (`from . import x`) del paquete actual"], a: 2,
      w: "Los absolutos se recomiendan por legibilidad: dicen de dónde viene cada cosa sin saber dónde estás." },
    { q: "Un import circular entre dos módulos.",
      o: ["Suele indicar que las responsabilidades están mal repartidas: hay que extraer lo común","Python lo resuelve solo","Se arregla importando dentro de la función"], a: 0,
      w: "Importar dentro de la función lo esconde y funciona, pero el problema de diseño sigue ahí." },
  ],

  "python-comprehensions-y-generadores": [
    { q: "Procesas un fichero de diez millones de líneas y te quedas sin memoria.",
      o: ["Hay que aumentar el límite del intérprete","Estás construyendo una lista: con un generador el uso de memoria se mantiene constante","Hay que leer el fichero por bloques manualmente"], a: 1,
      w: "El generador produce bajo demanda. A cambio, solo se puede recorrer una vez." },
    { q: "¿Cuándo NO conviene una comprehension?",
      o: ["Cuando itera más de 100 elementos","Cuando el resultado es un diccionario","Cuando anida varios `for` e `if` y deja de leerse: ahí gana el bucle explícito"], a: 2,
      w: "La comprehension es legible mientras cabe de un vistazo; a partir de ahí es un bucle escrito en una línea." },
  ],

  "python-decoradores": [
    { q: "¿Qué es exactamente `@decorador` sobre una función?",
      o: ["Azúcar para `f = decorador(f)`","Una anotación que lee el intérprete","Una comprobación de tipos"], a: 0,
      w: "Entenderlo así explica todo lo demás, incluidos los decoradores con parámetros, que son una función que devuelve un decorador." },
    { q: "Tras decorar una función, su `__name__` es `wrapper`.",
      o: ["Es inevitable","Falta `functools.wraps` en el decorador","Hay que renombrarla a mano"], a: 1,
      w: "Sin él, la función envuelta pierde nombre y docstring, y eso rompe herramientas que se apoyan en la introspección." },
  ],

  "python-context-managers": [
    { q: "¿Qué garantiza `with open(...) as f`?",
      o: ["Que el fichero se lee entero","Que nadie más puede escribir","Que se cierra al salir del bloque, incluso si salta una excepción"], a: 2,
      w: "Es un `try/finally` con nombre. Sirve para conexiones, locks y transacciones, no solo para ficheros." },
    { q: "¿Cómo se escribe un context manager propio de forma rápida?",
      o: ["Con `@contextlib.contextmanager` y un `yield` en medio","Heredando de `ContextManager`","Implementando `__init__` y `__del__`"], a: 0,
      w: "Lo de antes del `yield` es la entrada y lo de después la salida; con `try/finally` alrededor si hay que limpiar pase lo que pase." },
  ],

  "python-tipado-con-mypy": [
    { q: "Anotas los tipos y en ejecución pasa un valor del tipo equivocado sin quejarse.",
      o: ["Falta activar el modo estricto del intérprete","Es lo normal: Python ignora las anotaciones en ejecución; quien las comprueba es mypy, antes","Las anotaciones están mal escritas"], a: 1,
      w: "Por eso mypy y Pydantic se complementan: uno valida antes de ejecutar, el otro en la frontera de entrada de datos." },
    { q: "¿Qué ganas anotando tipos en un proyecto Python grande?",
      o: ["Rendimiento","Menos memoria","Que el editor y mypy detecten errores sin ejecutar, y que las firmas documenten de verdad"], a: 2,
      w: "En un lenguaje dinámico, muchos errores solo aparecen al recorrer esa rama concreta. Las anotaciones los adelantan." },
  ],

  "python-fastapi-intro": [
    { q: "Declaras un parámetro como `int` en un endpoint de FastAPI y llega `\"abc\"`.",
      o: ["FastAPI devuelve un 422 sin que escribas validación","Llega como string","Se convierte a 0"], a: 0,
      w: "La validación sale de los tipos que ya declaraste, y de ahí también el esquema OpenAPI y la documentación." },
    { q: "¿Qué aporta el sistema de dependencias (`Depends`) de FastAPI?",
      o: ["Gestiona los paquetes instalados","Inyecta y reutiliza cosas como la sesión de BD o el usuario autenticado, y las hace sustituibles en tests","Controla el orden de arranque"], a: 1,
      w: "Es inyección de dependencias con otra sintaxis, y su mayor valor está justo en poder sustituirlas al testear." },
  ],

  "python-pydantic": [
    { q: "¿Qué diferencia hay entre las anotaciones de mypy y un modelo Pydantic?",
      o: ["Ninguna, Pydantic usa mypy","Pydantic solo sirve para JSON","mypy comprueba antes de ejecutar; Pydantic valida y convierte en tiempo de ejecución"], a: 2,
      w: "Por eso Pydantic se usa en la frontera (entrada HTTP, ficheros de configuración), donde los datos vienen de fuera y no te fías." },
    { q: "¿Dónde tiene más sentido usar Pydantic?",
      o: ["En los bordes: entrada de la API, configuración, mensajes de cola","En toda clase del proyecto","Solo en los tests"], a: 0,
      w: "Dentro del dominio suele sobrar: si el dato ya entró validado, volver a validarlo en cada capa es ruido." },
  ],

  "python-sqlalchemy-async": [
    { q: "Usas SQLAlchemy async pero el driver es síncrono.",
      o: ["Funciona igual","Bloqueas el event loop: hace falta un driver async como asyncpg","SQLAlchemy lo convierte automáticamente"], a: 1,
      w: "Es el error típico al migrar a async: la librería es asíncrona pero la llamada de red sigue siendo bloqueante." },
    { q: "¿Qué problema da una sesión de SQLAlchemy compartida entre peticiones?",
      o: ["Va más rápido pero gasta memoria","Ninguno si es de solo lectura","No es segura: acumula estado y puede mezclar datos entre peticiones"], a: 2,
      w: "La sesión es por unidad de trabajo. En FastAPI se entrega por dependencia y se cierra al terminar la petición." },
  ],

  "python-testing-pytest": [
    { q: "¿Cómo recibe un test su fixture en pytest?",
      o: ["Pidiéndola por nombre en la firma del test","Importándola","Con un decorador"], a: 0,
      w: "Y con `yield` dentro de la fixture haces montaje y desmontaje en el mismo sitio, que es lo que la hace tan cómoda." },
    { q: "¿Qué controla el `scope` de una fixture?",
      o: ["Qué tests pueden usarla","Cada cuánto se crea: por test, por módulo o por sesión","Su orden de ejecución"], a: 1,
      w: "Un scope amplio ahorra tiempo en cosas caras, y a cambio comparte estado: ahí es donde aparecen las dependencias de orden." },
  ],

  "python-async-await": [
    { q: "Llamas a `time.sleep(5)` dentro de una corrutina.",
      o: ["Solo se pausa esa corrutina","Se ejecuta en un hilo aparte","Bloqueas el event loop entero: hay que usar `asyncio.sleep`"], a: 2,
      w: "Cualquier llamada síncrona larga para el bucle. Para código bloqueante inevitable está `asyncio.to_thread`." },
    { q: "Llamas a una función `async` sin `await`.",
      o: ["Obtienes un objeto corrutina y no se ejecuta nada; Python suele avisar","Se ejecuta igual","Da error de sintaxis"], a: 0,
      w: "El aviso de «coroutine was never awaited» es justo eso, y es fácil pasarlo por alto entre el resto de la salida." },
  ],

  "python-docker": [
    { q: "¿Por qué se usa `--no-cache-dir` al instalar con pip en un Dockerfile?",
      o: ["Para forzar la última versión","Para no dejar la caché de pip dentro de la imagen, que solo abulta","Para acelerar la instalación"], a: 1,
      w: "Detalle pequeño con efecto real: esa caché no sirve de nada en la imagen final y puede sumar decenas de megas." },
    { q: "¿Por qué conviene ejecutar como usuario no root dentro del contenedor?",
      o: ["Para que arranque más rápido","Porque Docker lo exige","Para limitar el daño si alguien consigue ejecutar código dentro"], a: 2,
      w: "Es defensa en profundidad: el contenedor aísla, pero no conviene que lo que corre dentro tenga todos los privilegios." },
  ],

  "python-configuracion": [
    { q: "¿Dónde van los secretos de una app en producción?",
      o: ["En variables de entorno o un gestor de secretos, fuera del repositorio","En un fichero versionado con el código","Codificados en base64 en el código"], a: 0,
      w: "Base64 es codificación, no cifrado. El principio es separar configuración de código: lo que cambia entre entornos, fuera." },
    { q: "¿Qué aporta `BaseSettings` de Pydantic sobre leer `os.environ` a mano?",
      o: ["Nada, es lo mismo","Tipa, valida y da valores por defecto, y falla al arrancar si falta algo obligatorio","Cifra las variables"], a: 1,
      w: "Fallar al arrancar es la gracia: mejor que reventar a media petición porque faltaba una variable." },
  ],

  "python-a-produccion": [
    { q: "¿Por qué no se usa el servidor de desarrollo en producción?",
      o: ["Porque no soporta HTTPS","Porque no admite variables de entorno","Porque no está pensado para concurrencia ni robustez: se usa un ASGI/WSGI de verdad como uvicorn o gunicorn"], a: 2,
      w: "El servidor de desarrollo prioriza recarga automática y mensajes de error, justo lo contrario de lo que quieres fuera." },
    { q: "¿Cómo se registran los logs de una app en un contenedor?",
      o: ["A stdout, y que la plataforma los recoja","En un fichero dentro del contenedor","Enviándolos por correo"], a: 0,
      w: "Escribir a fichero dentro del contenedor es escribir en algo efímero: al recrearlo, los logs se van con él." },
  ],

  "rust-que-es": [
    { q: "¿Qué promete Rust que lo distingue?",
      o: ["Compilación más rápida que C","Seguridad de memoria sin recolector de basura, comprobada al compilar","Sintaxis más simple"], a: 1,
      w: "Ni recolector ni fugas ni carreras de datos: el compilador lo verifica antes, y ese es el trato (y el coste de aprendizaje)." },
    { q: "¿Para qué proyectos NO es la mejor elección?",
      o: ["Sistemas embebidos","Herramientas de línea de comandos","Un CRUD sencillo donde el tiempo de desarrollo importa más que el rendimiento"], a: 2,
      w: "Pelearse con el borrow checker para un CRUD es pagar un precio sin cobrar el beneficio." },
  ],

  "rust-entorno-docker": [
    { q: "¿Qué se cachea en un build de Rust para no recompilar todo cada vez?",
      o: ["Las dependencias: copiar `Cargo.toml` y `Cargo.lock` y compilarlas antes del código","El binario","El directorio target completo"], a: 0,
      w: "Compilar dependencias en Rust es lento de verdad, así que este orden en el Dockerfile ahorra minutos por build." },
    { q: "¿Qué es `cargo add` equivalente a hacer en PHP?",
      o: ["`composer install`","`composer require`: añade la crate al Cargo.toml y actualiza el lock","`composer update`"], a: 1,
      w: "`cargo build` sería el equivalente a `composer install`: instala lo que dice el lock sin re-resolver." },
  ],

  "rust-editores": [
    { q: "¿Qué es rust-analyzer?",
      o: ["Un linter de estilo","El compilador","El servidor de lenguaje: autocompletado, tipos inferidos y errores en el editor"], a: 2,
      w: "En Rust importa especialmente: ver el tipo inferido y el error del borrow checker mientras escribes acorta muchísimo el aprendizaje." },
    { q: "¿Qué hace `cargo clippy` que `cargo build` no?",
      o: ["Sugiere formas más idiomáticas de escribir código que ya compila","Compila más rápido","Formatea el código"], a: 0,
      w: "Formatear es `cargo fmt`. Clippy es de las mejores formas de aprender el estilo de Rust: te corrige mientras avanzas." },
  ],

  "rust-primer-programa": [
    { q: "En Rust, `let x = 5;` y luego `x = 6;`.",
      o: ["Funciona","No compila: las variables son inmutables por defecto, hace falta `let mut`","Da un warning"], a: 1,
      w: "La inmutabilidad por defecto es una decisión de diseño: mutar es la excepción y se declara explícitamente." },
    { q: "¿Qué es el shadowing en Rust?",
      o: ["Un error de ámbito","Copiar una variable","Volver a declarar con `let` un nombre existente, incluso cambiando el tipo"], a: 2,
      w: "Es distinto de mutar: creas una variable nueva que tapa la anterior. Muy usado al convertir un valor conservando el nombre." },
  ],

  "rust-tipos-y-variables": [
    { q: "¿Qué diferencia hay entre `String` y `&str`?",
      o: ["`String` posee su memoria y crece; `&str` es una vista prestada de un texto que vive en otro sitio","Ninguna, son alias","`&str` es más moderno"], a: 0,
      w: "Es de las primeras cosas que chocan, y es una consecuencia directa del modelo de propiedad." },
    { q: "Rust no deja sumar un `i32` y un `u8` directamente.",
      o: ["Es una limitación temporal","No hay conversiones implícitas: hay que convertir a propósito","Hay que activar una feature"], a: 1,
      w: "Evita la clase de bugs donde una conversión silenciosa trunca o cambia el signo de un valor." },
  ],

  "rust-control-de-flujo": [
    { q: "En Rust, `let x = if cond { 1 } else { 2 };`.",
      o: ["No compila, `if` no devuelve valor","Hace falta un `return`","Funciona: `if` es una expresión"], a: 2,
      w: "Casi todo en Rust es expresión, incluidos `match` y los bloques. Por eso la última línea sin punto y coma es el valor." },
    { q: "¿Qué diferencia a `loop` de `while true`?",
      o: ["`loop` puede devolver un valor con `break valor`, y el compilador sabe que no termina solo","Ninguna","`loop` es más rápido"], a: 0,
      w: "Ese detalle permite usarlo como expresión, típico en reintentos: sales del bucle devolviendo el resultado." },
  ],

  "rust-funciones": [
    { q: "¿Qué captura una closure en Rust?",
      o: ["Siempre una copia","Lo que necesite: por referencia, por referencia mutable o por valor, y el compilador lo deduce","Solo variables globales"], a: 1,
      w: "Con `move` fuerzas la captura por valor, que es lo que hace falta al pasarla a otro hilo." },
    { q: "¿Por qué la última expresión de una función va sin punto y coma?",
      o: ["Por estilo","Es opcional, da igual","Porque el punto y coma la convierte en sentencia y descarta el valor"], a: 2,
      w: "Es la causa del error «expected i32, found ()» que todo el mundo se come al empezar." },
  ],

  "rust-structs-y-enums": [
    { q: "¿Qué hace potentes a los enums de Rust frente a los de otros lenguajes?",
      o: ["Que cada variante puede llevar datos propios, como `Some(T)` o `Err(E)`","Que son más rápidos","Que se pueden extender"], a: 0,
      w: "Es lo que permite que `Option` y `Result` sean simples enums de la librería estándar y no magia del compilador." },
    { q: "¿Qué representa `Option<T>`?",
      o: ["Un valor que puede fallar con un error","Un valor que puede estar (`Some`) o no (`None`)","Un puntero que puede ser nulo"], a: 1,
      w: "Es la respuesta de Rust al null: la ausencia se codifica en el tipo y el compilador te obliga a tratarla." },
  ],

  "rust-pattern-matching": [
    { q: "Añades una variante a un enum y varios `match` dejan de compilar.",
      o: ["Es un problema, hay que añadir `_` en todos","Hay que recompilar limpio","Es la ventaja: el compilador te da la lista de sitios donde falta tratarla"], a: 2,
      w: "Poner `_` a la ligera renuncia justo a esa red: convierte una refactorización guiada en un fallo silencioso." },
    { q: "¿Qué permite `if let Some(x) = opcion`?",
      o: ["Tratar solo un caso sin escribir el `match` completo","Comprobar sin extraer","Convertir Option en Result"], a: 0,
      w: "Es azúcar para un match con un solo brazo interesante. Y existe `let else` para el caso contrario: salir pronto si no encaja." },
  ],

  "rust-traits": [
    { q: "¿Puedes implementar un trait para un tipo que no es tuyo?",
      o: ["No, nunca","Sí, siempre que el trait sea tuyo (regla del huérfano)","Solo con macros"], a: 1,
      w: "La regla evita que dos crates implementen lo mismo para el mismo tipo y el compilador no sepa cuál usar." },
    { q: "¿Qué diferencia hay entre `impl Trait` y `dyn Trait`?",
      o: ["Ninguna, son sintaxis alternativas","`dyn` es más rápido","`impl` se resuelve al compilar (estático); `dyn` en ejecución, con coste de indirección"], a: 2,
      w: "El estático genera una versión por tipo (más binario, más rápido); el dinámico permite colecciones heterogéneas." },
  ],

  "rust-ownership": [
    { q: "Asignas un `String` a otra variable y usas la primera después.",
      o: ["No compila: la propiedad se movió","Funciona, se copia","Compila con un warning"], a: 0,
      w: "Con tipos `Copy` (enteros, bool, char) sí se copia y ambas siguen vivas. `String` posee memoria del heap y por eso se mueve." },
    { q: "¿Quién libera la memoria en Rust?",
      o: ["Un recolector de basura","El compilador inserta la liberación cuando el propietario sale de ámbito","El programador, con free"], a: 1,
      w: "Ni recolector ni liberación manual: es determinista y sin coste en ejecución. Ese es el gran truco del lenguaje." },
  ],

  "rust-borrowing": [
    { q: "¿Cuántas referencias mutables simultáneas admite Rust sobre el mismo dato?",
      o: ["Las que quieras en el mismo hilo","Dos: lectura y escritura","Una como máximo, y ninguna si hay alguna inmutable viva"], a: 2,
      w: "De esa regla salen gratis la ausencia de carreras de datos y de invalidación de iteradores." },
    { q: "¿Por qué no puedes modificar un vector mientras lo recorres?",
      o: ["Porque el iterador mantiene un préstamo, y modificar exigiría otro mutable a la vez","Por rendimiento","Porque el índice se descoloca"], a: 0,
      w: "En otros lenguajes esto compila y revienta en ejecución (o corrompe el recorrido). Aquí no llega a compilar." },
  ],

  "rust-lifetimes": [
    { q: "¿Qué hace un lifetime explícito como `<'a>`?",
      o: ["Alarga la vida de la variable","Describe cómo se relacionan las duraciones de varias referencias, algo que el compilador no puede inferir solo","Marca que va en el heap"], a: 1,
      w: "No cambia cuánto vive nada: solo documenta una relación para que el compilador pueda verificarla." },
    { q: "La mayoría del código Rust no lleva lifetimes escritos. ¿Por qué?",
      o: ["Porque son opcionales y se ignoran","Porque solo hacen falta en structs","Por elisión: en los casos comunes el compilador los infiere"], a: 2,
      w: "Aparecen cuando devuelves una referencia y hay varias entradas candidatas: ahí el compilador necesita que se lo digas." },
  ],

  "rust-smart-pointers": [
    { q: "Necesitas varios propietarios de un dato en un solo hilo.",
      o: ["`Rc<T>`, que lleva un contador de referencias","`Box<T>`","`Arc<T>`"], a: 0,
      w: "`Arc` es el equivalente para varios hilos, con contador atómico y por tanto algo más caro." },
    { q: "¿Para qué sirve `RefCell<T>`?",
      o: ["Para compartir entre hilos","Para mover la comprobación de préstamos a tiempo de ejecución, permitiendo mutar tras una referencia inmutable","Para evitar copias"], a: 1,
      w: "El precio es que si rompes la regla, el programa hace panic en ejecución en vez de no compilar." },
  ],

  "rust-concurrencia": [
    { q: "¿Qué garantiza el marcador `Send`?",
      o: ["Que el tipo se puede enviar por un canal sin bloquear","Que se puede compartir por referencia","Que su propiedad se puede transferir a otro hilo con seguridad"], a: 2,
      w: "Compartir referencias entre hilos es `Sync`. El compilador deduce ambos solo, y por eso las carreras se detectan al compilar." },
    { q: "¿Por qué se dice que en Rust la concurrencia es «sin miedo»?",
      o: ["Porque las reglas de propiedad y préstamo impiden las carreras de datos en tiempo de compilación","Porque tiene un runtime que lo gestiona","Porque usa procesos en vez de hilos"], a: 0,
      w: "No elimina los deadlocks ni los errores de lógica: elimina una categoría concreta, la de acceso concurrente sin sincronizar." },
  ],

  "rust-async-tokio": [
    { q: "Llamas a una función `async` y no haces `.await`.",
      o: ["Se ejecuta en segundo plano","No pasa nada: los Future de Rust son perezosos","Se ejecuta de forma síncrona"], a: 1,
      w: "En otros lenguajes una promesa arranca al crearse. Aquí hace falta que alguien la sondee: un `.await` o un `spawn`." },
    { q: "¿Por qué hace falta un runtime como Tokio?",
      o: ["Para compilar el código async","Para gestionar la memoria","Porque Rust define `async`/`await` en el lenguaje pero no incluye el ejecutor"], a: 2,
      w: "Es coherente con la filosofía: el lenguaje da la abstracción y tú eliges el runtime según el caso." },
  ],

  "rust-errores": [
    { q: "¿Qué hace el operador `?` al final de una expresión `Result`?",
      o: ["Devuelve el error al llamante y, si no lo hay, extrae el valor","Ignora el error","Lanza un panic"], a: 0,
      w: "Quien hace panic es `unwrap()`, que es justo lo que `?` te evita en código de producción." },
    { q: "¿Cuándo es aceptable `unwrap()`?",
      o: ["Nunca","En prototipos, tests o cuando puedes demostrar que el caso es imposible","Siempre que el error sea improbable"], a: 1,
      w: "«Improbable» no basta: en producción, improbable por un millón de peticiones es todos los días." },
  ],

  "rust-cargo-y-crates": [
    { q: "¿Se versiona `Cargo.lock`?",
      o: ["Siempre","Nunca","En binarios sí, para que todos compilen lo mismo; en librerías se suele omitir"], a: 2,
      w: "Quien usa tu librería resolverá su propio grafo, así que fijar el tuyo no le sirve de nada." },
    { q: "¿Qué son las features de una crate?",
      o: ["Partes opcionales que se activan al declarar la dependencia, para no arrastrar lo que no usas","Versiones alternativas","Ramas de desarrollo"], a: 0,
      w: "Es lo que permite que una crate sirva tanto en un servidor como en un embebido sin sistema operativo." },
  ],

  "rust-axum": [
    { q: "¿Qué son los extractors en Axum?",
      o: ["Middlewares","Tipos en la firma del handler que sacan y validan datos de la petición","Plantillas de respuesta"], a: 1,
      w: "Declaras `Json<MiTipo>` o `Path<u32>` y el framework se encarga: si no encaja, el handler ni se ejecuta." },
    { q: "¿Cómo comparte Axum estado entre handlers, como un pool de conexiones?",
      o: ["Con variables globales","Con un singleton","Con un estado compartido que se inyecta como extractor, típicamente dentro de un `Arc`"], a: 2,
      w: "El `Arc` es justo por lo de antes: varios hilos atendiendo peticiones necesitan propiedad compartida y segura." },
  ],

  "rust-serde-y-bd": [
    { q: "¿Qué hacen `#[derive(Serialize, Deserialize)]`?",
      o: ["Generan en tiempo de compilación el código para convertir a y desde JSON u otros formatos","Validan el tipo","Registran el tipo en un contenedor"], a: 0,
      w: "Al generarse al compilar, no hay reflexión ni coste en ejecución: es el enfoque habitual de Rust." },
    { q: "¿Qué aporta `sqlx` frente a un ORM clásico?",
      o: ["Genera el esquema automáticamente","Comprueba tus consultas SQL contra la base en tiempo de compilación","Evita escribir SQL"], a: 1,
      w: "Escribes SQL de verdad y aun así una columna mal escrita no llega a producción: falla al compilar." },
  ],

  "rust-testing-y-produccion": [
    { q: "¿Dónde van los tests unitarios en Rust?",
      o: ["En el directorio `tests/`","En un fichero `test.rs`","En un `mod tests` con `#[cfg(test)]` dentro del mismo fichero"], a: 2,
      w: "Así pueden probar funciones privadas y no entran en el binario final. El directorio `tests/` es para los de integración." },
    { q: "¿Por qué la imagen Docker de un servicio Rust puede ser mínima?",
      o: ["Porque el binario compilado no necesita runtime: con multi-stage la imagen final solo lo lleva a él","Porque Rust comprime mucho","Porque usa menos memoria"], a: 0,
      w: "Igual que en Go. Ojo si enlazas contra glibc: ahí conviene una base con esas librerías o compilar contra musl." },
  ],


  "config-y-entornos": [
    { q: "¿Por qué la regla 12-factor dice que la configuración no es código?",
      o: ["Porque cambia más a menudo","Porque varía entre entornos: el mismo build debe poder desplegarse en todos","Porque no se puede testear"], a: 1,
      w: "La prueba es sencilla: si tuvieras que hacer público el repo mañana, ¿habría credenciales dentro? Si sí, hay configuración en el código." },
    { q: "¿Qué papel tiene de verdad un fichero `.env`?",
      o: ["Es el sitio donde va la configuración de producción","Un fichero de ejemplo que no se lee","Una comodidad para desarrollo: en producción las variables las pone la plataforma"], a: 2,
      w: "Por eso se versiona un `.env.example` con las claves y valores falsos, y nunca el `.env` real." },
  ],

  "composer": [
    { q: "¿Cuál es la diferencia entre `composer install` y `composer update`?",
      o: ["`install` obedece al lock sin resolver nada; `update` re-resuelve y reescribe el lock","`install` es para producción y `update` para desarrollo","Son sinónimos"], a: 0,
      w: "Por eso en CI y en producción siempre `install`: garantiza el mismo grafo de dependencias al byte." },
    { q: "¿Qué va al repositorio: `composer.lock` o `vendor/`?",
      o: ["Los dos","El lock sí; `vendor/` va al .gitignore porque es regenerable","Solo vendor/, el lock se genera"], a: 1,
      w: "Sin el lock, cada `install` resuelve por su cuenta y aparece el «en mi máquina funciona» de las dependencias." },
    { q: "¿Qué permite `^1.2.3` según semver?",
      o: ["Solo la 1.2.3 exacta","Cualquier versión 1.x o 2.x","Actualizaciones que no rompan compatibilidad: hasta la 2.0.0 sin llegar a ella"], a: 2,
      w: "`~1.2.3` es más restrictivo: solo permite subir el parche. Y todo esto depende de que el autor respete semver." },
  ],

  "object-calisthenics": [
    { q: "Una de las reglas es «no usar else». ¿Qué persigue?",
      o: ["Reducir el anidamiento con retornos tempranos, que hace el flujo más plano y legible","Escribir menos líneas","Mejorar el rendimiento"], a: 0,
      w: "Son ejercicios llevados al extremo a propósito: la idea no es cumplirlas siempre, es notar la incomodidad y aprender de ella." },
    { q: "«Envolver los primitivos» propone cambiar un `int $edad` por un objeto `Edad`. ¿Qué se gana?",
      o: ["Rendimiento","Que las reglas del valor (no negativa, máximo razonable) vivan en un sitio y no repartidas por todo el código","Menos memoria"], a: 1,
      w: "Es la puerta de entrada a los value objects: el tipo pasa a garantizar lo que antes comprobabas a mano en cada uso." },
  ],

  "jerga": [
    { q: "Alguien dice que un bug solo pasa en un «edge case».",
      o: ["Que ocurre en el borde de la pantalla","Que está en el código del frontend","Que ocurre en un caso límite poco frecuente, no en el flujo habitual"], a: 2,
      w: "El caso límite es donde vive la mayor parte de los bugs de verdad: lista vacía, cero elementos, el último día del mes." },
    { q: "¿Qué es la deuda técnica?",
      o: ["El coste futuro de una decisión que hoy acelera: no es siempre mala, pero hay que saber que se contrae","El dinero que cuesta mantener el software","Los bugs pendientes de arreglar"], a: 0,
      w: "La metáfora funciona porque paga intereses: cuanto más tardas en devolverla, más caro sale cada cambio." },
  ],

  "extensiones-php": [
    { q: "¿Qué es una extensión de PHP?",
      o: ["Una librería instalada con Composer","Un módulo en C que se enchufa al motor y se carga al arrancar","Un fichero .php que se incluye automáticamente"], a: 1,
      w: "De ahí que se instalen en el sistema (o en la imagen Docker) y no con el gestor de paquetes del proyecto." },
    { q: "Tu código falla con «Class Redis not found» aunque instalaste el paquete de Composer.",
      o: ["Falta el autoload","Hay que reiniciar el navegador","Probablemente falta la extensión del sistema: el cliente de Composer no la sustituye"], a: 2,
      w: "Es la confusión habitual: `predis` es una implementación en PHP puro y `ext-redis` es la extensión en C. No son lo mismo." },
  ],

  "php-fpm": [
    { q: "¿Qué es un SAPI en PHP?",
      o: ["La interfaz por la que el motor se comunica con su entorno: CLI, FPM, mod_php…","Un framework","Una extensión de rendimiento"], a: 0,
      w: "Explica por qué el mismo script se comporta distinto por CLI que por web: cambia el SAPI, y con él límites y configuración." },
    { q: "¿Qué modo de pool de FPM conviene si la carga es estable y quieres latencia predecible?",
      o: ["ondemand","static: procesos fijos, sin coste de arranque","dynamic siempre"], a: 1,
      w: "`ondemand` ahorra memoria en servicios poco usados a cambio de pagar el arranque; `dynamic` es el término medio." },
  ],

  "memoria-php": [
    { q: "¿Qué limita de verdad `memory_limit`?",
      o: ["La memoria del servidor","La de todos los procesos de FPM juntos","La que puede usar un único script en una petición"], a: 2,
      w: "Por eso multiplicarlo por el número de procesos de FPM es la cuenta que hay que hacer para no quedarte sin RAM." },
    { q: "¿Qué es copy-on-write en PHP?",
      o: ["Que al asignar una variable no se copia el valor hasta que uno de los dos lo modifica","Un modo de escritura en disco","Una técnica de caché"], a: 0,
      w: "Es lo que hace que pasar arrays grandes por valor no sea tan caro como parece… hasta que la función los modifica." },
  ],

  "workers-php": [
    { q: "«Worker» significa dos cosas distintas en PHP. ¿Cuáles?",
      o: ["Los hilos y los procesos","Los procesos de FPM que atienden peticiones, y los consumidores de una cola de trabajos","Los de desarrollo y los de producción"], a: 1,
      w: "Confundirlos genera conversaciones cruzadas: «subimos los workers» no significa lo mismo en cada caso." },
    { q: "Pasas de FPM a un worker long-running con Swoole o RoadRunner. ¿Qué deja de perdonarse?",
      o: ["Los errores de sintaxis","Las consultas lentas","El estado global y los servicios con estado: ya no se limpian entre peticiones"], a: 2,
      w: "En FPM cada petición arrancaba de cero. En un proceso que vive horas, lo que guardes puede acabar en la petición de otro usuario." },
  ],

  "redis-a-fondo": [
    { q: "¿Por qué se dice que Redis es un servidor de estructuras de datos y no solo una caché?",
      o: ["Porque ofrece listas, sets, sorted sets y hashes con operaciones atómicas sobre ellos","Porque persiste en disco","Porque admite SQL"], a: 0,
      w: "Un sorted set resuelve un ranking en una línea; una lista, una cola. Usarlo solo como almacén clave-valor desaprovecha la mitad." },
    { q: "¿Qué operación usarías para un contador de visitas concurrente?",
      o: ["GET, sumar en PHP y SET","INCR, que es atómico","Una transacción con MULTI"], a: 1,
      w: "El leer-sumar-guardar desde la aplicación pierde incrementos con concurrencia; `INCR` lo hace en el servidor sin carrera." },
  ],

  "rabbitmq": [
    { q: "¿Quién decide a qué cola llega un mensaje en RabbitMQ?",
      o: ["El productor, indicando la cola","El consumidor, al suscribirse","El exchange, según su tipo y los bindings"], a: 2,
      w: "El productor publica en un exchange, no en una cola. Entenderlo es lo que permite fan-out y enrutado por clave." },
    { q: "¿Qué hace falta para que un mensaje sobreviva a un reinicio del broker?",
      o: ["Cola durable, mensaje persistente y confirmaciones del publicador: las tres cosas","Solo que la cola sea durable","Nada, RabbitMQ persiste siempre"], a: 0,
      w: "Es el fallo clásico: cola durable pero mensajes no persistentes, y al reiniciar la cola sigue ahí… vacía." },
  ],

  "opcache": [
    { q: "¿Qué cachea OPcache exactamente?",
      o: ["El resultado de las consultas","Los opcodes compilados de tus ficheros PHP, en memoria compartida","El HTML generado"], a: 1,
      w: "Sin él, PHP relee y recompila cada fichero en cada petición. Es la optimización de mayor impacto y menor esfuerzo que existe en PHP." },
    { q: "Despliegas y los usuarios siguen viendo el código viejo.",
      o: ["Falta limpiar la caché del navegador","Hay que reiniciar la base de datos","OPcache sigue sirviendo los opcodes anteriores: hay que invalidarla al desplegar"], a: 2,
      w: "Con `validate_timestamps=0` en producción ganas rendimiento a cambio de tener que invalidar explícitamente en cada despliegue." },
  ],

  "preload": [
    { q: "¿Qué añade preload sobre OPcache?",
      o: ["Deja las clases cargadas y enlazadas en memoria desde el arranque, sin pasar por el autoload","Cachea también las consultas","Comprime los opcodes"], a: 0,
      w: "OPcache evita recompilar; preload evita además resolver y enlazar. Encaja bien con el código estable de un framework." },
    { q: "¿Qué implica cambiar una clase precargada?",
      o: ["Nada, se recarga sola","Hay que reiniciar PHP-FPM: lo precargado vive mientras vive el proceso","Hay que limpiar la caché del navegador"], a: 1,
      w: "Por eso se precarga lo que no cambia (el framework) y no el código de tu aplicación en desarrollo." },
  ],

  "cc-agente-por-dentro": [
    { q: "¿Quién ejecuta el comando cuando el agente «corre los tests»?",
      o: ["El modelo, directamente sobre tu shell","El proveedor del modelo, en su servidor","El harness (Claude Code) en tu máquina, tras comprobar los permisos"], a: 2,
      w: "El modelo solo emite la petición con formato. Todo lo que ocurre en tu máquina lo ejecuta el harness — y por eso los permisos viven ahí." },
    { q: "¿Cómo se entera el modelo del resultado de una herramienta?",
      o: ["Vuelve a su contexto como texto, igual que un mensaje tuyo","Lo consulta cuando lo necesita","No se entera: el harness decide el siguiente paso"], a: 0,
      w: "Todo es texto en la ventana: por eso puede reaccionar a un test que falla, y por eso una salida ruidosa ocupa contexto el resto de la sesión." },
    { q: "Quieres que el agente no toque nunca un directorio. ¿Dónde lo garantizas?",
      o: ["Pidiéndoselo al principio de cada sesión","En la configuración de permisos del harness: un if determinista gana a una instrucción probabilística","Repitiéndolo en cada mensaje importante"], a: 1,
      w: "Las instrucciones al modelo se cumplen casi siempre; las reglas del harness, siempre. La seguridad se pone en la capa determinista." },
  ],
  "cc-contexto-finito": [
    { q: "¿Qué suele ocupar más contexto en una sesión de trabajo real?",
      o: ["El system prompt del harness","Tus mensajes","Los resultados de herramientas: ficheros leídos y salidas de comandos"], a: 2,
      w: "Por eso la economía de contexto va sobre todo de acotar lecturas y salidas, no de escribir mensajes más cortos." },
    { q: "¿Cuál es el síntoma típico de un contexto degradado por compactación?",
      o: ["El agente re-propone cosas ya descartadas o re-pregunta lo decidido","Las respuestas llegan más lentas","El agente deja de poder usar herramientas"], a: 0,
      w: "El resumen conserva la idea general y pierde el detalle — y el detalle era justo la decisión que tomasteis hace una hora." },
    { q: "Para un fichero de 2.000 líneas del que necesitas una función, ¿qué patrón gasta menos contexto?",
      o: ["Leerlo entero para tener toda la información","Pedir al agente que lo resuma primero","wc -l para el tamaño, grep -n para localizar, y leer solo el rango relevante"], a: 2,
      w: "Localizar antes de leer: la información que no entra en la mesa no desplaza a la que ya estaba." },
    { q: "Una decisión de diseño debe sobrevivir a la sesión. ¿Dónde tiene que acabar?",
      o: ["En la conversación, bien argumentada","En un fichero del repo (note de estado o rule)","En el resumen de compactación"], a: 1,
      w: "El contexto se pierde; los ficheros no. Si la siguiente sesión no podría continuar sin preguntarte, falta escribirlo a disco." },
  ],
  "cc-plan-y-verificacion": [
    { q: "¿Qué garantiza el modo plan de Claude Code mientras está activo?",
      o: ["Que el plan resultante será correcto","Que el agente puede leer y buscar pero no escribir: la escritura se desbloquea con tu aprobación","Que la sesión gastará menos tokens"], a: 1,
      w: "Es la frontera de permisos al servicio del método: explorar sin tocar, y tú decides cuándo se pasa a implementar." },
    { q: "¿Cuál de estas señales delata un plan NO aprobable?",
      o: ["Nombra ficheros y funciones concretas del repo","Dice explícitamente qué no va a tocar","Sus pasos valdrían para cualquier proyecto: no cita nada del código real"], a: 2,
      w: "Un plan genérico es señal de que no hubo exploración: estás aprobando deseos, no un plan." },
    { q: "El agente dice «he corregido el servicio, los tests deberían pasar». ¿Qué falta?",
      o: ["Ejecutar la suite y ver la salida real: verificar es ejecutar, no predecir","Nada, si el diff se ve razonable","Pedirle que explique el cambio"], a: 0,
      w: "«Debería funcionar» no es una comprobación. La salida real del comando es la única evidencia que cuenta." },
    { q: "Los tests pasan… pero el diff muestra que el agente modificó el test, no el código. ¿Qué compruebas?",
      o: ["Que el test siga en verde en CI","Que el estilo del test siga las convenciones","Si el test debilitado sigue verificando lo mismo que antes"], a: 2,
      w: "Un agente puede «arreglar» un test aflojándolo. El verde solo vale si el contrato que verifica no se ha rebajado." },
  ],
  "cc-subagentes": [
    { q: "¿Qué recibe el agente principal cuando termina un subagente?",
      o: ["Solo el informe final: el proceso (lecturas, búsquedas) muere con el contexto del subagente","Todo el historial de herramientas del subagente","Una copia de su ventana de contexto"], a: 0,
      w: "Esa es la gracia del aislamiento: el ruido del proceso no contamina la sesión que decide." },
    { q: "¿Cuál de estas tareas es MAL candidata a subagente?",
      o: ["Una auditoría amplia de un módulo que no conoces","Un cambio de una línea que depende de decisiones tomadas en tu sesión","Tres análisis independientes, uno por módulo"], a: 1,
      w: "El subagente arranca sin tu contexto: para una tarea corta y dependiente de matices, el arranque frío cuesta más que hacerla." },
    { q: "¿Por qué un subagente revisor juzga mejor un diff que el agente que lo escribió?",
      o: ["Porque usa un modelo distinto","Porque arranca sin el sesgo de las decisiones que llevaron a ese código","Porque tiene más herramientas disponibles"], a: 1,
      w: "Quien escribió algo tiende a validar sus propias decisiones. El revisor recién llegado ve el diff con los ojos que quieres en una revisión." },
    { q: "Dos subagentes lanzados en paralelo van a editar el mismo fichero. ¿Qué significa?",
      o: ["Que el harness los serializará automáticamente","Que conviene lanzar un tercero para coordinar","Que el corte del trabajo está mal hecho: las partes no eran independientes"], a: 2,
      w: "El paralelismo solo funciona sobre tareas independientes. Compartir ficheros es la señal de que la división siguió otra lógica." },
  ],
  "cc-rules": [
    { q: "¿Cuál es el criterio de admisión para que algo entre en las rules?",
      o: ["Lo que el agente no puede deducir del código y necesita en casi toda sesión","Todo lo que describa el proyecto, cuanto más completo mejor","Los pasos detallados de cada flujo del equipo"], a: 0,
      w: "La estructura se lee con ls y los flujos son skills. Las rules guardan el criterio que no está escrito en ningún otro sitio." },
    { q: "¿Por qué conviene que cada regla lleve su porqué?",
      o: ["Para que el documento parezca más profesional","Porque se generaliza bien desde mecanismos y mal desde prohibiciones sueltas, que invitan a la excepción","Para poder auditar quién escribió cada una"], a: 1,
      w: "«No uses fetch» se interpreta; «fetch falla por CORS en file://, usa .js que asignan a un global» se obedece y enseña el patrón correcto." },
    { q: "¿Por qué unas rules de 2.000 líneas son un problema, aunque todo sea verdad?",
      o: ["Ocupan demasiado en el repositorio","El harness las rechaza por tamaño","Entran al contexto en todas las sesiones: impuesto fijo, y las diez reglas críticas se diluyen entre doscientas"], a: 2,
      w: "Se pagan siempre, apliquen o no. La válvula: regla corta en rules, detalle enlazado bajo demanda, flujos como skills." },
    { q: "Corriges al agente por segunda vez por el mismo motivo. ¿Qué toca?",
      o: ["Repetir la corrección con más énfasis","Escribir la regla (con su porqué) en las rules, en esa misma sesión","Cambiar de modelo"], a: 1,
      w: "Lo aprendido vuelve a las reglas en caliente o se pierde con el contexto. Una corrección repetida es una regla pidiendo existir." },
  ],
  "cc-skills": [
    { q: "¿Qué diferencia clave separa una skill de una rule?",
      o: ["La skill entra al contexto solo al invocarla; la rule, en todas las sesiones","La skill la escribe la herramienta y la rule el usuario","La rule puede tener comandos y la skill no"], a: 0,
      w: "Lo que aplica siempre es rule; lo que aplica «cuando hago X» es skill. Por eso una skill larga es barata y unas rules largas no." },
    { q: "¿Qué papel cumple la descripción de una skill?",
      o: ["Es documentación para humanos, el agente no la usa","Define los permisos que tendrá la skill","Es lo que el agente lee para decidir si la carga: casos concretos de uso, no un eslogan"], a: 2,
      w: "La descripción vive permanentemente en el contexto (el resto de la skill no): es el disparador, y se escribe pensando en eso." },
    { q: "¿Cuál de estos es un candidato claro a skill?",
      o: ["«Usar nombres semánticos en las variables»","El flujo de publicar contenido: plantilla → manifest → regenerar índice → validar","Una migración que harás una sola vez"], a: 1,
      w: "Pasos fijos, checklist verificable y repetición: la tríada de la skill. Lo primero es una rule; lo tercero no merece empaquetarse." },
  ],
  "cc-memoria-y-continuidad": [
    { q: "¿Cuál es la única memoria fiable entre sesiones de agente?",
      o: ["El historial de conversación de la herramienta","Los ficheros del repositorio: versionados y legibles por cualquier sesión futura","La memoria interna del modelo"], a: 1,
      w: "La conversación se pierde o se compacta; el modelo no retiene nada entre sesiones. Lo que debe sobrevivir se escribe a disco." },
    { q: "¿Qué guarda la note de estado y con qué contrato?",
      o: ["Documentación del código, actualizada al desplegar","Un diario completo de todo lo ocurrido","El estado vivo del trabajo: se lee al abrir sesión y se actualiza al cerrar cada unidad de trabajo"], a: 2,
      w: "Es un retrato del presente con contrato de lectura y escritura. Lo que envejece se archiva; el diario ya lo lleva git." },
    { q: "¿Cuál es el criterio para saber si falta escribir una note?",
      o: ["Si la siguiente sesión (u otra máquina, u otra persona) no podría continuar sin preguntarte","Si la sesión duró más de una hora","Si se tocaron más de diez ficheros"], a: 0,
      w: "Esa pregunta única decide. Cinco minutos de escritura contra re-explicar el contexto entero mañana, con pérdidas." },
    { q: "¿Por qué las secciones de «decisiones cerradas» y «trampas» son las más valiosas?",
      o: ["Porque son las más fáciles de escribir","Porque evitan reabrir debates zanjados y repagar depuraciones ya pagadas","Porque las exige el formato estándar"], a: 1,
      w: "Cada sesión llega de nuevas: sin decisiones escritas, reabre debates; sin trampas escritas, vuelve a caer en ellas." },
  ],
  "cc-mcp": [
    { q: "¿Qué problema resuelve MCP como protocolo estándar?",
      o: ["Hace los modelos más rápidos","El N×M de conectores: escribes el servidor una vez y lo habla cualquier cliente agéntico","Sustituye a las herramientas nativas del agente"], a: 1,
      w: "El mismo movimiento que LSP con editores y lenguajes: un contrato único entre clientes y servicios." },
    { q: "¿Qué diferencia una tool de un resource en un servidor MCP?",
      o: ["La tool es una acción con efectos; el resource es contenido legible por URI, sin efectos","La tool es local y el resource remoto","El resource requiere autenticación y la tool no"], a: 0,
      w: "Comando y consulta, como siempre. Mezclarlos (un listado que modifica cosas) es el GET que borra, versión MCP." },
    { q: "¿Dónde se pone el límite «solo SELECT» de una tool de base de datos?",
      o: ["En la descripción de la tool, bien clara","En las rules del proyecto","Validado dentro del servidor (y con credencial de solo lectura): la frontera determinista"], a: 2,
      w: "La descripción orienta al modelo, pero la garantía vive en código que siempre se cumple — y en el permiso de la propia conexión." },
    { q: "Una tool MCP devuelve el texto de un ticket escrito por un tercero. ¿Qué riesgo entra con él?",
      o: ["Que el JSON venga mal formado","Inyección de prompt: el contenido puede traer instrucciones dirigidas al modelo, ahora por la puerta de las herramientas","Que el ticket esté duplicado"], a: 1,
      w: "Todo lo que devuelve una tool entra al contexto. Datos como datos: desconfía de resultados que «piden cosas»." },
  ],

};
