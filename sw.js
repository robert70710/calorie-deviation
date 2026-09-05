/* Service Worker — offline cache for calorie deviation PWA */
const CACHE_NAME = 'calorie-deviation-v5';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app-loader.js',
  './app.p1.0.js',
  './app.p1.1.js',
  './app.p1.2.js',
  './app.p1.3.js',
  './app.p1.4.js',
  './app.p1.5.js',
  './app.p1.6.js',
  './app.p1.7.js',
  './app.p1.8.js',
  './app.p1.9.js',
  './app.p1.10.js',
  './app.p2.0.js',
  './app.p2.1.js',
  './app.p2.2.js',
  './app.p2.3.js',
  './app.p2.4.js',
  './app.p2.5.js',
  './app.p2.6.js',
  './app.p2.7.js',
  './app.p2.8.js',
  './app.p2.9.js',
  './config.js',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.hostname.includes('supabase.co') || url.hostname.includes('jsdelivr.net') || url.hostname.includes('unpkg.com')) {
    event.respondWith(fetch(event.request));
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetched = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || fetched;
    })
  );
});
