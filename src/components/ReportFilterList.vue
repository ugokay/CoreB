<template>
  <v-layout v-if="filterDefinitions && filterDefinitions.length > 0">
    <v-flex xs11 sm2
            v-for="definition in filterDefinitions"
            v-if="!definition.static"
            :key="definition.name">
      <v-menu
        ref="menu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        full-width
        :nudge-right="40"
        min-width="290px">
        <v-text-field
          slot="activator"
          :label="definition.label"
          prepend-icon="event"
          readonly />
        <report-filter :definition="definition" :filters="filters" @loaded="filterLoaded"></report-filter>
      </v-menu>
    </v-flex>
  </v-layout>
</template>
<script>
  import Vue from 'vue'
  import { Util } from '@/helpers/helpers.js'
  import ReportFilter from '@/components/ReportFilter'

  export default {
    name: 'report-filter-list',
    components: {
      ReportFilter
    },
    props: {
      globalFilterDefinitions: {
        type: Array,
        required: true
      },
      report: {
        type: Object,
        required: true
      },
      filters: {
        type: Object,
        default: {}
      }
    },
    data: function () {
      return {
        filterDefinitions: [],
        filterLoadCounter: -1,
      }
    },
    methods: {
      filterLoaded: function () {
        console.log('Before filterLoad ' + this.filterLoadCounter)
        this.filterLoadCounter--;
        console.log('After filterLoad ' + this.filterLoadCounter)
      },
      calculateFilterDefinitions() {
        console.log("Calc FD")
        let queries = []
        let filterDefinitions = []
        this.report.elements.forEach(element => {
          queries.push(element.query)
        })
        let filterTokens = Util.getUnifiedMustacheTokens(queries)
        if (filterTokens.length > 0) {
          filterDefinitions = Util.calculateFilterDefinitions(filterTokens, this.globalFilterDefinitions)
        } else {
          this.filterLoadCounter = 0
        }
        filterDefinitions.forEach(filterDefinition => {
          if (filterDefinition.static) {
            this.filters[filterDefinition.name] = filterDefinition.defaultValue
          } else {
            if (this.filterLoadCounter === -1) {
              console.log("=1")
              this.filterLoadCounter = 1
            } else {
              console.log("+1")
              this.filterLoadCounter++
            }
          }
        })
        this.filterDefinitions = filterDefinitions
        console.log("Calc FD END")
      }
    },
    created: function () {
      console.log(this.report)
      this.calculateFilterDefinitions()
    },
    watch: {
      report: function () {
        console.log("Report change")
      console.log(this.report)
        this.filterLoadCounter = -1
        Vue.nextTick().then(() => {
          this.calculateFilterDefinitions()
        })
      },
      filterLoadCounter: function (filterLoadCounter) {
        console.log('Changed:' + filterLoadCounter)
        if (filterLoadCounter === 0) {
          console.log('Filters Loaded')
          this.$emit('loaded')
        }
      }
    }
  }
</script>
