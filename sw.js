/* Match2Vote service worker.
 *
 * Exists mainly so the web app is installable: Android's beforeinstallprompt
 * needs a registered service worker with a real fetch handler, not just a
 * manifest. Caching is deliberately conservative so a new deploy is never
 * hidden behind a stale copy:
 *   - page loads (navigations): network first, cached shell only when offline
 *   - hashed Expo bundles under /_expo/static/: cache first (the hash changes
 *     on every build, so a cached copy can never be wrong)
 *   - everything else: network, falling back to cache only when offline
 * Bump CACHE_VERSION if you ever need to force every client to drop its cache.
 */

const CACHE_VERSION = 'm2v-v1';
const SHELL = ['/', '/index.html', '/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(SHELL))
      .catch(() => undefined)
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // App shell: always try the network so a fresh deploy shows up immediately.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put('/index.html', copy)).catch(() => undefined);
          return res;
        })
        .catch(() => caches.match('/index.html').then((hit) => hit || Response.error()))
    );
    return;
  }

  // Content-hashed bundles: safe to serve from cache forever.
  if (url.pathname.startsWith('/_expo/static/')) {
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy)).catch(() => undefined);
        return res;
      }))
    );
    return;
  }

  // Everything else (icons, manifest, JSON): network, cache only as an offline fallback.
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy)).catch(() => undefined);
        }
        return res;
      })
      .catch(() => caches.match(req).then((hit) => hit || Response.error()))
  );
});
