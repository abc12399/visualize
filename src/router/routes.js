const routes = [
    {
        path: '/',
        name: 'index',
        title: '首页',
        component: () => import('../components/HelloWorld.vue'), //.vue不能省略
    },
    {
        path:'/vispoint',
        component:()=>import('../components/mode1.vue')
    },
    {
        path:'/visline',
        component:()=>import('../components/RoutePlan.vue')
    }
]
export default routes
