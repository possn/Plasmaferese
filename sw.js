// Cache-first service worker (offline). Works on HTTPS only (e.g., GitHub Pages).
const CACHE = "plasmaferese-v2-cache-2";
const ASSETS = ["./","./index.html","./manifest.json","./assets/icon-192.png","./assets/icon-512.png"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k===CACHE?null:caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch", e => {
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
    const copy = res.clone();
    caches.open(CACHE).then(c=>c.put(e.request, copy)).catch(()=>{});
    return res;
  }).catch(()=>hit)));
});
