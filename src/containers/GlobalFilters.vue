<template>
  <v-flex class="mt-5 mb-5" xs12 offset-lg2 lg8>
    <filter-popup @addFilter="addFilter" ref="filterPopup" @updateFilter="updateFilter" />
    <h2 class="mb-3 display-1">Global Filters</h2>
    <v-data-table
      :headers="headers"
      :items="reportFilters"
      hide-actions
      class="elevation-1">
      <template slot="items" slot-scope="props">
        <td>{{ props.item.name }}</td>
        <td class="text-xs-left">{{ props.item.label }}</td>
        <td class="text-xs-left">{{ props.item.type }}</td>
        <td class="text-xs-left">{{ props.item.defaultValue }}</td>
        <td class="text-xs-center">
          <v-btn @click="openEditFilterPopup(props.item.id)" class="mr-0" color="primary" small flat>Edit</v-btn>
        </td>
      </template>
    </v-data-table>
  </v-flex>
</template>

<script>
import FilterPopup from '@/components/popups/FilterPopup'
import { HTTP } from '@/helpers/http-helper'

export default {
  name: 'GlobalFilters',
  data () {
    return {
      reportFilters: [],
      headers: [
        { text: 'Name', },
        { text: 'Label', },
        { text: 'Type', },
        { text: 'Default Value', },
        { text: 'Edit', align: 'center' },
      ],
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
          this.reportFilters.push(res.data)
        })
        .then(() => this.$swal(
            'Success!',
            'Filter has been added to global filters successfully!',
            'success'
          )
        )
    },
    openEditFilterPopup: function (idx) {
      this.$refs.filterPopup.open(this.reportFilters[idx])
    }
  },
  created () {
    HTTP.get('bi/report/filter/list').then(res => {
      this.reportFilters = res.data
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
