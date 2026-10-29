/* BodyWise offline cache. Caches the app's own files after the first visit.
   Bump VERSION whenever you change any file so learners get the update. */
const VERSION = 'bodywise-v3';
const FILES = [
  './', './index.html', './manifest.webmanifest', './icons/icon.svg', './css/styles.css',
  './js/data/references.js', './js/data/systems.js', './js/data/curriculum.js',
  './js/data/lessons-1.js', './js/data/lessons-2.js', './js/data/lessons-3.js', './js/data/extras.js', './js/data/connections.js', './js/data/audit.js',
  './js/diagrams.js', './js/store.js', './js/quiz.js', './js/voice.js', './js/tutor.js', './js/interactive.js', './js/app.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  if (url.origin === location.origin) {
    // App files: cache first, fall back to network.
    e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request)));
  } else if (url.hostname.endsWith('fonts.googleapis.com') || url.hostname.endsWith('fonts.gstatic.com')) {
    // Fonts: network first, cache for offline use.
    e.respondWith(fetch(e.request).then((res) => { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(e.request, copy)); return res; }).catch(() => caches.match(e.request)));
  }
});
