import request from '@/utils/request'

export function getChartTp(regionalName) {
  return request({
    url: '/echarttaskpackages/?regiontask_name=' + regionalName,
    method: 'get'
  })
}

export function getChartTPSchedule(regionalName) {
  return request({
    url: '/echartschedules/?regiontask_name=' + regionalName,
    method: 'get'
  })
}
