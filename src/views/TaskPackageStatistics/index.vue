<template>
  <div class="dashboard-editor-container">

<<<<<<< HEAD
    <github-corner style="position: absolute; top: 0px; border: 0; right: 0;"/>

    <panel-group @handleSetLineChartData="handleSetLineChartData"/>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <raddar-chart />
    </el-row>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <pie-chart/>
    </el-row>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <bar-chart/>
    </el-row>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData"/>
    </el-row>
=======
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
>>>>>>> dev-v7

  </div>
</template>

<script>
<<<<<<< HEAD
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}
=======
import { getChartTp, getChartTPSchedule } from '@/api/taskpackageStatistics'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
>>>>>>> dev-v7

export default {
  name: 'DashboardAdmin',
  components: {
<<<<<<< HEAD
    LineChart,
    RaddarChart,
    PieChart,
    BarChart
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
=======
    RaddarChart,
    PieChart
  },
  props: ['regionalName'],
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
          getChartTp(this.regionalName).then(response => {
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
          getChartTPSchedule(this.regionalName).then(response => {
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
>>>>>>> dev-v7
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
