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
  },
  {
    path: '/',
    component: Layout,
    redirect: '/taskpackageList',
    name: 'TaskpackageList',
    children: [{
      path: 'taskpackageList',
      component: () => import('@/views/TaskpackageList/index'),
      props: (route) => ({ regionalName: '东南区域1800幅' }),
      meta: { title: '任务包列表', icon: 'table', noCache: true }
    }]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/taskPackageStatistics',
    name: 'TaskPackageStatistics',
    children: [{
      path: 'taskPackageStatistics',
      component: () => import('@/views/TaskPackageStatistics/index'),
      props: (route) => ({ regionalName: '东南区域1800幅' }),
      meta: { title: '任务包统计', icon: 'chart', noCache: true }
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
    path: '/adminMgmt',
    component: Layout,
    redirect: '/adminMgmt/index',
    alwaysShow: true,
    meta: {
      title: '后台管理',
      icon: 'lock',
      roles: ['admin']
    },
    hidden: true,
    children: [
      {
        path: '/adminMgmt/userMgmt',
        component: () => import('@/views/AdminMgmt/UserMgmt/index'),
        name: 'UserMgmt',
        meta: {
          title: '用户管理',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: '/adminMgmt/projectMgmt',
        component: () => import('@/views/AdminMgmt/ProjectMgmt/index'),
        name: 'ProjectMgmt',
        meta: {
          title: '项目管理',
          roles: ['admin']
        }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
