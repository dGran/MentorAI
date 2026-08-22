/* ============================================================
   MentorAI — Ponlo en práctica: mini-retos por curso
   Cada clave es el slug de un curso; cada reto tiene enunciado y
   solución en texto plano (los escapa el renderer) y código opcional
   { lang, source } que se resalta con SyntaxHighlighter.
   Se pintan al final de la ficha del curso (assets/js/modules/practica.js).
   ============================================================ */

window.MENTORAI_PRACTICE = {
  "terminal-linux": [
    {
      title: "El fichero que se come el disco",
      statement:
        "El disco de un servidor está al 92% y nadie sabe por qué. Sin abrir ningún explorador gráfico, encuentra los 5 ficheros más pesados que cuelgan de /var en tu máquina (o de tu $HOME si no tienes permisos). Pista: no es lo mismo el tamaño de un directorio que el de un fichero.",
      solution:
        "du -ah recorre el árbol mostrando el tamaño de cada fichero y directorio; sort -rh ordena por tamaño legible (entiende K, M, G) de mayor a menor, y head corta los 5 primeros. La alternativa con find -type f -size +100M lista solo ficheros grandes, pero no los ordena: por eso el pipeline con du es la herramienta habitual de diagnóstico.",
      solutionCode: {
        lang: "bash",
        source: "du -ah /var 2>/dev/null | sort -rh | head -n 5",
      },
    },
    {
      title: "El permiso que falta no es el que parece",
      statement:
        "Reproduce esta situación y explica por qué falla el cat: el fichero tiene permiso de lectura para todos y aun así no se puede leer. Arréglalo tocando un solo permiso.",
      code: {
        lang: "bash",
        source:
          "mkdir caja\necho \"secreto\" > caja/nota.txt\nchmod 644 caja/nota.txt\nchmod 600 caja\ncat caja/nota.txt   # Permission denied, ¿por qué?",
      },
      solution:
        "Para llegar a nota.txt hay que atravesar el directorio caja, y atravesar un directorio exige su bit x (ejecución). Con chmod 600 el directorio se queda sin él, así que da igual que el fichero sea legible: no se puede llegar hasta él. Se arregla devolviendo el bit x al dueño; en directorios lo normal es r y x juntos (700 o 755).",
      solutionCode: {
        lang: "bash",
        source: "chmod 700 caja\ncat caja/nota.txt",
      },
    },
    {
      title: "Un pipeline con datos de verdad",
      statement:
        "Usando solo cut, sort, uniq y head sobre /etc/passwd, saca cuántos usuarios de tu sistema usan cada shell, ordenado de más a menos. Te dirá cuántas cuentas de servicio hay frente a usuarios reales.",
      solution:
        "El campo 7 de /etc/passwd es la shell, separada por dos puntos. uniq -c cuenta líneas repetidas, pero solo si están juntas: por eso el primer sort es obligatorio antes de uniq, y el segundo ordena el recuento. Este patrón cortar → ordenar → contar → ordenar por frecuencia sirve igual para logs de acceso, IPs o user agents.",
      solutionCode: {
        lang: "bash",
        source: "cut -d: -f7 /etc/passwd | sort | uniq -c | sort -rn",
      },
    },
  ],
  "cache-y-rendimiento": [
    {
      title: "La media te está mintiendo",
      statement:
        "Genera en PHP 100 latencias simuladas: 95 entre 20 y 40 ms y 5 entre 900 y 1200 ms. Calcula la media, el p95 y el p99, y compáralos. ¿Qué número le enseñarías a tu equipo y por qué?",
      solution:
        "La media sale en torno a 80 ms, un número que ningún usuario experimenta: los rápidos ven ~30 ms y los lentos ~1000 ms. El p95 y el p99 destapan la cola, que es donde viven los usuarios que se quejan. Por eso los SLO se escriben con percentiles, nunca con medias.",
      solutionCode: {
        lang: "php",
        source:
          "$latencies = [...array_map(fn () => rand(20, 40), range(1, 95)), ...array_map(fn () => rand(900, 1200), range(1, 5))];\nsort($latencies);\n\n$percentile = fn (int $p) => $latencies[(int) ceil(count($latencies) * $p / 100) - 1];\n\necho \"media \" . round(array_sum($latencies) / count($latencies)) . \" ms\\n\";\necho \"p95   \" . $percentile(95) . \" ms\\n\";\necho \"p99   \" . $percentile(99) . \" ms\\n\";",
      },
    },
    {
      title: "El índice que no entra",
      statement:
        "Crea en tu MySQL (o SQLite) una tabla con 100.000 filas y un índice sobre email. Lanza estas dos consultas con EXPLAIN y explica por qué solo una usa el índice, si el índice cubre la columna en ambas.",
      code: {
        lang: "sql",
        source:
          "EXPLAIN SELECT * FROM users WHERE email LIKE 'ana%';\nEXPLAIN SELECT * FROM users WHERE email LIKE '%@gmail.com';",
      },
      solution:
        "Un índice B-tree ordena por el prefijo del valor: 'ana%' define un rango contiguo en ese orden y el índice lo recorre. '%@gmail.com' empieza por comodín, así que no hay prefijo por el que entrar: cualquier fila podría casar y toca leerlas todas (full scan). Para buscar por sufijo hacen falta otras armas: una columna invertida indexada o un índice full-text.",
    },
    {
      title: "Provoca (y evita) la estampida",
      statement:
        "Tienes una clave de caché que expira y 50 peticiones concurrentes que la piden justo después. Escribe el flujo cache-aside ingenuo, señala qué pasa en ese instante y protégelo con un lock para que solo una petición recalcule.",
      solution:
        "Con el cache-aside ingenuo las 50 peticiones ven el miss a la vez y las 50 recalculan: la base de datos recibe de golpe el trabajo que la caché existía para evitar. Con un lock, solo quien lo adquiere recalcula; el resto espera y relee. Las alternativas del curso —refresco anticipado probabilístico o servir el valor caducado mientras se recalcula— atacan lo mismo: que el recálculo nunca sea simultáneo.",
      solutionCode: {
        lang: "php",
        source:
          "$value = $cache->get($key);\n\nif ($value !== null) return $value;\n\nif (!$lock->acquire(\"lock:$key\", ttlSeconds: 10)) {\n    usleep(100_000);\n\n    return $cache->get($key) ?? $fallback;\n}\n\n$value = $repository->compute();\n$cache->set($key, $value, ttlSeconds: 300);\n$lock->release(\"lock:$key\");\n\nreturn $value;",
      },
    },
  ],
  "infraestructura": [
    {
      title: "Un servicio que no se puede matar",
      statement:
        "Escribe una unit de systemd para un script que escribe la hora en un fichero cada 5 segundos. Actívala, mátala con kill -9 y comprueba con systemctl status que systemd lo ha resucitado solo. ¿Qué campo lo consigue?",
      code: {
        lang: "ini",
        source:
          "[Unit]\nDescription=Latido cada 5 segundos\n\n[Service]\nExecStart=/usr/local/bin/latido.sh\nRestart=always\nRestartSec=2\n\n[Install]\nWantedBy=multi-user.target",
      },
      solution:
        "Restart=always le dice a systemd que el proceso debe estar vivo pase lo que pase; RestartSec espacia los reintentos para no entrar en bucle frenético si el script muere nada más arrancar. Tras el kill -9, journalctl -u latido muestra la muerte y el rearranque: esa es la diferencia entre lanzar un proceso y operarlo.",
      solutionCode: {
        lang: "bash",
        source:
          "sudo systemctl daemon-reload && sudo systemctl start latido\nkill -9 $(systemctl show -p MainPID --value latido)\nsleep 3 && systemctl status latido --no-pager | head -5",
      },
    },
    {
      title: "nginx delante, tu app detrás",
      statement:
        "Levanta con docker compose un nginx que haga de reverse proxy hacia un contenedor con php -S. Desde fuera solo se habla con nginx. Comprueba qué IP ve tu aplicación en REMOTE_ADDR y arregla la pérdida con la cabecera adecuada.",
      solution:
        "La app ve la IP interna de nginx, no la del cliente: el proxy es quien conecta con ella. La convención es que el proxy añada X-Forwarded-For con la IP original (proxy_set_header en nginx) y que la app solo se fíe de esa cabecera cuando la petición venga del proxy — si te fías de ella siempre, cualquier cliente puede falsificar su IP escribiéndola a mano.",
      solutionCode: {
        lang: "ini",
        source:
          "location / {\n    proxy_pass http://app:8000;\n    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n    proxy_set_header Host $host;\n}",
      },
    },
    {
      title: "El backup que no existe",
      statement:
        "Haz un dump de una base de datos de prueba, borra la base de datos entera y restáurala desde el dump. Cronometra la restauración. Si nunca has hecho la segunda mitad de este reto en tu proyecto real, tu backup es una hipótesis.",
      code: {
        lang: "bash",
        source:
          "docker exec mysql mysqldump -uroot -p\"$PASS\" tienda > tienda.sql\ndocker exec mysql mysql -uroot -p\"$PASS\" -e \"DROP DATABASE tienda\"",
      },
      solution:
        "Restaurar es crear la base vacía y volcar el dump dentro. Lo que enseña el reto no es el comando: es que la restauración tiene pasos (crear la BD, permisos, tiempo real de importación) que solo descubres haciéndola, y que ese tiempo es tu RTO de verdad. Un backup sin restauración ensayada falla siempre en el peor momento posible.",
      solutionCode: {
        lang: "bash",
        source:
          "docker exec mysql mysql -uroot -p\"$PASS\" -e \"CREATE DATABASE tienda\"\ntime docker exec -i mysql mysql -uroot -p\"$PASS\" tienda < tienda.sql",
      },
    },
  ],
  "protocolos-y-tiempo-real": [
    {
      title: "Cuenta los viajes del handshake",
      statement:
        "Lanza curl -v contra un sitio HTTPS y separa en la salida qué pertenece al TCP, qué al handshake TLS y cuándo sale por fin la petición HTTP. ¿Cuántos round-trips pasan antes del primer byte útil? Compara con lo que promete TLS 1.3.",
      code: {
        lang: "bash",
        source: "curl -svo /dev/null https://example.com 2>&1 | head -30",
      },
      solution:
        "El orden es: SYN/SYN-ACK (1 RTT de TCP), luego el saludo TLS — con 1.3, un solo round-trip: ClientHello y ServerHello ya negocian claves — y solo entonces viaja el GET. Con TLS 1.2 eran dos RTT de TLS; la mejora de 1.3 es estructural, no de implementación. Ese coste fijo por conexión nueva es la razón de ser del keep-alive y de la reutilización de conexiones.",
    },
    {
      title: "Server-Sent Events en 15 líneas",
      statement:
        "Escribe un endpoint PHP que emita un evento SSE por segundo con la hora, sírvelo con php -S y consúmelo con curl -N. Fíjate en qué cabecera y qué formato de líneas hacen que esto sea SSE y no una respuesta cualquiera.",
      solution:
        "SSE es HTTP normal que no termina: Content-Type text/event-stream, y cada mensaje son líneas data: separadas por una línea en blanco. No hay protocolo nuevo ni handshake extra — por eso atraviesa proxies y reconecta gratis con EventSource — y esa simpleza es su argumento frente a WebSockets cuando el flujo es solo servidor → cliente.",
      solutionCode: {
        lang: "php",
        source:
          "header(\"Content-Type: text/event-stream\");\nheader(\"Cache-Control: no-cache\");\n\nwhile (true) {\n    echo \"data: \" . date(\"H:i:s\") . \"\\n\\n\";\n    ob_flush();\n    flush();\n    sleep(1);\n}",
      },
    },
    {
      title: "Firma tu webhook y rompe el replay",
      statement:
        "Simula el emisor de un webhook: firma el cuerpo JSON con HMAC-SHA256 y una clave compartida, y escribe la verificación del receptor. Después responde: si un atacante captura una petición firmada válida, ¿qué le impide reenviarla mañana? Añade lo que falta.",
      solution:
        "La firma prueba quién lo envió y que no se alteró, pero una petición capturada sigue siendo válida para siempre: eso es el replay. La defensa es incluir un timestamp en lo firmado y rechazar peticiones más viejas que una ventana corta; con eso, reenviar mañana produce una firma caducada. Comparar con hash_equals evita, además, filtrar la firma por tiempos de comparación.",
      solutionCode: {
        lang: "php",
        source:
          "$signed = $timestamp . \".\" . $body;\n$expected = hash_hmac(\"sha256\", $signed, $secret);\n\n$freshEnough = abs(time() - (int) $timestamp) < 300;\n\nif (!$freshEnough || !hash_equals($expected, $receivedSignature)) {\n    http_response_code(401);\n    exit;\n}",
      },
    },
  ],
  "sistemas-distribuidos": [
    {
      title: "El reintento que cobró dos veces",
      statement:
        "Monta con php -S un endpoint que tarda 3 segundos en responder pero SÍ ejecuta su efecto (escribe una línea en un fichero). Llámalo con timeout de 1 segundo y 3 reintentos, y cuenta después cuántas líneas hay en el fichero. Explica el desastre y cómo lo evita una clave de idempotencia.",
      solution:
        "El timeout corta la espera del cliente, no el trabajo del servidor: cada reintento vuelve a ejecutar el efecto y el fichero acaba con varias líneas — en producción, varios cobros. Un reintento solo es seguro sobre operaciones idempotentes: el cliente manda una clave única por operación y el servidor, si ya la vio, devuelve el resultado guardado en lugar de repetir el efecto.",
      solutionCode: {
        lang: "php",
        source:
          "$key = $_SERVER[\"HTTP_IDEMPOTENCY_KEY\"] ?? null;\n\nif ($key !== null && $store->has($key)) {\n    echo $store->get($key);\n    exit;\n}\n\n$result = cobrar();\n\nif ($key !== null) $store->set($key, $result);\n\necho $result;",
      },
    },
    {
      title: "Outbox: el evento que no se pierde",
      statement:
        "Diseña el esquema y la transacción del patrón outbox: guardar un pedido y su evento PedidoCreado de forma que sea imposible que exista el uno sin el otro, aunque el broker de mensajes esté caído en ese momento. ¿Quién publica el evento y cuándo?",
      solution:
        "El truco es que el evento se escribe en una tabla de la MISMA base de datos, dentro de la misma transacción que el pedido: el commit los hace atómicos a los dos. Publicar en el broker dentro de la transacción no sirve — el broker no participa en tu BEGIN. Un proceso aparte (relay) lee la outbox, publica y marca como enviado: si el broker está caído, los eventos esperan en la tabla, no se pierden.",
      solutionCode: {
        lang: "sql",
        source:
          "BEGIN;\nINSERT INTO pedidos (id, total) VALUES (42, 99.90);\nINSERT INTO outbox (aggregate_id, tipo, payload, publicado)\nVALUES (42, 'PedidoCreado', '{\"pedido\": 42}', FALSE);\nCOMMIT;",
      },
    },
    {
      title: "Un circuit breaker de 30 líneas",
      statement:
        "Implementa en PHP un cortacircuitos con sus tres estados — cerrado, abierto, semiabierto — alrededor de una llamada HTTP: a los 5 fallos seguidos se abre, tras 30 segundos deja pasar una llamada de prueba, y si sale bien se cierra. ¿Qué gana el sistema respecto a reintentar sin más?",
      solution:
        "Reintentar contra un servicio caído es echarle más carga justo cuando peor está, y encima cada llamada tuya espera el timeout entero: la lentitud se contagia hacia arriba. El breaker abierto falla en microsegundos sin tocar la red — protege al servicio caído de la avalancha y a ti de agotar workers esperando. El estado semiabierto es la parte fina: sondear la recuperación con una sola llamada, no con todas.",
      solutionCode: {
        lang: "php",
        source:
          "if ($this->state === State::Open) {\n    if (time() - $this->openedAt < 30) throw new CircuitOpenException();\n\n    $this->state = State::HalfOpen;\n}\n\ntry {\n    $response = $call();\n    $this->failures = 0;\n    $this->state = State::Closed;\n\n    return $response;\n} catch (TransportException $exception) {\n    $this->failures++;\n\n    if ($this->failures >= 5 || $this->state === State::HalfOpen) {\n        $this->state = State::Open;\n        $this->openedAt = time();\n    }\n\n    throw $exception;\n}",
      },
    },
  ],
  "go": [
    {
      title: "Cuenta en paralelo",
      statement:
        "Escribe un programa que cuente las líneas de todos los ficheros que le pases como argumentos, lanzando una goroutine por fichero y recogiendo los resultados por un channel. Compara mentalmente con cómo lo harías en PHP: ¿qué te está regalando el runtime?",
      solution:
        "Cada goroutine cuenta su fichero y manda el resultado por el channel; main recibe exactamente un mensaje por fichero, así que ni siquiera hace falta WaitGroup. En PHP la concurrencia de este estilo exige extensiones o procesos; en Go es parte del lenguaje: goroutines baratas y un canal tipado que además sincroniza — recibir bloquea hasta que hay dato.",
      solutionCode: {
        lang: "go",
        source:
          "func main() {\n    type result struct {\n        name  string\n        lines int\n    }\n\n    results := make(chan result)\n\n    for _, name := range os.Args[1:] {\n        go func(name string) {\n            data, _ := os.ReadFile(name)\n            results <- result{name, bytes.Count(data, []byte(\"\\n\"))}\n        }(name)\n    }\n\n    for range os.Args[1:] {\n        r := <-results\n        fmt.Println(r.name, r.lines)\n    }\n}",
      },
    },
    {
      title: "La interfaz que nadie declara",
      statement:
        "Define una interfaz Notificador con un método Enviar(mensaje string) error y dos tipos que la cumplan (email y consola) sin mencionar la interfaz en ningún sitio. Escribe una función que acepte Notificador y pásale ambos. ¿Qué línea haría esto imposible en PHP?",
      solution:
        "En Go la conformidad es estructural: si el tipo tiene el método con esa firma, cumple la interfaz, y el compilador lo comprueba en el punto de uso. En PHP haría falta implements en cada clase — la conformidad es nominal y se declara. La consecuencia práctica en Go: puedes definir interfaces sobre tipos de terceros que no conocen tu paquete, y las interfaces se definen donde se consumen, no donde se implementan.",
      solutionCode: {
        lang: "go",
        source:
          "type Notificador interface {\n    Enviar(mensaje string) error\n}\n\ntype Consola struct{}\n\nfunc (Consola) Enviar(mensaje string) error {\n    _, err := fmt.Println(mensaje)\n    return err\n}\n\nfunc avisa(n Notificador, mensaje string) {\n    if err := n.Enviar(mensaje); err != nil {\n        log.Println(\"no se pudo avisar:\", err)\n    }\n}",
      },
    },
    {
      title: "Errores que se preguntan, no se lanzan",
      statement:
        "Escribe una función CargarConfig(ruta string) que devuelva un error envuelto con %w cuando el fichero no exista, y en main distingue con errors.Is si el fallo fue fs.ErrNotExist (usa un valor por defecto) o cualquier otro (aborta). ¿Qué aporta envolver frente a devolver el error tal cual?",
      solution:
        "Envolver con %w añade contexto legible sin destruir la cadena: errors.Is atraviesa los envoltorios hasta encontrar el error original. Si devolvieras un error nuevo con el texto concatenado, el llamador ya no podría distinguir un fichero ausente de un disco roto salvo comparando strings — que es exactamente la fragilidad que el modelo de errores de Go evita.",
      solutionCode: {
        lang: "go",
        source:
          "func CargarConfig(ruta string) ([]byte, error) {\n    data, err := os.ReadFile(ruta)\n    if err != nil {\n        return nil, fmt.Errorf(\"cargando config %s: %w\", ruta, err)\n    }\n    return data, nil\n}\n\ndata, err := CargarConfig(\"app.conf\")\nif errors.Is(err, fs.ErrNotExist) {\n    data = []byte(configPorDefecto)\n} else if err != nil {\n    log.Fatal(err)\n}",
      },
    },
  ],
  "framework-por-dentro": [
    {
      title: "Espía el ciclo de la petición",
      statement:
        "En un proyecto Symfony (vale el skeleton en Docker), lista quién escucha kernel.request con debug:event-dispatcher y localiza en qué posición actúan el RouterListener y el firewall. Después escribe tu propio listener con prioridad mayor que el router y comprueba que se ejecuta antes.",
      code: {
        lang: "bash",
        source: "php bin/console debug:event-dispatcher kernel.request",
      },
      solution:
        "La lista muestra el orden real: los listeners se ejecutan por prioridad descendente, y el RouterListener (32) resuelve la ruta antes de que el firewall (8) decida sobre seguridad. Un listener tuyo con prioridad 64 corre antes que ambos — puede, por ejemplo, cortar la petición sin coste de routing. El framework no es magia: es este dispatcher recorriendo esta lista, y ahora sabes leerla.",
      solutionCode: {
        lang: "php",
        source:
          "#[AsEventListener(event: KernelEvents::REQUEST, priority: 64)]\nfinal class TrazaListener\n{\n    public function __invoke(RequestEvent $event): void\n    {\n        error_log(\"antes del router: \" . $event->getRequest()->getPathInfo());\n    }\n}",
      },
    },
    {
      title: "Recoge tus servicios con un tag",
      statement:
        "Crea una interfaz Exportador con dos implementaciones (CSV y JSON) y un servicio que las reciba TODAS sin nombrarlas: en Symfony con un tagged iterator (o en Laravel con tag() del contenedor). Añade después una tercera implementación y comprueba que no tocaste el consumidor.",
      solution:
        "El contenedor hace el trabajo: AutoconfigureTag marca cada implementación al registrarse, y AutowireIterator inyecta la colección completa. Añadir el exportador XML es crear la clase y nada más — el consumidor queda cerrado a modificación y abierto a extensión, que es OCP materializado por el framework. Este mecanismo (tag + recolección) es como el propio Symfony descubre listeners, voters o comandos.",
      solutionCode: {
        lang: "php",
        source:
          "#[AutoconfigureTag(\"app.exportador\")]\ninterface Exportador\n{\n    public function exporta(array $filas): string;\n}\n\nfinal class Informes\n{\n    public function __construct(\n        #[AutowireIterator(\"app.exportador\")]\n        private readonly iterable $exportadores,\n    ) {}\n}",
      },
    },
  ],
  "patrones-diseno": [
    {
      title: "Del switch al Strategy",
      statement:
        "Esta clase calcula gastos de envío con un switch que crece con cada transportista nuevo. Refactorízala al patrón Strategy: una interfaz, una clase por transportista y un consumidor que no cambia al añadir el siguiente. ¿Dónde queda la decisión de qué estrategia usar?",
      code: {
        lang: "php",
        source:
          "public function coste(string $transportista, float $peso): float\n{\n    switch ($transportista) {\n        case \"correos\": return 4.95 + $peso * 0.5;\n        case \"mrw\": return $peso > 10 ? 12.0 : 8.0;\n        case \"recogida\": return 0.0;\n    }\n}",
      },
      solution:
        "Cada rama del switch se convierte en una clase con la interfaz común, y el switch no desaparece: se muda a un único punto de creación (un factory o el propio contenedor con tagged services). Esa es la honestidad del patrón — la decisión existe igual, pero ahora vive en un solo sitio y el cálculo queda abierto a extensión: transportista nuevo, clase nueva, cero cambios en lo probado.",
      solutionCode: {
        lang: "php",
        source:
          "interface CalculadoraDeEnvio\n{\n    public function acepta(string $transportista): bool;\n\n    public function coste(float $peso): float;\n}\n\nfinal class EnvioMrw implements CalculadoraDeEnvio\n{\n    public function acepta(string $transportista): bool\n    {\n        return $transportista === \"mrw\";\n    }\n\n    public function coste(float $peso): float\n    {\n        return $peso > 10 ? 12.0 : 8.0;\n    }\n}",
      },
    },
    {
      title: "Decora sin tocar",
      statement:
        "Tienes un TipoDeCambioApi que llama a un servicio externo lento. Sin modificar esa clase ni sus llamadores, añade una capa de caché con el patrón Decorator. ¿Por qué esto es mejor que meter el if de caché dentro de la clase original?",
      solution:
        "El decorador implementa la misma interfaz y envuelve al original: los llamadores reciben TipoDeCambioCacheado sin saberlo. La clase original conserva una sola responsabilidad (hablar con la API) y la caché es opcional, componible y testeable por separado — puedes apilar otro decorador de logging encima. Los middlewares HTTP y las capas de caché de Doctrine funcionan exactamente así.",
      solutionCode: {
        lang: "php",
        source:
          "final class TipoDeCambioCacheado implements TipoDeCambio\n{\n    public function __construct(\n        private readonly TipoDeCambio $origen,\n        private readonly CacheInterface $cache,\n    ) {}\n\n    public function tasa(string $divisa): float\n    {\n        return $this->cache->get(\"tasa-$divisa\", fn () => $this->origen->tasa($divisa));\n    }\n}",
      },
    },
    {
      title: "Caza tres patrones en tu framework",
      statement:
        "Sin escribir código: localiza en el framework que uses a diario un Chain of Responsibility, un Observer y un Adapter reales. Nombra la clase o el mecanismo concreto de cada uno y qué problema le resuelve al framework.",
      solution:
        "En Symfony/Laravel: los middleware HTTP son Chain of Responsibility (cada eslabón decide atender, delegar o cortar); el EventDispatcher y los eventos de Eloquent son Observer (emisores que no conocen a sus oyentes); y los drivers de caché o filesystem (Flysystem) son Adapter (una interfaz propia sobre APIs ajenas incompatibles). El ejercicio real del curso es este: dejar de ver los patrones como catálogo y empezar a reconocerlos en código que ya usas.",
    },
  ],
  "sql-aplicado": [
    {
      title: "Top 3 por categoría, sin bucles",
      statement:
        "Con una tabla productos(id, categoria, ventas), saca los 3 productos más vendidos de CADA categoría en una sola consulta. Primero intenta resolverlo sin window functions para sentir el dolor; luego hazlo con ROW_NUMBER.",
      solution:
        "Sin window functions esto exige subconsultas correlacionadas contando cuántos superan a cada fila — ilegible y lento. ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...) numera dentro de cada categoría sin colapsar filas, que es la diferencia clave con GROUP BY: agregar resume, la window function anota. Filtrar rn <= 3 exige la CTE porque el WHERE no puede ver el resultado de una window function de su mismo nivel.",
      solutionCode: {
        lang: "sql",
        source:
          "WITH ranking AS (\n  SELECT id, categoria, ventas,\n         ROW_NUMBER() OVER (PARTITION BY categoria ORDER BY ventas DESC) AS rn\n  FROM productos\n)\nSELECT id, categoria, ventas\nFROM ranking\nWHERE rn <= 3;",
      },
    },
    {
      title: "El JOIN que infló la factura",
      statement:
        "Un cliente tiene 1 pedido de 100 € con 3 líneas de envío. Esta consulta devuelve 300 €. Reprodúcelo con dos tablas pequeñas, explica el porqué del triple y arréglalo manteniendo la información de ambas ramas.",
      code: {
        lang: "sql",
        source:
          "SELECT c.nombre, SUM(p.total)\nFROM clientes c\nJOIN pedidos p ON p.cliente_id = c.id\nJOIN envios e ON e.pedido_id = p.id\nGROUP BY c.nombre;",
      },
      solution:
        "El JOIN con envios multiplica cada pedido por sus 3 envíos ANTES de agregar: SUM ve tres copias del mismo total. Es el fan-out de todo JOIN 1:N, y muerde justo cuando mezclas agregación con más de una rama N. La solución es agregar cada rama en su propia CTE (o subconsulta) y unir ya agregado — o, si solo necesitas contar, un COUNT(DISTINCT) honesto.",
      solutionCode: {
        lang: "sql",
        source:
          "WITH totales AS (\n  SELECT cliente_id, SUM(total) AS gastado\n  FROM pedidos\n  GROUP BY cliente_id\n)\nSELECT c.nombre, t.gastado\nFROM clientes c\nJOIN totales t ON t.cliente_id = c.id;",
      },
    },
    {
      title: "WHERE no puede, HAVING sí",
      statement:
        "Sobre pedidos(cliente_id, total, creado_en): lista los clientes que en 2025 hayan hecho más de 5 pedidos con un total acumulado superior a 500 €. Decide qué condición va en WHERE y cuál en HAVING, y explica qué pasaría si las cruzaras.",
      solution:
        "WHERE filtra filas antes de agrupar: ahí va el año, porque descarta pedidos individuales. HAVING filtra grupos ya agregados: ahí van el COUNT y el SUM, que no existen hasta después del GROUP BY. Cruzarlas o falla (WHERE no conoce agregados) o desperdicia: filtrar el año en HAVING obligaría a agregar pedidos que ibas a tirar. La regla mnemotécnica del curso: WHERE habla de filas, HAVING habla de grupos.",
      solutionCode: {
        lang: "sql",
        source:
          "SELECT cliente_id, COUNT(*) AS pedidos, SUM(total) AS gastado\nFROM pedidos\nWHERE creado_en >= '2025-01-01' AND creado_en < '2026-01-01'\nGROUP BY cliente_id\nHAVING COUNT(*) > 5 AND SUM(total) > 500;",
      },
    },
  ],
  "git": [
    {
      title: "El commit que creías perdido",
      statement:
        "En un repo de prueba: haz dos commits, ejecuta git reset --hard HEAD~1 y comprueba que el segundo commit ya no está en git log. Ahora recupéralo. Pista: git no borra casi nada de verdad.",
      solution:
        "El reflog registra cada movimiento de HEAD, incluidos los que el log ya no muestra: ahí sigue el hash del commit «perdido». Un reset --hard a ese hash (o un cherry-pick) lo devuelve. La lección que da calma para siempre: un commit hecho es recuperable durante semanas; lo único que git pierde de verdad es lo que nunca llegó a commit.",
      solutionCode: {
        lang: "bash",
        source: "git reflog\ngit reset --hard HEAD@{1}",
      },
    },
    {
      title: "Merge y rebase, en paralelo",
      statement:
        "Crea un repo con una rama main y una rama feature que divergen (2 commits cada una). Clónalo en dos copias: en una integra feature con merge, en la otra con rebase + merge. Compara git log --graph --oneline de ambas y di qué historia contarías tú.",
      solution:
        "El merge conserva la verdad histórica: dos líneas que existieron en paralelo y un commit de unión. El rebase reescribe feature como si siempre hubiera partido del main actual: historia lineal, bisect y revert más simples, a cambio de commits con hashes nuevos — por eso la regla de oro es no rebasar lo ya compartido. No hay respuesta única: hay equipos de historia fiel y equipos de historia legible; lo importante es elegir sabiendo qué pierdes.",
      solutionCode: {
        lang: "bash",
        source:
          "git checkout feature && git rebase main\ngit checkout main && git merge feature\ngit log --graph --oneline --all",
      },
    },
    {
      title: "Encuentra al culpable con bisect",
      statement:
        "En un repo de prueba, haz 8 commits que escriban números en un fichero y haz que uno intermedio introduzca un «bug» (por ejemplo, la palabra ROTO). Usa git bisect con un script de grep para que git encuentre el commit culpable solo. ¿Cuántos pasos le costó?",
      solution:
        "bisect hace búsqueda binaria entre el último commit bueno y el malo: con 8 commits llega en ~3 pasos, con mil llegaría en ~10. La versión run lo automatiza por completo: tu script devuelve 0 si el commit está sano y distinto de 0 si está roto, y git navega solo. Es la herramienta que convierte «algo se rompió este mes» de una tarde de arqueología en un minuto de cómputo.",
      solutionCode: {
        lang: "bash",
        source:
          "git bisect start HEAD HEAD~7\ngit bisect run sh -c '! grep -q ROTO datos.txt'\ngit bisect reset",
      },
    },
  ],
  "apis-rest": [
    {
      title: "Cinco respuestas, cinco códigos",
      statement:
        "Asigna el código de estado exacto a estos cinco casos y justifica cada uno: (1) POST que crea un pedido, (2) DELETE de un recurso que ya no existía, (3) petición con JSON válido pero un email mal formado, (4) usuario autenticado que intenta borrar el pedido de otro, (5) petición sin token.",
      solution:
        "(1) 201 con Location del recurso nuevo — 200 esconde que hubo creación. (2) 404 o 204 son defendibles: 204 si tratas DELETE como idempotente por resultado («ya no está»), 404 si informas de que no existía; lo importante es elegir uno y documentarlo. (3) 422: la sintaxis era válida, la semántica no — 400 es para JSON roto. (4) 403: sabemos quién es y no puede. (5) 401: no sabemos quién es. Confundir 401/403 es el error más común, y cada uno filtra información distinta.",
    },
    {
      title: "Un error que se explica solo",
      statement:
        "Diseña la respuesta de error de tu API para una validación fallida con DOS campos mal, siguiendo application/problem+json (RFC 9457). El que consume la API debe poder pintar el error de cada campo debajo de su input sin parsear mensajes.",
      solution:
        "problem+json estandariza el sobre (type, title, status, detail) y permite extensiones: la clave está en el array de errores por campo, que es una extensión tuya pero con estructura estable. El consumidor enruta por type (una URI que identifica la clase de error, no una frase) y pinta por campo con el array — nunca haciendo string-matching sobre mensajes humanos, que cambian con cada traducción.",
      solutionCode: {
        lang: "json",
        source:
          "{\n  \"type\": \"https://api.example.com/problems/validation\",\n  \"title\": \"La petición no supera la validación\",\n  \"status\": 422,\n  \"errors\": [\n    { \"field\": \"email\", \"message\": \"No es una dirección válida\" },\n    { \"field\": \"birthdate\", \"message\": \"Debe ser una fecha pasada\" }\n  ]\n}",
      },
    },
    {
      title: "La página 500 que devuelve duplicados",
      statement:
        "Tu listado pagina con ?page=500&limit=20 sobre una tabla donde se insertan filas nuevas constantemente (ordenada por fecha descendente). Explica qué ve un cliente que recorre las páginas mientras entran filas, y rediseña la paginación para que no pase.",
      solution:
        "Con OFFSET, cada inserción desplaza todo: la fila 20 de la página 1 reaparece como fila 1 de la página 2 (duplicado), o un elemento cae entre páginas y no se ve nunca. Además OFFSET 10000 lee y descarta 10.000 filas. La paginación por cursor ancla cada página al último elemento visto, así las inserciones nuevas no desplazan lo ya recorrido y el índice entra directo. El precio: no hay «salta a la página 37», y por eso se elige cuando el recorrido es secuencial.",
      solutionCode: {
        lang: "sql",
        source:
          "SELECT id, titulo, creado_en\nFROM articulos\nWHERE (creado_en, id) < ('2026-08-01 10:00:00', 4200)\nORDER BY creado_en DESC, id DESC\nLIMIT 20;",
      },
    },
  ],
  "acceso-a-datos": [
    {
      title: "Fabrica tu propio N+1",
      statement:
        "Con PDO y dos tablas (autores y sus libros), escribe primero la versión ingenua: consulta los 100 autores y, en el bucle, consulta los libros de cada uno. Cuenta las consultas y cronométralo. Después arréglalo en 2 consultas totales sin cambiar lo que se pinta.",
      solution:
        "La ingenua hace 1 + 100 consultas: el coste no es el SQL, son 100 viajes de red con su latencia cada uno. El arreglo clásico es recoger los ids y traer TODOS los libros con un IN en la segunda consulta, agrupándolos en PHP por autor_id. Es exactamente lo que hace el eager loading de un ORM (with() en Eloquent, el fetch join en Doctrine): ahora sabes qué te ahorra y qué le cuesta.",
      solutionCode: {
        lang: "php",
        source:
          "$autores = $pdo->query(\"SELECT id, nombre FROM autores\")->fetchAll();\n$ids = array_column($autores, \"id\");\n$marcas = implode(\",\", array_fill(0, count($ids), \"?\"));\n\n$consulta = $pdo->prepare(\"SELECT autor_id, titulo FROM libros WHERE autor_id IN ($marcas)\");\n$consulta->execute($ids);\n\n$librosPorAutor = [];\n\nforeach ($consulta as $libro) {\n    $librosPorAutor[$libro[\"autor_id\"]][] = $libro[\"titulo\"];\n}",
      },
    },
    {
      title: "La migración que rompe producción",
      statement:
        "Escribe la migración (up y down) para añadir una columna telefono VARCHAR NOT NULL a una tabla clientes que YA tiene 50.000 filas. La versión obvia falla o miente: descubre por qué y escribe la versión que funciona en producción.",
      solution:
        "ADD COLUMN ... NOT NULL a secas falla (las filas existentes no tienen valor) o, con DEFAULT '', rellena 50.000 teléfonos falsos que parecen datos. En producción es una secuencia: añadir la columna NULLABLE, hacer backfill por lotes con los datos reales (o dejar NULL como «desconocido» honesto), y solo al final —cuando el código ya escribe siempre el campo— apretar a NOT NULL. El down deshace en orden inverso. Una migración con datos es un despliegue en fases, no una sentencia.",
      solutionCode: {
        lang: "sql",
        source:
          "-- fase 1\nALTER TABLE clientes ADD COLUMN telefono VARCHAR(20) NULL;\n-- fase 2: backfill por lotes desde la fuente real\n-- fase 3, en otro despliegue posterior\nALTER TABLE clientes MODIFY telefono VARCHAR(20) NOT NULL;",
      },
    },
    {
      title: "¿Quién hace flush aquí?",
      statement:
        "Sin ejecutar nada: en un servicio con Doctrine que crea un Pedido, modifica el stock de tres Productos ya cargados y llama a flush() una sola vez al final, ¿cuántas sentencias SQL se emiten y cuándo? ¿Y si una línea intermedia lanza una excepción antes del flush? Justifica con el unit of work.",
      solution:
        "Hasta el flush, cero SQL: el unit of work solo anota — el Pedido como inserción pendiente y los Productos como cambios detectados por comparación con su snapshot. flush() calcula el conjunto mínimo (1 INSERT + hasta 3 UPDATE, solo de columnas cambiadas) y lo emite dentro de una transacción. Si algo revienta antes del flush, la base de datos no se enteró de nada: no hay nada que deshacer. Ese es el contrato mental con un Data Mapper: tus objetos cambian en memoria; la base de datos cambia en los flush.",
    },
  ],
  "docker": [
    {
      title: "La caché de capas, cronometrada",
      statement:
        "Escribe un Dockerfile para un proyecto PHP que copie TODO el código antes del composer install. Construye, toca un fichero cualquiera de src/ y reconstruye cronometrando. Después reordena las instrucciones para que ese segundo build tarde segundos, y explica por qué.",
      code: {
        lang: "bash",
        source:
          "docker build -t app .\ntouch src/Kernel.php\ntime docker build -t app .",
      },
      solution:
        "Cada instrucción es una capa, y una capa se reutiliza solo si ella y TODAS las anteriores no cambiaron. Con COPY . . primero, tocar cualquier fichero invalida desde ahí: composer install se repite entero. El orden correcto copia primero lo que menos cambia (composer.json y el lock), instala dependencias, y copia el código al final: tocar src/ ya no invalida la capa cara. Es la regla general: de lo más estable a lo más volátil.",
      solutionCode: {
        lang: "bash",
        source:
          "COPY composer.json composer.lock ./\nRUN composer install --no-dev --no-scripts\nCOPY . .",
      },
    },
    {
      title: "¿Por qué muere nada más arrancar?",
      statement:
        "Este contenedor termina con exit 0 al instante aunque nginx queda «lanzado». Reprodúcelo, explica qué contrato está rompiendo y arréglalo. La respuesta tiene que ver con quién es el PID 1.",
      code: {
        lang: "bash",
        source: "FROM nginx\nCMD [\"sh\", \"-c\", \"nginx && echo listo\"]",
      },
      solution:
        "Un contenedor vive exactamente lo que viva su PID 1. nginx a secas se demoniza: el proceso que arrancó el shell termina, sh imprime «listo» y muere — y con él, el contenedor, aunque haya hijos de nginx por detrás. El contrato es que el proceso principal corra en primer plano: daemon off. Por lo mismo, un CMD con tail -f para «mantener vivo» el contenedor es un parche que delata el problema.",
      solutionCode: {
        lang: "bash",
        source: "CMD [\"nginx\", \"-g\", \"daemon off;\"]",
      },
    },
    {
      title: "Multi-stage: la imagen a dieta",
      statement:
        "Parte de una imagen que compila algo (vale el binario de Go del curso, o composer install con dev incluido) y mide su tamaño con docker images. Reescríbela en dos stages —uno que construye, otro que solo copia el resultado— y compara tamaños. ¿Qué se queda fuera exactamente?",
      solution:
        "El stage final parte de una base mínima y solo recibe, vía COPY --from, el artefacto construido: compiladores, caché de paquetes, dependencias de desarrollo y código fuente intermedio se quedan en el stage builder, que no viaja. En Go la diferencia es brutal (de ~800 MB a ~15 MB); en PHP, sacar las dev-dependencies y las herramientas de build ya recorta cientos de MB. Menos imagen es menos superficie de ataque y despliegues más rápidos: no es estética.",
      solutionCode: {
        lang: "bash",
        source:
          "FROM golang:1.23 AS builder\nWORKDIR /src\nCOPY . .\nRUN CGO_ENABLED=0 go build -o /app\n\nFROM scratch\nCOPY --from=builder /app /app\nENTRYPOINT [\"/app\"]",
      },
    },
  ],
  "ci-cd": [
    {
      title: "Tu primer pipeline honesto",
      statement:
        "Monta en un repo de prueba un workflow de GitHub Actions que en cada push instale dependencias con composer y ejecute PHPUnit. Rompe un test a propósito, haz push y comprueba que el push queda marcado en rojo. Sin ese rojo visible, no tienes CI: tienes un script.",
      solution:
        "El valor no está en ejecutar los tests — eso ya lo hacías en local — sino en que se ejecuten SIEMPRE, en una máquina limpia, y el resultado sea público e ineludible. La máquina limpia es la mitad del valor: caza los «en mi máquina funciona» (extensiones instaladas a mano, ficheros sin commitear). El rojo que bloquea el merge convierte la disciplina personal en propiedad del sistema.",
      solutionCode: {
        lang: "yaml",
        source:
          "name: CI\non: [push, pull_request]\n\njobs:\n  tests:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: shivammathur/setup-php@v2\n        with:\n          php-version: '8.3'\n      - run: composer install --prefer-dist --no-progress\n      - run: vendor/bin/phpunit",
      },
    },
    {
      title: "El minuto que se repite en cada build",
      statement:
        "Tu pipeline instala las dependencias de composer desde cero en cada ejecución. Añade caché al workflow anterior, lanza dos builds seguidos y compara la duración del paso de instalación. ¿Qué usas como clave de la caché y por qué esa exactamente?",
      solution:
        "La clave correcta es el hash del composer.lock: mientras las dependencias no cambien, la caché acierta y el install tarda segundos; en cuanto el lock cambia, la clave cambia y se instala de verdad. Usar una clave fija sería peor que no cachear — servirías dependencias viejas para siempre. Es el mismo razonamiento de la caché de capas de Docker: la clave debe capturar exactamente aquello de lo que depende el contenido.",
      solutionCode: {
        lang: "yaml",
        source:
          "- uses: actions/cache@v4\n  with:\n    path: vendor\n    key: composer-${{ hashFiles('composer.lock') }}",
      },
    },
    {
      title: "Diseña el rollback antes del deploy",
      statement:
        "Sin escribir YAML: tu app corre en dos contenedores detrás de nginx. Diseña sobre papel el despliegue blue-green — pasos exactos, en orden — y responde: ¿en qué momento puedes volver atrás en segundos, y qué pieza del sistema lo hace posible? ¿Qué pasa con las migraciones de base de datos?",
      solution:
        "El orden: levantar la versión nueva (green) al lado de la vieja, calentarla y hacerle health checks, cambiar el upstream de nginx, y NO destruir blue todavía. El rollback es re-apuntar nginx a blue: segundos, porque la versión anterior sigue viva — esa es la pieza clave, pagar el doble de recursos un rato a cambio de vuelta atrás instantánea. El talón de Aquiles son las migraciones: si green migró el esquema de forma incompatible, blue ya no funciona; por eso las migraciones deben ser retrocompatibles (expandir → desplegar → contraer), que es lo que hace el rollback posible de verdad.",
    },
  ],
  "oop": [
    {
      title: "Del array al objeto que se defiende",
      statement:
        "Esta función recibe un array asociativo y confía en que todo venga bien. Conviértelo en un value object Importe con validación en el constructor, y explica qué garantiza el objeto que el array no puede garantizar jamás.",
      code: {
        lang: "php",
        source:
          "function aplicarDescuento(array $importe, float $porcentaje): array\n{\n    return [\n        \"cantidad\" => $importe[\"cantidad\"] * (1 - $porcentaje / 100),\n        \"moneda\" => $importe[\"moneda\"],\n    ];\n}",
      },
      solution:
        "El array puede llegar sin moneda, con cantidad negativa o con una clave mal escrita, y lo descubres en producción. El value object valida UNA vez en el constructor y a partir de ahí es imposible tener un Importe inválido: cada función que lo recibe hereda esa garantía gratis. Eso es la encapsulación con consecuencias — no «poner private», sino hacer irrepresentables los estados inválidos.",
      solutionCode: {
        lang: "php",
        source:
          "final class Importe\n{\n    public function __construct(\n        public readonly float $cantidad,\n        public readonly string $moneda,\n    ) {\n        if ($cantidad < 0) {\n            throw new InvalidArgumentException(\"La cantidad no puede ser negativa\");\n        }\n\n        if (!in_array($moneda, [\"EUR\", \"USD\"], strict: true)) {\n            throw new InvalidArgumentException(\"Moneda no soportada: $moneda\");\n        }\n    }\n\n    public function conDescuento(float $porcentaje): self\n    {\n        return new self($this->cantidad * (1 - $porcentaje / 100), $this->moneda);\n    }\n}",
      },
    },
    {
      title: "Mata el switch con polimorfismo",
      statement:
        "Un sistema notifica por email, SMS o push, y cada punto del código que notifica repite el mismo switch sobre un string $canal. Modela los canales como clases con un método común y haz desaparecer todos los switch. ¿Qué pregunta le haces ahora al objeto en vez de preguntarle qué es?",
      solution:
        "El switch pregunta «¿qué eres?» y decide desde fuera; el polimorfismo ordena «hazlo» y cada clase sabe hacerlo a su manera. Con una interfaz Canal y una clase por medio, añadir Telegram es crear una clase — no cazar todos los switch del proyecto, que es donde se olvidaba siempre uno. La señal para detectarlo en código ajeno: el mismo switch/if sobre el mismo discriminador repetido en varios sitios.",
      solutionCode: {
        lang: "php",
        source:
          "interface Canal\n{\n    public function envia(Usuario $usuario, string $mensaje): void;\n}\n\nfinal class Sms implements Canal\n{\n    public function envia(Usuario $usuario, string $mensaje): void\n    {\n        $this->proveedor->enviarSms($usuario->telefono(), $mensaje);\n    }\n}",
      },
    },
    {
      title: "¿Interfaz o clase abstracta?",
      statement:
        "Tres casos, decide para cada uno interfaz, clase abstracta o ninguna, y justifica: (1) tres formas de almacenar ficheros (disco, S3, memoria) sin código común; (2) cuatro informes que comparten el 80% del flujo y difieren solo en formatear la salida; (3) una única implementación de un servicio de facturación, «por si acaso mañana hay otra».",
      solution:
        "(1) Interfaz: solo hay contrato, ningún comportamiento que heredar. (2) Clase abstracta con template method: el flujo común vive una vez y cada informe rellena el hueco abstracto — una interfaz duplicaría el 80%. (3) Ninguna: una abstracción con una sola implementación y sin necesidad real es coste sin beneficio; se extrae cuando llegue la segunda implementación, que además te dirá qué forma debía tener el contrato. La regla del curso: la interfaz define qué, la abstracta comparte cómo, y ninguna de las dos se crea «por si acaso».",
    },
  ],
  "solid": [
    {
      title: "Tres razones para cambiar",
      statement:
        "Esta clase compila, funciona y viola SRP. Identifica sus TRES razones de cambio distintas, sepáralas en clases y di quién orquesta a quién después de la separación.",
      code: {
        lang: "php",
        source:
          "final class Facturador\n{\n    public function factura(Pedido $pedido): void\n    {\n        $total = $pedido->base() * 1.21;\n\n        $pdf = $this->plantilla->render(\"factura.html\", [\"total\" => $total]);\n\n        mail($pedido->email(), \"Tu factura\", $pdf);\n    }\n}",
      },
      solution:
        "Cambia si cambian los impuestos (negocio), si cambia el diseño del PDF (presentación) o si cambia cómo se envía (infraestructura): tres dueños distintos del cambio, tres clases — CalculadoraDeImpuestos, GeneradorDeFactura, y un canal de envío. Facturador queda como orquestador que las recibe por constructor y las llama en orden: sigue existiendo, pero ya solo cambia si cambia el PROCESO. SRP no dice «clases pequeñas»: dice una razón de cambio por clase.",
    },
    {
      title: "El contrato que la subclase rompe",
      statement:
        "Crea una clase Rectangulo con setAncho/setAlto y una subclase Cuadrado que sobreescribe ambos para mantener los lados iguales. Escribe un test que reciba un Rectangulo, haga setAncho(4); setAlto(5) y verifique área 20. Pásale un Cuadrado y mira qué pasa. ¿Qué principio se rompió y cuál es la salida?",
      solution:
        "El test falla con Cuadrado (área 25): la subclase ES un rectángulo en el mundo real, pero no puede sustituir a la base sin romper las expectativas de quien la usa — eso es exactamente Liskov, y demuestra que la herencia no sigue al lenguaje natural sino al comportamiento. La salida no es «arreglar» Cuadrado: es no heredar — dos clases sin parentesco, o inmutabilidad (withAncho devuelve otro objeto) donde la trampa desaparece.",
      solutionCode: {
        lang: "php",
        source:
          "public function testElAreaSaleDeAmbosLados(): void\n{\n    $figura = new Cuadrado();\n    $figura->setAncho(4);\n    $figura->setAlto(5);\n\n    self::assertSame(20, $figura->area());\n}",
      },
    },
    {
      title: "Invierte la dependencia de verdad",
      statement:
        "Una clase InformeVentas hace new PDO(...) dentro de su constructor. Enumera todo lo que eso te impide hacer, y refactorízala aplicando DIP. Ojo a la parte fina: ¿la interfaz que crees pertenece a la capa de datos o a la de negocio?",
      solution:
        "Con el new dentro no puedes testear sin MySQL, ni cambiar de motor, ni saber desde fuera qué necesita la clase. El refactor obvio es inyectar; el punto fino de DIP es que la abstracción la define quien la CONSUME: la interfaz no es «PDOWrapper» (eso sería depender del detalle con disfraz), es VentasRepository con métodos en lenguaje de negocio (ventasDelMes). La capa de datos la implementa. Las dependencias apuntan hacia el dominio — eso es la inversión, y es la puerta de entrada a la arquitectura hexagonal.",
      solutionCode: {
        lang: "php",
        source:
          "interface VentasRepository\n{\n    /** @return list<Venta> */\n    public function ventasDelMes(int $anio, int $mes): array;\n}\n\nfinal class InformeVentas\n{\n    public function __construct(\n        private readonly VentasRepository $ventas,\n    ) {}\n}",
      },
    },
  ],
  "clean-code": [
    {
      title: "Renombra hasta que sobre el comentario",
      statement:
        "Refactoriza este fragmento SOLO renombrando (variables, función) hasta que el comentario sea innecesario y lo puedas borrar. No toques la lógica.",
      code: {
        lang: "php",
        source:
          "// comprueba si el usuario puede pedir\nfunction check(array $u, array $c): bool\n{\n    $d = time() - $u[\"ts\"];\n\n    return $d > 86400 * 30 && count($c) < 3 && !$u[\"b\"];\n}",
      },
      solution:
        "El nombre de la función dice qué responde, los de las variables dicen qué contienen, y las condiciones con nombre explican el porqué de cada regla. El comentario muere porque ya no describe nada que el código no diga — y a diferencia del comentario, los nombres no pueden quedarse desactualizados sin que se note en el diff.",
      solutionCode: {
        lang: "php",
        source:
          "function puedeRealizarPedido(array $usuario, array $pedidosAbiertos): bool\n{\n    $segundosComoCliente = time() - $usuario[\"registradoEn\"];\n    $esClienteVeterano = $segundosComoCliente > 86400 * 30;\n    $tieneCupoDisponible = count($pedidosAbiertos) < 3;\n\n    return $esClienteVeterano && $tieneCupoDisponible && !$usuario[\"bloqueado\"];\n}",
      },
    },
    {
      title: "Una función, un nivel de abstracción",
      statement:
        "Busca en tu propio código (o escribe a propósito) una función de más de 30 líneas que mezcle validar, calcular y persistir. Extráela en funciones privadas hasta que la pública se lea como un índice. Criterio de parada: cada función debe poder describirse sin usar la palabra «y».",
      solution:
        "La función pública queda en tres o cuatro llamadas con nombres semánticos — se lee como el resumen del caso de uso — y cada privada opera a un solo nivel de abstracción. El test de la «y» es el detector: «valida Y calcula» son dos funciones. El beneficio no es estético: cada pieza pequeña es testeable sola, y el lector elige en qué nivel de detalle quiere leer, como con los titulares de un periódico.",
      solutionCode: {
        lang: "php",
        source:
          "public function procesa(SolicitudDeAlta $solicitud): Usuario\n{\n    $this->garantizaEmailLibre($solicitud->email);\n\n    $usuario = $this->creaUsuario($solicitud);\n\n    $this->notificaBienvenida($usuario);\n\n    return $usuario;\n}",
      },
    },
    {
      title: "El olor tiene nombre",
      statement:
        "Diagnostica este código con el vocabulario del curso: nombra los DOS code smells presentes y aplica el refactor que los cura. Pista: fíjate en a quién le pregunta los datos y en qué grupo de parámetros viaja junto.",
      code: {
        lang: "php",
        source:
          "function costeEnvio(float $lat1, float $lon1, float $lat2, float $lon2, Pedido $pedido): float\n{\n    $peso = $pedido->getCaja()->getContenido()->getPeso();\n\n    return distancia($lat1, $lon1, $lat2, $lon2) * 0.01 * $peso;\n}",
      },
      solution:
        "Primero, data clump: las dos parejas lat/lon viajan siempre juntas — son un concepto pidiendo nacer, Coordenada (y el par de coordenadas, un Trayecto). Segundo, la cadena getCaja()->getContenido()->getPeso() es una train wreck que viola la Ley de Deméter: la función conoce las tripas de Pedido a tres niveles. La cura: objetos Coordenada y un método pesoTotal() en Pedido — pregúntale al que sabe, no navegues por él.",
      solutionCode: {
        lang: "php",
        source:
          "function costeEnvio(Trayecto $trayecto, Pedido $pedido): float\n{\n    return $trayecto->distanciaKm() * 0.01 * $pedido->pesoTotal();\n}",
      },
    },
  ],
  "di-contenedores": [
    {
      title: "Un contenedor en 40 líneas",
      statement:
        "Escribe un contenedor con autowiring real: dado un nombre de clase, lee su constructor por reflexión, resuelve recursivamente cada parámetro tipado y devuelve la instancia (cacheada: misma clase, misma instancia). Pruébalo con una cadena A → B → C. ¿Qué caso no puede resolver y qué hacen Symfony o Laravel con él?",
      solution:
        "La reflexión responde a «¿qué pide este constructor?» y la recursión hace el resto; el array de instancias da el comportamiento singleton por defecto. Lo que no puede resolver solo: parámetros escalares (¿qué string?) e interfaces (¿cuál de las implementaciones?) — ahí los frameworks piden configuración: bindings de interfaz a clase y parámetros nombrados. Después de este reto, el contenedor de tu framework deja de ser magia: es esto con caché compilada y configuración encima.",
      solutionCode: {
        lang: "php",
        source:
          "final class Contenedor\n{\n    /** @var array<class-string, object> */\n    private array $instancias = [];\n\n    public function resuelve(string $clase): object\n    {\n        if (isset($this->instancias[$clase])) return $this->instancias[$clase];\n\n        $constructor = (new ReflectionClass($clase))->getConstructor();\n        $argumentos = array_map(\n            fn (ReflectionParameter $parametro) => $this->resuelve($parametro->getType()->getName()),\n            $constructor?->getParameters() ?? [],\n        );\n\n        return $this->instancias[$clase] = new $clase(...$argumentos);\n    }\n}",
      },
    },
    {
      title: "El estado que se cuela entre usos",
      statement:
        "Con tu contenedor del reto anterior (o el de tu framework): crea un servicio CarritoEnMemoria con un array interno de líneas e inyéctalo en dos consumidores distintos. Añade líneas desde uno y lee desde el otro. Explica lo que ves y cuándo ese comportamiento es un regalo o una bomba.",
      solution:
        "Ambos consumidores comparten LA MISMA instancia — es el ciclo de vida singleton por defecto de los contenedores — así que el estado de uno aparece en el otro. Para un pool de conexiones o un logger, regalo: compartir es el objetivo. Para un servicio con estado de un usuario concreto, bomba: en PHP clásico el proceso muere por petición y te salva sin merecerlo, pero en workers persistentes (Swoole, colas de mensajes, tests que reutilizan kernel) el carrito de un usuario se filtra al siguiente. Regla: los servicios compartidos, sin estado de caso de uso; el estado, en objetos que viajan como argumentos.",
    },
  ],
  "fundamentos": [
    {
      title: "0.1 + 0.2 y el céntimo perdido",
      statement:
        "Ejecuta en PHP: var_dump(0.1 + 0.2 === 0.3), y después suma 0.1 cien veces y compara con 10. Explica el porqué con lo que sabes de IEEE 754 y decide cómo representarías dinero en un sistema de facturación.",
      code: {
        lang: "php",
        source:
          "var_dump(0.1 + 0.2 === 0.3);\n\n$total = 0.0;\n\nfor ($i = 0; $i < 100; $i++) {\n    $total += 0.1;\n}\n\nvar_dump($total === 10.0, $total);",
      },
      solution:
        "0.1 en binario es periódico —como 1/3 en decimal— así que el double guarda una aproximación, y las aproximaciones se acumulan: tras cien sumas el error ya es visible. No es un bug de PHP: es la naturaleza de coma flotante en cualquier lenguaje. Para dinero: enteros en céntimos (o BCMath/decimal si necesitas divisiones exactas), y las comparaciones de floats, siempre con tolerancia, nunca con ===.",
    },
    {
      title: "O(n) contra O(1), medido",
      statement:
        "Construye un array de un millón de emails. Mide cuánto tarda in_array buscando el último email 1.000 veces, y compáralo con la misma búsqueda usando isset sobre un array invertido con array_flip. Relaciona los números con la Big-O de cada estructura.",
      solution:
        "in_array recorre el array hasta encontrar (O(n)): un millón de comparaciones por búsqueda. isset va contra la hash table interna del array PHP (O(1) amortizado): calcula el hash y va directo. La diferencia medida —de segundos a milisegundos— es la teoría hecha carne, y la moraleja operativa: si vas a preguntar «¿está X?» muchas veces, invierte una vez (array_flip) y pregunta barato. Es la misma decisión que un índice en base de datos.",
      solutionCode: {
        lang: "php",
        source:
          "$emails = array_map(fn ($i) => \"user$i@example.com\", range(1, 1_000_000));\n$buscado = \"user1000000@example.com\";\n\n$inicio = hrtime(true);\n\nfor ($i = 0; $i < 1000; $i++) in_array($buscado, $emails, strict: true);\n\necho \"in_array: \" . intdiv(hrtime(true) - $inicio, 1_000_000) . \" ms\\n\";\n\n$indice = array_flip($emails);\n$inicio = hrtime(true);\n\nfor ($i = 0; $i < 1000; $i++) isset($indice[$buscado]);\n\necho \"isset:    \" . intdiv(hrtime(true) - $inicio, 1_000_000) . \" ms\\n\";",
      },
    },
    {
      title: "Mira al índice trabajar",
      statement:
        "Crea una tabla con 200.000 filas (vale generarlas con un INSERT ... SELECT recursivo o un bucle en PHP) y lanza la misma consulta por una columna sin índice, con EXPLAIN. Crea el índice, repite el EXPLAIN y compara filas examinadas. Después responde: ¿por qué no indexamos todas las columnas y listo?",
      solution:
        "Sin índice, el EXPLAIN muestra un recorrido completo (type ALL, ~200.000 filas examinadas); con él, un salto directo por el B-tree (type ref, un puñado de filas). El árbol mantiene la columna ordenada y localiza en O(log n). No se indexa todo porque cada índice se paga: cada INSERT/UPDATE debe actualizar todos los árboles, y ocupan disco y memoria. Un índice es una apuesta: aceleras las lecturas que lo usan a costa de TODAS las escrituras — por eso se indexan las columnas por las que de verdad se busca.",
      solutionCode: {
        lang: "sql",
        source:
          "EXPLAIN SELECT * FROM usuarios WHERE email = 'ana@example.com';\nCREATE INDEX idx_usuarios_email ON usuarios (email);\nEXPLAIN SELECT * FROM usuarios WHERE email = 'ana@example.com';",
      },
    },
  ],
  "testing": [
    {
      title: "TDD de verdad: sin adelantarte",
      statement:
        "Implementa con TDD estricto un conversor de números a texto de escalera (1 → «I», 4 → «IV»... números romanos hasta 20). La regla del reto: no puedes escribir NI UNA línea de producción sin un test en rojo que la exija, y tras cada verde, considera refactorizar. Guarda la secuencia de commits como evidencia.",
      solution:
        "La experiencia que busca el reto: el código crece a empujones mínimos (primero un if, luego dos, luego emerge el bucle con la tabla de valores) y el diseño final —la tabla ordenada de pares valor/símbolo— aparece en un refactor en verde, no de un plan previo. Eso es lo que TDD entrena: el test como especificación ejecutable primero, y la seguridad de refactorizar sabiendo que la red está echada.",
      solutionCode: {
        lang: "php",
        source:
          "public static function romanoProvider(): array\n{\n    return [[1, \"I\"], [4, \"IV\"], [9, \"IX\"], [14, \"XIV\"], [20, \"XX\"]];\n}\n\n#[DataProvider(\"romanoProvider\")]\npublic function testConvierte(int $numero, string $esperado): void\n{\n    self::assertSame($esperado, Romano::desde($numero));\n}",
      },
    },
    {
      title: "Testea sin enviar emails",
      statement:
        "Un servicio RecuperarPassword genera un token y llama a un EmailSender real. Escribe su test unitario sin que se envíe nada: crea a mano (sin librería de mocks) un doble que capture el envío, y verifica que se llamó una vez, al destinatario correcto y con el token dentro. ¿Qué tipo de doble acabas de escribir?",
      solution:
        "Es un spy: implementa la interfaz, no hace nada real y RECUERDA cómo lo llamaron para que el test pregunte después. La condición que lo hace posible es que el servicio dependa de una interfaz inyectada — si hiciera new EmailSender dentro, no habría doble que valga: la testabilidad es una propiedad del diseño, no del framework de tests. Escribirlo a mano una vez es la mejor vacuna contra usar mocks sin entender qué generan.",
      solutionCode: {
        lang: "php",
        source:
          "final class EmailSenderSpy implements EmailSender\n{\n    /** @var list<array{destinatario: string, cuerpo: string}> */\n    public array $enviados = [];\n\n    public function envia(string $destinatario, string $cuerpo): void\n    {\n        $this->enviados[] = [\"destinatario\" => $destinatario, \"cuerpo\" => $cuerpo];\n    }\n}",
      },
    },
    {
      title: "El test que estorba",
      statement:
        "Este test pasa, y aun así es un mal test. Encuentra los dos motivos por los que estorbará al refactorizar, y reescríbelo para que proteja el comportamiento en lugar de la implementación.",
      code: {
        lang: "php",
        source:
          "public function testCalcula(): void\n{\n    $servicio = new CalculadoraDePrecios();\n    $reflexion = new ReflectionMethod($servicio, \"aplicaIvaInterno\");\n\n    self::assertSame(12.1, $reflexion->invoke($servicio, 10.0));\n    self::assertSame(1, $servicio->contadorDeLlamadas);\n}",
      },
      solution:
        "Uno: testea un método privado por reflexión — en cuanto renombres o fusiones ese método, el test rompe sin que el comportamiento haya cambiado. Dos: asevera sobre un contador interno, un detalle de implementación que a ningún consumidor le importa. El test bueno ataca la API pública y afirma el resultado observable: si un refactor lo rompe, es que rompiste comportamiento de verdad. Los tests acoplados a la implementación castigan el refactor, que es justo lo que debían proteger.",
      solutionCode: {
        lang: "php",
        source:
          "public function testElPrecioFinalIncluyeIva(): void\n{\n    $servicio = new CalculadoraDePrecios();\n\n    self::assertSame(12.1, $servicio->precioFinal(10.0));\n}",
      },
    },
  ],
  "observabilidad": [
    {
      title: "Logs que responden preguntas",
      statement:
        "Toma un script PHP con logs de texto libre («Error al procesar pedido 42 del usuario 7») y conviértelos a JSON estructurado con campos fijos. Después responde con jq, sobre el fichero de log, la pregunta que el texto libre no puede responder bien: ¿cuántos fallos hubo por usuario en la última hora?",
      solution:
        "Con texto libre esa pregunta son regex frágiles; con JSON es una consulta. La disciplina que lo hace posible: campos con nombre estable (level, event, user_id) en TODOS los logs, el mensaje humano aparte, y una línea por evento. Es exactamente lo que luego explota Loki con LogQL — jq sobre un fichero es la versión de juguete del mismo modelo mental: el log como datos, no como prosa.",
      solutionCode: {
        lang: "bash",
        source:
          "jq -s '[.[] | select(.level == \"error\")] | group_by(.user_id)\n  | map({user: .[0].user_id, fallos: length})' app.log",
      },
    },
    {
      title: "Expón /metrics a mano",
      statement:
        "Sin librerías: haz que tu app PHP exponga un endpoint /metrics en el formato de texto de Prometheus con dos métricas — un counter de peticiones totales (etiquetado por ruta) y un gauge con el timestamp del último deploy. Compruébalo con curl y explica por qué un counter jamás debe bajar.",
      solution:
        "El formato es texto plano con # TYPE y una línea por serie (nombre, etiquetas, valor). El counter solo sube porque Prometheus calcula tasas con rate(), que se apoya en incrementos entre scrapes: si el valor bajara arbitrariamente, la tasa saldría negativa o falsa — un reinicio a cero sí lo detecta y compensa. El gauge, en cambio, es una foto que sube y baja. Elegir mal el tipo corrompe silenciosamente todos los dashboards que se construyan encima.",
      solutionCode: {
        lang: "php",
        source:
          "header(\"Content-Type: text/plain; version=0.0.4\");\n\necho \"# TYPE http_requests_total counter\\n\";\n\nforeach ($contadores as $ruta => $total) {\n    echo \"http_requests_total{route=\\\"$ruta\\\"} $total\\n\";\n}\n\necho \"# TYPE app_last_deploy_timestamp gauge\\n\";\necho \"app_last_deploy_timestamp \" . filemtime(\"/var/www/RELEASE\") . \"\\n\";",
      },
    },
    {
      title: "¿Cuál de las dos alertas despierta a alguien?",
      statement:
        "Redacta dos alertas para tu servicio: «la CPU de la base de datos supera el 90% durante 5 minutos» y «el p99 de latencia del checkout supera 2 segundos durante 5 minutos». Solo una merece despertar a un humano a las 4 de la mañana. Decide cuál, y qué haces con la otra.",
      solution:
        "Despierta la de latencia: es un síntoma — mide dolor real de usuarios, y quien se despierta sabe que hay impacto. La CPU al 90% es una causa posible: puede ser un backup nocturno inofensivo o la base de datos aguantando perfectamente; despertar por causas fabrica falsas alarmas, y la fatiga de alertas acaba en alertas ignoradas — el peor estado posible de un sistema de guardia. La de CPU vive en un dashboard, como contexto para diagnosticar cuando un síntoma dispare. Se alerta sobre síntomas; se diagnostica con causas.",
    },
  ],
  "phpunit": [
    {
      title: "Veinte casos, un test",
      statement:
        "Escribe un validador de DNI español (8 dígitos + letra de control) y su test con un data provider que cubra: válidos, letra incorrecta, longitud mala, letras minúsculas y cadena vacía. Nombra cada caso del provider. ¿Qué te da esto que no den 5 tests copiados?",
      solution:
        "Un solo test declara el comportamiento y la tabla lo puebla: añadir el caso raro que aparezca en producción mañana es una línea, no otro método duplicado. Las claves con nombre («letra que no corresponde») son la parte menos apreciada y más útil: cuando falle, PHPUnit te dice QUÉ caso falló sin abrir el fichero. Un data provider es una especificación en formato tabla.",
      solutionCode: {
        lang: "php",
        source:
          "public static function dniProvider(): array\n{\n    return [\n        \"valido\" => [\"12345678Z\", true],\n        \"letra que no corresponde\" => [\"12345678A\", false],\n        \"demasiado corto\" => [\"1234567Z\", false],\n        \"minuscula valida\" => [\"12345678z\", true],\n        \"vacio\" => [\"\", false],\n    ];\n}\n\n#[DataProvider(\"dniProvider\")]\npublic function testValida(string $dni, bool $esperado): void\n{\n    self::assertSame($esperado, Dni::esValido($dni));\n}",
      },
    },
    {
      title: "El mock con expectativas",
      statement:
        "Un servicio CancelarPedido debe: buscar el pedido en el repositorio, marcarlo cancelado y guardarlo UNA sola vez. Escribe el test con createMock: un stub para la búsqueda y una expectativa estricta para el guardado (veces exactas y argumento verificado con un callback). Rompe luego el servicio duplicando el save y mira el mensaje.",
      solution:
        "El stub de find alimenta el escenario; la expectativa sobre save es la aseveración real del test: exactly(1) y el callback que inspecciona el estado del pedido guardado. Al duplicar el save, PHPUnit falla con «expected 1, invoked 2» — el mock verificó la INTERACCIÓN, que aquí es el comportamiento observable (no hay valor de retorno que comprobar). La regla del curso sigue aplicando: expectativas de interacción solo donde la interacción ES el contrato; para lo demás, aseverar estado.",
      solutionCode: {
        lang: "php",
        source:
          "$repositorio = $this->createMock(PedidoRepository::class);\n$repositorio->method(\"find\")->willReturn($pedido);\n$repositorio->expects($this->once())\n    ->method(\"save\")\n    ->with($this->callback(\n        fn (Pedido $guardado) => $guardado->estado() === Estado::Cancelado,\n    ));\n\n(new CancelarPedido($repositorio))->ejecuta(42);",
      },
    },
    {
      title: "La excepción también es contrato",
      statement:
        "Tu servicio de transferencias lanza SaldoInsuficienteException con el déficit en el mensaje cuando no hay fondos. Escribe el test que verifica la clase de excepción Y parte del mensaje — y colócalo de forma que también verifiques que NO se ejecutó nada después del punto de fallo. ¿Dónde tiene que ir la llamada que revienta?",
      solution:
        "expectException se declara ANTES de la llamada — es una promesa sobre el futuro — y la llamada que lanza debe ser lo último del test: todo lo que pongas después de ella no se ejecuta jamás, incluido cualquier assert que creyeras estar haciendo (un clásico silencioso). Para verificar que no hubo efectos colaterales, la aseveración va en un doble (el repositorio espera never() sobre save) porque el flujo del test muere con la excepción.",
      solutionCode: {
        lang: "php",
        source:
          "$this->expectException(SaldoInsuficienteException::class);\n$this->expectExceptionMessageMatches(\"/faltan 25\\.00/\");\n\n$cuentas->expects($this->never())->method(\"save\");\n\n$servicio->transfiere($origenCon50, $destino, importe: 75.0);",
      },
    },
  ],
  "programar-con-ia": [
    {
      title: "El mismo prompt, con y sin contexto",
      statement:
        "Pide a tu asistente de IA la misma función dos veces en conversaciones separadas: (1) «hazme una función que valide IBANs» a secas, y (2) la misma petición aportando tu firma exacta, tus convenciones (excepciones tipadas, sin else) y dos tests que debe pasar. Compara los resultados como si revisaras dos PRs. ¿Qué decidió la IA por ti en la versión 1?",
      solution:
        "En la versión sin contexto, la IA decidió el lenguaje de los errores (¿bool? ¿excepción? ¿array de errores?), el naming, el manejo de entrada sucia y hasta el alcance (¿valida el checksum o solo el formato?) — y lo decidió con la media de su entrenamiento, no con tu proyecto. La versión con contexto convierte esas decisiones en requisitos. La lección operativa del curso: la calidad de lo generado es función del contrato que le des, y los tests son el contrato más barato y menos ambiguo que existe.",
    },
    {
      title: "Caza la alucinación con red",
      statement:
        "Pide código que use una librería real que NO conozcas bien (por ejemplo, publicar en Redis Streams desde PHP). Antes de ejecutarlo, audita contra la documentación oficial cada llamada: nombre del método, orden de parámetros, valores de retorno. Anota cuántas afirmaciones eran verificables y cuántas te habrías tragado.",
      solution:
        "El patrón de las alucinaciones de API es que son plausibles: métodos que DEBERÍAN existir con ese nombre, parámetros en el orden «lógico». Por eso la revisión por intuición no las caza — tu intuición y la del modelo se entrenaron con lo mismo. La red es mecánica: la doc oficial o el propio código fuente de la librería como árbitro, y un test de integración que ejecute la llamada de verdad. Regla del curso: cuanto menos conoces el terreno, menos puedes revisar a ojo y más necesitas verificación ejecutable.",
    },
    {
      title: "El diff generado, bajo tu checklist",
      statement:
        "Toma un cambio no trivial generado por IA (o genera uno: «añade rate limiting a este endpoint») y revísalo con una checklist escrita por ti ANTES de mirar el diff: casos borde cubiertos, errores manejados, seguridad, tests, consistencia con el proyecto. Firma mentalmente el resultado como si el commit llevara tu nombre — porque lo lleva.",
      solution:
        "La checklist previa es el truco: si revisas sin ella, el código bien formateado y seguro de sí mismo te arrastra a asentir — el sesgo de fluidez es real. Contra la lista, aparecen los huecos típicos de lo generado: el happy path impecable, los bordes flojos (¿qué pasa con el reloj que retrocede en el rate limiter?, ¿y con múltiples workers?), y decisiones no pedidas coladas de regalo. El criterio final del curso: la IA multiplica tu producción, no tu responsabilidad — esa no se delega.",
    },
  ],
  "diseno-y-arquitectura": [
    {
      title: "Un puerto, dos adaptadores",
      statement:
        "Toma un caso de uso tuyo que hable directamente con Doctrine o PDO y sepáralo en hexagonal: define el puerto (interfaz de repositorio en lenguaje del dominio), mueve el acceso a datos a un adaptador, y escribe un segundo adaptador EnMemoria. La prueba del algodón: el test del caso de uso debe correr sin base de datos y sin mocks.",
      solution:
        "El puerto lo define el dominio con sus palabras (buscaPorEmail, no findOneBy con array); el adaptador de Doctrine lo implementa en la capa de infraestructura. El adaptador EnMemoria —un array— no es un apaño de test: es la demostración de que el dominio no sabe qué hay detrás del puerto, y da tests rápidos y legibles sin fixtures de mocks. Cuando cambiar de ORM o testear sin base de datos deja de dar miedo, la arquitectura está haciendo su trabajo.",
      solutionCode: {
        lang: "php",
        source:
          "final class UsuarioRepositorioEnMemoria implements UsuarioRepositorio\n{\n    /** @var array<string, Usuario> */\n    private array $usuarios = [];\n\n    public function guarda(Usuario $usuario): void\n    {\n        $this->usuarios[$usuario->email()] = $usuario;\n    }\n\n    public function buscaPorEmail(string $email): ?Usuario\n    {\n        return $this->usuarios[$email] ?? null;\n    }\n}",
      },
    },
    {
      title: "El evento saca al intruso del agregado",
      statement:
        "Un método Usuario::registra() termina enviando el email de bienvenida (le inyectaron el mailer al agregado). Refactoriza con eventos de dominio: el agregado registra UsuarioRegistrado, y el envío ocurre en un handler fuera. ¿Qué gana el dominio y qué decisión nueva aparece sobre CUÁNDO despachar?",
      solution:
        "El agregado vuelve a hablar solo su idioma: registra el hecho (el evento es pasado inmutable: «esto ocurrió») y pierde la dependencia de infraestructura; añadir «y también dale un cupón» mañana es otro handler, sin tocar Usuario. La decisión nueva es el momento del despacho: si despachas al instante y la transacción luego falla, enviaste bienvenida de un usuario que no existe — por eso lo robusto es despachar tras el commit, y si el handler debe sobrevivir a caídas, esto conecta con el outbox de distribuidos.",
      solutionCode: {
        lang: "php",
        source:
          "public function registra(): void\n{\n    $this->estado = Estado::Activo;\n    $this->registraEvento(new UsuarioRegistrado($this->id, $this->email));\n}\n\nfinal class EnviaBienvenida\n{\n    public function __invoke(UsuarioRegistrado $evento): void\n    {\n        $this->mailer->bienvenida($evento->email);\n    }\n}",
      },
    },
    {
      title: "Separa la lectura que no encaja",
      statement:
        "El dashboard de tu app necesita «pedidos por día con nombre de cliente y total, últimos 30 días». Implementarlo con los agregados del dominio obliga a cargar cientos de objetos para tirar el 90%. Aplica CQRS mínimo: un read model que sirva ESA vista. ¿Qué le está permitido a ese modelo de lectura que al de escritura le está prohibido?",
      solution:
        "El read model puede saltarse todo lo que protege al de escritura: consulta SQL directa con JOINs y agregación (o una vista/tabla desnormalizada), devuelve DTOs planos sin invariantes y no pasa por repositorios de agregados — porque leer no puede romper reglas de negocio. El de escritura conserva los agregados y su consistencia. Esa asimetría es CQRS; el event sourcing es otra decisión aparte, y el criterio del curso es empezar por esta separación barata cuando las consultas de lectura empiezan a deformar el dominio.",
      solutionCode: {
        lang: "sql",
        source:
          "SELECT DATE(p.creado_en) AS dia, c.nombre, SUM(p.total) AS total\nFROM pedidos p\nJOIN clientes c ON c.id = p.cliente_id\nWHERE p.creado_en >= NOW() - INTERVAL 30 DAY\nGROUP BY dia, c.nombre\nORDER BY dia DESC;",
      },
    },
  ],
  "python": [
    {
      title: "El generador que no revienta la RAM",
      statement:
        "Genera un fichero de 5 millones de líneas y procésalo dos veces: una cargándolo con readlines() y una list comprehension, otra con un generador (expresión generadora o yield). Mide memoria pico con tracemalloc en ambas. Explica la diferencia con el modelo de evaluación de cada uno.",
      solution:
        "La lista materializa los 5 millones de elementos a la vez: la memoria pico crece con el tamaño del fichero. El generador produce un elemento cada vez que alguien se lo pide y no recuerda los anteriores: memoria plana, del tamaño de UNA línea, sea el fichero de 5 millones o de 500. El precio: solo se recorre una vez y no tiene len(). Es el patrón por defecto para pipelines de datos — y la razón de que range, map o las líneas de un fichero abierto sean perezosos en Python 3.",
      solutionCode: {
        lang: "python",
        source:
          "import tracemalloc\n\ntracemalloc.start()\n\nwith open(\"datos.txt\") as fichero:\n    total = sum(1 for linea in fichero if \"error\" in linea)\n\n_, pico = tracemalloc.get_traced_memory()\nprint(f\"pico: {pico / 1_048_576:.1f} MB\")",
      },
    },
    {
      title: "Escribe @cronometra",
      statement:
        "Implementa un decorador @cronometra que imprima cuánto tardó la función decorada, sin perder su nombre ni su docstring (compruébalo con __name__). Aplícalo a dos funciones distintas. Explica qué es exactamente lo que hace la sintaxis @ por debajo.",
      solution:
        "La @ es azúcar para funcion = cronometra(funcion): el decorador recibe la función, devuelve otra que la envuelve, y el nombre original pasa a apuntar a la envoltura. Por eso sin functools.wraps el __name__ diría «envoltura» — wraps copia la identidad de la original. Entender esto desmonta la magia de @app.get de FastAPI o @pytest.fixture: son funciones que reciben tu función y la registran o la transforman.",
      solutionCode: {
        lang: "python",
        source:
          "import functools\nimport time\n\ndef cronometra(funcion):\n    @functools.wraps(funcion)\n    def envoltura(*args, **kwargs):\n        inicio = time.perf_counter()\n        resultado = funcion(*args, **kwargs)\n        duracion = time.perf_counter() - inicio\n        print(f\"{funcion.__name__}: {duracion:.3f}s\")\n        return resultado\n\n    return envoltura",
      },
    },
    {
      title: "FastAPI valida por ti (hasta donde le digas)",
      statement:
        "Monta un endpoint POST /usuarios con un modelo Pydantic: email validado como email real, edad entero entre 18 y 120. Pruébalo con curl tres veces: datos buenos, edad 15 y edad \"quince\". Lee las tres respuestas y di qué trabajo acabas de delegar y qué validación NO puede hacer Pydantic por ti.",
      solution:
        "Con datos malos, FastAPI devuelve 422 con el detalle por campo sin que escribieras un if: el modelo ES el contrato, y además alimenta la documentación de /docs. Lo que Pydantic no puede saber: las reglas que dependen de estado — que el email no exista ya, que el usuario tenga permiso. La frontera del curso: la validación de FORMA vive en el modelo; la de NEGOCIO, en tu capa de servicio. Confundirlas acaba con lógica de negocio en validators de Pydantic, imposible de reutilizar fuera de HTTP.",
      solutionCode: {
        lang: "python",
        source:
          "from fastapi import FastAPI\nfrom pydantic import BaseModel, EmailStr, Field\n\napp = FastAPI()\n\nclass UsuarioNuevo(BaseModel):\n    email: EmailStr\n    edad: int = Field(ge=18, le=120)\n\n@app.post(\"/usuarios\", status_code=201)\ndef crea_usuario(usuario: UsuarioNuevo):\n    return {\"email\": usuario.email}",
      },
    },
  ],
  "rust": [
    {
      title: "Pelea tu primer error de ownership",
      statement:
        "Escribe este programa, intenta compilarlo y lee el error COMPLETO antes de arreglar nada: crea un String, pásalo a una función saluda(nombre: String) y vuelve a usarlo en main después de la llamada. Arréglalo de dos formas distintas y di cuál preferirías y por qué.",
      code: {
        lang: "rust",
        source:
          "fn saluda(nombre: String) {\n    println!(\"Hola, {nombre}\");\n}\n\nfn main() {\n    let nombre = String::from(\"Ada\");\n    saluda(nombre);\n    println!(\"Adiós, {nombre}\"); // no compila: ¿por qué?\n}",
      },
      solution:
        "saluda(nombre) MUEVE el String: la función pasa a ser su dueña, lo libera al terminar, y main ya no puede usarlo — el compilador te está impidiendo un use-after-free que en C sería un bug silencioso. Arreglos: prestar con &str (la función solo necesita leer: es la opción idiomática) o clonar (copia real, cuesta memoria). La regla mental que instala el reto: cada valor tiene UN dueño, y pasar sin & es entregar la propiedad.",
      solutionCode: {
        lang: "rust",
        source:
          "fn saluda(nombre: &str) {\n    println!(\"Hola, {nombre}\");\n}\n\nfn main() {\n    let nombre = String::from(\"Ada\");\n    saluda(&nombre);\n    println!(\"Adiós, {nombre}\");\n}",
      },
    },
    {
      title: "El enum que hace imposible el estado ilegal",
      statement:
        "Modela un pago que puede estar Pendiente, Confirmado (con fecha) o Rechazado (con motivo) usando un enum con datos. Escribe una función descripcion(pago) con match — y comprueba qué pasa al compilar si añades una variante nueva Reembolsado y NO tocas el match.",
      solution:
        "El match sobre enums es exhaustivo: al añadir Reembolsado, el compilador señala cada match del proyecto que no la contempla — el caso olvidado pasa de bug en producción a error de compilación. Y como cada variante lleva SUS datos, no existe «confirmado sin fecha» ni «rechazado sin motivo»: el estado ilegal no se valida, directamente no se puede construir. Es la versión con esteroides del consejo de OOP de hacer irrepresentables los estados inválidos.",
      solutionCode: {
        lang: "rust",
        source:
          "enum Pago {\n    Pendiente,\n    Confirmado { fecha: String },\n    Rechazado { motivo: String },\n}\n\nfn descripcion(pago: &Pago) -> String {\n    match pago {\n        Pago::Pendiente => \"En espera\".into(),\n        Pago::Confirmado { fecha } => format!(\"Confirmado el {fecha}\"),\n        Pago::Rechazado { motivo } => format!(\"Rechazado: {motivo}\"),\n    }\n}",
      },
    },
    {
      title: "Errores con ? de principio a fin",
      statement:
        "Escribe una función que lea un fichero de configuración y devuelva el valor entero de la clave puerto: cada paso puede fallar (fichero ausente, clave ausente, valor no numérico). Sin unwrap ni panic: firma que devuelve Result, operador ? en cada paso, y el main decide qué hacer con el error. ¿Qué hace exactamente el ? en cada línea?",
      solution:
        "El ? desazucara a un match: si es Ok extrae el valor y sigue; si es Err, RETORNA el error convertido al tipo de error de la función (vía From) — propagación explícita en un carácter, visible en cada línea que puede fallar. La diferencia con las excepciones de PHP: el fallo está en la firma (Result) y el compilador no te deja ignorarlo; unwrap es decirle «si falla, revienta», aceptable en un ejemplo, deuda en producción.",
      solutionCode: {
        lang: "rust",
        source:
          "use std::fs;\n\nfn puerto_configurado(ruta: &str) -> Result<u16, Box<dyn std::error::Error>> {\n    let contenido = fs::read_to_string(ruta)?;\n    let linea = contenido\n        .lines()\n        .find(|linea| linea.starts_with(\"puerto=\"))\n        .ok_or(\"falta la clave puerto\")?;\n    let puerto = linea.trim_start_matches(\"puerto=\").trim().parse()?;\n\n    Ok(puerto)\n}",
      },
    },
  ],
  "claude-code": [
    {
      title: "Escribe una rule y mide si se obedece",
      statement:
        "Elige una convención real de tu proyecto que el agente incumpla de vez en cuando. Escríbela en el CLAUDE.md de dos formas: primero como prohibición seca, luego con el mecanismo y el porqué. Abre una sesión nueva con cada versión, pide una tarea que la ponga a prueba y compara el comportamiento.",
      solution:
        "La versión con porqué gana casi siempre, y el motivo es el de la lección: un modelo generaliza bien desde mecanismos («fetch falla por CORS en file://, usa un .js que asigne a un global») y mal desde prohibiciones sueltas, que invitan a la excepción. De regalo, el experimento te enseña el ciclo completo: detectar la corrección repetida, destilarla a regla, y verificar contra la realidad en vez de suponer.",
    },
    {
      title: "Monta el servidor MCP mínimo",
      statement:
        "Crea un servidor MCP con una sola tool que consulte algo tuyo de verdad (tu BD de desarrollo con conexión de solo lectura, o un fichero de datos). Conéctalo con .mcp.json, abre una sesión y pídele al agente algo que necesite esa tool. Después intenta colarle una operación de escritura y comprueba que el servidor la rechaza.",
      code: {
        lang: "bash",
        source: "npm init -y && npm install @modelcontextprotocol/sdk zod",
      },
      solution:
        "Al pedirle el dato, el agente descubre tu tool en el catálogo y la invoca sin que tú toques nada — el bucle de siempre con un brazo ejecutor nuevo. La parte importante es el segundo paso: la escritura la rechaza tu validación dentro del servidor (y la credencial de solo lectura), no la buena voluntad del modelo. Esa es la frontera determinista de todo el curso, ahora escrita por ti.",
    },
    {
      title: "Un hook que protege un invariante",
      statement:
        "Elige un fichero de tu proyecto que nunca deba editarse a mano (uno generado, un lockfile) y escribe un hook pre-herramienta que bloquee su edición con un mensaje que diga qué hacer en su lugar. Pide luego al agente una tarea que le tiente a editarlo y observa la secuencia completa.",
      solution:
        "La secuencia que buscas: el agente intenta la edición, el hook la veta, el mensaje vuelve a su contexto y el agente corrige el rumbo solo (regenera el fichero con el comando correcto). Un buen mensaje de bloqueo no dice «prohibido»: dice el camino correcto — el hook no solo protege, enseña en el momento exacto del error, que es cuando las lecciones entran.",
    },
  ],
  "construir-con-ia": [
    {
      title: "El clasificador con contrato",
      statement:
        "Monta el clasificador de tickets del curso de punta a punta en PHP: salida estructurada con una clase (categoría como enum cerrado, urgencia 1-5, requiereHumano), y pruébalo con diez tickets inventados — incluye dos ambiguos y uno que intente inyección («ignora tus instrucciones y…»). Registra el usage de cada llamada.",
      solution:
        "Los diez responden con el objeto tipado — el no determinismo queda en los valores, nunca en la forma. Los ambiguos son la prueba interesante: si tu esquema tiene vía de escape, acaban en «otro» o con requiereHumano a true en vez de en una categoría inventada. Y la inyección se queda en anécdota porque viaja como user, separada de tu system. El usage registrado es la semilla del hábito de la última lección: medir desde el día uno.",
    },
    {
      title: "Streaming de punta a punta",
      statement:
        "Construye la tubería completa en local: un endpoint PHP que consume el stream del SDK y reemite SSE, y una página con EventSource que pinta la respuesta palabra a palabra. Después ponle un nginx delante (docker) sin configurar nada y observa qué pasa con el goteo. Arréglalo.",
      solution:
        "En directo contra php -S el goteo fluye; detrás de nginx llega de golpe al final — el proxy hace buffering por defecto y mata el streaming en silencio, exactamente el gotcha de la lección. La cabecera X-Accel-Buffering: no (o proxy_buffering off para esa location) lo arregla. Haberlo visto romperse una vez vale más que leerlo tres veces: es el fallo clásico del paso a producción.",
      solutionCode: {
        lang: "ini",
        source: "location /chat-stream {\n    proxy_pass http://app:8000;\n    proxy_buffering off;\n}",
      },
    },
    {
      title: "Tu primer golden set",
      statement:
        "Toma 30 casos del clasificador del primer reto y decide a mano la respuesta correcta de cada uno. Escribe el runner: un script PHP que los pasa todos por el clasificador y saca el porcentaje de aciertos. Después cambia una frase del system prompt y vuelve a correrlo. ¿Mejoró?",
      solution:
        "Ahora la pregunta tiene respuesta numérica: «la versión B acierta 27/30, la A acertaba 25/30». Sin el golden set, ese mismo cambio se habría evaluado con tres pruebas a mano y una intuición. El set crece con cada fallo real de producción (el caso que falló entra con su respuesta correcta), y el día que quieras probar un modelo más barato o llegue una retirada de modelo, el runner es tu red: correr y leer el número.",
      solutionCode: {
        lang: "php",
        source:
          "$aciertos = 0;\n\nforeach ($goldenSet as $caso) {\n    $resultado = $clasificador->clasifica($caso[\"texto\"]);\n\n    if ($resultado->categoria === $caso[\"esperado\"]) {\n        $aciertos++;\n    }\n}\n\necho sprintf(\"%d/%d (%.0f%%)\\n\", $aciertos, count($goldenSet), 100 * $aciertos / count($goldenSet));",
      },
    },
  ],
  "la-maquina": [
    {
      title: "Filas contra columnas, medido",
      statement:
        "Ejecuta el experimento de la lección de CPU: recorre una matriz de 2000×2000 por filas y por columnas, cronometrando ambos con hrtime. Mismo número de sumas exactas. Anota la diferencia — y si tienes Go o Rust a mano, repítelo ahí y compara la brecha.",
      solution:
        "En PHP verás una diferencia moderada (el intérprete amortigua); en un lenguaje compilado, brutal. La causa es una sola: por filas aprovechas cada línea de caché de 64 bytes; por columnas la desperdicias y vas a RAM una y otra vez. Mismo Big O, distinta física — a partir de hoy, «recorrer datos contiguos» deja de ser un consejo abstracto.",
      solutionCode: {
        lang: "php",
        source:
          "for ($fila = 0; $fila < $n; $fila++) {\n    for ($col = 0; $col < $n; $col++) {\n        $suma += $matriz[$fila][$col];\n    }\n}",
      },
    },
    {
      title: "Espía un hola mundo con strace",
      statement:
        "Ejecuta strace -c php -r 'echo \"hola\";' y estudia el resumen: ¿cuántas syscalls en total? ¿Cuáles dominan? Después lanza strace -e trace=write con el mismo echo y encuentra la línea exacta donde tu echo se convierte en syscall.",
      code: {
        lang: "bash",
        source: "strace -c php -r 'echo \"hola\\n\";'\nstrace -e trace=write php -r 'echo \"hola\\n\";'",
      },
      solution:
        "El resumen enseña cientos de llamadas — openat y mmap dominan (cargar el intérprete y sus librerías) — y tu programa entero es una: write(1, \"hola\\n\", 5). Esa desproporción es la lección: el lenguaje de alto nivel es azúcar sobre un menú corto de syscalls, y strace te deja verlo siempre que un proceso haga cosas raras.",
    },
    {
      title: "Provoca un TIME_WAIT masivo",
      statement:
        "Con un servidor local (php -S localhost:8000), lanza 2000 curls seguidos en un bucle y a continuación ejecuta ss -tan | grep -c TIME-WAIT. Explica qué ves, por qué pasa, y qué pieza de tu stack real existe para evitarlo.",
      solution:
        "Verás cientos o miles de TIME_WAIT: cada curl abrió y cerró su propia conexión, y quien cierra retiene la tumba ~60 segundos por si llegan paquetes rezagados. Es inofensivo en tu máquina y un problema a escala (agotamiento de puertos efímeros). La pieza que lo evita: reutilizar conexiones — keep-alive en HTTP, el pool de conexiones hacia MySQL. Ahora el consejo del curso de rendimiento tiene su porqué de kernel.",
      solutionCode: {
        lang: "bash",
        source: "for i in $(seq 2000); do curl -s localhost:8000 > /dev/null; done\nss -tan | grep -c TIME-WAIT",
      },
    },
  ],
  "k8s-para-devs": [
    {
      title: "Mata al pod y pierde la batalla",
      statement:
        "Con tu kind levantado y el deployment de 2 réplicas aplicado: abre kubectl get pods -w en una terminal y, desde otra, borra un pod. Cronometra cuánto tarda el sustituto en estar Running. Después intenta «ganar»: borra pods más rápido de lo que renacen. Espóiler: no puedes.",
      solution:
        "El sustituto aparece en segundos, y no hay forma de ganar: no compites contra un script que reacciona sino contra un bucle que compara estado deseado (2 réplicas) con real y actúa, indefinidamente. Cuando interiorizas que borrar pods es inútil mientras la declaración diga otra cosa, el modelo declarativo ha hecho clic — y entiendes por qué los cambios de verdad se hacen editando el manifiesto.",
      solutionCode: {
        lang: "bash",
        source: "kubectl get pods -w   # terminal 1\nkubectl delete pod <nombre>   # terminal 2, y observa",
      },
    },
    {
      title: "El deploy roto que nadie sufrió",
      statement:
        "Reproduce el experimento estrella del curso: tu app con /salud, despliega v1 sana, luego construye una v3 cuyo /salud devuelva 500 y aplícala. Mientras tanto, un bucle de curls contra el Service. Comprueba: ¿cuántos errores vieron tus «usuarios»? ¿En qué estado quedó el rollout? Sal del lío con rollout undo.",
      solution:
        "Cero errores: los pods v3 nunca pasan su readiness (0/1 Ready), el rollout se atasca tras el primer intento sin tocar los v2 sanos, y el Service solo enruta a quien está listo. kubectl rollout undo restaura la declaración anterior. Haber visto un deploy roto no doler es el argumento definitivo para no desplegar jamás sin readiness probe.",
      solutionCode: {
        lang: "bash",
        source: "while true; do curl -s localhost:8080 || echo FALLO; sleep 0.2; done\nkubectl rollout status deployment/academia-app\nkubectl rollout undo deployment/academia-app",
      },
    },
    {
      title: "Provoca un OOMKilled",
      statement:
        "Baja el límite de memoria de tu deployment a 32Mi y añade a tu index.php una ruta /comer que reserve memoria en bucle (str_repeat en un array). Llama a /comer y observa con kubectl get pods -w y describe qué le pasa al contenedor. ¿Quién lo mató y quién lo resucitó?",
      solution:
        "El contenedor muere y el pod muestra OOMKilled con restarts subiendo: lo mató el kernel (los cgroups aplicando el límite — la lección de syscalls en acción) y lo resucitó el Deployment (el bucle de reconciliación). Si la «fuga» persiste, verás el bucle muerte-resurrección en vivo: exactamente lo que significa CrashLoop con causa de memoria en producción, ahora visto con tus ojos.",
      solutionCode: {
        lang: "bash",
        source: "kubectl get pods -w\nkubectl describe pod <nombre> | grep -A3 \"Last State\"",
      },
    },
  ],
};
