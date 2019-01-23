<template>
  <div class="app-container">
    <div class="filter-container">
      <!--<el-input placeholder="搜索进度" style="width: 200px;" class="filter-item" />-->
      <!--<el-button class="filter-item" type="primary" icon="el-icon-search" >搜索</el-button>-->
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">添加进度</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="序号" prop="id" sortable="custom" align="center" width="85">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="进度" min-width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.schedule }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="danger" @click="deleteData(scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination=""/>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="scheduleList" :model="scheduleList" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="进度名称" prop="name">
          <el-input v-model="scheduleList.schedule"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getTPSchedule, createTPSchedule, updateTPSchedule, delTPSchedule } from '@/api/adminMgmt'
import Pagination from '@/components/Pagination'

export default {
  name: 'AdminMgmt',
  components: { Pagination },
  props: ['regionalName'],
  data() {
    return {
      tableKey: 0,
      dialogFormVisible: false,
      dialogStatus: '',
      scheduleList: {
        // id: undefined,
        schedule: '',
        regiontask_name: ''
      },
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        regiontask_name: ''
      },
      list: null,
      textMap: {
        update: '修改进度',
        create: '添加进度'
      },
      listLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listQuery.regiontask_name = this.regionalName
      getTPSchedule(this.listQuery).then(response => {
        this.list = response.data
        // this.total = response.data.count
        this.listLoading = false
      }).catch(error => {
        reject(error)
      })
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['scheduleList'].clearValidate()
      })
    },
    createData() {
      this.scheduleList.regiontask_name = this.regionalName
      createTPSchedule(this.scheduleList).then(response => {
        this.dialogFormVisible = false
        this.$message({
          message: '添加成功！',
          type: 'success'
        })
        this.getList()
        this.listLoading = false
      }).catch(error => {
        reject(error)
      })
    },
    handleUpdate(row) {
      this.scheduleList = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['scheduleList'].clearValidate()
      })
    },
    updateData() {
      updateTPSchedule(this.scheduleList).then(response => {
        this.dialogFormVisible = false
        this.$message({
          message: '修改成功！',
          type: 'success'
        })
        this.getList()
        this.listLoading = false
      }).catch(error => {
        reject(error)
      })
    },
    deleteData(id) {
      delTPSchedule(id).then(response => {
        this.dialogFormVisible = false
        this.$message({
          message: '删除成功！',
          type: 'success'
        })
        this.getList()
        this.listLoading = false
      }).catch(error => {
        reject(error)
      })
    }
  }
}
</script>
