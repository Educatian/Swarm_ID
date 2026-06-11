/* Design Tension Studio service worker.
   Strategy: network-first for the app shell (so every deploy reaches students
   on the next launch), falling back to cache when offline. Static assets are
   cached as they are fetched. */
const CACHE_NAME = "dts-shell-v1";
const SHELL = [
  "./index.html",
  "./app.js",
  "./styles.css",
  "./supabase-config.js",
  "./manifest.webmanifest",
  "./assets/logo.png",
  "./assets/hero-bg.webp",
  "./assets/material-symbols-outlined.woff2",
  "./assets/favicon-64.png",
  "./assets/icon-192.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  // Never intercept API/auth traffic (Supabase, Gemini, fonts CDNs).
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() =>
        caches.match(request).then(
          (cached) =>
            cached ||
            (request.mode === "navigate" ? caches.match("./index.html") : Response.error())
        )
      )
  );
});
