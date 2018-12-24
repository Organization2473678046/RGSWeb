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
          data: ['修改缝隙', '河网环修改', '有向点修改', '一对多修改', '匝道赋值', '同层拓扑', '不同层拓扑', '微短线修改', '微小面修改', '急锐角修改', '等高线拼接']
        },
        calculable: true,
        series: [
          {
            name: '处理进度',
            type: 'pie',
            roseType: 'radius',
            center: ['50%', '45%'],
            data: [
              { value: 32, name: '修改缝隙' },
              { value: 28, name: '河网环修改' },
              { value: 25, name: '有向点修改' },
              { value: 21, name: '一对多修改' },
              { value: 17, name: '匝道赋值' },
              { value: 15, name: '同层拓扑' },
              { value: 12, name: '不同层拓扑' },
              { value: 9, name: '微短线修改' },
              { value: 8, name: '微小面修改' },
              { value: 5, name: '急锐角修改' },
              { value: 5, name: '等高线拼接' }
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
