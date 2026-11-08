/* Modo sin conexión de Mundo Mente. Versión 1d4701e3 */
const V = 'mundo-mente-1d4701e3';
const ARCHIVOS = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "privacy.html",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/maskable-512.png",
  "icons/apple-touch-icon.png",
  "icons/favicon-32.png",
  "fonts/Baloo2-4a324d.woff2",
  "fonts/Lexend-45b4c6.woff2",
  "fonts/fonts.css"
];
/* Se guarda todo en una carpeta nueva por versión. La versión nueva espera hasta que la persona toque "Actualizar ahora". */
self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => Promise.all(ARCHIVOS.map(u => c.add(new Request(u, {cache: 'reload'}))))));
});
self.addEventListener('message', e => { if (e.data === 'SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
/* Siempre responde desde lo guardado de esta versión (rápido y sin conexión); solo archivos del mismo sitio. */
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) return;
  e.respondWith(caches.match(e.request, {ignoreSearch: true}).then(hit => hit || fetch(e.request).catch(() => caches.match('index.html'))));
});
