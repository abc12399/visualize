import { createApp } from 'vue'

import App from './App.vue'

import Leaflet from 'leaflet'
import "leaflet/dist/leaflet.css"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'


import router from './router/index'

const app = createApp(App)
app.use(ElementPlus)
app.use(Leaflet)
app.use(router)
app.mount('#app')
