<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '635px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
    // this.__resizeHandler = debounce(() => {
    //   if (this.chart) {
    //     this.chart.resize()
    //   }
    // }, 100)
    // window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['窦盟', '任丹丹', '舒云芳', '周洁', '王启', '孟珠李', '邹作武', '李萌萌']
        },
        calculable: true,
        series: [
          {
            name: '任务包数量',
            type: 'pie',
            center: ['50%', '45%'],
            data: [
              { value: 28, name: '窦盟' },
              { value: 24, name: '任丹丹' },
              { value: 14, name: '舒云芳' },
              { value: 10, name: '周洁' },
              { value: 18, name: '孟珠李' },
              { value: 13, name: '王启' },
              { value: 10, name: '邹作武' },
              { value: 5, name: '李萌萌' }
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
