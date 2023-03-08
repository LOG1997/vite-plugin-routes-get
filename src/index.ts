// import type { PluginOption } from 'vite';
// import path from 'path';
// // import fs from 'fs';
// import { getRoutes, countFile, initFileCount } from './option'

// // const mdRelationMap = new Map<string, string>();

// const __dirname = path.resolve('src');
// let fileCountPre = 0;
// let routes: any[] = []
// type UserOptions = {
//     dirname: string,
//     defaultFile: string,
//     type: string,
// }
// const defaultOptions: UserOptions = {
//     dirname: 'views',
//     defaultFile: 'index',
//     type: '',
// }
// export default function vitePluginRouteGet(userOptions: UserOptions = defaultOptions): PluginOption {

//     const virtualModuleId = 'virtual:routes-get'
//     const resolvedVirtualModuleId = '\0' + virtualModuleId
//     return {
//         name: 'vite-plugin-route-get',
//         // 指明它们仅在 'build' 或 'serve' 模式时调用
//         // apply: 'build', // apply 亦可以是一个函数
//         enforce: 'pre',
//         config(config) {
//             console.log('🚀 vite-plugin-route-get config')
//             return config
//         },
//         options(options) {
//             console.log('🚀 vite-plugin-route-get options')
//             return options
//         },
//         buildStart() {
//             console.log('🚀 vite-plugin-route-get buildStart')
//         },
//         resolveId(id) {
//             if (userOptions.type == '') {
//                 throw Error('请传入项目类型vue或者react')
//             }
//             if (id === virtualModuleId) {
//                 return resolvedVirtualModuleId
//             }
//         },
//         load(id) {
//             const { dirname, defaultFile, type } = userOptions
//             if (!type || (type != 'vue' && type != 'react')) {
//                 throw Error("请输入项目类型vue或者react，格式如 plugins: [react(), vitePluginRouteGet({type: 'vue'})]")
//             }
//             else if (id === resolvedVirtualModuleId) {
//                 routes = [];
//                 routes = getRoutes(dirname, '', __dirname, defaultFile, type)
//                 // console.log('😉routes:', routes)
//                 // return `export const msg = "from virtual module"`
//                 return `export const routeGet = ${JSON.stringify(routes)}`
//             }
//             return `export const routeGet = "from virtual module"`
//         },
//         handleHotUpdate(ctx) {
//             const { server } = ctx;

//             const relationModule = [...server.moduleGraph.getModulesByFile('\x00virtual:routes-get')!][0];
//             const fileCountNow = countFile(__dirname + '/' + userOptions.dirname)
//             if (fileCountNow !== fileCountPre) {
//                 fileCountPre = fileCountNow;
//                 server.ws.send({
//                     type: 'update',
//                     updates: [
//                         {
//                             type: 'js-update',
//                             path: relationModule.file!,
//                             acceptedPath: relationModule.file!,
//                             timestamp: new Date().getTime()
//                         }
//                     ]
//                 });
//                 initFileCount();

//                 return [relationModule]
//             }
//             initFileCount();

//             return []
//             // 指定需要重新编译的模块
//         },
//     }
// }
export default function myPlugin() {
    const virtualModuleId = 'virtual:my-module'
    const resolvedVirtualModuleId = '\0' + virtualModuleId

    return {
        name: 'my-plugin', // 必须的，将会在 warning 和 error 中显示
        resolveId(id) {
            if (id === virtualModuleId) {
                return resolvedVirtualModuleId
            }
        },
        load(id) {
            if (id === resolvedVirtualModuleId) {
                return `export const msg = "from virtual module"`
            }
        },
    }
}