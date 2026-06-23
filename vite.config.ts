import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: 'hidden',
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
          if (id.includes('src/api')) {
            return 'api'
          }
          if (id.includes('src/hooks')) {
            return 'hooks'
          }
          if (id.includes('src/mocks')) {
            return 'mocks'
          }
          if (id.includes('src/components')) {
            return 'components'
          }
          if (id.includes('src/context')) {
            return 'context'
          }
        },
      },
    },
  },
})
