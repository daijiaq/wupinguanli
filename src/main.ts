import { createSSRApp } from 'vue'
import uviewPlus from 'uview-plus'
import App from './App.vue'
import * as Pinia from 'pinia'
import 'uview-plus/index.scss'
import '@/static/icons/iconfont/iconfont.css'
import 'animate.css/animate.min.css'

export function createApp() {
  const app = createSSRApp(App)
  app.use(Pinia.createPinia()).use(uviewPlus)
  return {
    app,
    Pinia
  }
}
