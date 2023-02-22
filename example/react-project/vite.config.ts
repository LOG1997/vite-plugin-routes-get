import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vitePluginRouteGet from 'vite-plugin-routes-get'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), vitePluginRouteGet()],
})
