'use strict';

const CACHE_NAME = "cryptocoin_static";

const FILES_CACHE = [
    'css/animate.min.css',
    'css/bootstrap.min.css',
    'css/main.css',
    'images/logo.png',
    'js/bootstrap.bundle.min.js',
    'fonts/Poppins-Regular.ttf',
    'offline.html',
    'js/main.js',
    'service-worker.js',
    'manifest.json',
    'api/coins-list.json',
    'api/coins.json',
];

//Install and activate progressive web app
self.addEventListener('activate', (evt) => {

    evt.waitUntil(

        caches.keys().then((keylist) => {

            return Promise.all(keylist.map((key) => {

                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }

            }));

        })
    )
});

self.addEventListener('install', (evt) => {

    evt.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("[Service Worker] - Registering static cache");
            return cache.addAll(FILES_CACHE);
        })
    );

    self.skipWaiting();

});

//Enabling offline navigation
self.addEventListener('fetch', (evt) => {

    if (evt.request.mode !== 'navigate') {
        return;
    }

    evt.respondWith(

        fetch(evt.request).catch(() => {

            return caches.open(CACHE_NAME).then((cache) => {

                return cache.match('offline.html');

            });

        })

    );

});