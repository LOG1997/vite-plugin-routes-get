
import { useRoutes } from "react-router-dom";
import { Suspense, lazy } from 'react';
// FIXME:打包时不成功，server模式可行
// import { msg } from 'virtual:my-module';
import { replaceComponent } from "@/utils/replaceComponent";
import projectInfo from 'virtual:project-info';
console.log('😀projectInfo:', projectInfo)
// const autoRoutes = replaceComponent(routeGet);
// console.log('😌autoRoutes:', autoRoutes)
// const routes = routeGet;

// console.log('😅msg:', msg)
const routes = [
    {
        path: "/",
        component: lazy(() => import('@/App')),
        auth: false,
    },
    {
        path: "/login",
        component: lazy(() => import('@/views/About')),
    },
    // ...autoRoutes
]
console.log('😔routes:', routes)
const checkAuth = (routers: any, path: string) => {
    for (const data of routers) {
        if (data.path === path) {
            return data;
        }
        if (
            data.children
        ) {
            const res: unknown = checkAuth(data.children, path);
            if (res) { return res; }
        }
    }
    return null;
};

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
const checkRouterAuth = (path: string) => {
    let auth = null;
    auth = checkAuth(routes, path);
    return auth;
};

export { Router, checkRouterAuth };