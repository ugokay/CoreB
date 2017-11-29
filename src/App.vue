<template>
  <div id="app">
    <template v-if="isLogged()">
      <div class="row">
        <div class="col-md-2">
          <navigation />
        </div>
        <div class="col-md-10 scrollable">
          <router-view />
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
      return {}
    },
    methods: {
      isLogged: function () {
        return AUTH.isLogged()
      },
      onLoginSuccess: function (data) {
      },
      onLoginError: function (data) {
      }
    },
    created: function () {
      var self = this
      HTTP.interceptors.response.use(function (response) {
        // Do something with response data
        return response
      }, function (error) {
        // Do something with response error
        if (error.response.status === 401) {
          console.log('Unauthorized attept!')
          AUTH.setToken('')
          self.$router.push('login')
        }
        return Promise.reject(error)
      })
    }
  }
</script>

<style>
#app {
  /* font-family: 'Avenir', Helvetica, Arial, sans-serif; */
  /* -webkit-font-smoothing: antialiased; */
  /* -moz-osx-font-smoothing: grayscale; */
  /* text-align: center; */
  /* color: #2c3e50; */
  /* margin-top: 60px; */
}

.scrollable {    height: 100vh;
    overflow-y: scroll;
    overflow-x: hidden;}
</style>
