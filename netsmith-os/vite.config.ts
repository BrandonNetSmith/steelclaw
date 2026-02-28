import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 7100,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:7101',
        changeOrigin: true
      }
    }
  },
  preview: {
    port: 7100,
    host: true
  }
})
