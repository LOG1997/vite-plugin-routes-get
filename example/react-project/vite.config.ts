import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vitePluginRouteGet from 'vite-plugin-routes-get'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), vitePluginRouteGet()],
  server: {
    hmr: {
      overlay: true,
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
