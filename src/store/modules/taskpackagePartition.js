import { submitTaskpackage, getOperator } from '@/api/taskpackagePartition'

const taskpackage = {
  state: {
    name: '',
    user: '',
    mapnum: '',
    visits: 0
  },
  mutations: {
    SET_VISITS: (state, visits) => {
      state.visits = visits
    }
  },
  actions: {
    // 提交任务包
    SubmitTaskpackage({ commit }, taskpackageInfo) {
      const name = taskpackageInfo.name.trim()
      return new Promise((resolve, reject) => {
        submitTaskpackage(name, taskpackageInfo.describe, taskpackageInfo.owner, taskpackageInfo.mapnums, taskpackageInfo.mapnumcounts, taskpackageInfo.regiontask_name, taskpackageInfo.starttime, taskpackageInfo.endtime).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    GetOperator({ commit }) {
      return new Promise((resolve, reject) => {
        getOperator().then(response => {
          commit('SET_VISITS', 1)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default taskpackage
