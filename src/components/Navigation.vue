<template>
  <div class="hidden-xs">
    <aside :class="navigation">
      <div class="nav-head flex flex-space-between flex-middle">
        <router-link class="logo" to="/">
          <img src="/static/logo.svg" alt="Corebi Logo">
        </router-link>
      </div>
      <div>
        <ul class="sidebarLinks">
          <li>
            <router-link to="/">
              <icon name="home"></icon> <span class="text-holder">Home</span>
            </router-link>
        </li>
          <li>
            <router-link to="/report-list">
              <icon name="list-ul"></icon> <span class="text-holder">Report List</span>
            </router-link>
          </li>
          <li>
            <router-link to="/global-filters">
              <icon name="globe"></icon> <span class="text-holder">Global Filters</span>
            </router-link>
          </li>
          <li>
            <router-link to="/mappers">
              <icon name="map-signs"></icon> <span class="text-holder">Mappers</span>
            </router-link>
          </li>
          <li>
            <router-link to="/users">
              <icon name="users"></icon> <span class="text-holder">Users</span>
            </router-link>
          </li>
          <li>
            <router-link to="/schemas">
              <icon name="database"></icon><span class="text-holder">Schemas</span>
            </router-link>
          </li>
        </ul>
      </div>
      <div class="nav-settings">
        <a @click.prevent="logout"><icon name="power-off"></icon></a>
        <router-link to="/user-settings"><icon name="user-circle"></icon></router-link>
        <a href="#"><icon name="arrows-alt"></icon></a>
        <a class="hidden-xs" @click="toggleSidebar"><icon name="chevron-left"></icon></a>
      </div>
    </aside>
  </div>
</template>

<script>
import {AUTH} from '@/helpers/auth-helper'
import Icon from 'vue-awesome/components/Icon'
import { flag, home, globe, sortAmountDesc, mapSigns ,users,userCircle, chevronLeft, arrowsAlt, Database } from 'vue-awesome/icons'

export default {
  name: 'navigation',
  data() {
    return {
      isSidebarActive: null
    }
  },
  components: {
    Icon
  },
  methods: {
    logout () {
      this.$swal({
        title: 'Logout?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Logout!',
        cancelButtonText: 'No, stay here!'
      }).then((res) => {
        if (res.value) {
          AUTH.logout()
          window.location.replace('/')
        }
      })
    },
    toggleSidebar() {
      this.isSidebarActive = !this.isSidebarActive
      const tempStorage = JSON.parse(window.localStorage.getItem('UI_Options'))
      tempStorage.isSidebarActive = this.isSidebarActive
      window.localStorage.setItem('UI_Options', JSON.stringify(tempStorage))
    }
  },
  computed: {
    navigation() {
      return this.isSidebarActive
        ? 'navbar navbar-bundle col-xs-12'
        : 'navbar navbar-bundle col-xs-12 is-scaled'
    }
  },
  created () {
    if (!window.localStorage.getItem('UI_Options')) {
      window.localStorage.setItem('UI_Options', JSON.stringify({
        isSidebarActive: true
      }))
    }
    this.isSidebarActive = JSON.parse(window.localStorage.getItem('UI_Options')).isSidebarActive
  }
}
</script>
