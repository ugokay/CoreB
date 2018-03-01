<template>
  <li class="is-list-item">
    <h6 class="subheading">
      <icon name="database"></icon>
      <span class="body-2"> {{ field.name }} </span>
    </h6>
    <span :class="saved">
      <icon name="check"></icon>
    </span>
    <div class="labels">
      <label class="checkbox-item" @click="handleChecks">
        <input type="checkbox" checked/>
        <span class="text"><i></i></span>
      </label>
      <label class="checkbox-item" @click="handleChecks">
        <input type="checkbox"/>
        <span class="text"><i></i></span>
      </label>
      <label class="checkbox-item" @click="handleChecks">
        <input type="checkbox"/>
        <span class="text"><i></i></span>
      </label>
    </div>
    <v-menu offset-y right>
      <v-btn icon slot="activator" class="mr-1">
        <v-icon class="color-grey">more_vert</v-icon>
      </v-btn>
      <v-list class="report-element-dropdown">
        <v-list-tile @click=""><v-list-tile-title>DELETE</v-list-tile-title></v-list-tile>
      </v-list>  
    </v-menu>
  </li>
</template>

<script>
  import Icon from 'vue-awesome/components/Icon'
  import { Database, EllipsisV, Check } from 'vue-awesome/icons'
  import ClickOutside from 'vue-click-outside'

  export default {
    name: 'SchemeItem',
    components: {
      Icon
    },
    data() {
      return {
        clickedDropDown: false,
        isSaving: false
      }
    },
    props: {
      field: {
        type: Object,
        required: true
      }
    },
    computed: {
      isVisible: function () {
        return this.clickedDropDown ? 'dropdown-menu open' : 'dropdown-menu'
      },
      saved: function () {
        return this.isSaving ? 'is-saved is-visible' : 'is-saved'
      }
    },
    methods: {
      handleChecks() {
        this.isSaving = true
        setTimeout(() => {
          this.isSaving = false
        }, 1100)
      },
      openDropdown: function () {
        this.clickedDropDown = true
      },
      hideDropdown: function () {
        this.clickedDropDown = false
      }
    },
    directives: {
      ClickOutside
    }
  }
</script>
