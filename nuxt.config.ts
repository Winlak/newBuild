// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  devServer: {
    host: '0.0.0.0',
    port: 3000,
  },
  runtimeConfig: {
    adminLogin: process.env.ADMIN_LOGIN || '',
    adminPassword: process.env.ADMIN_PASSWORD || '',
    adminSessionSecret: process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || 'change-me',
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://novostroyki-nsk.ru',
      yandexMapsApiKey: process.env.NUXT_PUBLIC_YANDEX_MAPS_API_KEY || '',
    },
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'ru',
      },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#0d6efd' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },
  routeRules: {
    '/content/**': {
      headers: {
        'cache-control': 'public, max-age=31536000, immutable',
      },
    },
    '/icons/**': {
      headers: {
        'cache-control': 'public, max-age=31536000, immutable',
      },
    },
    '/favicon.ico': {
      headers: {
        'cache-control': 'public, max-age=31536000, immutable',
      },
    },
    '/api/apartments': {
      swr: 60,
    },
    '/api/apartments/**': {
      swr: 60,
    },
    '/api/reviews': {
      swr: 60,
    },
    '/admin': {
      headers: {
        'X-Robots-Tag': 'noindex, nofollow',
      },
    },
    '/admin/**': {
      headers: {
        'X-Robots-Tag': 'noindex, nofollow',
      },
    },
    '/api/admin/**': {
      headers: {
        'X-Robots-Tag': 'noindex, nofollow',
      },
    },
    '/api/**': {
      headers: {
        'X-Robots-Tag': 'noindex, nofollow',
      },
    },
  },
  vite: {
    optimizeDeps: {
      include: [
        '@fortawesome/fontawesome-svg-core',
        '@fortawesome/free-brands-svg-icons',
        '@fortawesome/vue-fontawesome',
        'vue',
        'vue-router',
      ],
    },
    server: {
      allowedHosts: [
        'localhost',
        '127.0.0.1',
        '.devtunnels.ms',
        'c69f-91-220-8-238.ngrok-free.app'
      ],
    },
  },
  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    'bootstrap-icons/font/bootstrap-icons.css'
  ],
  
})
