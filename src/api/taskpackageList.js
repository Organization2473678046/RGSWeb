import request from '@/utils/request'

export function getTaskpackageList(params) {
<<<<<<< HEAD
  let url = ''
  if(params.ordering === 'ascending') {
    url = '/v3/taskpackages/?page=' + params.page + '&limit=' + params.limit + '&ordering=' + params.column
  } else {
    url = '/v3/taskpackages/?page=' + params.page + '&limit=' + params.limit + '&ordering=-' + params.column
  }

  return request({
    url: url,
    method: 'get',
=======
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
>>>>>>> dev-v7
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
<<<<<<< HEAD
  const url = '/v3/taskpackagesons/?taskpackage_name=' + params.taskpackage_name + '&page=' + params.page + '&limit=' + params.limit
  return request({
    url: url,
    method: 'get'
=======
  // const url = '/taskpackagesons/?taskpackage_name=' + params.taskpackage_name + '&page=' + params.page + '&limit=' + params.limit
  return request({
    url: '/taskpackagesons/',
    method: 'get',
    params
>>>>>>> dev-v7
  })
}

export function atOperator(params) {
  return request({
<<<<<<< HEAD
    url: '/v3/taskpackageowners/',
=======
    url: '/taskpackageowners/',
>>>>>>> dev-v7
    method: 'post',
    data: params
  })
}

export function atOperatorRecord(params) {
<<<<<<< HEAD
  const url = '/v3/taskpackageowners/?taskpackage_name=' + params.taskpackage_name + '&page=' + params.page + '&limit=' + params.limit
  return request({
    url: url,
    method: 'get'
=======
  // const url = '/taskpackageowners/?taskpackage_name=' + params.taskpackage_name + '&page=' + params.page + '&limit=' + params.limit
  return request({
    url: '/taskpackageowners/',
    method: 'get',
    params
>>>>>>> dev-v7
  })
}
