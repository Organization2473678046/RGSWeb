import request from '@/utils/request'

export function submitTaskpackage(name, describe, owner, mapnums, nums) {
  const data = {
    name,
    describe,
    owner,
    mapnums,
    nums
  }
  return request({
    url: '/v3/taskpackages/',
    method: 'post',
    data
  })
}

export function getOperator() {
  return request({
    url: '/v3/users/',
    method: 'get'
  })
}
