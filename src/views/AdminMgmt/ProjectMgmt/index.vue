<template>
  <div class="app-container">
    <div class="filter-container">
      <!--<el-input placeholder="搜索进度" style="width: 200px;" class="filter-item" />-->
      <!--<el-button class="filter-item" type="primary" icon="el-icon-search" >搜索</el-button>-->
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">创建项目</el-button>
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
      <el-table-column label="项目名称" min-width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目状态" min-width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button :disabled="scope.row.name !== null" type="primary" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button :disabled="scope.row.name !== null" size="mini" type="danger" @click="deleteData(scope.row.id)">删除
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
      <el-form ref="projectList" :model="projectList" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="projectList.name"/>
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
import { getProjectRegional, createProjectRegional, updateProjectRegional, delProjectRegional } from '@/api/adminMgmt'
import Pagination from '@/components/Pagination'

export default {
  name: 'AdminMgmt',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      dialogFormVisible: false,
      dialogStatus: '',
      projectList: {
        // id: undefined,
        name: ''
      },
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      list: null,
      textMap: {
        update: '修改项目',
        create: '创建项目'
      },
      listLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getProjectRegional(this.listQuery).then(response => {
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
        this.$refs['projectList'].clearValidate()
      })
    },
    createData() {
      createProjectRegional(this.projectList).then(response => {
        this.dialogFormVisible = false
        this.$message({
          message: '创建成功！',
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
      updateProjectRegional(this.scheduleList).then(response => {
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
      delProjectRegional(id).then(response => {
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
