import Vue from 'vue'
import Router from 'vue-router';

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    // { path: "*", redirect: '/postList' },
    
    {
      path: '/',
      name: 'index',
      component:() => import('@/view/index/index'),
    },
    {
      path: '/listDetail',
      name: 'listDetail',
      component:() => import('@/view/index/listDetail'),
    },
    {
      path: '/userinfo',
      name: 'userInfo',
      component:() => import('@/view/user/userInfo'),
    },
    {
      path: '/releaseContent',
      name: 'releaseContent',
      component:() => import('@/view/releaseContent/index'),
    },
    {
      path: '/myPostbar',
      name: 'myPostbar',
      component:() => import('@/view/user/myPostbar'),
    },
  ]
})
