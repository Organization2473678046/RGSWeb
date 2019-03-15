<template>
  <div v-if="whetherTimeOut === true">
    <el-badge :is-dot="true" style="line-height: 25px;margin-top: -5px;" @click.native="TaskTimeOutRemindInfo">
      <el-button style="padding: 8px 10px;" size="small" type="danger" icon="el-icon-bell">
      </el-button>
    </el-badge>

    <el-dialog :visible.sync="timeOutInfodialog" title="任务超时列表" width="80%">
      <el-table
        v-loading="listLoading"
        :data="taskTimeOutList"
        border
        highlight-current-row
        style="width: 100%;"
        @sort-change="sortChange">
        <el-table-column label="序号" prop="id" sortable="custom" align="center" width="85">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="任务名称" width="150px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.taskpackage_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="所属区域" width="150px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.regiontask_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="任务创建时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createtime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="任务开始时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.starttime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="任务结束时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.endtime | formatDate }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="任务状态" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status | statusDisplayFilter }}</el-tag>
          </template>
        </el-table-column> -->
      </el-table>
    </el-dialog>

  </div>
</template>

<script>
import { taskTimeOutRemind } from '@/api/taskpackageList'
import { getProjectRegional } from '@/api/adminMgmt'

export default {
  data() {
    return {
      timeOutInfodialog: false,
      whetherTimeOut: false,
      listLoading: true,
      taskListQuery: {
        page: 1,
        limit: 5
      },
      taskTimeOutList: null
    }
  },
  computed: {
    // taskTimeOutRemind() {
    //   return this.$store.getters.roles[0]
    // }
  },
  created() {
    this.TaskTimeOutCheck()
  },
  methods: {
    TaskTimeOutCheck(){
      this.taskListQuery.limit = 999
      taskTimeOutRemind(this.taskListQuery).then(response => {
        if(response.data.count !== 0){
          this.whetherTimeOut = response.data.results[0].isoverdue
          for (let i = 0; i < response.data.results.length; i++) {
            this.TaskTimeOutRemind(response.data.results[i].regiontask_name, response.data.results[i].starttime, response.data.results[i].taskpackage_name)
          }
        }
      }).catch(error => {
      })
    },
    TaskTimeOutRemind(regionalName, timeoutDate, taskName) {
      this.$notify.warning({
        title: '任务超时提醒',
        message: '您' + regionalName + timeoutDate + '的任务包：' + taskName + '超时未完成，请查看！！',
        offset: 35,
        duration: 0
      });
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop !== '') {
        this.sortByID(order, prop)
      }
    },
    sortByID(order, prop) {
      if (order === 'ascending') {
        this.listQuery.ordering = prop + ',id'
      } else {
        this.listQuery.ordering = '-' + prop + ',id'
      }
      this.fetchData()
    },
    TaskTimeOutRemindInfo(){
      this.timeOutInfodialog = true
      taskTimeOutRemind(this.taskListQuery).then(response => {
        this.taskTimeOutList = response.data.results
        this.listLoading = false
      }).catch(error => {
        reject(error)
      })
    }
  }
}
</script>

<style scoped>
.message-title {
  font-size: 16px;
  color: #333;
  font-weight: bold;
  padding-right: 8px;
}
</style>
