<template>
  <div>
    <highcharts v-if="queryResult.schema" :options="chartOptions"></highcharts>
  </div>
</template>
<script>
  import Vue from 'vue'
  import VueHighcharts from 'vue-highcharts'
  import {CHART} from '@/helpers/chart-helper.js'

  Vue.use(VueHighcharts)

  export default{
    name: 'report-element',
    props: {
      queryResult: {}
    },
    data: function () {
      return {}
    },
    computed: {
      chartOptions: function () {
        var valueIdxs = []
        for (var i = 0; i < this.queryResult.schema.fields.length; i++) {
          var field = this.queryResult.schema.fields[i]
          if (field.type.sqlTypeName === 'INTEGER' || field.type.sqlTypeName === 'LONG' || field.type.sqlTypeName === 'DOUBLE') {
            valueIdxs.push(i)
          }
        }
        var chartData = CHART.chartify(this.queryResult, valueIdxs, 0)
        var chartOptions = CHART.createChartOptions(chartData)
        return chartOptions
      }
    },
    created: function () {
      // Execute report element
    }
  }
</script>
<style></style>
