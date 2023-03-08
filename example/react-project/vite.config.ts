import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import myPlugin from 'vite-plugin-routes-get'
import projectInfoPlugin from 'vite-plugin-project-info'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), myPlugin(), projectInfoPlugin()],
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
