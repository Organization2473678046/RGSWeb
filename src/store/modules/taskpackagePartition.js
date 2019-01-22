import { submitTaskpackage, getOperator } from '@/api/taskpackagePartition'

const taskpackage = {
  state: {
    name: '',
    user: '',
    mapnum: '',
    file: ''
  },
  mutations: {

  },
  actions: {
    // 提交任务包
    SubmitTaskpackage({ commit }, taskpackageInfo) {
      const name = taskpackageInfo.name.trim()
      return new Promise((resolve, reject) => {
<<<<<<< HEAD
        submitTaskpackage(name, taskpackageInfo.describe, taskpackageInfo.owner, taskpackageInfo.mapnums, taskpackageInfo.nums).then(response => {
=======
        submitTaskpackage(name, taskpackageInfo.describe, taskpackageInfo.owner, taskpackageInfo.mapnums, taskpackageInfo.mapnumcounts, taskpackageInfo.regiontask_name).then(response => {
>>>>>>> dev-v7
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    GetOperator() {
      return new Promise((resolve, reject) => {
        getOperator().then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default taskpackage
