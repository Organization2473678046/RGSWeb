<template>
  <div class="components-container">
    <!-- <el-button type="primary" @click="dialogTableVisible = true">open a Drag Dialog</el-button> -->
    <el-dialog :before-close="handleClose" :visible.sync="dialogVisible" title="版本更新记录">
      <h1 style="">V0.9版本更新内容</h1>
      <h3>1 添加进度管理和项目管理搜索、排序、分页功能</h3>
      <h3>2 处理浏览器放大缩小导致的排版错乱</h3>
      <h3>3 优化任务包划分帮助提示</h3>
      <h3>4 替换任务包划分页面切换图层小图标</h3>

      <h1 style="">V0.8版本更新内容</h1>
      <h3>1 任务包列表页面上传文件添加取消功能</h3>
      <h3>2 解决任务包列表排序重复记录问题</h3>
      <h3>3 优化性能</h3>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'VersionDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    handleClose: {
      type: Function
    }
  },
  methods: {

  }
}
</script>

</<style>
h1 {font-family:Georgia;}
</style>
