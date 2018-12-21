import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import files from './modules/files'
import permission from './modules/permission'
import taskpackage from './modules/taskpackagePartition'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    files,
    permission,
    taskpackage
  },
  getters
})

export default store
