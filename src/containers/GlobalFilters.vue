<template>
  <div class="global-filters">
    <filter-popup @addFilter="addFilter" ref="filterPopup" @updateFilter="updateFilter"/>
    <a class="btn--add is-fixed" @click="openFilter">
      <i class="icon-plus" />
      Add
    </a>
    <div class="col-sm-12">
      <h2>Global Filters</h2>
      <ul class="global-filters is-table-view">
        <li
          v-for="(filterDefinition, index) in reportElements"
          :key="filterDefinition.name">
          <span class="name">{{ filterDefinition.name }}</span>
          <span class="_label">{{ filterDefinition.label }}</span>
          <span>
            <label class="label label-default">{{ filterDefinition.type }}</label>
          </span>
          <span>
            <label class="label label-default">{{ filterDefinition.defaultValue }}</label>
          </span>
          <span class="justify-content-end">
            <label @click="openEditFilterPopup(index)" class="label label-primary">Edit</label>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import FilterPopup from '@/components/popups/FilterPopup'
import {HTTP} from '@/helpers/http-helper'

export default {
  name: 'GlobalFilters',
  data () {
    return {
      reportElements: []
    }
  },
  components: {
    FilterPopup
  },
  methods: {
    updateFilter (filter) {
      HTTP.post('bi/report/filter', filter)
        .then(res => {
          console.log(res.data)
          this.$swal('Success!', 'Filter has been updated successfully!', 'success')
        })
    },
    openFilter () {
      this.$refs.filterPopup.open()
    },
    addFilter (filter) {
      filter.global = true
      HTTP.post('bi/report/filter', filter)
        .then(res => {
          console.log(res.data)
          this.reportElements.push(res.data)
        })
        .then(() => this.$swal(
          'Success!',
          'Filter has been added to global filters successfully!', 'success')
        )
    },
    openEditFilterPopup: function (index) {
      this.$refs.filterPopup.open(this.reportElements[index])
    }
  },
  created () {
    HTTP.get('bi/report/filter/list').then(res => {
      this.reportElements = res.data
    })
  }
}
</script>

<style>
.global-filters li{
  padding: 1em;
  height: 50px;
  background-color: #ffffff;
  box-shadow: 1px 2px 4px 0 rgba(0, 0, 0, 0.12);
  margin-bottom: 1px
}
.global-filters li .name {
  font-size: 15px;
  color:#000;
}
.global-filters li ._label {
  font-size: 13px;
  color:#000;
}
</style>
