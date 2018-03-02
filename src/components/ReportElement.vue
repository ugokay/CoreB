<template>
  <v-layout wrap>
    <div v-if="loading" class="progress-bar-area">
      <div class="loading-nice">
        <span></span>
      </div>
      <div
        v-if="progress"
        class="progress-bar"
        v-bind:style="{ width: progress + '%' }">
        <span>{{progress}}%</span>
      </div>
    </div> 
    <v-flex xs12 md12 lg12 wrap>
      <v-layout class="pl-3 pt-2" v-if="isEditing">
        <v-text-field type="input" class="pt-0" v-model="element.title"/>
        <v-menu offset-y>
          <v-btn icon slot="activator" class="mr-1">
            <v-icon class="color-grey">more_vert</v-icon>
          </v-btn>
          <v-list class="report-element-dropdown">
            <v-list-tile v-if="!isDesignMode" @click=""><v-list-tile-title>Save</v-list-tile-title></v-list-tile>
            <v-list-tile v-if="!isDesignMode" @click.prevent="executeQuery"><v-list-tile-title>Execute</v-list-tile-title></v-list-tile>
            <v-list-tile v-if="!isDesignMode" @click='$router.push(designLink)'>
              <v-list-tile-title>Design</v-list-tile-title>
            </v-list-tile>
            <v-list-tile v-if="!isDesignMode" class="divider"></v-list-tile>
            <v-list-tile @click.prevent="setChartType('table')"><v-list-tile-title>Table</v-list-tile-title></v-list-tile>
            <v-list-tile @click.prevent="setChartType('line')"><v-list-tile-title>Line Chart</v-list-tile-title></v-list-tile>
            <v-list-tile @click.prevent="setChartType('column')"><v-list-tile-title>Bar Chart</v-list-tile-title></v-list-tile>
            <v-list-tile @click.prevent="setChartType('bar')"><v-list-tile-title>Bar Chart (Horizontal)</v-list-tile-title></v-list-tile>
            <v-list-tile @click.prevent="setChartType('pie')"><v-list-tile-title>Pie Chart</v-list-tile-title></v-list-tile>
            <v-list-tile @click.prevent="setChartType('custom')"><v-list-tile-title>Custom Html</v-list-tile-title></v-list-tile>
            <v-list-tile class="divider"></v-list-tile>
            <v-list-tile @click.prevent="editChart"><v-list-tile-title>Edit Chart</v-list-tile-title></v-list-tile>
            <v-list-tile @click.prevent="saveAsPng"><v-list-tile-title>Save as Png</v-list-tile-title></v-list-tile>
            <v-list-tile @click="">
              <excel-button data="excelData" :fields="excelFields" name="filename.xls">Download Excel</excel-button>
            </v-list-tile>
            <v-list-tile v-if="!isDesignMode" class="divider"></v-list-tile>
            <v-list-tile v-if="!isDesignMode" @click.prevent="remove"><v-list-tile-title>Remove</v-list-tile-title></v-list-tile>
          </v-list>
        </v-menu>
      </v-layout>
      <v-btn v-else flat block color="grey darken-2" class="mt-0" justify-start @click="$router.push(designLink)">{{ element.title }}</v-btn>
      <v-layout column>
        <div ref="elementWrapper" v-if="queryResult.schema">
          <div v-if="element.chartType === 6">
            <div v-html="customHtml"></div>
          </div>
          <div class="full-height" v-else-if="element.chartType === 0">
            <table class="table table-scrollable" v-if="queryResult"  v-on:click="tableSeen = !tableSeen">
              <thead>
                <th v-for="field in queryResult.schema.fields">{{field.name}}</th>
                <th style="text-align: right; position: relative; padding-right: 20px;">
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
            v-else-if="!loading"
            :options="chartOptions"
            ref="chart">
          </vue-highcharts>
        </div>
      </div>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
  import { CHART } from '@/helpers/chart-helper.js'
  import { HTTP } from '@/helpers/http-helper.js'
  import { Util } from '@/helpers/helpers.js'
  import VueHighcharts from 'vue2-highcharts'
  import Mustache from 'mustache'
  import JsonExcel from 'vue-json-excel'
  import html2canvas from 'html2canvas'

  export default{
    name: 'report-element',
    components: { VueHighcharts, 'excel-button': JsonExcel },
    data() {
      return {
        queryResult: {},
        loading: false,
        progress: 0,
        elementData: this.element,
        queryId: null,
        isWSEnabled: false,
        _chartColors: null,
        update: false
      }
    },
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
      },
      isDesignMode: {
        type: Boolean,
        required: false
      }
    },
    computed: {
      excelFields() {
        const excelFields = {}
        this.queryResult.schema.fields.forEach(field => {
          excelFields[field.name] = 'String'
        })
        // console.log(excelFields)
        return excelFields
      },
      excelData() {
        const excelData = []
        this.queryResult.data.forEach(row => {
          const rowData = {}
          this.queryResult.schema.fields.forEach((field, idx) => {
            rowData[field.name] = row[idx]
          })
          excelData.push(rowData)
        })
        // console.log(excelData)
        return excelData
      },
      isEditing() {
        return this.isDesignMode ? true : this.isEditingMode
      },
      designLink() {
        return `/report-design/${this.element.id}`
      },
      isVisible() {
        return this.clickedDropDown ? 'dropdown-menu open' : 'dropdown-menu'
      },
      customHtml() {
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
      chartOptions() {
        var valueIdxs = []
        const colors = this.chartColors
        for (var i = 0; i < this.queryResult.schema.fields.length; i++) {
          var field = this.queryResult.schema.fields[i]
          if (
              field.type.sqlTypeName === 'INTEGER' ||
              field.type.sqlTypeName === 'LONG' ||
              field.type.sqlTypeName === 'DOUBLE'
            ) {
              valueIdxs.push(i)
            }
        }
        let reportType = Util.chartType(this.elementData.chartType)
        var chartData = {}
        if (
            this.queryResult.schema.fields.length === 3 &&
            this.queryResult.schema.fields[1].type.sqlTypeName === 'VARCHAR'
          ) {
          chartData = CHART.cubify(this.queryResult)
        } else {
          chartData = CHART.chartify(this.queryResult, valueIdxs, 0)
        }
        var chartOptions = CHART.createChartOptions(chartData, reportType, colors)
        return chartOptions
      },
      chartColors: {
        get() {
          const type = Util.chartType(this.elementData.chartType)
          if (this.update) {
            return this._chartColors
          } else {
            if (type == 'pie') {
              this._chartColors = ['pink', 'navy', 'tomato', 'red', 'blue', 'green']
            } else {
              this._chartColors = ['pink', 'navy']
            }
          }
          return this._chartColors
        },
        set(colors) {
          this._chartColors = colors
        }
      }
    },
    methods: {
      setUpdates(updates) {
        this.update = true
        const { colors } = updates
        this.chartColors = colors
      },
      editChart() {
        this.update = false
        const colors = this.chartColors
        const chartOptions = this.chartOptions
        const elementId = this.elementData.id
        this.$emit('editChart', {
          colors,
          elementId,
          chartOptions
        })
      },
      saveAsPng() {
        this.clickedDropDown = false
        html2canvas(this.$refs.elementWrapper)
          .then(canvas => {
            const imgData = canvas.toDataURL('image/png')
            this.$emit('getCanvas', imgData)
          })
      },
      remove() {
        this.$emit('remove', this.elementData.id)
      },
      setChartType(value) {
        this.elementData.chartType = Util.chartType(value)
      },
      redrawChart() {
        if (this.elementData.chartType !== 6) {
          this.$refs.chart.getChart().reflow()
        }
      },
      resolveExecution(res) {
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
      catchExecution(error) {
        this.loading = false
        this.progress = 0
        this.catchExecutionError(error)
      },
      executeElement() {
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
      executeQuery() {
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
      catchExecutionError(error) {
        // console.log(error)
        if (error.response.data.message) {
          const msg = error.response.data.message
            .replace('com.facebook.presto.sql.parser.ParsingException: ', '')
            .replace('java.sql.SQLException: ', '')
          this.$swal('Execution Error', msg, 'error')
        } else {
          this.$swal('Execution Error', 'Unknown error!', 'error')
        }
      },
      checkExecution(queryId) {
        HTTP.get('bi/analyze/progress/' + queryId, {})
          .then((res) => {
            // console.log(res.data)
            this.progress = res.data.percentage
            if (res.status === 200 && res.data.percentage < 100) {
              setTimeout(
                () => {
                  this.checkExecution(queryId)
                }, 1000)
            } else {
              this.executeElement()
            }
          })
      }
    },
    created() {
      if (this.$socket && this.$socket.readyState === this.$socket.OPEN) {
        this.isWSEnabled = true
        this.$options.sockets.onmessage = res => {
          // console.log(res)
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
