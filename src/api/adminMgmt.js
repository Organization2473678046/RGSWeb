import request from '@/utils/request'

export function getUserList() {
  return request({
    url: '//',
    method: 'get'
  })
}

// 进度管理 CURD START
export function getTPSchedule(params) {
  return request({
    url: '/schedule/',
    method: 'get',
    params
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
export function getProjectRegional(params) {
  return request({
    url: '/regiontasks/',
    method: 'get',
    params
  })
}

export function createProjectRegional(params) {
  return request({
    url: '/regiontasks/',
    method: 'post',
    data: params
  })
}

export function updateProjectRegional(params) {
  return request({
    url: '/regiontasks/' + params.id + '/',
    method: 'put',
    data: {
      schedule: params.schedule
    }
  })
}

export function delProjectRegional(params) {
  return request({
    url: '/regiontasks/' + params + '/',
    method: 'DELETE'
  })
}
// 项目管理 CURD END

// 用户管理 CURD START
export function getUser(params) {
  return request({
    url: '/regiontasks/',
    method: 'get',
    params
  })
}

export function createUser(params) {
  return request({
    url: '/regiontasks/',
    method: 'post',
    data: params
  })
}

export function editUser(params) {
  return request({
    url: '/regiontasks/' + params.id + '/',
    method: 'put',
    data: {
      schedule: params.schedule
    }
  })
}

export function delUser(params) {
  return request({
    url: '/regiontasks/' + params + '/',
    method: 'DELETE'
  })
}

export function resetPassword(params) {
  return request({
    url: '/regiontasks/' + params.id + '/',
    method: 'put'
  })
}
// 用户管理 CURD END
