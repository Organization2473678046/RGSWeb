<template>
  <div class="dashboard-container">
    <div id="map" class="map">
      <div id="mapType-wrapper" class="expand">
        <div id="mapType">
          <div id="testM" class="mapTypeCard normal active">
            <div class="switch-box">
              <input id="visibleChinaMap" checked type="checkbox" class="switch" />
              <p class="mapCardFont">矢量数据</p>
            </div>
            <span>地图</span>
          </div>
          <div class="mapTypeCard earth">
            <div class="switch-box">
              <input id="visibleImageMap" type="checkbox" class="switch" checked>
              <p class="mapCardFont">影像数据</p>
            </div>
            <span>影像</span>
          </div>
          <div class="mapTypeCard panorama choosedType">
            <div class="switch-box">
              <input id="visibleTask" type="checkbox" class="switch" checked="true">
              <p class="mapCardFont">影像数据</p>
            </div>
            <span>任务区域</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import $ from "jquery";
import "ol/ol.css";
import Map from "ol/Map.js";
import View from "ol/View.js";
import { platformModifierKeyOnly } from "ol/events/condition.js";
import EsriJSON from "ol/format/EsriJSON.js";
import { DragBox, Select } from "ol/interaction.js";
import { Tile as TileLayer, Vector as VectorLayer, Group } from "ol/layer.js";
import { fromLonLat } from "ol/proj.js";
import VectorSource from "ol/source/Vector.js";
import { TileArcGISRest } from "ol/source.js";
import { getMapServices } from "@/api/taskpackagePartition";
import guide from "@/views/guide/index";

export default {
  name: "TaskpackagePartition",
  props: ["regionalName"],
  components: { guide },
  data() {
    return {
      loading: false,
      operatorList: {},
      checked3: true,
      visits: this.$store.getters.visits
    };
  },
  mounted() {
    this.$nextTick(function() {
      this.initMap();
    });
  },
  methods: {
    initMap() {
      getMapServices(this.regionalName)
        .then(response => {
          const _this = this;

          const dituMapServerUrl = response.data.results[0].basemapservice;

          const mmanageMapServerUrl =
            response.data.results[0].mapindexmapservice;

          const featureServerUrl =
            response.data.results[0].mapindexfeatureservice;

          const scheduleServerUrl =
            response.data.results[0].mapindexschedulemapservice;
debugger
          const layer = "0";

          const esrijsonFormat = new EsriJSON();

          const vectorSource = new VectorSource({});

          let chinaMapLayer = '', taskLayer = '', scheduleLayer= ''

          const layers = [
            chinaMapLayer = new Group({
              title: "底图",
              layers: [
                new TileLayer({
                  title: "中国地图",
                  type: "base",
                  source: new TileArcGISRest({
                    url: dituMapServerUrl,
                    wrapX: false
                  })
                })
              ]
            }),
            taskLayer = new Group({
              title: "要素地图",
              layers: [
                new TileLayer({
                  title: "接图表",
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
            scheduleLayer = new Group({
              title: "进度",
              layers: [
                new TileLayer({
                  title: "进度",
                  source: new TileArcGISRest({
                    url: scheduleServerUrl,
                    wrapX: false
                  })
                })
              ]
            })
          ];

          const map = new Map({
            layers: layers,
            target: document.getElementById("map"),
            view: new View({
              // projection: "EPSG:3857",
              center: fromLonLat([107.615838, 32.097535]),
              zoom: 3.4
            })
          });

          // a normal select interaction to handle click
          const select = new Select();
          map.addInteraction(select);

          const selectedFeatures = select.getFeatures();

          // a DragBox interaction used to select features by drawing boxes
          const dragBox = new DragBox({
            condition: platformModifierKeyOnly
          });

          map.addInteraction(dragBox);

          // 触发框选
          dragBox.on("boxend", function(e) {
            // features that intersect the box are added to the collection of
            // selected features
            var extent = dragBox.getGeometry().getExtent();
            var url =
              featureServerUrl +
              "/" +
              layer +
              "/query/?f=json&" +
              "returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=" +
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
              ) +
              "&geometryType=esriGeometryEnvelope&inSR=3857&outFields=*" +
              "&outSR=3857";
            $.ajax({
              url: url,
              dataType: "jsonp",
              success: function(response) {
                if (response.error) {
                  alert(
                    response.error.message +
                      "\n" +
                      response.error.details.join("\n")
                  );
                } else {
                  var features = esrijsonFormat.readFeatures(response);
                  if (features.length > 0) {
                    vectorSource.clear();
                    vectorSource.addFeatures(features);
                    vectorSource.forEachFeatureIntersectingExtent(
                      extent,
                      function(feature) {
                        selectedFeatures.push(feature);
                      }
                    );

                    // 拉取作业员列表
                    /*_this.$store.dispatch('GetOperator').then(response => {
                    _this.operatorList = response.data
                  }).catch(() => { _this.loading = false })

                  _this.submitTPDisable = false*/
                  }
                }
              }
            });
          });

          // clear selection when drawing a new box and when clicking on the map
          dragBox.on("boxstart", function() {
            selectedFeatures.clear();
          });

          selectedFeatures.on(["add", "remove"], function() {
            var names = selectedFeatures.getArray().map(function(feature) {
              return feature.get("new_jbmapn");
            });
            // _this.taskpackageForm.mapnumcounts = names.length
            if (names.length > 0) {
              // _this.taskpackageForm.mapnums = names.join(',')
            } else {
              // _this.taskpackageForm.mapnums = ''
            }
          });

          $("#visibleChinaMap").on('change', function() {
             chinaMapLayer.setVisible(this.checked);
          });
          $("#visibleImageMap").on('change', function() {
             taskLayer.setVisible(this.checked);
          });
          $("#visibleTask").on('change', function() {
             scheduleLayer.setVisible(this.checked);
          });

          $("#testM").click(function(){
            chinaMapLayer.setVisible(this.checked);
          });
        })
        .catch(error => {
          // reject(error)
        });
    },
    submitTaskpackage() {
      this.$refs.taskpackageForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.taskpackageForm.regiontask_name = this.regionalName;
          this.$store
            .dispatch("SubmitTaskpackage", this.taskpackageForm)
            .then(response => {
              this.submitTPDisable = true;
              this.loading = false;
              this.$message({
                message: "已完成任务包划分！",
                type: "success"
              });
            })
            .catch(error => {
              this.$message({
                message: error.response.data.name[0],
                type: "error"
              });
              // reject(error)
            });
        } else {
          console.log("提交错误!!");
          return false;
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    background-color: rgb(240, 242, 245);
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

#content {
  position: absolute;
  width: 350px;
  font-size: 14px;
  font-family: "微软雅黑", Arial, Helvetica, STHeiti, "宋体";
  background-color: #fff;
}

#mapType-wrapper {
  position: absolute;
  bottom: 0;
  right: 0;
}

#mapType {
  height: 80px;
  cursor: pointer;
  -webkit-transition-property: width, background-color;
  transition-property: width, background-color;
  -webkit-transition-duration: 0.4s;
  transition-duration: 0.4s;
  width: 110px;
  background-color: rgba(255, 255, 255, 0);
}

.expand #mapType {
  width: 298px;
  background-color: #fff;
  background-color: rgba(255, 255, 255, 0.8);
}

.expand #mapType .mapTypeCard {
  border: 1px solid rgba(255, 255, 255, 0);
  background-image: url(//webmap1.bdimg.com/wolfman/static/common/images/new/maptype_8a68f95.png);
}

.expand #mapType .mapTypeCard.active {
  border: 1px solid #3385ff;
}

.expand #mapType .normal {
  right: 202px;
}

.expand #mapType .satellite,
.expand #mapType .earth {
  right: 106px;
}

@media only screen and (-webkit-min-device-pixel-ratio: 2),
  (-webkit-min-device-pixel-ratio: 2),
  (min-resolution: 2dppx),
  (min-resolution: 192dpi) {
  .expand #mapType .mapTypeCard {
    background-image: url(//webmap1.bdimg.com/wolfman/static/common/images/new/maptype2x_54247ab.png);
  }
}

#mapType .mapTypeCard {
  height: 60px;
  width: 86px;
  position: absolute;
  border-radius: 2px;
  top: 10px;
  box-sizing: border-box;
  border: 1px solid transparent;
  border: 1px solid rgba(153, 153, 153, 0.42);
  background: url(//webmap1.bdimg.com/wolfman/static/common/images/new/shadow_6bf0ecd.png)
    no-repeat 0 0;
  background-size: 86px 240px;
  -webkit-transition-property: right, background-image;
  transition-property: right, background-image;
  -webkit-transition-duration: 0.4s;
  transition-duration: 0.4s;
}

#mapType .mapTypeCard span {
  position: absolute;
  bottom: 0;
  right: 0;
  display: inline-block;
  padding: 3px 5px 5px 4px;
  font-size: 12px;
  height: 16px;
  line-height: 12px;
  color: #fff;
  border-top-left-radius: 2px;
}

#mapType .mapTypeCard.active span,
#mapType .mapTypeCard:hover span {
  background-color: #3385ff;
}

#mapType .mapTypeCard:hover {
  border: 1px solid #3385ff;
}

#mapType .normal {
  z-index: 1;
  background-position: 0 0;
  right: 20px;
}

#mapType .normal .switch-box p {
  margin-left: 20px;
}

#mapType .normal .switch-box input.switch {
  left: 5px;
}

#mapType .normal:hover .switch-box {
  visibility: visible;
}

#mapType .satellite,
#mapType .earth {
  right: 15px;
  z-index: 2;
  background-position: 0 -60px;
}

#mapType .satellite:hover .switch-box,
#mapType .earth:hover .switch-box {
  visibility: visible;
}

#mapType .earth {
  background-position: 0 -181px;
}

#mapType .panorama {
  z-index: 3;
  right: 10px;
  background-image: url(//webmap1.bdimg.com/wolfman/static/common/images/new/maptype_8a68f95.png);
  background-position: 0 -121px;
  border-left: 1px solid rgba(153, 153, 153, 0.6);
}

@media only screen and (-webkit-min-device-pixel-ratio: 2),
  (-webkit-min-device-pixel-ratio: 2),
  (min-resolution: 2dppx),
  (min-resolution: 192dpi) {
  #mapType .panorama {
    background-image: url(//webmap1.bdimg.com/wolfman/static/common/images/new/maptype2x_54247ab.png);
  }
}

#mapType .switch-box {
  visibility: hidden;
  position: absolute;
  width: 100%;
  height: 20px;
  line-height: 22px;
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
}

#mapType .switch-box p {
  display: inline-block;
  margin-left: 25px;
}

#mapType .switch-box input.switch {
  position: absolute;
  left: 8px;
  top: 4px;
  cursor: pointer;
}
.mapCardFont {
  font-size: 12px;
  margin-top: -30px;
}
</style>
