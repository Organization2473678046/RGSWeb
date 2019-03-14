// 用户登录测试参数
const user = {
    name: 'root',
    password: 'root12345'
}

// 任务包列表测试参数
const taskpackageList = {
    tpName: 'task',
    tpSearch: 'task5',
    tpAtDescribe: '测试@功能描述',
    tpAtSelectOperator: '作业员5',
    uploadTaskDes: '上传作业包备注'
}


//进度管理测试参数
const scheduleList = {
    scheduleName: '修改缝隙',   // 用于断言获取进度数据
    addSchedule: '添加进度测试1',
    editSchedule: '修改',
    editScheduleTest: '添加进度测试修改',
    editBtnId: '#scheduleEdit55',   // 获取新增进度的编辑按钮ID（每次新增后ID递增  需相应修改）
    DelBtnId: '#scheduleDel55'
}

//项目管理测试参数
const projectList = {
    projectName: '东南区域1800幅',   // 用于断言获取项目数据
    createProject: '创建项目测试2',
    createProjectDes: '创建项目测试描述',
    editScheduleTest: '添加进度测试修改',
    editBtnId: '#scheduleEdit53',   // 获取新增进度的编辑按钮ID（每次新增后ID递增  需相应修改）
    DelBtnId: '#scheduleDel53'
}
export { user, taskpackageList, scheduleList, projectList }  