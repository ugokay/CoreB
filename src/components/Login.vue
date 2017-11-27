<template>
  <div>
    <input v-model="userName"/>
    <input v-model="password"/>
    <button @click="login">Login</button>
  </div>
</template>
<script>
  import {AUTH} from '@/helpers/auth-helper.js'
  export default {
    name: 'login',
    data: function () {
      return {
        userName: 'flormar_admin',
        password: '123456'
      }
    },
    methods: {
      login: function () {
        AUTH.login(this.userName, this.password).then((res) => {
          this.$emit('success', res.data)
          AUTH.isLogged = true
          AUTH.setToken(res.data.token)
        }).catch((error) => {
          this.$emit('error', error.response)
        })
      }
    }
  }
</script>
<style>

</style>
