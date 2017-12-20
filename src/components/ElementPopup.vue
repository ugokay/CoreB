<template>
  <div v-if="!hidden" class="popup-area">
    <div class="popup">
      <div class="close-icon" @click="close">
        <div class="icon-plus"></div>
      </div>
      <input 
        type="text"
        placeholder="Filter elements.." 
        v-model="elementTitle"
        class="filterElement">
      <ul class="elementList">
        <li
          v-for="element in elementList">
          {{element.title}}
          <span
            @click="addElement(element.id)"
            class="btn btn-xs btn-primary pull-right">
            Add
          </span>
        </li>
      </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import { HTTP } from '@/helpers/http-helper'

  export default {
    name: 'popup',
    data: function () {
      return {
        hidden: true,
        elementList: '',
        elementTitle: ''
      }
    },
    methods: {
      close: function () {
        this.hidden = true
      },
      open: function (user) {
        this.hidden = false
      },
      filterList() {

      }
    },
    created () {
      HTTP.get('bi/report/element/list').then(res => {
        this.elementList = res.data
      })
    }
  }
</script>

