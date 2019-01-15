import store from '../../store'
import { asyncRouterMap } from '../index'
import Layout from '../../views/layout/Layout'

export function getRegionalMenu () {
  return new Promise((resolve, reject) => {
    store.dispatch('GetOperator').then(response => {
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
              key:userMap[i].id,
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
              path: '/adminMgmt' + userMap[i].id,
              component: () => import('@/views/AdminMgmt/ScheduleMgmt/index'),
              redirect: '/adminMgmt' + userMap[i].id,
              alwaysShow: true,
              meta: {
                title: '管理',
                icon: 'lock',
                roles: ['admin']
              },
              // hidden: true,
              children: [
                {
                  path: '/adminMgmt/scheduleMgmt' + userMap[i].id,
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

      resolve()
    })
  })
}
