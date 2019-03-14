import request from '@/utils/request'

export function getTaskpackageList(params) {
  return request({
    url: '/taskpackages/',
    method: 'get',
    params
  })
}

export function uploadTaskpackage(params) {
  return request({
    url: '/taskpackageversion/',
    method: 'post',
    data: params
  })
}

export function getTPSubversionList(params) {
  return request({
    url: '/taskpackagesons/',
    method: 'get',
    params
  })
}

export function atOperator(params) {
  return request({
    url: '/taskpackageowners/',
    method: 'post',
    data: params
  })
}

export function atOperatorRecord(params) {
  return request({
    url: '/taskpackageowners/',
    method: 'get',
    params
  })
}

export function taskTimeOutRemind(params) {
  return request({
    url: '/overdue_worker/',
    method: 'get',
    params
  })
}

export function taskTimeOutTimeline(params) {
  return request({
    url: '/overdue_admin/',
    method: 'get',
    params
  })
}
