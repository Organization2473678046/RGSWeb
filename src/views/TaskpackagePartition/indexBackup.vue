<template>
  <div class="dashboard-container">
    <div class="taskinfo-container">
      <el-form ref="taskpackageForm" :inline="true" :inline-message="true" :model="taskpackageForm" :rules="taskpackageRules" style="margin-bottom: -20px;">
        <el-form-item prop="name">
          <el-input v-model="taskpackageForm.name" :disabled="submitTPDisable" placeholder="请输入任务包名称" style="width: 200px;" class="taskinfo-item"/>
        </el-form-item>
        <el-form-item prop="describe">
          <el-input v-model="taskpackageForm.describe" :disabled="submitTPDisable" placeholder="描述" style="width: 220px;" class="taskinfo-item"/>
        </el-form-item>
        <el-form-item prop="mapnumcounts">
          <el-input v-model="taskpackageForm.mapnumcounts" :disabled="TPNumDisable = true" placeholder="已划分图幅数" style="width: 118px;" class="taskinfo-item"/>
        </el-form-item>
        <el-form-item prop="owner">
          <el-select v-model="taskpackageForm.owner" :disabled="submitTPDisable" placeholder="请选择作业员" prop="owner" class="taskinfo-item" style="width: 140px">
            <el-option v-for="operator in operatorList" :key="operator.id" :label="operator.reallyname" :value="operator.username"/>
          </el-select>
        </el-form-item>
        <el-form-item prop="startDate">
          <div class="block">
            <el-date-picker
              :disabled="submitTPDisable"
              v-model="taskpackageForm.startDate"
              type="datetime"
              placeholder="任务开始时间">
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item prop="endDate">
          <div class="block">
            <el-date-picker
              :disabled="submitTPDisable"
              v-model="taskpackageForm.endDate"
              type="datetime"
              placeholder="任务结束时间">
            </el-date-picker>
          </div>
        </el-form-item>        
        <el-button :disabled="submitTPDisable" class="taskinfo-item" type="primary" icon="el-icon-menu" @click.native.prevent="submitTaskpackage">提交</el-button>
        <!-- <el-button v-show="cancelSelectBtn" class="taskinfo-item" style="margin-left: 10px;" type="danger" @click="cancelSelection">取消框选</el-button> -->

        <guide class="guide-help" v-if="visits === 0"/>
        <!-- <el-tag v-if="visits === 0" type="warning" style="margin-left: 8%;">**按住Ctrl进行框选**</el-tag> -->
      </el-form>
    </div>
    <div id="map" class="map"/>
  </div>
</template>
<script>
import $ from 'jquery'
import 'ol/ol.css'
import Map from 'ol/Map.js'
import View from 'ol/View.js'
import { platformModifierKeyOnly } from 'ol/events/condition.js'
import EsriJSON from 'ol/format/EsriJSON.js'
import { DragBox, Select } from 'ol/interaction.js'
import { Tile as TileLayer, Vector as VectorLayer, Group } from 'ol/layer.js'
import { fromLonLat } from 'ol/proj.js'
import VectorSource from 'ol/source/Vector.js'
import { TileArcGISRest } from 'ol/source.js'
import 'ol-layerswitcher/src/ol-layerswitcher.css'
import LayerSwitcher from 'ol-layerswitcher/src/ol-layerswitcher'
import { getMapServices } from '@/api/taskpackagePartition'
import guide from '@/views/guide/index'

export default {
  name: 'TaskpackagePartition',
  props: ['regionalName'],
  components: { guide },
  data() {
    return {
      submitTPDisable: true,
      loading: false,
      taskpackageForm: {
        name: '',
        describe: '',
        owner: '',
        mapnums: '',
        mapnumcounts: '',
        regiontask_name: '',
        startDate: '',
        endDate: ''
      },
      taskpackageRules: {
        name: [{ required: true, message: '*必填*', trigger: 'blur' }],
        owner: [{ required: true, message: '*必填*', trigger: 'blur' }],
        describe: [{ required: true, message: '*必填*', trigger: 'blur' }]
      },
      operatorList: {},
      checked3: true,
      visits: this.$store.getters.visits,
      cancelSelectBtn: false
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.initMap()
    })
  },
  methods: {
    initMap() {
      getMapServices(this.regionalName).then(response => {
        const _this = this

        const dituMapServerUrl = response.data.results[0].basemapservice

        const mmanageMapServerUrl = response.data.results[0].mapindexmapservice

        const featureServerUrl = response.data.results[0].mapindexfeatureservice

        const scheduleServerUrl = response.data.results[0].mapindexschedulemapservice

        const layer = '0'

        const esrijsonFormat = new EsriJSON()

        const vectorSource = new VectorSource({})

        const layers = [
          new Group({
            title: '底图',
            layers: [
              new TileLayer({
                title: '中国地图',
                type: 'base',
                source: new TileArcGISRest({
                  url: dituMapServerUrl,
                  wrapX: false
                })
              })
            ]
          }),
          new Group({
            title: '要素地图',
            layers: [
              new TileLayer({
                title: '接图表',
                source: new TileArcGISRest({
                  url: mmanageMapServerUrl,
                  wrapX: false
                })
              }),
              new VectorLayer({
                source: vectorSource
              })
            ]
          }),
          new Group({
            title: '进度',
            layers: [
              new TileLayer({
                title: '进度',
                source: new TileArcGISRest({
                  url: scheduleServerUrl,
                  wrapX: false
                })
              })
            ]
          })
        ]

        const map = new Map({
          layers: layers,
          target: document.getElementById('map'),
          view: new View({
            // projection: "EPSG:3857",
            center: fromLonLat([107.615838, 32.097535]),
            zoom: 3.4
          })
        })

        const layerSwitcher = new LayerSwitcher({
          tipLabel: 'Légende' // Optional label for button
        })
        map.addControl(layerSwitcher)

        // a normal select interaction to handle click
        const select = new Select()
        map.addInteraction(select)

        const selectedFeatures = select.getFeatures()

        // a DragBox interaction used to select features by drawing boxes
        const dragBox = new DragBox({
          condition: platformModifierKeyOnly
        })

        map.addInteraction(dragBox)

        // 触发框选
        dragBox.on('boxend', function(e) {
          // features that intersect the box are added to the collection of
          // selected features
          var extent = dragBox.getGeometry().getExtent()
          var url = featureServerUrl + '/' + layer + '/query/?f=json&' +
            'returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=' +
            encodeURIComponent(
              '{"xmin":' +
              extent[0] +
              ',"ymin":' +
              extent[1] +
              ',"xmax":' +
              extent[2] +
              ',"ymax":' +
              extent[3] +
              ',"spatialReference":{"wkid":3857}}'
            ) + '&geometryType=esriGeometryEnvelope&inSR=3857&outFields=*' + '&outSR=3857'
          $.ajax({
            url: url,
            dataType: 'jsonp',
            success: function(response) {
              if (response.error) {
                alert(response.error.message + '\n' + response.error.details.join('\n'))
              } else {
                var features = esrijsonFormat.readFeatures(response)
                if (features.length > 0) {
                  vectorSource.clear()
                  vectorSource.addFeatures(features)
                  vectorSource.forEachFeatureIntersectingExtent(extent, function(feature) {
                    selectedFeatures.push(feature)
                  })

                  // 拉取作业员列表
                  _this.$store.dispatch('GetOperator').then(response => {
                    _this.operatorList = response.data
                  }).catch(() => { _this.loading = false })

                  _this.submitTPDisable = false

                  _this.cancelSelectBtn = true
                }
              }
            }
          })
        })

        // clear selection when drawing a new box and when clicking on the map
        dragBox.on('boxstart', function() {
          selectedFeatures.clear()
        })

        selectedFeatures.on(['add', 'remove'], function() {
          var names = selectedFeatures.getArray().map(function(feature) {
            return feature.get('new_jbmapn')
          })
          _this.taskpackageForm.mapnumcounts = names.length
          if (names.length > 0) {
            _this.taskpackageForm.mapnums = names.join(',')
          } else {
            _this.taskpackageForm.mapnums = ''
          }
        })
      }).catch(error => {
        // reject(error)
      })
    },
    submitTaskpackage() {
      this.$refs.taskpackageForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.taskpackageForm.regiontask_name = this.regionalName
          this.$store.dispatch('SubmitTaskpackage', this.taskpackageForm).then(response => {
            this.submitTPDisable = true
            this.loading = false
            this.$message({
              message: '已完成任务包划分！',
              type: 'success'
            })
          }).catch(error => {
            this.$message({
              message: error.response.data.name[0],
              type: 'error'
            })
            // reject(error)
          })
        } else {
          console.log('提交错误!!')
          return false
        }
      })
    },
    cancelSelection() {
      alert("取消选择")
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 0px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.map {
  height: 100%;
  width: 100%;
  margin-bottom: -8%;
}
.ol-dragbox {
  background-color: rgba(255, 255, 255, 0.4);
  border-color: rgba(100, 150, 0, 1);
}
</style>
