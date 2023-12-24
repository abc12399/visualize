<template>
  <div id="container"></div>
  <!-- <div id="panel"></div> -->
</template>

<script>
//添加秘钥
window._AMapSecurityConfig = {
  securityJsCode: "fb8c4c604948be159451a77848affd73",
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
      points_amap:[]
    };
  },
  mounted() {
    this.updatePoints().then (() => {
      this.initMap();
    });
  },
  methods: {
    sleep(time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    },
     async updatePoints() {
      try {
        // Fetch JSON data from 1.json
        for(var i = 1; i <= 10; i++){
          console.log("/datAmp"+i+".json");
          const response = await fetch("/datAmp"+i+".json");

          const jsonData = await response.json();
          
          // Update points array with latitude and longitude from JSON data

          var points_t = await jsonData.map((entry) => {
              return {"pos":[entry.longitude, entry.latitude],"distance":entry.speed,"time":entry.time}
          });
          
          this.points_test.push(points_t)
        }

        console.log(this.points_test);
        
      } catch (error) {
        console.error("Error fetching or parsing JSON data:", error);
      }},
    initMap() {
        //read json
      let _this = this;
      AMapLoader.load({
        key: "0d7d4de087458a89e3dc26d9529eb152", //设置您的key
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
          var driving = new AMap.Driving({
            map: _this.map,
            hideMarkers: true,
          });
          // 根据起终点经纬度规划驾车导航路线
          
         
          
            for (var i = 0; i < _this.points_test.length; i++){
                var start = 0;
                var end = 15;
                var watpoinslist = [];
                
                var route=_this.points_test[i];

                var list=[];
                while(end<route.length){
                    var ans={};
                    ans["start"] = route[start].pos;
                    ans["end"] = route[end].pos;
                    ans["start_time"]=route[start].time;
                    ans["end_time"]=route[end].time;
                    for(var j = start+1; j < end; j++){
                        watpoinslist.push(route[j].pos);
                    }
                    await driving.search(route[start].pos,route[end].pos, {
                        waypoints: watpoinslist
                    }, function (status, result) {
                    // 未出错时，result即是对应的路线规划方案
                      console.log(status)
                      if(status == "complete"){
                        console.log(result);
         
                        ans["info"]=_this.parseRouteToPath(result.routes[0]);
                        
                        list.push(ans);
                      }
                      else{
                        console.log('获取驾车数据失败：' + result)
                      }
                    // console.log(result);
                    // _this.drawRoute(result.routes[0]);
                    });
                    start = end;
                    end = end + 15;
                    watpoinslist = [];
                    await _this.sleep(40);
                    
                }
                _this.points_amap.push(list);

            }
            console.log("==============================")
            console.log(_this.points_amap);

            const  blob = new Blob([JSON.stringify(_this.points_amap)], {type : 'application/json'});
            const  link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'data.json';
            link.click();



           
           
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
      var allinfo={}
      var list  = [];
      var path = [];
      for (var i = 0, l = route.steps.length; i < l; i++) {
        var step = route.steps[i];
        var dict ={}
        dict["distance"] = step.distance;
        dict["time"] = step.time;
        dict["path"] = step.path;
        dict["start_location"] = step.start_location;
        dict["end_location"] = step.end_location;
        list.push(dict);
        for (var j = 0, n = step.path.length; j < n; j++) {
          path.push(step.path[j]);
        }
      }
      allinfo["list"] = list;
      allinfo["path"] = path;
  
    return allinfo;
    },
  },
};
</script>

<style>
#container {
  padding: 0px;
  margin: 0px;
  width: 70%;
  height: 800px;
}
</style>
