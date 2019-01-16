import request from '@/utils/request'

export function submitTaskpackage(name, describe, owner, mapnums, mapnumcounts) {
  const data = {
    name,
    describe,
    owner,
    mapnums,
    mapnumcounts
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
export function getMapServices() {
  return request({
    url: '//',
    method: 'get'
  })
}
