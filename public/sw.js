const CACHE = "rakhlo-static-v6";
const OFFLINE_URL = "/offline.html";
const PRECACHE = [OFFLINE_URL, "/icon", "/icon1", "/apple-icon"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      Promise.all(PRECACHE.map((url) => cache.add(url).catch(() => undefined))),
    ),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("rakhlo-") && key !== CACHE)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = {
      title: "Rakhlo reminder",
      body: event.data.text(),
      url: "/reminders",
    };
  }

  const title = payload.title || "Rakhlo reminder";
  const options = {
    body: payload.body || "You have something to remember.",
    icon: "/icon",
    badge: "/icon1",
    tag: "rakhlo-reminder",
    data: { url: payload.url || "/reminders" },
    renotify: true,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || "/reminders", self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((client) => "focus" in client);
      if (existing) {
        existing.navigate(target);
        return existing.focus();
      }
      return self.clients.openWindow(target);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/auth/")) {
    return;
  }

  if (request.destination === "document") {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match(OFFLINE_URL).then((offline) => offline || Response.error()),
      ),
    );
    return;
  }

  if (
    request.destination !== "style" &&
    request.destination !== "script" &&
    request.destination !== "image"
  ) {
    return;
  }

  const immutable = url.pathname.startsWith("/_next/static/");

  if (immutable) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;

        return fetch(request)
          .then((response) => {
            if (!response.ok) return response;
            event.waitUntil(
              caches.open(CACHE).then((cache) => cache.put(request, response.clone())),
            );
            return response;
          })
          .catch(() => Response.error());
      }),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const update = fetch(request)
        .then((response) => {
          if (!response.ok) return response;
          event.waitUntil(
            caches.open(CACHE).then((cache) => cache.put(request, response.clone())),
          );
          return response;
        })
        .catch(() => cached || Response.error());

      return cached || update;
    }),
  );
});
