# 自动生成路由
> react和vue3皆可使用

>每次新增一个页面文件都要去路由文件再配置一次，真的是太烦了！
所以就写了一个自动获取路由的插件，只要在路由文件中引入一个虚拟模块，就可以自动获取路由了。

> 初学，写得比较菜，性能以及错误处理考虑不是很全面，欢迎大家指正。

## 使用

### 安装和配置
```bash
npm i vite-plugin-routes-get -D
```
### vite配置
在vite配置文件`vite.config.ts`中引入插件并使用，需要传入参数，如下：
params:
dirname:存放页面的文件夹，非必传，默认为'views'
defaultFile:页面文件夹下的默认文件，非必传，默认值为'index'
type:指定该插件用于哪个类型的项目，**必传**，可选参数为`vue`和`react`
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vitePluginRouteGet from 'vite-plugin-routes-get'
export default defineConfig({
  plugins: [react(), vitePluginRouteGet(
   dirname:'views',
   defaultFile:'index',
   type:'react'
  )],
})
```
### 路由配置
在路由文件中使用，引入虚拟模块`virtual:routes-get`，如下：
```ts
// @/router/index.tsx
import { routeGet } from 'virtual:routes-get';
```
处理一下路由参数，因为`virtual:routes-get`中的路由数组的component返回的是一个字符串，需要转换成函数，如下：
在`@/router/utils`定义一个转换函数
#### 路由转换函数
vue-router的转换函数如下
```ts
export const replaceComponent = (routes: any[]) => {
    routes.forEach((item: any) => {
        if (item.children && item.children.length) {
            item.component = () => import(item.componentPath)
            replaceComponent(item.children)
        }
        item.component = () => import(item.componentPath)

    })
    return routes
}
```
```ts
// @/router/utils/replaceComponent.ts
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
### 在路由文件中使用
> 后续将封装一个处理路由的函数，实现全自动导入。

生成路由的格式如下：
**vue**
```ts
[
  {
    path: '/home',
    name: 'Home',
    component: (() => import('/src/views/Home/index.vue')),
    children: [],
    parent: 'views',
  }
]
```
**react**
```ts
[
  {
    path: '/home',
    name: 'Home',
    component: lazy(() => import('/src/views/Home')),
    children: [],
    parent: 'views',
  }
]a
```
vue无需特殊操操作，按照正常流程创建路由即可，react还需要进一步操作。
如果有特殊路由，请一并添加到这个routes数组中
```ts
const autoRoutes = replaceComponent(routeGet);
const routes = [
    {
        path: "/",
        redirect: <Navigate to="/home" />,
    },
    {
        component: Layout,
        children: [
            ...autoRoutes
        ]
    }
];
```
可以放心使用了，后面便是生成路由的操作了
```ts
const generateRoutes = (routes: any) => {
    return routes.map((item: any) => {
        if (item.children) {
            generateRoutes(item.children);
        }
        item.redirect ? item.element = item.redirect :
            item.element = <Suspense fallback={<div>加载中</div>}>
                <item.component />
            </Suspense>

        return item;
    });
}
// 生成路由
const Router = () => {
    return useRoutes(generateRouter(routes));
};
```
