<template>
  <div class="row">
    <div class="col-md-4 col-sm-offset-4">
      <img src="assets/logo_invert.png" alt="" style="margin: auto;      display: block;      padding: 50px;">
      <div class="panel panel-primary" style="border-color: #24262c">
        <div class="panel-heading" style="background:#24262c">
          <h3 class="panel-title">Login</h3>
        </div>
        <div class="panel-body">
          <form class="form-horizontal">
            <div class="form-group col-md-10">
              <label for="username">Username</label>
              <input name="username" v-model="userName"  class="form-control" />
            </div>
            <div class="form-group col-md-10">
              <label for="password">Password</label>
              <input name="password" v-model="password"  class="form-control"  type="password"/>
            </div>
            <div class="col-md-10">
              <button @click.prevent="login" style="background:#24262c" class="btn btn-primary">Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
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
