/* ============================================================
   MentorAI — Service Worker
   Cachea el shell (CSS, JS, páginas principales) en install.
   Los tutoriales se añaden al content cache bajo demanda
   cuando el usuario pulsa "Guardar para viajar".

   Todas las rutas son RELATIVAS al scope del registro: el sitio
   puede vivir en la raíz del dominio o bajo un subdirectorio
   (GitHub Pages lo sirve en /MentorAI/) sin tocar nada.

   Al desplegar cambios en el shell, subir VERSION para que los
   navegadores que ya lo tienen cacheado se traigan lo nuevo.
   ============================================================ */

var VERSION = "v3";
var SHELL = "academia-shell-" + VERSION;
var CONTENT = "academia-content-" + VERSION;

var SHELL_PATHS = [
  "index.html",
  "cursos.html",
  "rutas.html",
  "articulos.html",
  "offline.html",
  "curso.html",
  "assets/css/styles.css",
  "assets/fonts/inter-400-latin.woff2",
  "assets/fonts/inter-500-latin.woff2",
  "assets/fonts/inter-600-latin.woff2",
  "assets/fonts/inter-700-latin.woff2",
  "assets/fonts/inter-800-latin.woff2",
  "assets/fonts/jetbrains-mono-400-latin.woff2",
  "assets/fonts/jetbrains-mono-500-latin.woff2",
  "assets/fonts/jetbrains-mono-600-latin.woff2",
  "assets/js/modules/core.js",
  "assets/js/modules/storage.js",
  "assets/js/modules/ui-text.js",
  "assets/js/modules/ui-icons.js",
  "assets/js/modules/catalog-card.js",
  "assets/js/modules/catalog-filters.js",
  "assets/js/modules/catalog.js",
  "assets/js/modules/courses.js",
  "assets/js/modules/exams.js",
  "assets/js/modules/paths.js",
  "assets/js/modules/home.js",
  "assets/js/modules/syntax.js",
  "assets/js/modules/tutorial-audio.js",
  "assets/js/modules/tutorial-nav.js",
  "assets/js/modules/tutorial-feedback.js",
  "assets/js/modules/tutorial.js",
  "assets/js/modules/checks.js",
  "assets/js/modules/quiz.js",
  "assets/js/modules/offline.js",
  "assets/js/modules/init.js",
  "assets/icons/icon-192.png",
  "assets/icons/icon-512.png",
  "assets/icons/icon-maskable-512.png",
  "assets/icons/apple-touch-icon.png",
  "tutorials/manifest.js",
  "tutorials/courses.js",
  "tutorials/paths.js",
  "tutorials/quizzes.js",
  "tutorials/checks.js",
  "manifest.webmanifest",
];

function shellUrls() {
  return SHELL_PATHS.map(function (path) {
    return new URL(path, self.registration.scope).href;
  });
}

function offlinePageUrl() {
  return new URL("offline.html", self.registration.scope).href;
}

/* ---------- Install: cachea el shell ---------- */
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches
      .open(SHELL)
      .then(function (cache) {
        return Promise.all(
          shellUrls().map(function (url) {
            return cache.add(url).catch(function () {});
          })
        );
      })
      .then(function () {
        return self.skipWaiting();
      })
  );
});

/* ---------- Activate: limpia caches obsoletos ---------- */
self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys
            .filter(function (key) {
              return key !== SHELL && key !== CONTENT;
            })
            .map(function (key) {
              return caches.delete(key);
            })
        );
      })
      .then(function () {
        return self.clients.claim();
      })
  );
});

/* ---------- Refresco del shell, una vez por arranque del worker ----------
   Evita quedarse con CSS y JS viejos entre despliegues sin pagar una
   revalidación por cada petición. Offline falla en silencio. */
var shellRefreshed = false;

function refreshShell() {
  if (shellRefreshed) return Promise.resolve();

  shellRefreshed = true;

  return caches.open(SHELL).then(function (cache) {
    return Promise.all(
      shellUrls().map(function (url) {
        return fetch(url, { cache: "reload" })
          .then(function (response) {
            if (response.ok) return cache.put(url, response);
          })
          .catch(function () {});
      })
    );
  });
}

/* ---------- Fetch: content cache → shell cache → red ---------- */
self.addEventListener("fetch", function (event) {
  var request = event.request;

  if (request.method !== "GET") return;

  var url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  var isNavigation =
    request.mode === "navigate" ||
    (request.headers.get("accept") || "").indexOf("text/html") !== -1;

  if (isNavigation) {
    event.waitUntil(refreshShell());
  }

  event.respondWith(respond(request, isNavigation));
});

/* Las páginas se enlazan con query string (curso.html?slug=go), así que la
   caché tiene que casar ignorando la query: si no, nada acierta nunca. */
function matchIn(cacheName, request, isNavigation) {
  return caches.open(cacheName).then(function (cache) {
    return cache.match(request).then(function (exact) {
      if (exact || !isNavigation) return exact;

      return cache.match(request, { ignoreSearch: true });
    });
  });
}

function respond(request, isNavigation) {
  return matchIn(CONTENT, request, isNavigation)
    .then(function (contentMatch) {
      if (contentMatch) return contentMatch;

      return matchIn(SHELL, request, isNavigation);
    })
    .then(function (cached) {
      if (cached) return cached;

      return fetch(request).catch(function () {
        if (isNavigation) {
          return caches.match(offlinePageUrl()).then(function (offlinePage) {
            if (offlinePage) return offlinePage;

            return sinConexion();
          });
        }

        return sinConexion();
      });
    });
}

function sinConexion() {
  return new Response("Sin conexión — vuelve cuando tengas internet.", {
    status: 503,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

/* ---------- Mensajes desde la página ---------- */
self.addEventListener("message", function (event) {
  var data = event.data || {};
  var source = event.source;

  if (data.type === "SAVE_COURSE") {
    event.waitUntil(saveCourse(data.slug, data.urls, source));
    return;
  }

  if (data.type === "REMOVE_COURSE") {
    event.waitUntil(removeCourse(data.urls));
    return;
  }
});

function saveCourse(slug, urls, client) {
  return caches
    .open(CONTENT)
    .then(function (cache) {
      var done = 0;
      var total = urls.length;

      return urls.reduce(function (chain, url) {
        return chain.then(function () {
          return fetch(url)
            .then(function (response) {
              if (response.ok) {
                return cache.put(url, response);
              }
            })
            .catch(function () {})
            .then(function () {
              done++;
              if (client) {
                client.postMessage({ type: "SAVE_PROGRESS", slug: slug, done: done, total: total });
              }
            });
        });
      }, Promise.resolve());
    })
    .then(function () {
      if (client) {
        client.postMessage({ type: "SAVE_DONE", slug: slug });
      }
    });
}

function removeCourse(urls) {
  return caches.open(CONTENT).then(function (cache) {
    return Promise.all(
      urls.map(function (url) {
        return cache.delete(url);
      })
    );
  });
}
