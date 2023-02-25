import { lazy } from 'react'
export const replaceComponent = (routes: any[]) => {
    routes.forEach((item: any) => {
        if (item.children && item.children.length) {
            item.component = lazy(() => import(item.componentPath));
            replaceComponent(item.children)
        }
        item.component = lazy(() => import(item.componentPath));

    })
    return routes
}