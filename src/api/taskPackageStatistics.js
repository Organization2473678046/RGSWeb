import request from '@/utils/request'

export function getChartTp() {
  return request({
    url: '/echarttaskpackages/',
    method: 'get'
  })
}

export function getChartTPSchedule() {
  return request({
    url: '/echartschedules/',
    method: 'get'
  })
}
