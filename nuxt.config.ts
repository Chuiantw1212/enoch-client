// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@element-plus/nuxt'],
  nitro: {
    firebase: {
      gen: 2,
      httpsOptions: {
        // https://firebase.google.com/docs/hosting/functions
        region: 'asia-east1',
      }
    },
    // https://nitro.unjs.io/config#compresspublicassets
    compressPublicAssets: {
      gzip: true,
      brotli: true,
    },
  }
})
