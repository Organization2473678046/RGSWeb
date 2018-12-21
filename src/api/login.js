import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/v3/login/',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getUserInfo(token) {
  return request({
    url: '/v3/user/',
    method: 'get',
    params: { token }
  })
}
