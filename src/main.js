import Vue from 'vue'
import App from './App'
import router from './router'
import VueSweetalert2 from 'vue-sweetalert2'

import 'bootstrap/dist/css/bootstrap.min.css'
import '../style.css'
import VueHotkey from 'v-hotkey'

Vue.use(VueHotkey)
Vue.use(VueSweetalert2)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  template: '<App/>',
  components: {App},
  router
})
