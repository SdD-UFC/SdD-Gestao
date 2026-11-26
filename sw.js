// Service worker do Painel SdDUFC: deixa o app instalável e abre a tela mesmo sem internet.
// Os dados continuam vindo do Firebase; aqui só ficam guardados os arquivos do site.
const CACHE = 'sdd-v7';
const FILES = ['./', './index.html', './firebase-config.js', './manifest.json', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return; // Firebase e Google passam direto
  // Rede primeiro (pega sempre a versão nova); se estiver sem internet, usa a cópia guardada.
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(cc => cc.put(e.request, c)); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html'))));
});
