// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules:[
    '@pinia/nuxt',
  ],
   srcDir: 'src/',
   css: ['~/assets/css/main.css'],

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
   
})
