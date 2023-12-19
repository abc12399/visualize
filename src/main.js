import { createApp } from 'vue'

import App from './App.vue'

import Leaflet from 'leaflet'
import "leaflet/dist/leaflet.css"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(ElementPlus)
app.use(Leaflet)
app.mount('#app')
