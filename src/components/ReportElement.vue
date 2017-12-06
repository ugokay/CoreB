<template>
  <div>
    <div class="col-sm-12">
      <div class="row">
        <input type="input"  class="no-border col-xs-9" v-model="element.title"/>
        <div  class="col-xs-3 btn-group btn-group-xs align-right no-padding toggleTriggerBox">
          <a class="dropdown-toggle" @click="toggleDropDown" data-toggle="dropdown">
            <i class="icon-more"></i>
          </a>
          <ul :class="isVisible" v-on:click="clickedDropDown = !clickedDropDown">
            <li><a>Test Mustache</a></li>
            <li><a>Save</a></li>
            <li><a>Execute</a></li>
            <li><a>Detail</a></li>
            <li class="divider"></li>
            <li><a>Table</a></li>
            <li><a>Single Value</a></li>
            <li><a>Line Chart</a></li>
            <li><a>Bar Chart</a></li>
            <li><a>Bar Chart (Horizontal)</a></li>
            <li><a>Pie Chart</a></li>
            <li><a>Custom Html</a></li>
            <li class="divider"></li>
            <li><a>Remove</a></li>
          </ul>
        </div>
      </div>
    </div>
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
        clickedDropDown: false,
        queryResult: {}
      }
    },
    computed: {
      isVisible: function() {
        return this.clickedDropDown ? 'dropdown-menu open' : 'dropdown-menu'
      },
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
          this.queryResult.schema.fields[1].type.sqlTypeName === 'VARCHAR') {
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
      },
      toggleDropDown: function () {
        this.clickedDropDown = !this.clickedDropDown;
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

  .toggleTriggerBox {
    position: inherit!important
  }
  .toggleTriggerBox .dropdown-menu {
    right: 0;
    left: auto;
  }

  .highcharts-root{
    width: 100%;
    height: 100%;
  }
  .no-border { border:none }

  .dropdown-toggle {
    color:#000;
    cursor: pointer;
    padding-top: 10px;
  }
  .dropdown-menu.open {
    display: block!important;
    z-index: 9999;
  }
</style>
