<template>
  <div id="app">
    <template v-if="isLogged">
      <navigation />
      <router-view />
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
  export default {
    name: 'app',
    components: { Navigation, Login },
    data: function () {
      return {
        isLogged: AUTH.isLogged
      }
    },
    methods: {
      onLoginSuccess: function (data) {
        this.isLogged = true
      },
      onLoginError: function (data) {
        console.log(data)
      }
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
</style>
