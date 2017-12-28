<template>
  <div class="report-element-wrapper">
    <div v-if="loading">
      <div
        class="progress-bar"
        v-bind:style="{width: progress + '%'}"
        v-if="progress > 0">
        {{progress}}
      </div>
      <div v-else class="loading-nice">
        <span></span>
      </div>
    </div>
    <div class="col-sm-12 report__element">
      <div class="row">
          <input
            v-if="isEditingMode"
            type="input"
            class="report-element--title no-border col-xs-9"
            v-model="element.title"/>  
          <p v-else class="report--element-title"> {{element.title}} </p>
        <div class="col-xs-3 btn-group btn-group-xs align-right no-padding toggleTriggerBox hidden-xs">
          <template v-if="isEditingMode">
            <a class="dropdown-toggle"
               v-click-outside="hideDropdown"
               @click="openDropdown"
               data-toggle="dropdown">
              <i class="icon-more"></i>
            </a>
            <ul :class="isVisible">
              <li><a>Save</a></li>
              <li><a @click.prevent="executeQuery">Execute</a></li>
              <li><router-link :to="designLink">Design</router-link></li>
              <li class="divider"></li>
              <li><a @click.prevent="setChartType('table')">Table</a></li>
              <li><a @click.prevent="setChartType('line')">Line Chart</a></li>
              <li><a @click.prevent="setChartType('column')">Bar Chart</a></li>
              <li><a @click.prevent="setChartType('bar')">Bar Chart (Horizontal)</a></li>
              <li><a @click.prevent="setChartType('pie')">Pie Chart</a></li>
              <li><a @click.prevent="setChartType('custom')">Custom Html</a></li>
              <li class="divider"></li>
              <li><a @click.prevent="remove">Remove</a></li>
            </ul>
          </template>
        </div>
      </div>
    </div>
    <div v-if="queryResult.schema">
      <div v-if="element.chartType === 6">
        <div v-html="customHtml"></div>
      </div>
      <div v-else-if="element.chartType === 0">
        <table class="table" v-if="queryResult"  v-on:click="tableSeen = !tableSeen">
          <thead>
            <th v-for="field in queryResult.schema.fields">{{field.name}}</th>
            <th style="text-align: right;    position: relative;    padding-right: 20px;">
              <i class="icon-query-hide"></i>
            </th>
          </thead>
          <tbody>
          <tr v-for="row in queryResult.data">
            <td v-for="value in row">{{value}}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <vue-highcharts
        v-else
        :options="chartOptions"
        ref="chart">
      </vue-highcharts>
    </div>
  </div>
</template>

<script>
  import { CHART } from '@/helpers/chart-helper.js'
  import { HTTP } from '@/helpers/http-helper.js'
  import {Util} from '@/helpers/helpers.js'
  import VueHighcharts from 'vue2-highcharts'
  import Mustache from 'mustache'
  import ClickOutside from 'vue-click-outside'

  export default{
    name: 'report-element',
    components: { VueHighcharts },
    props: {
      element: {
        type: Object,
        required: true
      },
      filters: {
        type: Object,
        required: true
      },
      isEditingMode: {
        type: Boolean
      }
    },
    data: function () {
      return {
        clickedDropDown: false,
        queryResult: {},
        loading: false,
        progress: 0,
        elementData: this.element,
        queryId: null,
        isWSEnabled: false
      }
    },
    computed: {
      designLink: function () {
        return `/report-design/${this.element.id}`
      },
      isVisible: function () {
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
        let reportType = Util.chartType(this.elementData.chartType)
        var chartData = {}
        if (this.queryResult.schema.fields.length === 3 &&
          this.queryResult.schema.fields[1].type.sqlTypeName === 'VARCHAR') {
          chartData = CHART.cubify(this.queryResult)
        } else {
          chartData = CHART.chartify(this.queryResult, valueIdxs, 0)
        }

        var chartOptions = CHART.createChartOptions(chartData, reportType)
        return chartOptions
      }
    },
    methods: {
      remove: function () {
        this.$emit('remove', this.elementData.id)
      },
      setChartType: function (value) {
        this.elementData.chartType = Util.chartType(value)
      },
      hideDropdown: function () {
        this.clickedDropDown = false
      },
      openDropdown: function () {
        this.clickedDropDown = true
        document.querySelectorAll('.vue-grid-item').forEach(item => { item.style.zIndex = '1' })
        this.$el.parentNode.style.zIndex = '10'
      },
      redrawChart: function () {
        if (this.elementData.chartType !== 6) {
          this.$refs.chart.getChart().reflow()
        }
      },
      resolveExecution: function (res) {
        if (res.status === 202) {
          this.queryId = res.data.queryId
          if (this.isWSEnabled) {
            this.$socket.send('QUERY_PROGRESS:' + this.queryId)
          } else {
            this.checkExecution(this.queryId)
          }
        } else {
          this.loading = false
          this.progress = 0
          this.queryResult = res.data
          this.$emit('executed', this.queryResult)
        }
      },
      catchExecution: function (error) {
        this.loading = false
        this.progress = 0
        this.catchExecutionError(error)
      },
      executeElement: function () {
        this.loading = true
        HTTP.get('bi/analyze/execute/report-element/' + this.element.id, {
          params: {
            filterParamsJson: JSON.stringify(this.filters)
          }
        }).then((res) => {
          this.resolveExecution(res)
        }).catch((error) => {
          this.catchExecution(error)
        })
      },
      executeQuery: function () {
        this.loading = true
        HTTP.post('bi/analyze/execute', {query: this.element.query}, {
          params: {
            filterParamsJson: JSON.stringify(this.filters)
          }
        }).then((res) => {
          this.resolveExecution(res)
        }).catch((error) => {
          this.catchExecution(error)
        })
      },
      catchExecutionError: function (error) {
        console.log(error)
        if (error.response.data.message) {
          const msg = error.response.data.message
            .replace('com.facebook.presto.sql.parser.ParsingException: ', '')
            .replace('java.sql.SQLException: ', '')
          this.$swal('Execution Error', msg, 'error')
        } else {
          this.$swal('Execution Error', 'Unknown error!', 'error')
        }
      },
      checkExecution: function (queryId) {
        HTTP.get('bi/analyze/progress/' + queryId, {})
          .then((res) => {
            // console.log(res.data)
            this.progress = res.data.percentage
            if (res.status === 200 && res.data.percentage < 100) {
              setTimeout(() => {
                this.checkExecution(queryId)
              }, 1000)
            } else {
              this.executeElement()
            }
          })
      }
    },
    directives: {
      ClickOutside
    },
    created: function () {
      if (this.$socket && this.$socket.readyState === this.$socket.OPEN) {
        this.isWSEnabled = true
        this.$options.sockets.onmessage = (res) => {
          const msg = JSON.parse(res.data)
          if (this.queryId === msg.id) {
            this.progress = msg.percentage
            if (msg.percentage === 100) {
              this.executeElement()
            }
          }
        }
      }
      this.executeElement()
    }
  }
</script>
