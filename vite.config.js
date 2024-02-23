import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          compatConfig: {
            ATTR_FALSE_VALUE: false,
            RENDER_FUNCTION: false,
            MODE: 3 // fallback setting for bootstrap-vue
          }
        }
      }
    }),
  ],
  resolve: {
    alias: {
      vue: '@vue/compat',
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@views': fileURLToPath(new URL('./src/views', import.meta.url)),
      '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      '@router': fileURLToPath(new URL('./src/router', import.meta.url)),
      '@stores': fileURLToPath(new URL('./src/stores', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url))
    }
  }
})
