
import { useRoutes } from "react-router-dom";
import { Suspense, lazy } from 'react';

import { routeGet } from 'virtual:routes-get';
import { replaceComponent } from "@/utils/replaceComponent";

const autoRoutes = replaceComponent(routeGet);
console.log('😌autoRoutes:', autoRoutes)
// const routes = routeGet;
const routes = [
    {
        path: "/",
        component: lazy(() => import('@/App')),
        auth: false,
    },
    ...autoRoutes
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