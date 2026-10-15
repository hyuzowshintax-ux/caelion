// ============================================================
// Cae1ioN ESPORTS — Service Worker (Offline Cache)
// ============================================================
const CACHE_NAME = 'cae1ion-v4';
const STATIC_ASSETS = [
  '/index.html',
  '/teams.html',
  '/community.html',
  '/shop.html',
  '/contact.html',
  '/assets/css/style.css',
  '/assets/js/main.js',
  '/assets/fonts/SuperChips.ttf',
  '/assets/fonts/DelRose.ttf',
  '/assets/img/logo-C1N.svg',
  '/assets/img/logo-C1N-trans.png',
  '/assets/img/favicon.svg',
  '/assets/img/orca.svg',
  '/assets/img/logo-C1N.jpg',
  'https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Inter:wght@400;500;600&family=Cinzel:wght@700;800;900&display=swap'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // Network-first untuk HTML, cache-first untuk asset statis
  if (e.request.mode === 'navigate' || url.pathname.endsWith('.html')) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
  } else {
    e.respondWith(
      caches.match(e.request).then((cached) => cached || fetch(e.request).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(e.request, copy));
        return res;
      }).catch(() => cached))
    );
  }
});
