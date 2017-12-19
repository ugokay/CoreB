<template>
  <div id="app">
    <template v-if="isLogged">
      <div class="row">
        <div class="col-md-2">
          <navigation />
        </div>
        <div class="col-md-10 scrollable">
          <div class="rest-loading" v-if="isLoadingRest"></div>
          <transition name="fade">
            <router-view />
          </transition>
        </div>
      </div>
    </template>
    <template v-else>
      <login @success="onLoginSuccess" @error="onLoginError"/>
    </template>
  </div>
</template>

<script>
import Navigation from '@/components/Navigation'
import Login from '@/components/Login'
import {AUTH} from '@/helpers/auth-helper.js'
import {HTTP} from '@/helpers/http-helper.js'

export default {
  name: 'app',
  components: { Navigation, Login },
  data: function () {
    return {
      isLogged: false,
      isLoadingRest: false
    }
  },
  methods: {
    onLoginSuccess: function (data) {
      this.isLogged = true
    },
    onLoginError: function (data) {
    }
  },
  created: function () {
    this.isLogged = AUTH.isLogged()
    var self = this
    HTTP.interceptors.response.use(function (response) {
      self.isLoadingRest = false
      return response
    }, function (error) {
      if (error.response.status === 401) {
        console.log('Unauthorized attept!')
        AUTH.setToken('')
        self.$router.push('login')
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
