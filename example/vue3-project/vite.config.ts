import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vitePluginRouteGet from 'vite-plugin-routes-get'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vitePluginRouteGet({
    dirname: 'views',
    type: 'vue'
  })],
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
