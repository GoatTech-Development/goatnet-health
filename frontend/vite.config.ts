import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173, // Set the port for the development server
    open: true, // Automatically open the browser on server start
    cors: true, // Enable CORS
    proxy: {
      // Proxy API requests to your Express backend during development
      '/api': 'http://localhost:3000',
    },
  },
  build: {
    outDir: 'dist', // Specify the output directory for the build files
    assetsDir: 'assets', // Specify the directory to nest asset files under
  },
})
