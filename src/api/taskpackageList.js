import request from '@/utils/request'

export function getTaskpackageList(params) {
  // let url = ''
  // if (params.ordering === 'ascending') {
  //   url = '/taskpackages/?page=' + params.page + '&limit=' + params.limit + '&ordering=' + params.column + '&search=' + params.describe
  // } else {
  //   url = '/taskpackages/?page=' + params.page + '&limit=' + params.limit + '&ordering=-' + params.column + '&search=' + params.describe
  // }
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
  // const url = '/taskpackagesons/?taskpackage_name=' + params.taskpackage_name + '&page=' + params.page + '&limit=' + params.limit
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
  // const url = '/taskpackageowners/?taskpackage_name=' + params.taskpackage_name + '&page=' + params.page + '&limit=' + params.limit
  return request({
    url: '/taskpackageowners/',
    method: 'get',
    params
  })
}
