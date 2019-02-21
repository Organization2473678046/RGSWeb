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
      actualData: [],
      loginForm: {
        username: "",
        password: ""
      }
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
      if (this.$store.getters.token !== undefined) {
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
      } else {
        this.handleLogin()
      }
    },
    handleLogin() {
      this.loading = true;
      // var asdsa = encodeURIComponent(window.location.href)

      var username = this.getUrlParameter()["username"];
      var password = this.getUrlParameter()["password"];

      this.loginForm.username = username
      this.loginForm.password = password
      this.$store.dispatch("Login", this.loginForm).then(() => {
          this.loading = false;
          // this.$router.push({ path: this.redirect || '/' })
          // this.$router.push({ path: '/' })
          this.getPieData('user')
      })
      .catch(error => {
          this.loading = false;
          if (error.response === undefined) {
            this.$message({
              message: "登录超时，请联系服务器管理员！！",
              type: "error"
            });
          } else if ("non_field_errors" in error.response.data) {
            this.$message({
              message: "用户名或密码错误！！",
              type: "error"
            });
          }
        });
    },
    getUrlParameter(name) {
      var vars = {};
      var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
          vars[key] = value;
      });
      return vars;
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
}
</style>
