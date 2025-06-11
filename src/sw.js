const CACHE_NAME = 'luminary-nexus-cache-v1';
const URLS_TO_CACHE = [
  // Add URLs of critical assets to pre-cache if known
  // For a generic wrapper, we'll rely on runtime caching.
  // './index.html', // Cache the main app shell
  // './renderer.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

self.addEventListener('fetch', event => {
  // We only want to cache GET requests for http/https
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  // For requests to the target website, try network first, then cache.
  // This ensures fresh content when online, but serves from cache when offline.
  if (event.request.url.startsWith('https://utopiancreations.github.io/luminarynexustoken/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return fetch(event.request).then(response => {
          // If the response is valid, clone it and store it in the cache.
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            cache.put(event.request, responseToCache);
          }
          return response;
        }).catch(() => {
          // Network request failed, try to serve from cache.
          return cache.match(event.request);
        });
      })
    );
  } else {
    // For other requests (e.g., local assets like index.html, renderer.js if they were in URLS_TO_CACHE)
    // use a cache-first strategy or network-first as appropriate.
    // For simplicity, let's try cache first for non-external assets.
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Cache hit - return response
          if (response) {
            return response;
          }
          return fetch(event.request); // Fallback to network
        }
      )
    );
  }
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
