// Define a cache name
const CACHE_NAME = 'dinz-ai-cache-v1';

// List of files to cache
const urlsToCache = [
  '/',
  '/index.html',
  '/index.js',
  '/manifest.json',
  '/icon.png'
];

// Install event: open a cache and add the files to it
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: serve from cache if available, otherwise fetch from network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // Not in cache - fetch from network
        return fetch(event.request);
      }
    )
  );
});
