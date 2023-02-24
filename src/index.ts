import type { PluginOption } from 'vite';
import path from 'path';
// import fs from 'fs';
import { getRoutes, countFile, initFileCount } from './option'

// const mdRelationMap = new Map<string, string>();

const __dirname = path.resolve('src');
let fileCountPre = 0;
let routes: any[] = []
export default function vitePluginRouteGet(): PluginOption {
    const virtualModuleId = 'virtual:routes-get'
    const resolvedVirtualModuleId = '\0' + virtualModuleId
    return {
        name: 'vite-plugin-route-get',
        // 指明它们仅在 'build' 或 'serve' 模式时调用
        // apply: 'serve', // apply 亦可以是一个函数
        resolveId(id) {

            if (id === virtualModuleId) {
                return resolvedVirtualModuleId
            }


        },
        load(id) {
            if (id === resolvedVirtualModuleId) {
                routes = [];
                routes = getRoutes('views', '', __dirname, 'index')
                // console.log('😉routes:', routes)
                // return `export const msg = "from virtual module"`

                return `export const routeGet = ${JSON.stringify(routes)}`
            }
        },
        handleHotUpdate(ctx) {
            const { server } = ctx;

            const relationModule = [...server.moduleGraph.getModulesByFile('\x00virtual:routes-get')!][0];
            const fileCountNow = countFile(__dirname + '/views')
            if (fileCountNow !== fileCountPre) {
                fileCountPre = fileCountNow;
                server.ws.send({
                    type: 'update',
                    updates: [
                        {
                            type: 'js-update',
                            path: relationModule.file!,
                            acceptedPath: relationModule.file!,
                            timestamp: new Date().getTime()
                        }
                    ]
                });
                initFileCount();

                return [relationModule]
            }
            initFileCount();

            return []
            // 指定需要重新编译的模块
        },
    }
}