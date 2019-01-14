import request from '@/utils/request'

export function getUserList() {
  return request({
    url: '//',
    method: 'get'
  })
}

export function getTPSchedule() {
  return request({
    url: '/schedule/',
    method: 'get'
  })
}

export function createTPSchedule(params) {
  return request({
    url: '/schedule/',
    method: 'post',
    data: params
  })
}

export function updateTPSchedule(params) {
  return request({
    url: '/schedule/' + params.id + '/',
    method: 'put',
    data: {
      schedule: params.schedule
    }
  })
}

export function delTPSchedule(params) {
  return request({
    url: '/schedule/' + params + '/',
    method: 'DELETE'
  })
}
