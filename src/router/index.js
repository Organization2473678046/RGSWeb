import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

// 所有权限通用路由表
// 如首页和登录页和一些不用权限的公用页面
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/home',
    name: 'Home',
    children: [{
      path: 'home',
      component: () => import('@/views/home/index'),
      meta: { title: '主页', icon: 'tree', noCache: true }
    }]
  }
]

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

// 异步挂载的路由
// 动态需要根据权限加载的路由表
export const asyncRouterMap = [
  {
    path: '/taskpackageList',
    component: Layout,
    meta: { roles: ['user'] },
    children: [
      {
        path: 'taskpackageList',
        name: 'TaskpackageList',
        component: () => import('@/views/TaskpackageList/index'),
        meta: { title: '任务包列表', icon: 'table', roles: ['user'] }
      }
    ]
  },
  {
    path: '/taskpackagePartition',
    component: Layout,
    meta: { roles: ['admin'] },
    children: [{
      path: 'taskpackagepartition',
      name: 'Taskpackagepartition',
      component: () => import('@/views/TaskpackagePartition/index'),
      meta: { title: '任务包划分', icon: 'example', roles: ['admin'] }
    }]
  },
  {
    path: '/taskPackageStatistics',
    component: Layout,
    meta: { roles: ['user'] },
    children: [{
      path: 'taskPackageStatistics',
      name: 'TaskPackageStatistics',
      component: () => import('@/views/TaskPackageStatistics/index'),
      meta: { title: '任务包统计', icon: 'chart', roles: ['user'] }
    }]
  },

  { path: '*', redirect: '/404', hidden: true }
]
