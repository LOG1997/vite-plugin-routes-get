import type { PluginOption } from 'vite';
import path from 'path'
import { getRoutes, writeRouteFile } from './option'
const __dirname = path.resolve();
export default function vitePluginRouteGet(): PluginOption {
    return {
        // 插件名称
        name: 'vite-plugin-routes-get',

        // pre 会较于 post 先执行
        enforce: 'pre', // post

        // 指明它们仅在 'build' 或 'serve' 模式时调用
        apply: 'build', // apply 亦可以是一个函数

        config(config, { command }) {
            console.log('这里是config钩子');
        },
        // 5. 构建阶段的通用钩子：在服务器启动时被调用：每次开始构建时调用
        buildStart(options) {
            console.log('😕options:', __dirname);
            const currentPath = path.resolve(__dirname, "./src")
            const routerPath = path.resolve(__dirname, "./src/router/routes_config.txt")
            let routesRes: any[] = []
            routesRes = getRoutes("views", "", currentPath, "index")

            writeRouteFile(routerPath, routesRes)
            console.log("😋routesRes:", routesRes)
        },
        configResolved(resolvedConfig) {
            console.log('这里是configResolved钩子');
        },
        configureServer(server) {
            console.log('这里是configureServer钩子');
        },

        transformIndexHtml(html) {
            console.log('这里是transformIndexHtml钩子');
        },
    }
}