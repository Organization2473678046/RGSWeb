<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.search" placeholder="请输入需要搜索的信息" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" id="createProject" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">创建项目</el-button>
    <!-- <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="dialogFileTreeVisible = true">帮助</el-button> -->
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      @sort-change="sortChange"
      style="width: 100%;">
      <el-table-column label="序号" prop="id" sortable="custom" align="center" width="75">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="项目名称" sortable="custom">
        <template slot-scope="scope">
          <!-- <span>{{ scope.row.name }}</span> -->
          <router-link :to="'/project' + scope.row.id + '/taskpackageList'" class="link-type">
            <span>{{ scope.row.name }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="项目状态" sortable="custom">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目描述" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.describe }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createtime" label="创建时间" width="160" sortable="custom">
        <template slot-scope="scope">
          <span>{{ scope.row.createtime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" :disabled="scope.row.status === '处理完成'" size="small" @click="handleUpload(scope.row.id, scope.row.name)">上传GDB<i class="el-icon-upload el-icon--right"/></el-button>
          <!-- <el-button :disabled="scope.row.name !== null" type="primary" size="small" @click="handleUpdate(scope.row)">修改</el-button> -->
          <!--<el-button :disabled="scope.row.name !== null" size="mini" type="danger" @click="deleteData(scope.row.id)">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="projectTotal>0"
      :total="projectTotal"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"/>

    <!-- 创建&编辑项目Dialog -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="projectForm" :model="projectList" :rules="projectListRules" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="projectList.name" placeholder="请输入项目名称"/>
        </el-form-item>
        <el-form-item label="项目描述" prop="describe">
          <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="projectList.describe" type="textarea" placeholder="请输入项目描述"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>

    <!-- 上传项目Dialog -->
    <el-dialog :visible.sync="dialogUpVisible" title="上传项目GDB文件">
      <uploader
        :url="'http://192.168.3.120:8000/v9/regiontasks/'"
        :headers = "{'Authorization': 'JWT ' + this.$store.getters.token}"
        :http_method="'PUT'"
        :filters="{
          mime_types : [ { title : 'Zip files', extensions : 'zip,rar' } ]
        }"
        :files-added="filesAdded"
        :before-upload="beforeUpload"
        browse_button="browse_button"
        @inputUploader="inputUploader"
      />
      <el-button id="browse_button" type="primary">选择文件</el-button>
      <br>
      <el-table :data="tableData" style="width: 100%; margin: 10px 10px;">
        <el-table-column label="文件名">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="大小">
          <template slot-scope="scope">
            <span>{{ scope.row.size | formatSize }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === -1">正在计算MD5</span>
            <span v-if="scope.row.status === 1">MD5计算完成，准备上传</span>
            <span v-if="scope.row.status === 4" style="color: brown">上传失败</span>
            <span v-if="scope.row.status === 5 && scope.row.percent === 100" style="color: chartreuse">已上传</span>
            <el-progress v-if="scope.row.status === 2" :text-inside="true" :stroke-width="20" :percentage="scope.row.percent"/>
          </template>
        </el-table-column>
      </el-table>
      <br>
      <el-button type="danger" @click="up.start()">开始上传</el-button>
    </el-dialog>


    <!-- 展示上传GDB文件目录结构Dialog -->
    <el-dialog title="帮助" :visible.sync="dialogFileTreeVisible">

      <div class="custom-tree-container">
        <div class="block">
          <h2>上传GDB文件目录结构</h2>
          <el-tree
            :data="fileTreeData"
            default-expand-all
            :expand-on-click-node="false"
            indent="22">
            <span class="custom-tree-node" slot-scope="{ node, treeData }">
              <span><i class="node-icon" :class="node.icon"></i>{{ node.label }}</span>
            </span>
          </el-tree>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFileTreeVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getProjectRegional, createProjectRegional, updateProjectRegional, delProjectRegional } from '@/api/adminMgmt'
import Pagination from '@/components/Pagination'
import FileMd5 from '@/utils/file-md5'
import { parseTime } from '@/utils'
import Uploader from '@/components/Upload/Uploader'

export default {
  name: 'AdminMgmt',
  components: { Pagination, 'uploader': Uploader },
  filters: {
    formatDate(time) {
      var date = new Date(time)
      return parseTime(date, '{y}-{m}-{d} {h}:{i}')
    },
    formatSize(size) {
      if (size > 1024 * 1024 * 1024 * 1024) {
        return (size / 1024 / 1024 / 1024 / 1024).toFixed(2) + ' TB'
      } else if (size > 1024 * 1024 * 1024) {
        return (size / 1024 / 1024 / 1024).toFixed(2) + ' GB'
      } else if (size > 1024 * 1024) {
        return (size / 1024 / 1024).toFixed(2) + ' MB'
      } else if (size > 1024) {
        return (size / 1024).toFixed(2) + ' KB'
      }
      return size.toString() + ' B'
    }
  },
  data() {
    const treeData = [{
      label: 'GDB压缩包文件',
        icon: "el-icon-tickets",
        children: [{
          icon: "el-icon-tickets",
          label: 'source',
          children: [{}]
        },
        {
          icon: "el-icon-tickets",
          label: 'temp'
        },
        {
          icon: "el-icon-tickets",
          label: 'xxxx.xml'
        }]     
    }];
    return {
      tableKey: 0,
      dialogFormVisible: false,
      dialogUpVisible: false,
      dialogFileTreeVisible: false,
      dialogStatus: '',
      projectList: {
        // id: undefined,
        name: '',
        describe: ''
      },
      projectListRules: {
        name: [{ required: true, message: '*必填*', trigger: 'blur' }],
        describe: [{ required: true, message: '*必填*', trigger: 'blur' }]
      },
      projectTotal: 0,
      listQuery: {
        page: 1,
        limit: 10,
        search: null,
        ordering: null
      },
      list: null,
      textMap: {
        update: '修改项目',
        create: '创建项目'
      },
      listLoading: false,
      files: [],
      up: {},
      tableData: [],
      projectId: '',
      projectName: '',
      fileTreeData: JSON.parse(JSON.stringify(treeData))
    }
  },
  watch: {
    files: {
      handler() {
        this.tableData = []
        this.files.forEach((e) => {
          this.tableData.push({
            name: e.name,
            size: e.size,
            status: e.status,
            id: e.id,
            percent: e.percent
          })
        })
      },
      deep: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList(listQuery) {
      if (listQuery !== undefined) {
        this.listQuery.limit = listQuery.limit
      }
      getProjectRegional(this.listQuery).then(response => {
        this.list = response.data.results
        this.projectTotal = response.data.count
        this.listLoading = false
      }).catch(error => {
        reject(error)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
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
      this.getList()
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['projectList'].clearValidate()
      })
    },
    createData() {
      this.$refs.projectForm.validate(valid => {
        if (valid) {
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
        }
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
    },
    handleUpload(projectId, projectName) {
      this.dialogUpVisible = true
      this.projectId = projectId
      this.projectName = projectName
    },
    inputUploader(up) {
      this.up = up
      this.files = up.files
    },
    filesAdded(up, files) {
      if (up.files.length > 1) {
        up.removeFile(up.files[0])
      }

      files.forEach((f) => {
        f.status = -1
        FileMd5(f.getNative(), (e, md5) => {
          f['md5'] = md5
          f.status = 1
        })
      })
    },
    beforeUpload(up, file) {
      up.settings.url = 'http://192.168.3.120:8000/v9/regiontasks/' + this.projectId + '/'
      up.setOption('multipart_params', { 'name': this.projectName, 'filemd5': file.md5 })
    }
  }
}
</script>

<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  h2{text-align:center;}

  .node-icon {
    margin-right: 5%;
  }
</style>