import type { PluginOption } from 'vite';
import path from 'path';
// import fs from 'fs';
import { getRoutes } from './option'


const __dirname = path.resolve('src');
console.log('😁__dirname:', __dirname)
export default function vitePluginRouteGet(): PluginOption {
    const virtualModuleId = 'virtual:routes-get'
    const resolvedVirtualModuleId = '\0' + virtualModuleId
    return {
        name: 'vite-plugin-route-get',
        resolveId(id) {

            if (id === virtualModuleId) {
                return resolvedVirtualModuleId
            }
        },
        load(id) {
            if (id === resolvedVirtualModuleId) {
                const routes = getRoutes('views', '', __dirname, 'index')
                // console.log('😉routes:', routes)
                // return `export const msg = "from virtual module"`
                return `export const routeGet = ${JSON.stringify(routes)}`
            }
        },
    }
}