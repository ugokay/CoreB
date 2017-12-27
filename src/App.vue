<template>
  <div id="app">
    <template v-if="isLogged">
      <div class="App-container">
        <navigation />
        <mobile-navigation />
        <div class="main-content scrollable">
          <div class="rest-loading" v-if="isLoadingRest"></div>
          <transition name="fade">
            <router-view />
          </transition>
        </div>
      </div>
    </template>
    <template v-else>
      <login
        @success="onLoginSuccess"
        @error="onLoginError" />
    </template>
  </div>
</template>


<script>
import Vue from 'vue'
import Navigation from '@/components/Navigation'
import MobileNavigation from '@/components/MobileNavigation'
import Login from '@/components/Login'
import {AUTH} from '@/helpers/auth-helper.js'
import {HTTP} from '@/helpers/http-helper.js'
import VueNativeSock from 'vue-native-websocket'

export default {
  name: 'app',
  components: { Navigation, Login, MobileNavigation },
  data: function () {
    return {
      isLogged: false,
      isLoadingRest: false
    }
  },
  methods: {
    onLoginSuccess: function (data) {
      this.isLogged = true
      Vue.use(VueNativeSock, 'ws://localhost:8081/web-socket/v1/general/' + data.token)
    },
    onLoginError: function (res) {
      this.$swal('Unauthorized', res.data.message, 'error')
    }
  },
  created: function () {
    this.isLogged = AUTH.isLogged()
    if (this.isLogged) {
      Vue.use(VueNativeSock, 'ws://localhost:8081/web-socket/v1/general/' + AUTH.token,
        {
          format: 'json',
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 3000
        })
    }
    var self = this
    HTTP.interceptors.response.use(function (response) {
      self.isLoadingRest = false
      return response
    }, function (error) {
      self.isLoadingRest = false
      if (error.response.status === 401) {
        console.log('Unauthorized attept!')
        AUTH.setToken('')
        self.$router.push('/')
      }
      return Promise.reject(error)
    })
    HTTP.interceptors.request.use(function (config) {
      self.isLoadingRest = true
      return config
    }, function (error) {
      return Promise.reject(error)
    })
  }
}
</script>
