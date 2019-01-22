import request from '@/utils/request'

export function login(username, password) {
  return request({
<<<<<<< HEAD
    url: '/v3/login/',
=======
    url: '/login/',
>>>>>>> dev-v7
    method: 'post',
    data: {
      username,
      password
    }
  })
}

<<<<<<< HEAD
// TODO 一个GET方法，不带有任何查询功能，不应该带参数
export function getUserInfo(token) {
  return request({
    url: '/v3/user/',
=======
export function getUserInfo(token) {
  return request({
    url: '/user/',
>>>>>>> dev-v7
    method: 'get',
    params: { token }
  })
}
