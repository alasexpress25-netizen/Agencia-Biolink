import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';
import clientConfig from './src/data/clientConfig.json';

const clientProfile = (clientConfig as any)?.profile || {};
const appTitle = clientProfile.browserTabTitle || (clientProfile.name ? `${clientProfile.name} - BioLink` : 'BioLink');
const appShortName = clientProfile.appName || clientProfile.name || 'BioLink';
const appDescription = clientProfile.metaDescription || clientProfile.bio || 'Página oficial de enlaces, comunidad y redes.';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  return {
    base: './', // Ensures static deployment on GitHub Pages or custom domain works out of the box
    plugins: [
      react(),
      tailwindcss(),
      {
        // Publica src/data/clientConfig.json como /clientConfig.json en dist,
        // para que las páginas estáticas (turnos.html, servicios.html) lo lean.
        name: 'emit-client-config',
        generateBundle() {
          // Nunca publicar contraseñas ni métricas antiguas
          const { password: _pw, analytics: _an, ...publicConfig } = clientConfig as any;
          this.emitFile({
            type: 'asset',
            fileName: 'clientConfig.json',
            // _supabase: datos públicos (la anon key es pública por diseño; la seguridad la da RLS)
            source: JSON.stringify({
              ...publicConfig,
              _supabase: {
                url: env.VITE_SUPABASE_URL || '',
                anonKey: env.VITE_SUPABASE_ANON_KEY || '',
                siteId: env.VITE_SITE_ID || 'default',
              },
            }),
          });
        },
      },
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
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,json}'],
          // Sin esto, ?servicio=... no coincide con el precache y el SW devuelve index.html
          ignoreURLParametersMatching: [/^utm_/, /^fbclid$/, /^servicio$/],
          // Las páginas estáticas NO deben caer al index.html de la SPA
          navigateFallbackDenylist: [/turnos\.html/, /servicios\.html/, /pagina\.html/],
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
