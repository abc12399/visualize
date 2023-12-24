<template>
  <div id="container"></div>
  <div id="panel">
    <el-card class="aggregated-info">
      二环内车流量：{{ sum[0] }} <br>
      三环内车流量：{{ sum[1] }} <br>
      四环内车流量：{{ sum[2] }} <br>
    </el-card>
  </div>
 
</template>

<script>
//添加秘钥
window._AMapSecurityConfig = {
  securityJsCode: "09d8f7a8b726c82961b2a70cb053249d",
};
import AMapLoader from "@amap/amap-jsapi-loader";
export default {
  data() {
    return {
      map: null,
      driving: null,
      points:[
            [116.317105, 39.960864],
            [116.384053, 39.958496],
            [116.446881, 39.962574],
            [116.304402, 39.911637],
            [116.389546, 39.912295],
            [116.466622, 39.914534],
            [116.323341, 39.85113],
            [116.409172, 39.850603],
            [116.476635, 39.846649],
            [116.395025,40.010545],
            [116.204481,39.914233],
            [116.585569,39.91318],
            [116.405324,39.808557],
            [116.502141,39.999762],
            [116.270055,40.0066],
            [116.241559,39.822797]],
      points_test: [],
      points_t: [],
      path: [],
      points_amap: [],
      sum: [0, 0, 0],
      sum_cir: [],
      circles: [],
      text_cir: [],

      playIsShow: true, //播放/暂停
      multipleNumber: 1, //倍速
      progress: 0, //进度
      marker: null,
      polyline1: null,
      duration: 0,
      timer: null, //定时器
      time: 800, //定时器速度,
      min: 0,
    };
  },
  mounted() {
    this.updatePoints().then(() => {
      this.initMap();
    });
  },
  methods: {
    async updatePoints() {
      try {
        // Fetch JSON data from 1.json
        for (var i = 1; i <= 10; i++) {
          // console.log("/datAmp" + i + ".json");
          const response = await fetch("/datAmp" + i + ".json");
          const jsonData = await response.json();
          // Update points array with latitude and longitude from JSON data

          var points_t = await jsonData.map((entry) => {
            return { "pos": [entry.longitude, entry.latitude], "distance": entry.speed, "time": entry.time }
          });

          this.points_test.push(points_t)
        }

        // console.log(this.points_test);

      } catch (error) {
        console.error("Error fetching or parsing JSON data: /dataAmp" + i + '.json', error);
      }
    },
    initMap() {
      //read json
      let _this = this;
      AMapLoader.load({
        key: "e72a9fc1373fbf6154f303bc4d4fe2e0", //设置您的key
        version: "2.0",
        plugins: ["AMap.ToolBar", "AMap.Driving"],

        Loca: {
          version: "2.0",
        },
      })
        .then(async (AMap) => {
          _this.map = new AMap.Map("container", {
            zoom: 12,
            zooms: [2, 22],
            center: [116.391935, 39.895534],
          });
          let centers = [
            [116.317105, 39.960864],
            [116.384053, 39.958496],
            [116.446881, 39.962574],
            [116.304402, 39.911637],
            [116.389546, 39.912295],
            [116.466622, 39.914534],
            [116.323341, 39.85113],
            [116.409172, 39.850603],
            [116.476635, 39.846649],
            [116.395025,40.010545],
            [116.204481,39.914233],
            [116.585569,39.91318],
            [116.405324,39.808557],
            [116.502141,39.999762],
            [116.270055,40.0066],
            [116.241559,39.822797],
            [116.510725,39.822533],
            [116.542482,39.940167],
            [116.548732,39.867834]
          ]
          for (let center of centers) {
            var circle = new AMap.CircleMarker({
              center: center, //圆心
              radius: 30, //半径
              strokeColor: "white", //轮廓线颜色
              strokeWeight: 2, //轮廓线宽度
              strokeOpacity: 0.5, //轮廓线透明度
              fillColor: "rgba(255,0,0,1)", //多边形填充颜色
              fillOpacity: 1, //多边形填充透明度
              zIndex: 10, //多边形覆盖物的叠加顺序
              cursor: "pointer", //鼠标悬停时的鼠标样式
            });
            _this.map.add(circle)
            _this.map.setFitView([circle])
            _this.sum_cir.push(0)
            _this.circles.push(circle)

            var text = new AMap.Text({
              text: '纯文本标记',
              anchor: 'center', // 设置文本标记锚点
              draggable: true,
              cursor: 'pointer',
              angle: 0,
              style: {
                'padding': '.75rem 1.25rem',
                'margin-bottom': '1rem',
                'border-radius': '.25rem',
                'background-color': 'transparent',
                'width': '15rem',
                'border-width': 0,
                // 'box-shadow': '0 2px 6px 0 rgba(114, 124, 245, .5)',
                'text-align': 'center',
                'font-size': '20px',
                'color': 'white'
              },
              position: center
            });
            text.setMap(_this.map);
            _this.text_cir.push(text);
          }
          var path = [[
            [116.3487, 39.868693],
            [116.349301, 39.897606],
            [116.356683, 39.898265],
            [116.355932, 39.943372],
            [116.372003, 39.948653],
            [116.433759, 39.949557],
            [116.436441, 39.900355],
            [116.443865, 39.898363],
            [116.446268, 39.878787],
            [116.443565, 39.870801],
            [116.418159, 39.871048],
            [116.415005, 39.872069],
          ],
          [
            [116.308514, 39.962736],
            [116.32126, 39.966979],
            [116.435758, 39.969446],
            [116.461765, 39.952999],
            [116.460993, 39.868762],
            [116.44932, 39.859012],
            [116.422197, 39.857431],
            [116.374261, 39.856936],
            [116.346323, 39.849754],
            [116.329371, 39.848898],
            [116.324179, 39.85071],
            [116.313021, 39.863492],
          ], [
            [116.287806, 39.833737],
            [116.285917, 39.84158],
            [116.284201, 39.844282],
            [116.283342, 39.865959],
            [116.275017, 39.887432],
            [116.275103, 39.919893],
            [116.274073, 39.943323],
            [116.275961, 39.955825],
            [116.273815, 39.969574],
            [116.299736, 39.985097],
            [116.438953, 39.989042],
            [116.489937, 39.957338],
            [116.489851, 39.87808],
            [116.484615, 39.848367],
            [116.465132, 39.833078],
            [116.290724, 39.829914],
            [116.525487,39.967142],
          ],
          ];
          
          // var polygon = new AMap.Polygon({
          //   map: _this.map,
          //   fillOpacity: 0.4,
          //   path: path[i]
          // });
          for (let points of _this.points_test) {
            for (let point of points) {
              for (var i = 0; i < 3; ++i) {
                let isin = AMap.GeometryUtil.isPointInRing(point.pos, path[i])
                this.sum[i] += isin
              }

              let mx = 100, mx_id = 0;
              for (let i in centers) {
                let distance = Math.pow(centers[i][0] - point.pos[0], 2) + Math.pow(centers[i][1] - point.pos[1], 2);
                if (distance < mx) {
                  mx = distance;
                  mx_id = i;
                }
              }
              _this.sum_cir[mx_id]++;
            }
          }
          for (let i in _this.text_cir) {
            _this.text_cir[i].setText(String(_this.sum_cir[i]))
            let col = 100*_this.sum_cir[i]/255
            console.log(col)
            _this.circles[i].setOptions(
              {
                fillColor: "rgb("+255+","+0+","+col+")"
              }
            )
          }

        })


    },

  },
};
</script>

<style>
#container {
  padding: 0px;
  margin: 0px;
  width: 70%;
  height: 900px;
  float: left;
}
#rightbox {
  width: 200px;
  height: 100px;
  background-color: white;
  border-radius: 10px;
  padding: 10px;
  z-index: 100;
  float: left;
}
#panel {
  position: absolute;
  top: 60px;
  left: 10px;
  width: 200px;
  height: 100px;
  background-color: white;
  border-radius: 10px;
  padding: 10px;
  z-index: 100;
}
</style>
