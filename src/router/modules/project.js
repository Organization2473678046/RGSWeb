function dynamicPropsFn(route) {
  const now = new Date()
  return {
    name: (now.getFullYear() + parseInt(route.params.years)) + '!'
  }
}
const projectRouter = [
  {
    path: 'taskpackageList/:years',
    name: 'TaskpackageList',
    component: () => import('@/views/TaskpackageList/index'),
    props: dynamicPropsFn,
    meta: { title: '任务包列表', icon: 'table', roles: ['user'] }
  },
  {
    path: 'taskpackagepartition',
    name: 'Taskpackagepartition',
    component: () => import('@/views/TaskpackagePartition/index'),
    meta: { title: '任务包划分', icon: 'example', roles: ['admin'] }
  },
  {
    path: 'taskPackageStatistics',
    name: 'TaskPackageStatistics',
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
        name: 'ScheduleMgmt',
        meta: {
          title: '进度管理',
          roles: ['admin']
        }
      }
    ]
  }
]

export default projectRouter
