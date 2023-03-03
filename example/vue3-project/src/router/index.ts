import { createRouter, createWebHistory } from "vue-router";
import { replaceComponent } from "@/router/utils/replaceComponent";
import { routeGet } from 'virtual:routes-get';
// console.log('😂routeGet:', routeGet)
// const routeGet = [
//     {
//         "path": "/about",
//         "name": "About",
//         "componentPath": "/src/views/About/index.vue",
//         "children": [],
//         "parent": "views"
//     },
//     {
//         "path": "/fun",
//         "name": "Fun",
//         "componentPath": "/src/views/Fun/index.vue",
//         "children": [],
//         "parent": "views"
//     },
//     {
//         "path": "/home",
//         "name": "Home",
//         "componentPath": "/src/views/Home",
//         "children": [],
//         "parent": "views"
//     },
//     {
//         "path": "/wallet",
//         "name": "Wallet",
//         "componentPath": "/src/views/Wallet",
//         "children": [],
//         "parent": "views"
//     }
// ]
const autoRoutes = replaceComponent(routeGet);
const routes = [
    ...autoRoutes
    // {
    //     path: '/about',
    //     name: 'About',
    //     component: () => import('/src/views/About/index.vue')
    // }
];

console.log('😑routes:', routes)
const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
