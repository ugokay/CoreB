<template>
  <div>
    <div class="col-sm-12 report__element">
      <div class="row">
        <input type="input"  class="no-border col-xs-9" v-model="element.title"/>
        <div  class="col-xs-3 btn-group btn-group-xs align-right no-padding toggleTriggerBox">
          <a
            class="dropdown-toggle"
            v-click-outside="hideDropdown"
            @click="openDropdown"
            data-toggle="dropdown">
            <i class="icon-more"></i>
          </a>
          <ul :class="isVisible" @click="handleDropdown">
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
    <div v-if="loading">
      <div class="progress-bar" v-bind:style="{width: progress + '%'}" v-if="progress > 0">{{progress}}</div>
      <div class="loader">Loading...</div>
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
  import { CHART } from '@/helpers/chart-helper.js'
  import { HTTP } from '@/helpers/http-helper.js'
  import {DUMMY_FILTER} from '@/helpers/helpers.js'
  import VueHighcharts from 'vue2-highcharts'
  import Mustache from 'mustache'
  import ClickOutside from 'vue-click-outside'

  export default{
    name: 'report-element',
    components: { VueHighcharts },
    props: {
      element: { type: Object, default: function () { return {} }}
    },
    data: function () {
      return {
        clickedDropDown: false,
        queryResult: {},
        loading: false,
        progress: 0
      }
    },
    computed: {
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
      hideDropdown: function() {
        this.clickedDropDown = false
      },
      openDropdown: function (e) {
        document.querySelectorAll('.vue-grid-item').forEach(el => el.style.zIndex = "1")
        e.path[6].style.zIndex = '999999'
        this.clickedDropDown = true
      },
      handleDropdown: function() {
        this.clickedDropDown = !this.clickedDropDown
      },
      redrawChart: function () {
        if (this.element.chartType !== 6) {
          this.$refs.chart.getChart().reflow()
        }
      },
      execute: function () {
        this.loading = true
        HTTP.get('bi/analyze/execute/report-element/' + this.element.id, {
          params: {
            filterParamsJson: JSON.stringify(DUMMY_FILTER.get())
          }
        }).then((res) => {
          if (res.status === 202) {
            // console.log(res.data)
            this.checkExecution(res.data.queryId)
          } else {
            this.loading = false
            this.progress = 0
            this.queryResult = res.data
          }
        }).catch(() => {
          this.loading = false
          this.progress = 0
        })
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
              this.execute()
            }
          })
      }
    },
    directives: {
      ClickOutside
    },
    created: function () {
      this.execute()
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

.selected-report-options {
  position: relative;
  z-index: 999999999;
}

  .loader,
.loader:before,
.loader:after {
  border-radius: 50%;
  width: 2.5em;
  height: 2.5em;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  -webkit-animation: load7 1.8s infinite ease-in-out;
  animation: load7 1.8s infinite ease-in-out;
}
.loader {
  color: #000040;
  font-size: 10px;
  margin: 80px auto;
  position: relative;
  text-indent: -9999em;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}
.loader:before,
.loader:after {
  content: '';
  position: absolute;
  top: 0;
}
.loader:before {
  left: -3.5em;
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}
.loader:after {
  left: 3.5em;
}
@-webkit-keyframes load7 {
  0%,
  80%,
  100% {
    box-shadow: 0 2.5em 0 -1.3em;
  }
  40% {
    box-shadow: 0 2.5em 0 0;
  }
}
@keyframes load7 {
  0%,
  80%,
  100% {
    box-shadow: 0 2.5em 0 -1.3em;
  }
  40% {
    box-shadow: 0 2.5em 0 0;
  }
}
</style>
