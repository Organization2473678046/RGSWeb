import request from '@/utils/request'

export function submitTaskpackage(name, describe, owner, mapnums, mapnumcounts, regiontask_name) {
  const data = {
    name,
    describe,
    owner,
    mapnums,
    mapnumcounts,
    regiontask_name
  }
  return request({
    url: '/taskpackages/',
    method: 'post',
    data
  })
}

export function getOperator() {
  return request({
    url: '/users/',
    method: 'get'
  })
}

// 获取地图服务地址
export function getMapServices(projectName) {
  return request({
    url: '/regiontasks/?regiontask_name=' + projectName,
    method: 'get'
  })
}
