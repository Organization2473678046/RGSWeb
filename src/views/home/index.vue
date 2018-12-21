<template>
  <div class="dashboard-container">
    <div id="map" class="map" />
  </div>
</template>

<script>
import 'ol/ol.css'
import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import { fromLonLat } from 'ol/proj.js'
import { TileArcGISRest } from 'ol/source.js'

export default {
  name: 'Home',
  mounted() {
    this.$nextTick(function() {
      initMap()
    })
  }
}

function initMap() {
  var dituMapServerUrl = 'http://192.168.3.180:6080/arcgis/rest/services/ditu/MapServer'

  new Map({
    target: 'map',
    layers: [
      new TileLayer({
        source: new TileArcGISRest({
          url: dituMapServerUrl
        })
      })
    ],
    view: new View({
      center: fromLonLat([107.615838, 32.097535]),
      zoom: 3.4
    })
  })
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
}
</style>
