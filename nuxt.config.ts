// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules:[
    '@pinia/nuxt',
    '@nuxtjs/i18n',
  ],
   srcDir: 'src/',
  
   css: ['~/assets/css/main.css'],

  runtimeConfig: {
    authEmail: '',
    authPassword: '',
  },

   app: {
    head: {
      title: 'My Store',
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: '/store.png',
        },
      ],
    },
  },

  i18n: {
    defaultLocale: 'en',
    strategy: 'no_prefix',
    langDir: 'locales',
  
    locales: [
      {
        code: 'en',
        language: 'en-US',
        name: 'English',
        file: 'en.json',
      },
      {
        code: 'de',
        language: 'de-DE',
        name: 'Deutsch',
        file: 'de.json',
      },
    ],
  },
   
})
