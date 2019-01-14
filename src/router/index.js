import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'
import projectRouter from '../router/modules/project'

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
  { path: '*', redirect: '/404', hidden: true }
]

const userMap = [
  {
    id: 1,
    path: '/southeast',
    title: '东南区域项目'
  },
  {
    id: 2,
    path: '/southwest',
    title: '西南区域项目'
  }
]

for (let i = 0; i < userMap.length; i++) {
  asyncRouterMap.push({
    path: userMap[i].path,
    component: Layout,
    redirect: userMap[i].path,
    alwaysShow: true,
    meta: {
      title: userMap[i].title,
      icon: 'lock',
      roles: ['admin']
    },
    // hidden: true,
    children: [
      {
        path: 'taskpackageList',
        name: 'TaskpackageList' + userMap[i].id,
        component: () => import('@/views/TaskpackageList/index'),
        props: (route) => ({ query: userMap[i].id }),
        meta: { title: '任务包列表', icon: 'table', roles: ['user'] }
      },
      {
        path: 'taskpackagepartition',
        name: 'Taskpackagepartition' + userMap[i].id,
        component: () => import('@/views/TaskpackagePartition/index'),
        meta: { title: '任务包划分', icon: 'example', roles: ['admin'] }
      },
      {
        path: 'taskPackageStatistics',
        name: 'TaskPackageStatistics' + userMap[i].id,
        component: () => import('@/views/TaskPackageStatistics/index'),
        meta: { title: '任务包统计', icon: 'chart', roles: ['user'] }
      },
      {
        path: '/adminMgmt',
        component: () => import('@/views/AdminMgmt/UserMgmt/index'),
        redirect: '/adminMgmt/index',
        alwaysShow: true,
        meta: {
          title: '管理',
          icon: 'lock',
          roles: ['admin']
        },
        // hidden: true,
        children: [
          {
            path: '/adminMgmt/scheduleMgmt',
            component: () => import('@/views/AdminMgmt/ScheduleMgmt/index'),
            name: 'ScheduleMgmt' + userMap[i].id,
            meta: {
              title: '进度管理',
              roles: ['admin']
            }
          }
        ]
      }
    ]
  })
}
