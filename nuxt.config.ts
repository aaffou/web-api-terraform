// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    // Simple usage
    '@nuxtjs/eslint-module',
    // With options
    ['@nuxtjs/eslint-module', { /* module options */ }]
  ],
  runtimeConfig: {
    API_KEY: process.env.API_KEY
  }
})
