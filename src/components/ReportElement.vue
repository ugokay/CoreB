<template>
  <div class="full-height is-relative">
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
    <div class="report-element-wrapper">
      <div class="col-sm-12 report__element">
        <div class="report-element--header">
          <input
            v-if="isEditing"
            type="input"
            style="padding: 0 10px 0"
            class="report-element--title no-border"
            v-model="element.title"/>
          <router-link
            v-else
            :to="designLink"
            class="report--element-title element-title btn-block">
            {{element.title}}
          </router-link>
          <div class="btn-group btn-group-xs align-right no-padding toggleTriggerBox hidden-xs">
            <template v-if="isEditing">
              <a class="dropdown-toggle"
                v-click-outside="hideDropdown"
                @click="openDropdown"
                data-toggle="dropdown">
                <i class="icon-more"></i>
              </a>
              <ul :class="isVisible">
                <li v-if="!isDesignMode"><a>Save</a></li>
                <li v-if="!isDesignMode"><a @click.prevent="executeQuery">Execute</a></li>
                <li v-if="!isDesignMode"><router-link :to="designLink">Design</router-link></li>
                <li v-if="!isDesignMode" class="divider"></li>
                <li><a @click.prevent="setChartType('table')">Table</a></li>
                <li><a @click.prevent="setChartType('line')">Line Chart</a></li>
                <li><a @click.prevent="setChartType('column')">Bar Chart</a></li>
                <li><a @click.prevent="setChartType('bar')">Bar Chart (Horizontal)</a></li>
                <li><a @click.prevent="setChartType('pie')">Pie Chart</a></li>
                <li><a @click.prevent="setChartType('custom')">Custom Html</a></li>
                <li class="divider" v-if="!isDesignMode"></li>
                <li v-if="!isDesignMode"><a @click.prevent="remove">Remove</a></li>
                <li class="divider" v-if="!isDesignMode"></li>
                <li><a @click.prevent="editChart">Edit Chart</a></li>
                <li><a @click.prevent="saveAsPng">Save as Png</a></li>
                <li>
                  <excel-button
                    class="excel-btn"
                    :data="excelData"
                    :fields="excelFields"
                    name="filename.xls">
                    Download Excel
                  </excel-button>
                </li>
              </ul>
            </template>
          </div>
        </div>
      </div>
      <div class="full-height" ref="elementWrapper" v-if="queryResult.schema">
        <div class="full-height" v-if="element.chartType === 6">
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
  </div>
</template>

<script>
  import { CHART } from '@/helpers/chart-helper.js'
  import { HTTP } from '@/helpers/http-helper.js'
  import { Util } from '@/helpers/helpers.js'
  import VueHighcharts from 'vue2-highcharts'
  import Mustache from 'mustache'
  import ClickOutside from 'vue-click-outside'
  import JsonExcel from 'vue-json-excel'
  import html2canvas from 'html2canvas'

  export default{
    name: 'report-element',
    components: { VueHighcharts, 'excel-button': JsonExcel },
    data() {
      return {
        clickedDropDown: false,
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
              this._chartColors = ['pink', 'navy', 'tomato']
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
      hideDropdown() {
        this.clickedDropDown = false
      },
      openDropdown() {
        this.clickedDropDown = true
        document.querySelectorAll('.vue-grid-item').forEach(item => { item.style.zIndex = '1' })
        this.$el.parentNode.style.zIndex = '10'
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
    directives: {
      ClickOutside
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
