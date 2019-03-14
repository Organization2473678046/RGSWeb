<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.search" placeholder="搜索用户" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">创建用户</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="userData"
      border
      fit
      highlight-current-row
      @sort-change="sortChange"
      style="width: 100%;">
      <el-table-column label="序号" prop="id" sortable="custom" align="center" width="85">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" prop="name" sortable="custom" >
        <template slot-scope="scope">
          <span>{{ scope.row.reallyname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登录账号" prop="name" sortable="custom" >
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" prop="name" sortable="custom" >
        <template slot-scope="scope">
          <span>{{ scope.row.isadmin==true?'管理员':'作业员' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.date_joined }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="260" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" :disabled="true" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini" @click="modifyPassword(scope.row.id)">重置密码
          </el-button>
          <el-button size="mini" :disabled="true" type="danger" @click="handleDelete(scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="userTotal>0"
      :total="userTotal"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getUserList"/>

    <!-- 创建&编辑用户Dialog -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="userForm" :model="userList" :rules="userListRules" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="登录名称" prop="username">
          <el-input v-model="userList.username" placeholder="用户登录账户名"/>
        </el-form-item>
        <el-form-item label="真实姓名" prop="reallyname">
          <el-input v-model="userList.reallyname" placeholder="请输入真实姓名"/>
        </el-form-item>
        <el-form-item label="指定角色" prop="isadmin">
          <el-select v-model="userList.isadmin" placeholder="指定角色">
            <el-option
              v-for="item in userRole"
              :key="item.id"
              :label="item.name"
              :value="item.val">
            </el-option>
          </el-select>
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
import { getUser, createUser, editUser, delUser, resetPassword } from '@/api/adminMgmt'
import Pagination from '@/components/Pagination'

export default {
  name: 'AdminMgmt',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      dialogFormVisible: false,
      dialogUpVisible: false,
      dialogStatus: '',
      userData: null,
      userList: {
        username: '',
        reallyname: '',
        password: 'password',
        isadmin: ''
      },
      userRole: [{
        id: 1,
        name: '管理员',
        val: true
      },{
        id: 2,
        name: '作业员',
        val: false
      }
      ],
      userListRules: {
        name: [{ required: true, message: '*必填*', trigger: 'blur' }],
        trueName: [{ required: true, message: '*必填*', trigger: 'blur' }]
      },
      textMap: {
        update: '修改用户',
        create: '创建用户'
      },
      userTotal: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        search: null,
        ordering: null
      },
      roleList: []
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    getUserList(listQuery) {
      if (listQuery !== undefined) {
        this.listQuery.limit = listQuery.limit
      }
      getUser(this.listQuery).then(response => {
        this.userData = response.data.results
        this.userTotal = response.data.count

        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getUserList()
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
      this.getUserList()
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['userList'].clearValidate()
      })
    },
    createData() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          createUser(this.userList).then(response => {
            this.dialogFormVisible = false
            this.$message({
              message: '创建成功！',
              type: 'success'
            })
            this.getUserList()
            this.listLoading = false
          }).catch(error => {
            reject(error)
          })
        }
      })
    },
    handleUpdate(row) {
      this.userList = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['userList'].clearValidate()
      })
    },
    updateData() {
      this.$refs['userForm'].validate((valid) => {
        if (valid) {
          editUser(this.userList).then(response => {
            this.dialogFormVisible = false
            this.$message({
              message: '修改成功！',
              type: 'success'
            })
            this.getUserList()
            this.listLoading = false
          }).catch(error => {
            reject(error)
          })
        }
      })
    },
    handleDelete(id) {
      delUser(id).then(response => {
        this.$message({
          message: '删除成功！',
          type: 'success'
        })
        this.getList()
        this.listLoading = false
      }).catch(error => {
        reject(error)
      })
    },
    modifyPassword(id) {
      resetPassword(id).then(response => {
        this.$message({
          message: '重置密码成功！',
          type: 'success'
        })
      }).catch(error => {
        reject(error)
      })
    }
  }
}
</script>
