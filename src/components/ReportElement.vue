<template>
  <div>
    <!--<highcharts v-if="queryResult.schema" :options="chartOptions"></highcharts>-->
    <div v-if="queryResult.schema">
      <div v-if="element.chartType === 6">
        <div v-html="customHtml"></div>
      </div>
      <vue-highcharts v-else :options="chartOptions" ref="chart"></vue-highcharts>
    </div>
  </div>
</template>
<script>
  import {CHART} from '@/helpers/chart-helper.js'
  import {HTTP} from '@/helpers/http-helper.js'
  import {DUMMY_FILTER} from '@/helpers/helpers.js'
  import VueHighcharts from 'vue2-highcharts'
  import Mustache from 'mustache'

  export default{
    name: 'report-element',
    components: {VueHighcharts},
    props: {
      element: {type: Object, default: function () { return {} }}
    },
    data: function () {
      return {
        queryResult: {}
      }
    },
    computed: {
      customHtml: function () {
        if (this.queryResult.schema) {
          var data = {}
          for (let i = 0; i < this.queryResult.data.length; i++) {
            var rowData = {}
            for (var j = 0; j < this.queryResult.data[i].length; j++) {
              rowData['c' + j] = this.queryResult.data[i][j]
            }
            data['r' + i] = rowData
          }
          return Mustache.render(this.element.html, {data: data})
        } else {
          return 'NO DATA'
        }
      },
      chartOptions: function () {
        var valueIdxs = []
        for (var i = 0; i < this.queryResult.schema.fields.length; i++) {
          var field = this.queryResult.schema.fields[i]
          if (field.type.sqlTypeName === 'INTEGER' || field.type.sqlTypeName === 'LONG' || field.type.sqlTypeName === 'DOUBLE') {
            valueIdxs.push(i)
          }
        }
        var chartData = {}
        if (this.queryResult.schema.fields.length === 3 &&
          this.queryResult.schema.fields[1].type === 'VARCHAR') {
          chartData = CHART.cubify(this.queryResult)
        } else {
          chartData = CHART.chartify(this.queryResult, valueIdxs, 0)
        }
        var chartOptions = CHART.createChartOptions(chartData)
        return chartOptions
      }
    },
    methods: {
      redrawChart: function () {
        if (this.element.chartType !== 6) {
          this.$refs.chart.getChart().reflow()
        }
      }
    },
    created: function () {
      HTTP.get('bi/analyze/execute/report-element/' + this.element.id, {
        params: {
          filterParamsJson: JSON.stringify(DUMMY_FILTER.get())
        }
      }).then((res) => {
        this.queryResult = res.data
      })
    }
  }
</script>
<style>
  .highcharts-root{
    width: 100%;
    height: 100%;
  }
</style>
