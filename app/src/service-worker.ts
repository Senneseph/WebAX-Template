/**
 * Service Worker for My WebAX App
 * 
 * Provides offline support, caching, and background sync.
 */

/// <reference lib="webworker" />

import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { BackgroundSyncPlugin } from 'workbox-background-sync';

declare const self: ServiceWorkerGlobalScope;

// Precache assets
precacheAndRoute(self.__WB_MANIFEST);

// Cache page navigations
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'pages',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
      })
    ]
  })
);

// Cache CSS, JS, and Web Worker requests with a Stale-While-Revalidate strategy
registerRoute(
  ({ request }) =>
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'worker',
  new StaleWhileRevalidate({
    cacheName: 'assets',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
      })
    ]
  })
);

// Cache images with a Cache-First strategy
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
      })
    ]
  })
);

// Cache API requests with a Stale-While-Revalidate strategy
registerRoute(
  ({ url }) => url.origin === 'https://jsonplaceholder.typicode.com',
  new StaleWhileRevalidate({
    cacheName: 'api',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 // 1 hour
      })
    ]
  })
);

// Background sync for API requests
const bgSyncPlugin = new BackgroundSyncPlugin('api-queue', {
  maxRetentionTime: 24 * 60 // Retry for up to 24 hours (in minutes)
});

// Register a route for API requests that will use background sync
registerRoute(
  ({ url }) => url.origin === 'https://jsonplaceholder.typicode.com' && url.pathname.startsWith('/posts'),
  new NetworkFirst({
    cacheName: 'api-posts',
    plugins: [bgSyncPlugin],
    networkTimeoutSeconds: 10
  }),
  'POST'
);

// Listen for the install event
self.addEventListener('install', (event) => {
  console.log('Service worker installed');
  
  // Skip waiting to activate the new service worker immediately
  self.skipWaiting();
});

// Listen for the activate event
self.addEventListener('activate', (event) => {
  console.log('Service worker activated');
  
  // Claim clients to take control of all open pages
  event.waitUntil(self.clients.claim());
});

// Listen for messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
