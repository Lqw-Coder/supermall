import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Toast from 'components/common/toast'

Vue.config.productionTip = false


//在原型上挂载一个事件中心，便捷实现非兄弟组件之间的通信
Vue.prototype.$bus = new Vue()

Vue.use(Toast)

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
