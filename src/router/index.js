import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

import PageHome from '../pages/Home'

const routes = [
    {
        path: '/',
        name: 'PageHome',
        component:  PageHome,
    }
];

const router = new VueRouter({
    mode: 'history',
    routes,
});

export default router;
