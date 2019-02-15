<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input v-model="listQuery.search" placeholder="请输入需要搜索的信息" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>

    <!-- 任务包列表Table -->
    <el-table
      v-loading="listLoading"
      :data="taskpackageList"
      element-loading-text="Loading"
      border
      highlight-current-row
      @sort-change="sortChange">
      <el-table-column prop="id" align="center" sortable="custom" label="ID" width="65">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="任务包名称" sortable="custom" width="150">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column prop="mapnumcounts" label="图幅数" sortable="custom" width="89">
        <template slot-scope="scope">
          {{ scope.row.mapnumcounts }}
        </template>
      </el-table-column>
      <el-table-column prop="owner" label="作业员" sortable="custom" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.reallyname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.describe }}</span>
        </template>
      </el-table-column>
      <el-table-column label="进度" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.schedule }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="裁切状态" width="100" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status | statusDisplayFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="前任" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.exreallyname === null?'无':scope.row.exreallyname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130" align="center">
        <template slot-scope="scope">
          <el-button
            :disabled="role !== 'admin'"
            type="primary"
            plain
            size="mini"
            @click="atOperatorFun(scope.row.name, scope.row.id)">@
          </el-button>
          <el-button
            :disabled="scope.row.file === null"
            type="success"
            class="download-button"
            size="mini"
            icon="el-icon-download"
            @click="downloadTaskpackage(scope.row.file)"/>
        </template>
      </el-table-column>
      <el-table-column label="管理数据" prop="newtaskpackagesonfornotice" sortable="custom" width="105" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit-outline"
            @click="handleData(subversionListQuery, scope.row.id, scope.row.name)"/>
          <span v-show="role === 'admin' && scope.row.newtaskpackagesonfornotice !== 0" class="data-remind">{{ scope.row.newtaskpackagesonfornotice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="@记录" width="100" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-view"
            @click="atOperatorRecord(atRecListQuery, scope.row.id, scope.row.name)"/>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="updatetime" sortable="custom" label="最后更新时间" width="160">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.updatetime | formatDate }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 任务包列表分页Components -->
    <pagination
      v-show="tpTotal>0"
      :total="tpTotal"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="fetchData"/>

    <!-- 数据管理Dialog -->
    <el-dialog :title="dataMGMTTitle" :visible.sync="dataMGMTDialog" :before-close="handleClose" width="60%">
      <el-form
        ref="taskpackageForm"
        :inline="true"
        :inline-message="true"
        :model="taskpackageForm"
        :rules="taskpackageRules">
        <el-form-item prop="remarks">
          <el-input v-model="taskpackageForm.remarks" name="remarks" placeholder="请输入备注" style="width: 260px;" class="filter-item"/>
        </el-form-item>
        <el-form-item prop="handleProgress">
          <el-select v-model="taskpackageForm.handleProgress" placeholder="请选择进度" prop="handleProgress" class="taskinfo-item" style="width: 140px">
            <el-option v-for="progress in handleProgressList" :label="progress.schedule" :key="progress.id" :value="progress.schedule"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <!--<upload-component
            chunk_size="2MB"
            :max_retries="3"/>-->
          <uploader
            ref="uploader"
            :url="'http://192.168.3.120:8000/v7/taskpackagesons/'"
            :headers = "{'Authorization': 'JWT ' + this.$store.getters.token}"
            :filters="{
              mime_types : [ { title : 'Zip files', extensions : 'zip,rar' } ]
            }"
            :before-upload="beforeUpload"
            :files-added="filesAdded"
            :Browse="browse"
            browse_button="browse_button"
            @inputUploader="inputUploader"
          />
          <el-button id="browse_button" type="primary">上传</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tpSubversionList" stripe style="width: 100%">
        <el-table-column label="历史版本" width="90">
          <template slot-scope="scope">
            {{ scope.row.version }}
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            {{ scope.row.describe }}
          </template>
        </el-table-column>
        <el-table-column label="上传人" width="100">
          <template slot-scope="scope">
            {{ scope.row.reallyname }}
          </template>
        </el-table-column>
        <el-table-column label="上传日期" width="150">
          <template slot-scope="scope">
            {{ scope.row.createtime | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="下载" width="90" align="center">
          <template slot-scope="scope">
            <el-button
              :disabled="scope.row.file === null"
              type="success"
              class="download-button"
              size="mini"
              icon="el-icon-download"
              @click="downloadTaskpackage(scope.row.file)"/>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="tpsTotal>0"
        :total="tpsTotal"
        :page.sync="subversionListQuery.page"
        :limit.sync="subversionListQuery.limit"
        @pagination="handleData"/>
    </el-dialog>

    <!-- @功能Dialog -->
    <el-dialog :title="atFunTitle" :visible.sync="dialogAtFunVisible">
      <el-form ref="atFunForm" :model="atFunForm" :rules="atFunRules">
        <el-form-item label="指定" prop="owner" label-width="120px">
          <el-select v-model="atFunForm.owner" placeholder="请选择作业员" prop="owner" class="taskinfo-item" style="width: 140px">
            <el-option v-for="operator in operatorList" :key="operator.id" :label="operator.reallyname" :value="operator.username"/>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="describe" label-width="120px">
          <el-input v-model="atFunForm.describe" placeholder="请输入描述" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAtFunVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAtOperator()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- @记录列表 -->
    <el-dialog :visible.sync="dialogAtRecVisible" title="@记录">
      <el-table :data="AtRecordList">
        <el-table-column label="序号" width="60">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="现任拥有者" width="115">
          <template slot-scope="scope">
            {{ scope.row.reallyname }}
          </template>
        </el-table-column>
        <el-table-column label="前任拥有者" width="115">
          <template slot-scope="scope">
            {{ scope.row.exreallyname }}
          </template>
        </el-table-column>
        <el-table-column label="描述">
          <template slot-scope="scope">
            {{ scope.row.describe }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="150">
          <template slot-scope="scope">
            {{ scope.row.createtime | formatDate }}
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="atRecTotal>0"
        :total="atRecTotal"
        :page.sync="atRecListQuery.page"
        :limit.sync="atRecListQuery.limit"
        @pagination="atOperatorRecord"/>
    </el-dialog>

    <!-- 上传进度列表 -->
    <upload-dialog-component
      :table-data="tableData"
      :is-display="isDisplay"
      :up-dialog-min-max="upDialogMinMax"
      :is-min-display="isMinDisplay"
      :up="up"/>
  </div>
</template>

<script>
import { getTaskpackageList, getTPSubversionList, atOperator, atOperatorRecord } from '@/api/taskpackageList'
import { getTPSchedule } from '@/api/adminMgmt'
import UploadDialogComponent from '@/components/Upload/uploadDialog.vue'
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils'
import '@/utils/js-spark-md5'
import FileMd5 from '@/utils/file-md5'
import Uploader from '@/components/Upload/Uploader'

export default {
  name: 'TaskpackageList',
  components: { Pagination, UploadDialogComponent, 'uploader': Uploader },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'info',
        1: 'success',
        2: 'gray',
        3: 'danger'
      }
      return statusMap[status]
    },
    statusDisplayFilter(status) {
      const statusMap = {
        0: '等待裁切',
        1: '裁切完成',
        2: '裁切中',
        3: '裁切错误'
      }
      return statusMap[status]
    },
    formatDate(time) {
      var date = new Date(time)
      return parseTime(date, '{y}-{m}-{d} {h}:{i}')
    }
  },
  props: ['regionalName'],
  data() {
    return {
      dataMGMTDialog: false, // 数据管理Dialog
      dataMGMTTitle: null, // 数据管理Dialog标题
      taskpackageID: null,
      taskpackageList: null,
      tpSubversionList: null,
      AtRecordList: null,
      dialogAtFunVisible: false,
      dialogAtRecVisible: false,
      operatorList: null,
      atFunTitle: null,
      listLoading: true,
      role: this.$store.getters.roles[0],
      tpTotal: 0,
      tpsTotal: 0,
      atRecTotal: 0,
      up: {},
      files: [],
      tableData: [],
      isDisplay: false,
      isMinDisplay: false,
      listQuery: {
        page: 1,
        limit: 10,
        regiontask_name: '',
        search: null,
        ordering: null
      },
      subversionListQuery: {
        id: null,
        taskpackage_name: null,
        page: 1,
        limit: 5,
        regiontask_name: ''
      },
      atRecListQuery: {
        id: null,
        taskpackage_name: null,
        regiontask_name: '',
        page: 1,
        limit: 5
      },
      taskpackageForm: {
        remarks: '',
        handleProgress: null
      },
      taskpackageRules: {
        remarks: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      },
      atFunForm: {
        owner: '',
        describe: '',
        taskpackage_name: '',
        regiontask_name: ''
      },
      atFunRules: {
        operator: [{ required: true, message: '*必填*', trigger: 'blur' }],
        describe: [{ required: true, message: '*必填*', trigger: 'blur' }]
      },
      listSearch: {
        page: 1,
        limit: 10,
        describe: undefined
      },
      scheduleQuery: {
        regiontask_name: ''
      },
      handleProgressList: null
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
    this.fetchData()
  },
  methods: {
    fetchData(listQuery) {
      this.listLoading = true
      // 获取任务包列表
      if (listQuery !== undefined) {
        this.listQuery.limit = listQuery.limit
      }
      this.listQuery.regiontask_name = this.regionalName
      getTaskpackageList(this.listQuery).then(response => {
        this.taskpackageList = response.data.results
        this.tpTotal = response.data.count
        this.listLoading = false
      }).catch(error => {
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },
    inputUploader(up) {
      this.up = up
      this.files = up.files
    },
    browse(up) {
      if (this.taskpackageForm.remarks === '') {
        this.$message({
          message: '请填写备注信息！',
          type: 'error'
        })
      }
    },
    beforeUpload(up, file) {
      up.setOption('multipart_params', { 'describe': file.remarks, 'schedule': file.handleProgress, 'taskpackage_file_id': file.taskpackageID, 'taskpackage_name': file.taskpackageName, 'file_md5': file.md5, 'regiontask_name': file.regionalName })
    },
    filesAdded(up, files) {
      this.dataMGMTDialog = false
      this.isDisplay = true
      this.isMinDisplay = false

      files.forEach((f) => {
        f.status = -1

        FileMd5(f.getNative(), (e, md5) => {
          f['md5'] = md5
          f.status = 1
        })

        f['remarks'] = this.taskpackageForm.remarks
        f['handleProgress'] = this.taskpackageForm.handleProgress === null ? '未指定状态' : this.taskpackageForm.handleProgress
        f['taskpackageID'] = this.taskpackageID
        f['taskpackageName'] = this.dataMGMTTitle
        f['regionalName'] = this.regionalName
      })
    },
    upDialogMinMax() {
      if (this.isDisplay === true) {
        this.isDisplay = false
        this.isMinDisplay = true
      } else {
        this.isDisplay = true
        this.isMinDisplay = false
      }
    },
    downloadTaskpackage(fileUrl) {
      window.open(fileUrl)
    },
    handleData: function(subversionListQuery, id, name) {
      if (!isNaN(id)) {
        this.taskpackageID = id
      }
      if (name !== undefined) {
        this.dataMGMTTitle = name
      }

      this.dataMGMTDialog = true

      // 获取任务包对应子版本列表
      subversionListQuery.id = this.taskpackageID
      subversionListQuery.taskpackage_name = this.dataMGMTTitle
      this.getScheduleList()
      subversionListQuery.regiontask_name = this.regionalName
      getTPSubversionList(subversionListQuery).then(response => {
        this.tpSubversionList = response.data.results
        this.tpsTotal = response.data.count
        this.listLoading = false
      })
    },
    handleClose(done) {
      done()
      this.fetchData()
    },
    atOperatorFun(name, taskID) {
      this.dialogAtFunVisible = true
      this.atFunTitle = '为' + name + '指定作业员'
      this.atFunForm.taskpackage_name = name
      // 拉取作业员列表
      this.$store.dispatch('GetOperator').then(response => {
        this.operatorList = response.data
      }).catch(() => { this.listLoading = false })
    },
    submitAtOperator() {
      this.$refs.atFunForm.validate(valid => {
        if (valid) {
          this.atFunForm.regiontask_name = this.regionalName
          atOperator(this.atFunForm).then(response => {
            this.dialogAtFunVisible = false
            this.$message({
              message: '已完成任务包指派！',
              type: 'success'
            })
            this.fetchData()
          })
        } else {
          console.log('提交错误!!')
          return false
        }
      })
    },
    atOperatorRecord(atRecListQuery, id, name) {
      if (!isNaN(id)) {
        this.taskpackageID = id
      }
      if (name !== undefined) {
        this.dataMGMTTitle = name
      }
      atRecListQuery.id = this.taskpackageID
      atRecListQuery.taskpackage_name = this.dataMGMTTitle
      atRecListQuery.regiontask_name = this.regionalName
      atOperatorRecord(atRecListQuery).then(response => {
        this.dialogAtRecVisible = true
        this.AtRecordList = response.data.results
        this.atRecTotal = response.data.count
      })
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop !== '') {
        this.sortByID(order, prop)
      }
    },
    sortByID(order, prop) {
      if (order === 'ascending') {
        this.listQuery.ordering = prop
      } else {
        this.listQuery.ordering = '-' + prop
      }
      this.fetchData()
    },
    getScheduleList(name, taskID) {
      // 拉取进度列表
      this.scheduleQuery.regiontask_name = this.regionalName
      getTPSchedule(this.scheduleQuery).then(response => {
        this.handleProgressList = response.data
        this.listLoading = false
      }).catch(error => {
      })
    }
  }
}
</script>

<style>
  .data-remind{
    position: absolute;
    left: 64%;
    width: 1.1rem;
    height: 1.1rem;
    border-radius: 100%;
    background: #FF0017;
    color: #ffffff;
    font-size: 15px;
    top: 1px;
    font-weight: 500;
    line-height: 1.2rem;
  }
</style>
