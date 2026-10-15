/* Increment VERSION after publishing changed files. All cached assets are local to this package. */
const VERSION = 'nma-universe-v1';
const CACHE = VERSION + '-' + self.registration.scope;
const FILES = ['./','index.html','styles.css','personalization.js','app.js','assets/star.svg','assets/universe.svg','manifest.webmanifest'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('nma-universe-')&&key.endsWith(self.registration.scope)&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
  // Prefer current personalized files when online, and the complete local copy when offline.
  event.respondWith(fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,copy)));}return response;}).catch(()=>caches.match(event.request).then(cached=>cached||(event.request.mode==='navigate'?caches.match('index.html'):Response.error()))));
});
