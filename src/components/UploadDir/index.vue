<template>
  <div>
    <input ref="upload-dir" class="upload-dir" type="file" webkitdirectory multiple @change="handleClick" >
    <div>
      <el-button :loading="loading" size="mini" type="primary" icon="el-icon-upload2" @click="handleUpload">上传</el-button>
    </div>
  </div>
</template>
<script>
import JSZip from 'jszip'
import { uploadTaskpackage } from '@/api/taskpackageList'
import saveAs from 'file-saver'

export default {
  props: {
    beforeUpload: Function, // eslint-disable-line
    onSuccess: Function,
    taskpackageID: Number,
    remarks: String
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    handleUpload() {
      this.$refs['upload-dir'].click()
    },
    handleClick(event) {
      const files = event.target.files
      if (files.length === 0) {
        this.$message({
          message: '不可以上传空文件夹！',
          type: 'warning'
        })
      } else {
        this.upload(files)
      }
    },
    upload(files) {
      if (this.beforeUpload(files)) {
        var zip = new JSZip()

        for (var i = 0; i < files.length; i++) {
          zip.file(event.target.files[i].webkitRelativePath, event.target.files[i])
        }

        var formData = new FormData()

        formData.append('taskpackageID', this.taskpackageID)
        formData.append('remarks', this.remarks)

        zip.generateAsync({ type: 'blob' }).then(function(content) {
          formData.append('data', content)
          // saveAs(content, "example.zip");
        })

        uploadTaskpackage(formData).then(response => {
          console.log(response)
        }).catch(() => {

        })
      }
    }
  }
}
</script>

<style scoped>
.upload-dir {
  display: none;
  z-index: -9999;
}
</style>
