<template>
  <div :class="filterSidebar">
    <div class="barStatus" v-if="!isSidebarActive"  @click="handleSidebar">
      <icon name="chevron-left" />
      <span class="text">Filters</span>
    </div>
    <div class="barStatus" v-else @click="handleSidebar">
      <icon name="chevron-right" />
    </div>
    <div
      v-for="filterDefinition in filterDefinitions"
      :key="filterDefinition.name"
      v-if="!filterDefinition.static"
      class="form-group">
      <label style="font-size: 12px;margin-bottom: 0;display: block">{{filterDefinition.label}}</label>
      <report-filter :definition="filterDefinition" :filters="filters"></report-filter>
    </div>
    <div
      v-for="filterDefinition in filterDefinitions"
      :key="filterDefinition.name"
      v-if="!filterDefinition.static"
      class="form-group">
      <label style="font-size: 12px;margin-bottom: 0;display: block">{{filterDefinition.label}}</label>
      <report-filter :definition="filterDefinition" :filters="filters"></report-filter>
    </div>
    <div
      v-for="filterDefinition in filterDefinitions"
      :key="filterDefinition.name"
      v-if="!filterDefinition.static"
      class="form-group">
      <label style="font-size: 12px;margin-bottom: 0;display: block">{{filterDefinition.label}}</label>
      <report-filter :definition="filterDefinition" :filters="filters"></report-filter>
    </div>
    <button class="btn btn-primary btn-block mt-30">APPLY CHANGES</button>
    <button class="btn btn-default btn-block" @click="handleSidebar">CANCEL</button>
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
        isSidebarActive: false
      }
    },
    components: {
      ReportFilter,
      Icon
    },
    methods: {
      handleSidebar () {
        this.isSidebarActive = !this.isSidebarActive
      }
    },
    computed: {
      filterSidebar () {
        return this.isSidebarActive ? 'filter-sidebar is-active' : 'filter-sidebar'
      }
    },
    props: {
      filterDefinitions: {
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
