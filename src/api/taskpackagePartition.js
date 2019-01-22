import request from '@/utils/request'

<<<<<<< HEAD
export function submitTaskpackage(name, describe, owner, mapnums, nums) {
=======
export function submitTaskpackage(name, describe, owner, mapnums, mapnumcounts, regiontask_name) {
>>>>>>> dev-v7
  const data = {
    name,
    describe,
    owner,
    mapnums,
<<<<<<< HEAD
    nums
  }
  return request({
    url: '/v3/taskpackages/',
=======
    mapnumcounts,
    regiontask_name
  }
  return request({
    url: '/taskpackages/',
>>>>>>> dev-v7
    method: 'post',
    data
  })
}

export function getOperator() {
  return request({
<<<<<<< HEAD
    url: '/v3/users/',
=======
    url: '/users/',
    method: 'get'
  })
}

// 获取地图服务地址
export function getMapServices(projectName) {
  return request({
    url: '/regiontasks/?regiontask_name=' + projectName,
>>>>>>> dev-v7
    method: 'get'
  })
}
