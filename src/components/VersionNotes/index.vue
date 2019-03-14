<template>
  <div class="components-container">
    <!-- <el-button type="primary" @click="dialogTableVisible = true">open a Drag Dialog</el-button> -->
    <el-dialog :before-close="handleClose" :visible.sync="dialogVisible" title="版本更新记录">
      <h1 style="">V0.10版本更新内容</h1>
      <h3>1 登录界面重新设计。</h3>
      <h3>2 添加任务超期提醒功能。</h3>
      <h3>作业员登录后如果有超期任务，会在右上角弹窗提醒超时任务，点击顶部铃铛按钮显示所有超期任务详情。</h3>
      <h3>管理员可在任务包列表进度处显示超期任务，点击进度显示任务包时间线。</h3>
      
      <h3>3 新增用户管理页面，可以创建用户、修改用户信息、重置密码</h3>

      <h1 style="">V0.9版本更新内容</h1>
      <h3>1 添加进度管理和项目管理搜索、排序、分页功能</h3>
      <h3>2 处理浏览器放大缩小导致的排版错乱</h3>
      <h3>3 优化任务包划分帮助提示</h3>
      <h3>4 替换任务包划分页面切换图层小图标</h3>

      <h1 style="">V0.8版本更新内容</h1>
      <h3>1 上传列表新增取消上传文件功能</h3>
      <h3>2 解决任务包列表排序错乱问题</h3>
      <h3>3 解决放大缩小浏览器导致的页面排版错乱</h3>

      <h1>V0.7版本</h1>
      <h3>1 新增项目（区域）管理，创建项目后上传GDB文件左侧生成新项目工作菜单</h3>
      <h3>1 样式调整，性能优化</h3>

      <h1>V0.6版本</h1>
      <h3>1 右上角显示当前登录用户名称</h3>
      <h3>2 添加后台管理-进度管理，管理员可以新增、修改、删除进度</h3>
      <h3>3 进度选择新增完成进度</h3>
      <h3>4 优化消息提醒圆圈样式</h3>
      <h3>5 搜索新增可以根据作业员中文名进行搜索</h3>

      <h1>V0.5版本</h1>
      <h3>1 任务包划分添加图层切换功能</h3>
      <h3>2 任务包划分添加帮助（提示如何划分任务）</h3>
      <h3>3 进度选择新增完成进度</h3>
      <h3>4 优化消息提醒圆圈样式</h3>
      <h3>5 搜索新增可以根据作业员中文名进行搜索</h3>

      <h1>V0.4版本</h1>
      <h3>1 新增上传任务包时选择进度</h3>
      <h3>2 新增按图幅数进行排序</h3>
      <h3>3 新增任务包列表搜索功能</h3>
      <h3>4 新增小铃铛提醒功能（管理员登录显示有新上传的作业包红色圆圈提醒）</h3>
      <h3>4 任务包列表作业员显示中文姓名</h3>

      <h1>V0.3版本</h1>
      <h3>1 添加任务包划分时显示已选任务包数量</h3>
      <h3>2 修改任务列表下载，默认下载最新上传版本</h3>
      <h3>3 添加任务包列表排序功能</h3>
      <h3>4 添加任务包统计图表</h3>

      <h1>V0.2版本</h1>
      <h3>1 性能优化</h3>

      <h1>V0.1版本</h1>
      <h3>1 全生命周期管理系统上线</h3>
      <h3>2 任务包列表，任务包划分</h3>
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
