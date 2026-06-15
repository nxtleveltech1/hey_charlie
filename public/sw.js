const CACHE = "hcc-v1";
const OFFLINE_URLS = ["/", "/packages", "/weather", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(OFFLINE_URLS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const isOfflineCandidate =
    url.pathname === "/" ||
    url.pathname === "/packages" ||
    url.pathname === "/weather" ||
    url.pathname.startsWith("/api/packages") ||
    url.pathname.startsWith("/api/weather");

  if (!isOfflineCandidate) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() =>
        caches.match(request).then((cached) => cached || caches.match("/")),
      ),
  );
});

// Web push placeholder — wire VAPID keys in production
self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {
    title: "Hey Charlie Charters",
    body: "You have a new update.",
  };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/logo2.png",
      badge: "/logo2.png",
      data: { url: data.url || "/" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(clients.openWindow(url));
});
