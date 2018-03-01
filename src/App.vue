<template>
  <v-app id="app">
    <v-container v-if="isLogged">
      <div class="rest-loading" v-if="isLoadingRest"></div>
      <navigation />
      <v-content>
        <v-container>
          <transition name="fade">
            <router-view></router-view>
          </transition>
        </v-container>
      </v-content>
    </v-container>
    <login
      v-else
      @success="onLoginSuccess"
      @error="onLoginError" />
  </v-app>
</template>

<script>
import Vue from 'vue'
import Navigation from '@/components/Navigation'
import MobileNavigation from '@/components/MobileNavigation'
import Login from '@/components/Login'
import { AUTH } from '@/helpers/auth-helper.js'
import { HTTP, WS_ENDPOINT } from '@/helpers/http-helper.js'
import VueNativeSock from 'vue-native-websocket'

export default {
  name: 'App',
  components: { Navigation, Login, MobileNavigation },
  data() {
    return {
      isLogged: false,
      isLoadingRest: false
    }
  },
  methods: {
    onLoginSuccess(data) {
      this.isLogged = true
      Vue.use(VueNativeSock, WS_ENDPOINT + data.token)
    },
    onLoginError(res) {
      this.$swal('Unauthorized', res.data.message, 'error')
    }
  },
  created() {
    this.isLogged = AUTH.isLogged()
    if (this.isLogged) {
      Vue.use(VueNativeSock, WS_ENDPOINT + AUTH.token,
        {
          format: 'json',
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 3000
        }
      )
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
        window.location.replace('/')
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
