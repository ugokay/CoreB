<template>
  <div :class="filterSidebar">
    <div class="barStatus" v-if="!isSidebarActive"  @click="toggleSidebar">
      <icon name="chevron-left" />
      <span class="text">Filters</span>
    </div>
    <div class="barStatus" v-else @click="toggleSidebar">
      <icon name="chevron-right" />
    </div>
    <div
      v-for="filterDefinition in filterDefinitions"
      :key="filterDefinition.name"
      v-if="!filterDefinition.static"
      class="form-group">
      <label class="filterDefinitionLabel">{{filterDefinition.label}}</label>
      <report-filter @change="filterChange" :definition="filterDefinition" :filters="filters"></report-filter>
    </div>
    <button class="btn btn-primary btn-block mt-30" @click="apply">APPLY CHANGES</button>
    <button class="btn btn-default btn-block" @click="toggleSidebar">CANCEL</button>
  </div>
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
    components: {
      ReportFilter,
      Icon
    },
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

<style>
  .barStatus {
    position: absolute;
    left: 0;
    cursor: pointer;
    top: 10px;
    background: red;
    transform: translateX(-100%);
    display: flex;
    align-items: center;
    padding: .5em 1em;
    background: #e6dede;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
  }
  .barStatus .text {
    margin-left: 7px;
  }
</style>
