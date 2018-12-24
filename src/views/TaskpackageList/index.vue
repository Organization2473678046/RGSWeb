<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input v-model="listQuery.describe" placeholder="请输入描述信息进行查询" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>

    <!-- 任务包列表Table -->
    <el-table
      v-loading="listLoading"
      :data="taskpackageList"
      element-loading-text="Loading"
      border
      :default-sort = "{prop: 'id'}"
      @sort-change='sortChange'
      highlight-current-row>
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
      <el-table-column prop="mapnumcounts" label="图幅数" width="89">
        <template slot-scope="scope">
          {{ scope.row.mapnumcounts }}
        </template>
      </el-table-column>
      <el-table-column prop="owner" label="作业员" sortable="custom" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.owner }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.describe }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="100" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status | statusDisplayFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="前任" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.exowner === null?'无':scope.row.exowner }}</span>
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
      <el-table-column label="管理数据" width="100" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit-outline"
            @click="handleData(subversionListQuery, scope.row.id, scope.row.name)"/>
          <span class="data-remind">{{ scope.row.id }}</span>
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
            <el-option v-for="progress in handleProgressList" :label="progress.label" :key="progress.value" :value="progress.value"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <!--<upload-component
            :taskpackageID="taskpackageID"
            :remarks="taskpackageForm.remarks"
            :on-success="handleSuccess"
            :before-upload="beforeUpload"/>
          @inputUploader="inputUploader"-->
          <uploader
            ref="uploader"
            :url="'http://192.168.3.120:8000/v3/taskpackagesons/'"
            :headers = "{'Authorization': 'JWT ' + this.$store.getters.token}"
            :filters="{prevent_duplicates:true}"
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
            {{ scope.row.user_username }}
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
            <el-option v-for="operator in operatorList" :key="operator.id" :label="operator.username" :value="operator.username"/>
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
            {{ scope.row.owner }}
          </template>
        </el-table-column>
        <el-table-column label="前任拥有者" width="115">
          <template slot-scope="scope">
            {{ scope.row.exowner }}
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
      :is-min-display="isMinDisplay"
      :up="up"/>
  </div>
</template>

<script>
import { getTaskpackageList, getTPSubversionList, atOperator, atOperatorRecord } from '@/api/taskpackageList'
import UploadDialogComponent from '@/components/Upload/uploadDialog.vue'
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils'
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
        1: '已完成',
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
        describe: null,
        column: null,
        ordering: null
      },
      subversionListQuery: {
        id: null,
        taskpackage_name: null,
        page: 1,
        limit: 5
      },
      atRecListQuery: {
        id: null,
        taskpackage_name: null,
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
        taskpackage_name: ''
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
      handleProgressList: [{
        value: '0',
        label: '修改缝隙'
      }, {
        value: '1',
        label: '河网环修改'
      }, {
        value: '2',
        label: '有向点修改'
      }, {
        value: '3',
        label: '一对多修改'
      }, {
        value: '4',
        label: '匝道赋值'
      }, {
        value: '5',
        label: '同层拓扑'
      }, {
        value: '6',
        label: '不同层拓扑'
      }, {
        value: '7',
        label: '微短线修改'
      }],
      uploadPra: [], // 上传文件参数对象
      upPraIndex: 0, // 上传文件参数下标
      upTaskAttr: []
    }
  },
  watch: {
    files: {
      handler() {
        this.tableData = []
        // let upTaskAttrIndex = 0
        this.files.forEach((e) => {
          this.tableData.push({
            name: e.name,
            size: e.size,
            status: e.status,
            id: e.id,
            percent: e.percent
            // taskAttribution: this.upTaskAttr[upTaskAttrIndex].taskAttr
          })
          // upTaskAttrIndex++
        })
      },
      deep: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      // 获取任务包列表
      getTaskpackageList(this.listQuery).then(response => {
        this.taskpackageList = response.data.results
        this.tpTotal = response.data.count
        this.listLoading = false
      }).catch(error => {
        reject(error)
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
      up.setOption('multipart_params', { 'describe': this.uploadPra[this.upPraIndex].remarks, 'handle_progress': this.uploadPra[this.upPraIndex].hp, 'taskpackage_file_id': this.uploadPra[this.upPraIndex].taskID, 'taskpackage_name': this.uploadPra[this.upPraIndex].tpName })
      this.upPraIndex++
    },
    filesAdded(up, files) {
      const upp = {}
      upp.remarks = this.taskpackageForm.remarks
      upp.hp = this.taskpackageForm.handleProgress
      upp.taskID = this.taskpackageID
      upp.tpName = this.dataMGMTTitle
      this.uploadPra.push(upp)

      this.dataMGMTDialog = false
      this.isDisplay = true
      this.isMinDisplay = false
    },
    handleSuccess({ upload }) {
      // 处理同一个文件上传两次无响应问题
      upload.value = ''
      // 上传成功，刷新子版本列表
      this.handleData(this.subversionListQuery)

      this.dataMGMTDialog = false
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

      // 上传为文件列表所属任务包
      // let upp = {}
      // upp.taskAttr = this.dataMGMTTitle
      // this.upTaskAttr.push(upp)

      this.dataMGMTDialog = true

      // 获取任务包对应子版本列表
      subversionListQuery.id = this.taskpackageID
      subversionListQuery.taskpackage_name = this.dataMGMTTitle
      getTPSubversionList(subversionListQuery).then(response => {
        this.tpSubversionList = response.data.results
        this.tpsTotal = response.data.count
        this.listLoading = false
      })
    },
    handleClose(done) {
      done()
    },
    atOperatorFun(name, taskID) {
      this.dialogAtFunVisible = true
      this.atFunTitle = '为' + name + '指定作业员'
      this.atFunForm.taskpackage_name = name
      // 拉取作业员列表
      this.$store.dispatch('GetOperator').then(response => {
        this.operatorList = response.data
      }).catch(() => { _this.loading = false })
    },
    submitAtOperator() {
      this.$refs.atFunForm.validate(valid => {
        if (valid) {
          atOperator(this.atFunForm).then(response => {
            this.dialogAtFunVisible = false
            this.$message({
              message: '已完成任务包指派！',
              type: 'success'
            })
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
      atOperatorRecord(atRecListQuery).then(response => {
        this.dialogAtRecVisible = true
        this.AtRecordList = response.data.results
        this.atRecTotal = response.data.count
      })
    },
    sortChange(sort) {
      this.listQuery.column = sort.prop
      this.listQuery.ordering = sort.order
      this.fetchData()
    }
  }
}
</script>

<style>
  .data-remind{
    position: absolute;
    left: 64%;
    width: 1.3rem;
    height: 1.3rem;
    border-radius: 100%;
    background: #FF0017;
    color: #ffffff;
    /*font-size: 15px;*/
    top: 2px;
    font-weight: 600;
    /* line-height: 1rem; */
  }
</style>
