<template>
  <div id="container"></div>
  <!-- <div id="panel"></div> -->
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
      points_test: [],
      points_t:[],
      path: [],
    };
  },
  mounted() {
    this.updatePoints();
    this.initMap();
  },
  methods: {
     async updatePoints() {
      try {
        // Fetch JSON data from 1.json
       
        var i = 1;
        console.log("/dataorigin"+i+".json");
        const response = await fetch("/dataorigin"+i+".json");

        const jsonData = await response.json();
        
        // Update points array with latitude and longitude from JSON data
        var points_t = await jsonData.map((entry) => [entry.latitude, entry.longitude]);
     
        this.points_test.push(points_t)
      
        
      } catch (error) {
        console.error("Error fetching or parsing JSON data:", error);
      }},
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
        .then((AMap) => {
          _this.map = new AMap.Map("container", {
            zoom: 12,
            zooms: [2, 22],
            center: [116.391935, 39.895534],
          });
          var driving = new AMap.Driving({
            map: _this.map,
            hideMarkers: true,
          });
          // 根据起终点经纬度规划驾车导航路线
          
            var start = 0;
            var end = 15;
            var watpoinslist = [];
            let i = 0;
            while(end<_this.points_test[i].length){
                for(var j = start+1; j < end; j++){
                    watpoinslist.push(new AMap.LngLat(_this.points_test[i][j][1],_this.points_test[i][j][0]));
                }
                driving.search(new AMap.LngLat(_this.points_test[i][start][1],_this.points_test[i][start][0]),new AMap.LngLat(_this.points_test[i][end][1],_this.points_test[i][end][0]), {
                    waypoints: watpoinslist
                }, function (status, result) {
                // 未出错时，result即是对应的路线规划方案
                console.log(result);
                _this.drawRoute(result.routes[0]);
                });
                start = end;
                end = end + 15;
                watpoinslist = [];
            }
            console.log(this.path)
           
           
        })
    },
    drawRoute(route) {
      var path = this.parseRouteToPath(route);

      var routeLine = new AMap.Polyline({
        path: path,
        isOutline: true,
        outlineColor: "#ffeeee",
        borderWeight: 2,
        strokeWeight: 5,
        strokeColor: "#0091ff",
        lineJoin: "round",
      });

      routeLine.setMap(this.map);

      // 调整视野达到最佳显示区域
      this.map.setFitView([ routeLine]);
    },
    parseRouteToPath(route) {
      var path = [];
      var newRoute=[];
      for (var i = 0, l = route.steps.length; i < l; i++) {
        var step = route.steps[i];
        for (var j = 0, n = step.path.length; j < n; j++) {
          this.path.push(step.path[j]);
    
        }
      }
    
    console.log(path);
    return path;
    },
  },
};
</script>

<style>
#container {
  padding: 0px;
  margin: 0px;
  width: 100%;
  height: 800px;
}
</style>
