import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Aksharastra',
        short_name: 'Aksharastra',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#3b82f6',
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/aksharastra-oncm\.onrender\.com\/.*/,
            handler: 'NetworkOnly',  // POST requests need NetworkOnly for bg sync
            method: 'POST',          // Only apply to POST requests
            options: {
              backgroundSync: {
                name: 'post-queue',
                options: {
                  maxRetentionTime: 24 * 60, // Retry for max of 24 hours
                },
              },
              networkTimeoutSeconds: 10, // Timeout to decide offline
            },
          },
          {
            urlPattern: /^https:\/\/aksharastra-oncm\.onrender\.com\/.*/,
            handler: 'NetworkFirst',
            method: 'GET',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      injectManifest: {
        swSrc: 'src/service-worker.js', // we'll create this below
      },
    }),
  ],
  base: '/',
});
