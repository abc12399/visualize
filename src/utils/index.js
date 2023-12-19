// 地图公共方法封装 /utils/index
import * as L from 'leaflet'
import { ElMessage, ElNotification } from 'element-plus'
export default class LMap {
    // 初始化地图
    /***
     * 【options】参数合集
     * [tileUrl]瓦片地图地址
     * [minZoom]最小级别
     * [maxZoom]最大级别
     * [zoom]初始化级别
     * [crs]坐标系
     * [center]初始化视图中心点
     * [fullscreenControl]是否显示全屏控件
     * [zoomControl]是否显示缩放控件
     * [inertia]是否开启惯性，在拖动和在某一时间段内持续朝同一方向移动建有动力的地图时，会有惯性的效果
     * [attributionControl]属性控制是否默认加载在地图上
     * [renderer]// 渲染方式 （默认使用canvas提高性能）
     * [bounds]// 地图限制拖动区域 [下，上，右，左]
     *
     *
     * ***/
    async initMap(divId, options) {
        // let url = process.env.VUE_APP_MAP_URL + '/OSM_BLUE/{z}/{x}/{y}.png'
        const {
            tileUrl,
            minZoom,
            maxZoom,
            zoom,
            crs,
            center,
            fullscreenControl,
            zoomControl,
            inertia,
            attributionControl,
            renderer,
            bounds
        } = options
        this.map = L.map(divId, {
            minZoom: minZoom ? minZoom : 8, // 地图最小缩放层级
            maxZoom: maxZoom ? maxZoom : 15, // 地图最大缩放层级,
            // crs: crs ? crs : L.CRS.EPSG3857, // 坐标系
            center: center ? center : [39.7506, 118.3423], // 地图中心
            zoom: zoom ? zoom : 8, // 地图默认缩放层级
            fullscreenControl: fullscreenControl ? fullscreenControl : false, // 是否显示全屏控件
            zoomControl: zoomControl ? zoomControl : false, // 是否显示缩放控件
            inertia: inertia ? inertia : true, // 是否开启惯性，在拖动和在某一时间段内持续朝同一方向移动建有动力的地图时，会有惯性的效果
            attributionControl: attributionControl ? attributionControl : false, // 属性控制是否默认加载在地图上
            renderer: renderer ? renderer : L.canvas() //使用canvas 渲染 提高性能
        })
        if (tileUrl) {
            // 将mapbox自定义样式添加到地图中
            // this.map.addLayer(L.tileLayer(tileUrl, { 
            //     tileSize: 256,
            //     zoomOffset: 1, 
            //     attribution: 'stamen',
            //   }))
            this.map.addLayer(L.tileLayer(tileUrl))
        } else {
            console.error('---请配置瓦片图层地址---')
        }
        // 给地图区域做限制的上下左右四部分
        if (bounds) {
            const mapBounds = bounds
            // L.latLngBounds([
            //     [40.7844, 118.2935], // 下
            //     [38.4575, 118.4979], // 上
            //     [39.782, 115.778], // 左
            //     [39.8041, 121.583] // 右
            // ])
            this.map.setMaxBounds(mapBounds)
        }
        // 渲染完成返回true
        return this.map
    }
    getMap() {
        return this.map || {}
    }
    mapArea() {}
    mapDistance() {}
}

