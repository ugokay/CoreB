<template>
  <v-layout justify-center class="grey lighten-3 pt-5">
    <v-flex xs12 lg3 class="pt-5">
      <div class="mb-5 text-center">
        <img src="static/logo_invert.png" />
      </div>
      <v-card>
        <v-card-text>
          <v-text-field label="Username" v-model="userName" />
          <v-text-field label="Password" type="password" requied v-model="password" />
          <v-btn :loading="loading"
      @click.native="loader = 'loading'"
      :disabled="loading" large color="primary" block @click="login">LOGIN</v-btn>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import {AUTH} from '@/helpers/auth-helper.js'
  export default {
    name: 'login',
    data: function () {
      return {
        userName: '',
        password: '',
        loading: false
      }
    },
    methods: {
      login: function () {
        this.loading = true
        AUTH.login(this.userName, this.password).then((res) => {
          this.$emit('success', res.data)
          AUTH.setToken(res.data.token)
        }).catch((error) => {
          this.$emit('error', error.response)
          this.loading = false
        })
      }
    }
  }
</script>
