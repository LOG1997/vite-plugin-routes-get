# 自动获取react路由

## 开发

### 基本函数
封装了一个从当前页面文件夹获取路由参数的函数，置于`src/option.ts`文件中，导出函数为`getRoute`，使用方法如下：
```ts
import { getRoute } from './option'; 
const routes = getRoutes('views', '', __dirname, 'index')
```
第一个参数：页面文件夹（一般为pages或者views），视项目情况而定
第二个参数：视项目情况而定，传入为空即可
第三个参数：`__dirname`，当前项目的src文件夹，如你有一个react项目名为react-project，则`__dirname`为`react-project/src`
第四个参数：首页文件名，一般为index，视项目情况而定

## 打包成vite插件



## 使用
### 安装、引入以及使用
安装
```bash
npm i vite-plugin-routes-get
```
在vite配置文件`vite.config.ts`中引入插件并使用，如下：
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vitePluginRouteGet from 'vite-plugin-routes-get'
export default defineConfig({
  plugins: [react(), vitePluginRouteGet()],
})
```
在路由文件中使用，引入虚拟模块`virtual:routes-get`，如下：
```ts
import { routeGet } from 'virtual:routes-get';
```
处理一下路由参数，因为`virtual:routes-get`中的路由数组的component返回的是一个字符串，需要转换成函数，如下：
定义一个转换函数
```ts
import { lazy } from 'react'
export const replaceComponent = (routes: any[]) => {
    routes.forEach((item: any) => {
        if (item.children && item.children.length) {
            item.component = lazy(() => import('' + item.componentPath));
            replaceComponent(item.children)
        }
        item.component = lazy(() => import('' + item.componentPath));

    })
    return routes
}
```
在路由文件中使用
```ts
const autoRoutes = replaceComponent(routeGet);
const routes = [
    {
        path: "/",
        component: lazy(() => import('@/App')),
        auth: false,
    },
    ...autoRoutes
]
```
后面便是生成路由的操作了
```ts
const generateRouter = (routers: any) => {
    const rout = routers.map((item: any) => {
        if (item.children && item.children.length > 0) {
            item.children = generateRouter(item.children);
        }

        item.element = <Suspense fallback={<div>等待中</div>}>
            <item.component />
        </Suspense>;


        return item;
    });

    return rout;
};
// 生成路由
const Router = () => {

    return useRoutes(generateRouter(routes));
};
```