<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
  >
    
      <h1 id="title">北京市出租车轨迹信息可视化</h1> 

    <div class="flex-grow" >
     </div>
    <el-menu-item index="1">
        <span>Home</span>
    </el-menu-item>
    <el-menu-item  index="2">
      <template #title>点聚合</template>
    </el-menu-item >
    <el-menu-item  index="3">
      <template #title>轨迹可视化</template>
    </el-menu-item >
  </el-menu>
  <div>
    <!-- <div id="middle" v-if="activeIndex==='2'">
        <HelloWorld></HelloWorld>
    </div>
    <div id="middle" v-else-if="activeIndex==='1'">
        <mode1></mode1>
    </div>
   -->
   <router-view></router-view>
  
  </div>
</template>

<script>
import HelloWorld from './HelloWorld.vue'
import RoutePlan from './RoutePlan.vue'
import mode1 from './mode1.vue';
import { useRouter } from "vue-router";
export default{
    data(){
        return{
            activeIndex: '1',
        }
    },
    mounted(){

    },
    components:{
        HelloWorld,
        RoutePlan,
        mode1
    },
    methods:{
        handleSelect(key, keyPath) {
            console.log(key, keyPath)
            console.log(this.activeIndex)
            //const route = useRouter();
            console.log(key)
            if(key=='1'){
                this.$router.push({path:'/'})
            }
            else if(key=='2'){
                this.$router.push({path:'/vispoint'})
            }
            else if(key=='3'){
                this.$router.push({path:'/visline'})
            }
        }
    },
}

</script>
<style scoped>

#title{
    font-size: 40px;
    color: #5047e9;
    margin-left: 350px;
    margin-top: 5px;
}
#middle{
    height: 600px;
    width: 100%;
}
.flex-grow {
  flex-grow: 0.7;
}
</style>
