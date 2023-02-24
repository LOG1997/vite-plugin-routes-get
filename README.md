# 自动获取react路由

>每次新增一个页面文件都要去路由文件再配置一次，真的是太烦了！
所以就写了一个自动获取路由的插件，只要在路由文件中引入一个虚拟模块，就可以自动获取路由了。

> 初学，写得比较菜，欢迎大家指正。

> 目前只适配了react
## 使用

安装
```bash
npm i vite-plugin-routes-get -D
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
> 后续将封装一个处理路由的函数，实现全自动导入。

生成路由的格式如下：
```ts
[
  {
    path: '/home',
    name: 'Home',
    component: lazy(() => import('../Home')),
    children: [],
    parent: 'views',
  }
]
```
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
