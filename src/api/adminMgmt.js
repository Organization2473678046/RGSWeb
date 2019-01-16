import request from '@/utils/request'

export function getUserList() {
  return request({
    url: '//',
    method: 'get'
  })
}

// 进度管理 CURD START
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
// 进度管理 CURD END

// 项目管理 CURD START
export function getProjectRegional() {
  return request({
    url: '/schedule/',
    method: 'get'
  })
}

export function createProjectRegional(params) {
  return request({
    url: '/schedule/',
    method: 'post',
    data: params
  })
}

export function updateProjectRegional(params) {
  return request({
    url: '/schedule/' + params.id + '/',
    method: 'put',
    data: {
      schedule: params.schedule
    }
  })
}

export function delProjectRegional(params) {
  return request({
    url: '/schedule/' + params + '/',
    method: 'DELETE'
  })
}
// 项目管理 CURD END
