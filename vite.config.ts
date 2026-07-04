import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: 'hidden',
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react/') || id.includes('react-dom/')) {
              return 'vendor-react'
            }
            if (id.includes('react-router-dom/')) {
              return 'vendor-router'
            }
            if (id.includes('@tanstack/react-query/')) {
              return 'vendor-query'
            }
            if (id.includes('axios/')) {
              return 'vendor-http'
            }
          }
        },
      },
    },
  },
})