<template>
  <v-tabs color="white" class="filter--header" v-if="filterDefinitions.length > 0">
    <v-tab v-for="(filterDefinition, i) in filterDefinitions" :key="i"  v-if="!filterDefinition.static">
      <v-menu
        ref="menu"
        lazy
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        full-width
        :nudge-right="40"
        min-width="290px"
        :return-value.sync="filterDefinition.label">
        <div class="filterValue" slot="activator">
          <label class="label label-default">{{ filterDefinition.label }}</label>
          <label class="label label-default">{{ filterDefinition.value }}</label>
        </div>
        <report-filter
          @change="filterChange"
          :definition="filterDefinition"
          :filters="filters">
        </report-filter>
      </v-menu>
    </v-tab>
  </v-tabs>
</template>

<script>
import Icon from 'vue-awesome/components/Icon'
import { chevronLeft, chevronRight } from 'vue-awesome/icons'
import ReportFilter from '@/components/ReportFilter'

export default {
    name: 'FilterSidebar',
    data() {
      return {
        isSidebarActive: false,
        filterValues: []
      }
    },
    components: { ReportFilter, Icon },
    methods: {
      filterChange: function (filterValue) {
        if (this.filterValues.filter(item => item.name === filterValue.name).length === 0){
          this.filterValues.push(filterValue)
        }else {
          this.filterValues = this.filterValues.map(item => {
            if (item.name === filterValue.name) {
              return filterValue
            }
            return item
          })
        }
        this.$emit('change', this.filterValues)
      },
      toggleSidebar () {
        this.isSidebarActive = !this.isSidebarActive
      },
      apply: function () {
        this.$emit("apply")
        this.isSidebarActive = false
      }
    },
    computed: {
      filterSidebar () {
        return this.isSidebarActive ? 'filter-sidebar is-active' : 'filter-sidebar'
      }
    },
    props: {
      filterDefinitions: {
        type: Array,
        required: true
      },
      filters: {
        type: Object,
        required: true
      }
    }
  }
</script>