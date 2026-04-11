import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
    strictPort: true,
    port: 5173,
    proxy: {
      '/api': 'http://localhost:80',
      '/socket.io': {
        target: 'http://localhost:80',
        ws: true
      }
    }
  },
  build: {
    sourcemap: false,
  },
})
