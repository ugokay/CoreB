<template>
  <div v-if="!hidden" class="popup-area">
    <div class="popup">
      <div class="close-icon" @click="close">
        <div class="icon-plus"></div>
      </div>
      <input
        type="text"
        placeholder="Filter elements.."
        v-model="searchTerm"
        class="filterElement">
      <ul class="elementList">
        <li
          v-for="element in filteredElements">
          {{element.title}} - {{chartTypeText(element)}}
          <span
            @click="addElement(element)"
            class="btn btn-xs btn-primary pull-right">
            Add
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { HTTP } from '@/helpers/http-helper'
  import { Util } from '@/helpers/helpers'

  export default {
    name: 'popup',
    data: function () {
      return {
        searchTerm: '',
        hidden: true,
        elementList: ''
      }
    },
    computed: {
      filteredElements () {
        if (this.searchTerm === '') {
          return this.elementList
        } else {
          return this.elementList.filter(element =>
            element.title && element.title.toLocaleLowerCase().includes(this.searchTerm.toLocaleLowerCase()))
        }
      }
    },
    methods: {
      chartTypeText (element) {
        return Util.chartType(element.chartType)
      },
      close: function () {
        this.hidden = true
      },
      open: function (user) {
        this.hidden = false
      },
      addElement: function (element) {
        this.$emit('addElement', element)
        this.close()
      },
      filterList () {

      }
    },
    created () {
      HTTP.get('bi/report/element/list').then(res => {
        this.elementList = res.data
      })
    }
  }
</script>

