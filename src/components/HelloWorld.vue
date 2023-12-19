<template>
  <div>
    <div class="leftRightBox">
      <!-- 左 -->
      <div class="oilMap" id="map"></div>
      <!-- 右 -->
      <div class="rightTxtBox">
        <el-card class="box-card">
          <!-- 播放轨迹 -->
          <div class="trackBox">
            <div>
              <i
                title="播放"
                v-if="playIsShow"
                @click="playPauseOn"
                class="el-icon-video-play"
              ></i>
              <i
                title="暂停"
                v-else
                @click="playPauseOn"
                class="el-icon-video-pause"
              ></i>
            </div>
            <div>
              <el-slider
                :min="0"
                :max="points.length - 1"
                @change="sliderOn"
                v-model="progress"
              ></el-slider>
              <!-- replace the code before using elementui  with elementplus -->
            </div>
          </div>
          <div class="multipleBox">
            <span>倍速：</span>
            <el-select
              @change="multipleOn"
              style="width: 70px"
              size="small"
              v-model="multipleNumber"
              placeholder="请选择倍速"
            >
              <el-option
                v-for="item in multipleOptions"
                :key="item.multipleNumber"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import LMap from "../utils/index.js";
import areaGeo from "../utils/beijing.json";
import abnormal from "../assets/temp.jpg"; //地图图标
export default {
  data() {
    return {
      multipleOptions: [
        {
          value: 800,
          label: "1",
        },
        {
          value: 550,
          label: "1.5",
        },
        {
          value: 400,
          label: "2",
        },
      ],
      map: null,
      lmap: new LMap(), //地图公共方法封装
      labelGroup: null, //文本图层
      tipsLayerGroup: null, //tips
      bondarylayer: null, //geojson 图层
      points: [
        //模拟点位数据
        [39.898457, 116.391844],
        [39.898595, 116.377947],
        [39.898341, 116.368001],
        [39.898063, 116.357144],
        [39.899095, 116.351934],
        [39.905871, 116.35067],
        [39.922329, 116.3498],
        [39.931017, 116.349671],
        [39.939104, 116.349225],
        [39.942233, 116.34991],
        [39.947263, 116.366892],
        [39.947568, 116.387537],
        [39.947764, 116.401988],
        [39.947929, 116.410824],
        [39.947558, 116.42674],
        [39.9397, 116.427338],
        [39.932404, 116.427919],
        [39.923109, 116.428377],
        [39.907094, 116.429583],
        [39.906858, 116.41404],
        [39.906622, 116.405321],
        [39.906324, 116.394954],
        [39.906308, 116.391264],
      ],
      points_test: [
        
      ],

      playIsShow: true, //播放/暂停
      multipleNumber: 1, //倍速
      progress: 0, //进度
      marker: null,
      polyline: null,
      duration: 0,
      timer: null, //定时器
      time: 800, //定时器速度,
      min: 0,
    };
  },
  mounted() {
    this.duration = this.points.length - 1;
    this.updatePoints().then(() => {
      this.initMap();
    
    });
    
    //read data from 1.josn  and update on points_test
    
  },
  watch: {
    progress() {
      this.updatePosition();
    },
  },
  destroyed() {
    clearTimeout(this.timer);
  },
  methods: {
    updatePosition() {
      const position = this.points[this.progress];
      this.marker.setLatLng(position);
      this.map.setView(position, 12); //放大比例
    },
    // 滑动进度
    sliderOn(e) {
      console.log(e, "滑动进度");
    },
    // 选择倍速
    multipleOn(e) {
      clearTimeout(this.timer);
      this.time = e;
      this.recursion();
    },
    // 点击播放暂停按钮
    playPauseOn() {
      if (this.progress == this.points.length - 1) {
        this.progress = 0;
      }
      this.playIsShow = !this.playIsShow;
      this.recursion();
    },
    // 递归
    recursion() {
      if (!this.playIsShow) {
        // 模拟数据变化
        this.timer = setTimeout(() => {
          this.progress++;
          if (this.progress >= this.points.length - 1) {
            this.playIsShow = true;
            this.polyline = L.polyline(this.points, { color: "red" }).addTo(
              this.map
            );
            clearTimeout(this.timer);
          }
          this.recursion();
        }, this.time);
      }
    },
    async updatePoints() {
      try {
        // Fetch JSON data from 1.json
        for(var i = 1; i <= 4; i++){

          console.log("/data"+i+".json");
          const response = await fetch("/data"+i+".json");

          const jsonData = await response.json();
          
          console.log(jsonData);
          // Update points array with latitude and longitude from JSON data
          var points_t = await jsonData.map((entry) => [entry.latitude, entry.longitude]);
          this.points_test.push(points_t)
          console.log(this.points_test);
        }
   
      } catch (error) {
        console.error("Error fetching or parsing JSON data:", error);
      }
    },
    //初始化地图
    async initMap() {
      let { lmap } = this;
      //配置地图项
      const mapConfig = {
        tileUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", //瓦片图层地址
        crs: L.CRS.EPSG4326,
        minZoom: 8, //允许缩放最小级别
        maxZoom: 20, //允许缩放最大级别
        zoom: 10, //初始化级别
        center: [39.91, 116.91], //初始化中心点
      };
      this.map = await lmap.initMap("map", mapConfig);
      if (this.map) {
        this.labelGroup = new L.layerGroup(); //文本图层
        this.labelGroup.addTo(this.map);
        this.tipsLayerGroup = new L.layerGroup();
        this.tipsLayerGroup.addTo(this.map);
        this.getGeojsonByName(areaGeo, true);
      } else {
        console.error("--地图加载失败!!!--");
      }
      var icon = L.icon({
        iconUrl: abnormal,
        iconSize: [16, 13],
        iconAnchor: [8, 7],
      });
      this.marker = L.marker(this.points[0], { icon: icon }).addTo(this.map);

      console.log(this.points);
      this.polyline = L.polyline(this.points, { color: "red" }).addTo(this.map);

      console.log(this.points_test);

      for(var i =0;i<this.points_test.length;i++){
        this.polyline1 = L.polyline(this.points_test[i], { color: "blue",weight: 2 }).addTo(this.map);
      }
      // this.polyline1 = L.polyline(this.points_test, { color: "blue",weight: 2 }).addTo(this.map);

      setInterval(() => {
        this.marker.setLatLng(this.points[this.progress]);
        this.polyline.setLatLngs(this.points.slice(0, this.progress + 1));
      }, 100);
    },
    //加载geojson数据 falg 是否显示名称
    getGeojsonByName(data, flag) {
      let _this = this;
      this.bondarylayer = L.geoJSON(data, {
        style: {
          color: "#4e98f444",
          fillOpacity: 1,
          weight: 1,
        },
        pane: "overlayPane",
        onEachFeature: (feature, layer) => {
          // console.log(layer)
          if (flag) {
            _this.addText(feature, layer);
          }
        },
      });
      this.bondarylayer.setZIndex(1);
      this.map.addLayer(this.bondarylayer);
    },
    //添加市所有区县
    addText(feature, layer) {
      let name = feature.properties.name;
      // let center = feature.properties.center;
      let location = layer._bounds.getCenter(); //[center[1], center[0]]; //
      //显示文字
      var content = `${name}`;
      // 区县名称文字
      var text = L.divIcon({
        html: "<div class='labelStyle'>" + content + "</div>",
        iconSize: [60, 20],
        iconAnchor: [0, 10],
        className: "labelStyle",
      });
      let marker = new L.marker(location, { icon: text });
      //中心点位
      this.labelGroup.addLayer(marker);
    },
  },
};
</script>
<style scoped>
.leftRightBox {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
/* 地图
让olimap 和 rightTxtBox 两个div并排显示
*/
.olimap,
.rightTxtBox {
  flex: 1; /* 平均分配剩余空间 */
  height: 100%; /* 充满高度 */
}
.oilMap {
  /*浮动*/
  float: left;
  height: 1000px;
  width: 1200px;
}
.rightTxtBox {
  float: left;
  width: 300px;
  height: 1000px;
  background: #fff;
  border-radius: 5px;
  margin-left: 10px;
  padding: 10px;
}
</style>
