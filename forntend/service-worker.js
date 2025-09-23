/// <reference lib="webworker" />
import { setCacheNameDetails, clientsClaim } from 'workbox-core';
import { NetworkOnly } from 'workbox-strategies';
import { BackgroundSyncPlugin } from 'workbox-background-sync';
import { registerRoute } from 'workbox-routing';

setCacheNameDetails({ prefix: 'aksharastra' });
clientsClaim();

const bgSyncPlugin = new BackgroundSyncPlugin('post-queue', {
  maxRetentionTime: 24 * 60, // Retry for max of 24 hours
});

registerRoute(
  ({ url, request }) =>
    url.origin === 'https://aksharastra-oncm.onrender.com' && request.method === 'POST',
  new NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  'POST'
);

// Skip waiting and activate service worker on install
self.addEventListener('install', (event) => {
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
