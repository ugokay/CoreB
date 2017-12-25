<template>
  <div class="mobileNav">
    <router-link class="logo-mobile" to="/">
      <router-link class="logo" to="/">
        <img src="../../static/logo.svg" alt="Corebi Logo">
      </router-link>
    </router-link>
    <ul>
      <li>
        <a @click.prevent="logout">
          <icon name="power-off" />
        </a>
      </li>
      <li>
        <a @click.prevent="fullscreen">
          <icon name="arrows-alt" />
        </a>
      </li>
      <li>
        <a @click.prevent="openMenu">
          <icon name="bars" />
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import {AUTH} from '@/helpers/auth-helper'
import Icon from 'vue-awesome/components/Icon'
import { bars, powerOff, arrowsAlt } from 'vue-awesome/icons'

export default {
  name: 'MobileNavigation',
  components: {
    Icon
  },
  data() {
    return {
      isMenuOpen: false
    }
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
    openMenu() {
      this.isMenuOpen = !this.isMenuOpen
      const menu = document.querySelector('.nav-tabs-navigation')
      if (this.isMenuOpen) {
          menu.classList.add('is-open')
      } else {
        menu.classList.remove('is-open')
      }
    },
    fullscreen() {
      if (typeof document.cancelFullScreen != 'undefined' && document.fullScreenEnabled === true) {
          document.requestFullScreen()
      }
    }
  }
}
</script>
