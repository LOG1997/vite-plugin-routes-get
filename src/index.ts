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
            // console.log('😕ctx:', ctx)
            const fileCountNow = countFile(__dirname + '/views')
            if (fileCountNow !== fileCountPre) {
                fileCountPre = fileCountNow;
                // routes = [];
                // routes = getRoutes('views', '', __dirname, 'index')
                // return `export const msg = "from virtual module"`

                initFileCount();
                // return `export const routeGet = ${JSON.stringify(routes)}`
            }
            initFileCount();
            // // 找到引入该 md 文件的 vue 文件
            // const relationId = mdRelationMap.get(file) as string;
            // // 找到该 vue 文件的 moduleNode
            const relationModule = [...server.moduleGraph.getModulesByFile('\x00virtual:routes-get')!][0];
            // // 发送 websocket 消息，进行单文件热重载
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

            // 指定需要重新编译的模块
            return [relationModule]
        },
    }
}