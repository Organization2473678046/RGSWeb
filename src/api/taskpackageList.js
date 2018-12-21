import request from '@/utils/request'

export function getTaskpackageList(params) {
  let url = ''
  if(params.ordering === 'ascending') {
    url = '/v3/taskpackages/?page=' + params.page + '&limit=' + params.limit + '&ordering=' + params.column
  } else {
    url = '/v3/taskpackages/?page=' + params.page + '&limit=' + params.limit + '&ordering=-' + params.column
  }

  return request({
    url: url,
    method: 'get',
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
  const url = '/v3/taskpackagesons/?taskpackage_name=' + params.taskpackage_name + '&page=' + params.page + '&limit=' + params.limit
  return request({
    url: url,
    method: 'get'
  })
}

export function atOperator(params) {
  return request({
    url: '/v3/taskpackageowners/',
    method: 'post',
    data: params
  })
}

export function atOperatorRecord(params) {
  const url = '/v3/taskpackageowners/?taskpackage_name=' + params.taskpackage_name + '&page=' + params.page + '&limit=' + params.limit
  return request({
    url: url,
    method: 'get'
  })
}
