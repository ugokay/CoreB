<template>
  <div>
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
        </ul>
      </div>
      <div class="nav-settings">
        <a @click.prevent="logout"><icon name="power-off"></icon></a>
        <a href="#"><icon name="user-circle"></icon></a>
        <a href="#"><icon name="arrows-alt"></icon></a>
        <a class="hidden-xs" @click="toggleSidebar"><icon name="chevron-left"></icon></a>
      </div>
    </aside>
  </div>
</template>

<script>
import {AUTH} from '@/helpers/auth-helper'
import Icon from 'vue-awesome/components/Icon'
import { flag, home, globe, sortAmountDesc, mapSigns ,users,userCircle, chevronLeft, arrowsAlt } from 'vue-awesome/icons'

export default {
  name: 'navigation',
  data() {
    return {
      isSidebarActive: true
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
        console.log(res)
        if (res.value) {
          AUTH.logout()
          window.location.replace('/')
        }
      })
    },
    toggleSidebar() {
      this.isSidebarActive = !this.isSidebarActive
    }
  },
  computed: {
    navigation() {
      return this.isSidebarActive
        ? 'navbar navbar-bundle col-xs-12'
        : 'navbar navbar-bundle col-xs-12 is-scaled'
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
/* .navbar {
  transition: all 300ms
} */
.navbar.is-scaled {
  width: 60px;
  position: relative;
  z-index: 9999;
}
.navbar.is-scaled li:hover span.text-holder {
  display: block
}
.navbar li {
  margin:0 -15px;
  position: relative;
  white-space: nowrap;
}
.navbar.is-scaled .btn-menu {
  transform: translate(4px, 45px);
}
.navbar span.text-holder {
  margin-left: 10px;
} 
.navbar.is-scaled span.text-holder {
  position: absolute;
  background: #3a3c46;
  right: -5px;
  transform: translate(100%, -50%);
  top: 50%;
  font-size: 13px;
  padding: .3em 1em;
  border-radius: 20px;
  display: none
}
.navbar.is-scaled .sidebarLinks a {
  /* text-align: center; */
}
.navbar.is-scaled .sidebarLinks i {
  /*margin-right: -10px!important*/
}
.sidebarLinks.admin-settings li{
  margin: 0 -20px;
}

@media screen and (max-width: 760px) {
  .navbar {
    width: 60px;
    position: relative;
    z-index: 9999;
  }
  .navbar span.text-holder {
    position: absolute;
    background: #3a3c46;
    right: -5px;
    transform: translate(100%, -50%);
    top: 50%;
    font-size: 13px;
    padding: .3em 1em;
    border-radius: 20px;
    display: none
  }
  .navbar .nav-settings {
    flex-direction: column
  }
  .navbar .nav-settings a:last-child {
    transform: rotate(180deg);
  }
  .navbar .nav-settings a {
    padding: .6em 1.6em!important
  }

  .sidebarLinks li a {
    display: flex!important;
    align-items: center
  }
  .navbar .nav-head {
    width: calc(100% + 30px);
    overflow: hidden;
    margin-left: -17px;
  }


}
</style>
