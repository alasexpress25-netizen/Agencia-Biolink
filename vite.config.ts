import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';
import clientConfig from './src/data/clientConfig.json';

const clientProfile = (clientConfig as any)?.profile || {};
const appTitle = clientProfile.browserTabTitle || (clientProfile.name ? `${clientProfile.name} - BioLink` : 'BioLink');
const appShortName = clientProfile.appName || clientProfile.name || 'BioLink';
const appDescription = clientProfile.metaDescription || clientProfile.bio || 'Página oficial de enlaces, comunidad y redes.';

export default defineConfig(() => {
  return {
    base: './', // Ensures static deployment on GitHub Pages or custom domain works out of the box
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'html-transform',
        transformIndexHtml(html: string) {
          return html
            .replace(/<title>.*?<\/title>/, `<title>${appTitle}</title>`)
            .replace(/(<meta\s+name="apple-mobile-web-app-title"\s+content=").*?("\s*\/?>)/, `$1${appShortName}$2`)
            .replace(/(<meta\s+property="og:title"\s+content=").*?("\s*\/?>)/, `$1${appTitle}$2`)
            .replace(/(<meta\s+name="description"\s+content=").*?("\s*\/?>)/, `$1${appDescription}$2`)
            .replace(/(<meta\s+property="og:description"\s+content=").*?("\s*\/?>)/, `$1${appDescription}$2`);
        },
      },
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icon.svg'],
        manifest: {
          id: '/',
          name: appTitle,
          short_name: appShortName,
          description: appDescription,
          theme_color: '#0f172a',
          background_color: '#0f172a',
          display: 'standalone',
          start_url: './',
          scope: './',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: 'pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
