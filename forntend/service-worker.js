/// <reference lib="webworker" />
import { setCacheNameDetails, clientsClaim } from 'workbox-core';
import { NetworkOnly } from 'workbox-strategies';
import { BackgroundSyncPlugin } from 'workbox-background-sync';
import { registerRoute } from 'workbox-routing';

// Set custom cache name prefix
setCacheNameDetails({ prefix: 'aksharastra' });
// Immediately claim clients after activation
clientsClaim();

// Create Background Sync plugin instance to queue POST requests
const bgSyncPlugin = new BackgroundSyncPlugin('post-queue', {
  maxRetentionTime: 24 * 60, // Retry for max 24 hours (in minutes)
});

// Register route to handle POST requests to your API with Background Sync
registerRoute(
  ({ url, request }) =>
    url.origin === 'https://aksharastra-oncm.onrender.com' && request.method === 'POST',
  new NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  'POST'
);

// Force waiting service worker to become active immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Claim any clients immediately after activation
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
