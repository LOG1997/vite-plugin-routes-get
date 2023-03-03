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