<template>
  <div class="dashboard-container">
    <div class="taskinfo-container">
      <el-form ref="taskpackageForm" :inline="true" :inline-message="true" :model="taskpackageForm" :rules="taskpackageRules" style="margin-bottom: -20px;">
        <el-form-item prop="name">
          <el-input v-model="taskpackageForm.name" :disabled="submitTPDisable" placeholder="请输入任务包名称" style="width: 200px;" class="taskinfo-item"/>
        </el-form-item>
        <el-form-item prop="describe">
          <el-input v-model="taskpackageForm.describe" :disabled="submitTPDisable" placeholder="描述" style="width: 350px;" class="taskinfo-item"/>
        </el-form-item>
        <el-form-item prop="mapnumcounts">
          <el-input v-model="taskpackageForm.mapnumcounts" :disabled="TPNumDisable = true" placeholder="已划分图幅数" style="width: 118px;" class="taskinfo-item"/>
        </el-form-item>
        <el-form-item prop="owner">
          <el-select v-model="taskpackageForm.owner" :disabled="submitTPDisable" placeholder="请选择作业员" prop="owner" class="taskinfo-item" style="width: 140px">
<<<<<<< HEAD
            <el-option v-for="operator in operatorList" :key="operator.id" :label="operator.username" :value="operator.id"/>
          </el-select>
        </el-form-item>
        <el-button :disabled="submitTPDisable" class="taskinfo-item" style="margin-left: 10px;" type="primary" icon="el-icon-menu" @click.native.prevent="submitTaskpackage">提交</el-button>
      </el-form>
    </div>
    <div id="map" class="map"/>

    <!-- 切换地图图层tree -->
    <!--<div id="layertree">
      <ul>
        <li><span>ChinaMap</span>
          <fieldset id="layer0">
            <label class="checkbox" for="visible0">
              <input id="visible0" class="visible" type="checkbox"/>visibility
            </label>
          </fieldset>
        </li>
      </ul>
    </div>-->
=======
            <el-option v-for="operator in operatorList" :key="operator.id" :label="operator.reallyname" :value="operator.username"/>
          </el-select>
        </el-form-item>
        <el-button :disabled="submitTPDisable" class="taskinfo-item" style="margin-left: 10px;" type="primary" icon="el-icon-menu" @click.native.prevent="submitTaskpackage">提交</el-button>
        <el-tag type="warning" style="margin-left: 8%;">**按住Ctrl进行框选**</el-tag>
      </el-form>
    </div>
    <div id="map" class="map"/>
>>>>>>> dev-v7
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
<<<<<<< HEAD
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js'
import { fromLonLat } from 'ol/proj.js'
import VectorSource from 'ol/source/Vector.js'
import { TileArcGISRest } from 'ol/source.js'

export default {
  name: 'TaskpackagePartition',
=======
import { Tile as TileLayer, Vector as VectorLayer, Group } from 'ol/layer.js'
import { fromLonLat } from 'ol/proj.js'
import VectorSource from 'ol/source/Vector.js'
import { TileArcGISRest } from 'ol/source.js'
import 'ol-layerswitcher/src/ol-layerswitcher.css'
import LayerSwitcher from 'ol-layerswitcher/src/ol-layerswitcher'
import { getMapServices } from '@/api/taskpackagePartition'

export default {
  name: 'TaskpackagePartition',
  props: ['regionalName'],
>>>>>>> dev-v7
  data() {
    return {
      submitTPDisable: true,
      loading: false,
      taskpackageForm: {
        name: '',
        describe: '',
        owner: '',
        mapnums: '',
<<<<<<< HEAD
        mapnumcounts: ''
=======
        mapnumcounts: '',
        regiontask_name: ''
>>>>>>> dev-v7
      },
      taskpackageRules: {
        name: [{ required: true, message: '*必填*', trigger: 'blur' }],
        owner: [{ required: true, message: '*必填*', trigger: 'blur' }],
        describe: [{ required: true, message: '*必填*', trigger: 'blur' }]
      },
<<<<<<< HEAD
      operatorList: {}
=======
      operatorList: {},
      checked3: true
>>>>>>> dev-v7
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.initMap()
    })
  },
  methods: {
    initMap() {
<<<<<<< HEAD
      const _this = this

      var dituMapServerUrl = 'http://192.168.3.180:6080/arcgis/rest/services/ditu/MapServer'

      var mmanageMapServerUrl = 'http://192.168.3.120:6080/arcgis/rest/services/mmanage/MapServer'

      var featureServerUrl = 'http://192.168.3.120:6080/arcgis/rest/services/mmanage/FeatureServer/'

      var layer = '0'

      var esrijsonFormat = new EsriJSON()

      var vectorSource = new VectorSource({})

      var layers = [
        new TileLayer({
          source: new TileArcGISRest({
            url: dituMapServerUrl
          })
        }),
        new TileLayer({
          source: new TileArcGISRest({
            url: mmanageMapServerUrl
          })
        }),
        new VectorLayer({
          source: vectorSource
        })
      ]

      var map = new Map({
        layers: layers,
        target: document.getElementById('map'),
        view: new View({
          // projection: "EPSG:3857",
          center: fromLonLat([107.615838, 32.097535]),
          zoom: 3.4
        })
      })

      // a normal select interaction to handle click
      var select = new Select()
      map.addInteraction(select)

      var selectedFeatures = select.getFeatures()

      // a DragBox interaction used to select features by drawing boxes
      var dragBox = new DragBox({
        condition: platformModifierKeyOnly
      })

      map.addInteraction(dragBox)

      // 触发框选
      dragBox.on('boxend', function(e) {
        // features that intersect the box are added to the collection of
        // selected features
        var extent = dragBox.getGeometry().getExtent()
        var url = featureServerUrl + layer + '/query/?f=json&' +
          'returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=' +
          encodeURIComponent(
            '{"xmin":' +
=======
      getMapServices(this.regionalName).then(response => {
        const _this = this

        const dituMapServerUrl = response.data[0].basemapservice

        const mmanageMapServerUrl = response.data[0].mapindexmapservice

        const featureServerUrl = response.data[0].mapindexfeatureservice

        const scheduleServerUrl = response.data[0].mapindexschedulemapservice

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
          var url = featureServerUrl + '/' +layer + '/query/?f=json&' +
            'returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=' +
            encodeURIComponent(
              '{"xmin":' +
>>>>>>> dev-v7
              extent[0] +
              ',"ymin":' +
              extent[1] +
              ',"xmax":' +
              extent[2] +
              ',"ymax":' +
              extent[3] +
              ',"spatialReference":{"wkid":3857}}'
<<<<<<< HEAD
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

      // 切换图层显隐
      map.getLayers().forEach(function(layer, i) {
        _this.bindInputs('#layer' + i, layer)
      })

      $('#layertree li > span').click(function() {
        $(this).siblings('fieldset').toggle()
      }).siblings('fieldset').hide()
=======
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
        reject(error)
      })
>>>>>>> dev-v7
    },
    submitTaskpackage() {
      this.$refs.taskpackageForm.validate(valid => {
        if (valid) {
          this.loading = true
<<<<<<< HEAD
=======
          this.taskpackageForm.regiontask_name = this.regionalName
>>>>>>> dev-v7
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
<<<<<<< HEAD
    },
    bindInputs(layerid, layer) {
      var visibilityInput = $(layerid + ' input.visible')
      visibilityInput.on('change', function() {
        layer.setVisible(this.checked)
      })
      visibilityInput.prop('checked', layer.getVisible())
=======
>>>>>>> dev-v7
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
<<<<<<< HEAD
=======
  margin-bottom: -8%;
>>>>>>> dev-v7
}
.ol-dragbox {
  background-color: rgba(255, 255, 255, 0.4);
  border-color: rgba(100, 150, 0, 1);
}
</style>
