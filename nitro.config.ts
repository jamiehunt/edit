import nitroCloudflareBindings from 'nitro-cloudflare-dev'
import { defineNitroConfig } from 'nitropack/config'

export default defineNitroConfig({
  modules: [nitroCloudflareBindings],
  preset: 'cloudflare_module',
  compatibilityDate: '2024-11-01',
  runtimeConfig: {
    WEBHOOK_URL: process.env.WEBHOOK_URL
  },
  srcDir: 'api/',
  routeRules: {
    '/': {
      cors: false
    }
  }
})
