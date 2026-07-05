/* ============================================================
   MentorAI — Service Worker
   Cachea el shell (CSS, JS, páginas principales) en install.
   Los tutoriales se añaden al content cache bajo demanda
   cuando el usuario pulsa "Guardar para viajar".
   ============================================================ */

var SHELL = "academia-shell-v1";
var CONTENT = "academia-content-v1";

var SHELL_URLS = [
  "/index.html",
  "/cursos.html",
  "/rutas.html",
  "/articulos.html",
  "/offline.html",
  "/curso.html",
  "/assets/css/styles.css",
  "/assets/js/modules/core.js",
  "/assets/js/modules/storage.js",
  "/assets/js/modules/catalog.js",
  "/assets/js/modules/courses.js",
  "/assets/js/modules/paths.js",
  "/assets/js/modules/home.js",
  "/assets/js/modules/syntax.js",
  "/assets/js/modules/bridge.js",
  "/assets/js/modules/tutorial.js",
  "/assets/js/modules/quiz.js",
  "/assets/js/modules/offline.js",
  "/assets/js/modules/init.js",
  "/tutorials/manifest.js",
  "/tutorials/courses.js",
  "/tutorials/paths.js",
  "/tutorials/quizzes.js",
  "/manifest.webmanifest",
];

/* ---------- Install: cachea el shell ---------- */
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches
      .open(SHELL)
      .then(function (cache) {
        return cache.addAll(SHELL_URLS);
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

/* ---------- Fetch: content cache → shell cache → red ---------- */
self.addEventListener("fetch", function (event) {
  var url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(respond(event.request));
});

function respond(request) {
  return caches.open(CONTENT).then(function (contentCache) {
    return contentCache.match(request).then(function (contentMatch) {
      if (contentMatch) return contentMatch;

      return caches.open(SHELL).then(function (shellCache) {
        return shellCache.match(request).then(function (shellMatch) {
          if (shellMatch) return shellMatch;

          return fetch(request).catch(function () {
            return new Response("Sin conexión — vuelve cuando tengas internet.", {
              status: 503,
              headers: { "Content-Type": "text/plain; charset=utf-8" },
            });
          });
        });
      });
    });
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
  return caches.open(CONTENT).then(function (cache) {
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
  }).then(function () {
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
