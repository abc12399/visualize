<template>
      <div id="container" @click="clickdiv"></div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader'
export default {
    data(){
        return{
            points_test:[],
            points_t:[],
            path:[],
            map:null,
            driving:null,
        }
    },
    mounted(){
        this.updatePoints();
        this.initMap();
    },
    methods:{
        initMap(){

        },
        updatePoints(){

        },
        clickdiv(){
            console.log("clickdiv");
        }
    }
}
</script>

<style>
#container {
    width: 100%;
    height: 100%;
}
</style>