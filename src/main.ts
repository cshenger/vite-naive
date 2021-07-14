import { createApp } from 'vue'
import naive from 'naive-ui'
import App from './App.vue'
import router from './router'
import store from './store'
import 'vfonts/Lato.css' // 通用字体
import 'vfonts/FiraCode.css' // 等宽字体
import $http from "./api/axios"
import echarts from './api/echartsUI'

//全局配置
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
      $http: Function,
      $echarts: Object
    }
}

const app = createApp(App);
app.config.globalProperties.$http = $http;
app.config.globalProperties.$echarts = echarts;
app.use(store).use(router).use(naive).mount('#app');
