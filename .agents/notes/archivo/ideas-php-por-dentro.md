# Ideas — PHP por dentro (cola de tutoriales aplicados)

Bloque temático **aplicado a PHP** que pidió el usuario (2026-06-21), aparte del
currículum de fundamentos CS (`plan-curriculum-fundamentos.md`). No es CS pura:
es cómo PHP, en concreto, hace lo que los fundamentos explican en abstracto. Por
eso varios temas **profundizan** tutoriales ya publicados en vez de repetirlos:
hay que cruzarlos con enlaces, no duplicar.

Categoría sugerida: reusar `php` (chip ya existente) o estrenar `runtime` si se
quiere agrupar. Decidir al publicar el primero.

## Temas pedidos → propuestas concretas

1. **Extensiones de PHP: qué son y para qué sirve cada una** (`extensiones-php`).
   - Qué es una extensión (escrita en C, `.so`/`.dll`), cómo se carga
     (`php.ini`, `extension=`), compiladas en el core vs PECL, ver las activas
     (`php -m`).
   - Las imprescindibles y su porqué: opcache, pdo/pdo_mysql, mbstring, intl,
     curl, json, gd/imagick, redis, sodium, bcmath, openssl.
   - **Aclaración clave (el usuario lo agrupó con extensiones):** `php-fpm` NO
     es una extensión, es un **SAPI** (interfaz por la que corre PHP). Va en el
     tutorial siguiente. Mencionarlo aquí solo para deshacer la confusión.

2. **SAPIs y PHP-FPM a fondo** (`php-fpm`).
   - Qué es un SAPI: CLI vs CGI vs mod_php vs **FPM** (FastCGI Process Manager).
   - Qué es FastCGI y por qué FPM: pools, `pm = static|dynamic|ondemand`,
     `pm.max_children`, ciclo de vida de un request.
   - Modelo **shared-nothing**: por qué el estado no persiste entre requests
     (cada uno arranca y muere) → estado fuera (Redis/BBDD).
   - **Cruce:** `procesos-hilos.html` ya introduce "PHP-FPM es multiproceso, un
     worker por petición". Este lo desarrolla; enlazar, no repetir.

3. **Cómo gestiona la memoria PHP** (`memoria-php`).
   - El gestor de Zend: `emalloc`/`efree`, arena por request, `memory_limit`,
     liberación total al final del request (barata: tira la arena entera).
   - **zvals**, refcounting y copy-on-write; el **garbage collector** de ciclos
     (`gc_collect_cycles`, por qué hace falta además del refcount).
   - **Cruce:** `memoria.html` ya da los fundamentos (stack/heap, virtual, caché)
     y toca `memory_limit` + copy-on-write por encima. Este baja al runtime de
     PHP. Enlazar como "memoria, en concreto en PHP".

4. **Workers y modelos de ejecución en PHP** (`workers-php`).
   - Dos sentidos de "worker": workers de **FPM** (request-per-process) vs
     workers de **cola** (Laravel Queue / Symfony Messenger / supervisor).
   - Procesos **long-running**: Swoole / RoadRunner / ReactPHP frente al modelo
     clásico que muere por request.
   - **Fugas en long-running**: por qué un worker que no muere acumula memoria y
     por qué se reinicia cada N jobs (`--max-jobs`, `memory_limit`).
   - **Cruce:** `async-event-loop.html` (Swoole/ReactPHP, no bloquear el loop) y
     `procesos-hilos.html`. Aquí el foco es operativo: colas y workers en prod.

## Orden sugerido
extensiones-php → php-fpm → memoria-php → workers-php (de lo más general/estático
a lo más dinámico y operativo). Sin dependencia dura; se pueden reordenar.

## Estado
Solo ideas en cola; ninguno empezado. Decidir categoría (`php` vs `runtime`) al
arrancar el primero y, en cada uno, enlazar con el tutorial de fundamentos que
profundiza (memoria / procesos-hilos / async-event-loop).
