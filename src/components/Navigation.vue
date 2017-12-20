<template>
    <div class="row">
      <aside class="navbar navbar-bundle col-xs-12">
        <div class="nav-head flex flex-space-between flex-middle">
          <router-link class="logo" to="/">
            <img src="/static/logo.svg" alt="Corebi Logo">
          </router-link>
          <a class="btn-menu" href="javascript:void(0);">
            <i class="icon-hamburger"></i>
          </a>
        </div>
        <div>
          <ul class="sidebarLinks">
            <li><router-link to="/"><i class="icon-plus" />Home</router-link></li>
            <li><router-link to="/report-list"><i class="icon-plus" />Report List</router-link></li>
            <li><router-link to="/global-filters"><i class="icon-plus" />Global Filters</router-link></li>
            <li><router-link to="/mappers"><i class="icon-plus" />Mappers</router-link></li>
            <li><router-link to="/users"><i class="icon-plus" />Users</router-link></li>
          </ul>
        </div>
        <div class="admin-settings">
          <a href="#">
            <i class="icon-settings"></i>
            <span class="text-holder">Admin</span>
            <button class="menu-toggler pull-right"><i class="icon-tri-left"></i> </button>
          </a>
          <a @click.prevent="logout">
            <i class="icon-tri-left"></i>
            <span class="text-holder">Logout</span>
          </a>
        </div>
      </aside>
    </div>
</template>

<script>
import {AUTH} from '@/helpers/auth-helper'

export default{
  name: 'navigation',
  methods: {
    logout () {
      AUTH.logout()
      window.location.replace('/')
    }
  }
}
</script>

<style>
.sidebarLinks  {
  margin-top: 30px;
}
.sidebarLinks li a{
  padding: 12px 20px;
  display: block;
  font-size: 15px;
  color: #fff;
  transition: all 200ms
}
.sidebarLinks li a:hover{
  background: #282a33
}
</style>
