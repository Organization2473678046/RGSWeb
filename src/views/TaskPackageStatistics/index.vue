<template>
  <div class="dashboard-editor-container">

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <el-select v-model="chartSwitch" placeholder="请选择图表">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <raddar-chart :chart-data="PieChartData"/>
    </el-row>

    <!--<el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">-->
    <!--<pie-chart/>-->
    <!--</el-row>-->

  </div>
</template>

<script>
import { getChartTp, getChartTPSchedule } from '@/api/taskpackageStatistics'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'

export default {
  name: 'DashboardAdmin',
  components: {
    RaddarChart,
    PieChart
  },
  data() {
    return {
      PieChartData: {},
      optionId: 1,
      options: [{
        value: 'user',
        label: '作业员任务包处理数量'
      }, {
        value: 'schedule',
        label: '任务包处理进度'
      }],
      value: '作业员任务包处理数量',
      expectedData: [],
      actualData: []
    }
  },
  computed: {
    chartSwitch: {
      get() {
        return this.value
      },
      set(val) {
        // this.$emit('input', val)
        this.getPieData(val)
      }
    }
  },
  created() {
    this.getPieData('user')
  },
  methods: {
    getPieData(val) {
      if (val === 'user') {
        return new Promise((resolve, reject) => {
          getChartTp().then(response => {
            let pcd = {}
            const data = []
            response.data.forEach((e) => {
              pcd = {}
              pcd.name = e.user_reallyname
              pcd.value = e.count
              data.push(pcd)
            })

            // 组成图例数据
            data.forEach((e) => {
              this.expectedData.push(e.name)
            })
            // 图表数据
            this.actualData = data
            this.value = val
            this.PieChartData = { expectedData: this.expectedData, actualData: this.actualData }
          }).catch(error => {
            reject(error)
          })
        })
      }
      if (val === 'schedule') {
        return new Promise((resolve, reject) => {
          getChartTPSchedule().then(response => {
            let pcd = {}
            const data = []
            response.data.forEach((e) => {
              pcd = {}
              pcd.name = e.taskpackage_schedule
              pcd.value = e.count
              data.push(pcd)
            })

            data.forEach((e) => {
              this.expectedData.push(e.name)
            })
            this.actualData = data
            this.value = val
            this.PieChartData = { expectedData: this.expectedData, actualData: this.actualData }
          }).catch(error => {
            reject(error)
          })
        })
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
}
</style>
