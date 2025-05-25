const CACHE_VERSION = '1.0.2';
const CACHE_NAME = `bristol-park-hospital-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.png',
  '/manifest.json'
];

const shouldCache = (url) => {
  // Don't cache API requests
  if (url.includes('/api/')) {
    return false;
  }

  // Don't cache development files
  if (url.includes('/@vite/') || url.includes('/@fs/') || url.includes('/node_modules/')) {
    return false;
  }

  // Don't cache cache-busted files
  if (url.includes('cache_bust=') || url.includes('v=') || url.includes('?t=')) {
    return false;
  }

  // Don't cache HMR WebSocket connections
  if (url.includes('ws://') || url.includes('wss://')) {
    return false;
  }

  return true;
};

self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets...');
        return Promise.allSettled(
          STATIC_ASSETS.map(url =>
            cache.add(url).catch(error => {
              console.warn(`[SW] Failed to cache asset: ${url}`, error);
              return null;
            })
          )
        );
      })
      .then(() => {
        console.log('[SW] Service worker installed successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[SW] Service worker installation failed:', error);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      console.log('[SW] Cleaning up old caches...');
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log(`[SW] Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    })
    .then(() => {
      console.log('[SW] Service worker activated successfully');
      return self.clients.claim();
    })
    .catch(error => {
      console.error('[SW] Service worker activation failed:', error);
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip WebSocket and other non-HTTP protocols
  const url = new URL(event.request.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return;
  }

  // Skip development files and HMR
  if (url.pathname.includes('/@vite/') ||
      url.pathname.includes('/@fs/') ||
      url.pathname.includes('/node_modules/') ||
      url.search.includes('import') ||
      url.search.includes('t=')) {
    return;
  }

  const requestUrl = event.request.url;

  // Handle HTML requests (navigation)
  if (event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseClone);
              })
              .catch(error => console.warn('Cache put failed:', error));
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Return a basic offline page if available
              return caches.match('/offline.html');
            });
        })
    );
    return;
  }

  // Handle other resources
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok && shouldCache(requestUrl)) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseClone);
            })
            .catch(error => console.warn('Cache put failed:', error));
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
