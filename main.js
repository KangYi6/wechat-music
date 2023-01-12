
// #ifndef VUE3
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif
// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'

//引入封装的axios
import request from './lib/request.js'

export function createApp() {
  const app = createSSRApp(App)
  //全局挂载axios
  app.config.globalProperties.$request = request
  // app.config.globalProperties.$baseUrl = 'http://192.168.101.77:81' //本地接口
  // app.config.globalProperties.$baseUrl = 'https://testmusic.thedream.tech' //测试服务器接口
  app.config.globalProperties.$baseUrl = 'https://music.thedream.tech' //正式服务器接口
  return {
    app
  }
}
// #endif