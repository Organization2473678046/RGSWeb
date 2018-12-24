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

// TODO 一个GET方法，不带有任何查询功能，不应该带参数
export function getUserInfo(token) {
  return request({
    url: '/v3/user/',
    method: 'get',
    params: { token }
  })
}
