<template>
  <div v-if="!hidden" class="popup-area">
    <div class="popup">
      <div class="close-icon" @click="close">
        <div class="icon-plus"></div>
      </div>
      <div class="input-row">
        <label>Field Name</label>
        <input
          v-model="schemeTitle"
          type="text">
      </div>
      <div class="input-row row no-margin">
        <label
          v-for="scheme in schemes"
          :key="scheme.name.table"
          class="checkbox-item is-circled icon-before no-padding-right col-md-6">
            <input
              type="radio"
              :value="scheme.name.table"
              v-model="schemeTable" />
           <span class="text capitalizeFirstLetter"> {{ scheme.name.table }} <i></i></span>
        </label>
      </div>
      <div class="input-row">
        <button @click="createScheme">Create Scheme</button>
      </div>
    </div>
  </div>
</template>

<script>
  import { MOCK_USERS_GROUP } from '@/helpers/helpers'

  export default {
    name: 'popup',
    props: {
      schemes: {
        required: true
      }
    },
    data: function () {
      return {
        schemeTitle: '',
        schemeTable: '',
        hidden: true,
      }
    },
    methods: {
      createScheme: function () {
        this.$emit('newScheme', {
          scheme_title: this.schemeTitle,
          scheme_table: this.schemeTable
        })
      },
      close: function (e) {
        this.schemeTitle = ''
        this.schemeTable = ''
        this.hidden = true
        console.log(this)
      },
      open: function () {
        this.hidden = false
      }
    }
  }
</script>

