import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import AstroPWA from '@vite-pwa/astro';

export default defineConfig({
  site: 'https://vergissberlin.github.io/andrelademann.de.skills',
  base: '/andrelademann.de.skills/',
  output: 'static',
  outDir: './dist',
  integrations: [
    AstroPWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'André Lademann Skills',
        short_name: 'AL Skills',
        description: 'Agent Skills catalog',
        start_url: '/andrelademann.de.skills/',
        scope: '/andrelademann.de.skills/',
        display: 'standalone',
        theme_color: '#1E2A45',
        background_color: '#1E2A45',
        icons: [
          { src: '/andrelademann.de.skills/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/andrelademann.de.skills/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: '/andrelademann.de.skills/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        navigateFallback: null,
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages',
              networkTimeoutSeconds: 3,
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 12 }
            }
          },
          {
            urlPattern: ({ request }) =>
              ['style', 'script', 'worker', 'font', 'image'].includes(request.destination),
            handler: 'CacheFirst',
            options: {
              cacheName: 'assets',
              expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 30 }
            }
          }
        ]
      }
    })
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
