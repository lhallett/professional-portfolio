import { canCache, resolveReading } from './policy.mjs';
const SHELL = 'mobile-shell-v1';
const DATA = 'mobile-readings-v1';
const ASSETS = ['/', '/index.html', '/app.js', '/policy.mjs', '/manifest.webmanifest', '/icon.svg'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(SHELL).then(cache => cache.addAll(ASSETS)));
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if ((key.startsWith('mobile-shell-') || key.startsWith('mobile-readings-')) && ![SHELL, DATA].includes(key)) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});
self.addEventListener('message', event => {
  if (event.data === 'APPLY_UPDATE') self.skipWaiting();
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (canCache(url, event.request.method, self.location.origin)) {
    event.respondWith((async () => {
      const result = await resolveReading({
        network: async () => {
          const response = await fetch(event.request, { signal: AbortSignal.timeout(3000), cache: 'no-store' });
          if (!response.ok) throw new Error('Service unavailable');
          return response.json();
        },
        saved: async () => (await (await caches.open(DATA)).match(event.request))?.json(),
        save: async reading => (await caches.open(DATA)).put(event.request, Response.json(reading)),
      });
      return Response.json(result, { status: result.reading ? 200 : 503 });
    })());
  } else if (url.origin === self.location.origin && event.request.method === 'GET' && ASSETS.includes(url.pathname)) {
    event.respondWith(caches.open(SHELL).then(async cache => (await cache.match(event.request)) || fetch(event.request)));
  }
});
