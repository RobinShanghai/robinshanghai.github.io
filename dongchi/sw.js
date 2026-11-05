const CACHE = 'dongchi-shell-v1';
const FILES = ['./','./index.html','./style.css','./app.js','./data.js','./assets/friends.svg','./icon.svg','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('dongchi-shell-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(event.request.method!=='GET'||url.origin!==self.location.origin)return;
  const path = url.pathname.slice(new URL(self.registration.scope).pathname.length);
  if(!['','index.html','style.css','app.js','data.js','assets/friends.svg','icon.svg','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'].includes(path))return;
  event.respondWith(fetch(event.request).then(response=>{
    if(response.ok&&!response.redirected){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}
    return response;
  }).catch(()=>caches.match(event.request).then(cached=>cached||Response.error())));
});
