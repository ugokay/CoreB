<template>
  <div class="hidden-xs">
    <v-navigation-drawer fixed="fixed" clipped="clipped" app="app" v-model="drawer" :mini-variant="mini" class="blue-grey darken-4" width="250">
      <v-list class="logo" v-show="!mini"><img src="static/logo.svg"/></v-list>
      <v-list class="logo-small" v-show="mini"><img src="static/logo-small.png"/></v-list>
      <v-list dark="dark" dense class="blue-grey darken-4">
        <router-link v-for="(item, i) in items" :to="item.link" :key="item.link">
          <v-layout row v-if="item.heading" align-center :key="i">
            <v-flex xs6>
              <v-subheader v-if="item.heading">{{ item.heading }}</v-subheader>
            </v-flex>
            <v-flex xs6 class="text-xs-right">
              <v-btn small flat>edit</v-btn>
            </v-flex>
          </v-layout>
          <v-divider dark v-else-if="item.divider" :key="i" class="my-3"></v-divider>
          <v-list-tile :key="i" v-else @click>
            <v-list-tile-action>
              <v-tooltip right="right">
                <v-icon slot="activator">{{ item.icon }}</v-icon><span>{{ item.text }}</span>
              </v-tooltip>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="white--text">{{ item.text }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </router-link>
      </v-list>
    <div class="nav-settings blue-grey darken-4">
      <v-layout wrap align-center justify-center>
        <v-btn @click.prevent="logout" icon><v-icon class="white--text">exit_to_app</v-icon></v-btn>
        <v-btn @click.prevent="$router.push('/user-settings')" icon><v-icon class="white--text">person</v-icon></v-btn>
        <v-btn @click.prevent icon><v-icon class="white--text">fullscreen</v-icon></v-btn>
        <v-btn @click.stop='mini = !mini' icon>
          <v-icon class="white--text" v-if="mini">keyboard_arrow_right</v-icon>
          <v-icon class="white--text" v-else>keyboard_arrow_left</v-icon>
        </v-btn>
      </v-layout>
    </div>
    </v-navigation-drawer>
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
      drawer: null,
      mini: true,
      items: [
        { icon: 'home', text: 'Home', link: '/'},
        { icon: 'list', text: 'Report List', link: '/report-list'},
        { icon: 'filter_list', text: 'Global Filters', link: '/global-filters'},
        { icon: 'layers', text: 'Mappers', link: '/mappers'},
        { icon: 'people', text: 'Users', link: '/users'},
        { icon: 'business', text: 'Schemas', link: '/schemas'},
      ]
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
//      const tempStorage = JSON.parse(window.localStorage.getItem('UI_Options'))
//      tempStorage.isSidebarActive = this.isSidebarActive
//      window.localStorage.setItem('UI_Options', JSON.stringify(tempStorage))
    }
  },
}
</script>
