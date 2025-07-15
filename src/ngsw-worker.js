// ngsw-worker.js

import { ServiceWorkerGlobalScope } from '@angular/service-worker/worker';

interface CacheConfig {
  name: string;
  versions?: {
    [key: string]: string[];
  };
}

const cacheConfigs: CacheConfig[] = [
  {
    name: 'assets',
    versions: {
      'v1': ['assets/'],
    },
  },
  {
    name: 'index.html',
    versions: {
      'v1': ['index.html'],
    },
  },
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all(
      cacheConfigs.map((cacheConfig) => {
        return caches.open(cacheConfig.name).then((cache) => {
          return cache.addAll(cacheConfig.versions[Object.keys(cacheConfig.versions)[0]]);
        });
      })
    )
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      } else {
        return fetch(event.request);
      }
    })
  );
});
