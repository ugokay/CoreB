// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import storeOptions from './stores/store'

Vue.use(Vuex)
Vue.config.productionTip = false
const store = new Vuex.Store(storeOptions)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: {App},
  router,
  store
})
