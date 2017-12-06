<template>
  <div class="row">
    <add-button />
    <ul class="dash-actions col-xs-2 pull-right">
      <li> Fullscreen</li>
      <!--<li> Edit Layout</li>-->
      <li> Toggle Slide</li>
      <li><i class="icon-refresh"></i><span>Refresh</span></li>
      <li><i class="icon-export"></i><span>Export</span></li>
      <li @click="saveReport"><i class="icon-export"></i><span>Save</span></li>
    </ul>
    <vue-tabs @tab-change="tabChange">
      <v-tab v-for="(report, reportIdx) in reports" :key="report.id" :title="report.title" style="position: relative;"  :style="{zIndex:report.id}">
        <div class="tabChores" style="margin: 0 0 20px 19px;font-size: 20px;font-weight: bold;">
          <input class="col-xs-4" style="border: none; background-color: #f1f1f1" type="input" v-model="report.title">
        </div>
        <div class="col-xs-6 form-group selected-report-options">
          <div v-for="filterDefinition in report.filterDefinitions" class="form-group col-sm-3">
            <label style="font-size: 12px;margin-bottom: 0;"> {{filterDefinition.label}} </label>
            <datepicker v-model="report.filters[filterDefinition.name]"></datepicker>
          </div>
        </div>
        <br>
        <br>
        <br>
        <br>
        <grid-layout
          v-if="selectedReportIdx === reportIdx"
          :layout="layoutList[reportIdx]"
          :col-num="12"
          :row-height="30"
          :is-draggable="true"
          :is-resizable="true"
          :margin="[10, 10]"
          :vertical-compact="false"
          :use-css-transforms="true">
          <grid-item v-for="(item, elementIdx) in layoutList[reportIdx]" :key="item.i" style="border: 1px solid"
             :x="item.x"
             :y="item.y"
             :w="item.w"
             :h="item.h"
             :i="item.i"
             @resized="resizeEnd(elementIdx)"
             @resize="resize(elementIdx)">
            <report-element :element="getElement(report, item.id)" ref="reportElement"/>
          </grid-item>
        </grid-layout>
      </v-tab>
    </vue-tabs>
  </div>
</template>

<script>
  import Report from '@/components/Report'
  import ReportElement from '@/components/ReportElement'
  import AddButton from '@/components/AddButton'
  import {HTTP} from '@/helpers/http-helper.js'
  import VueGridLayout from 'vue-grid-layout'
  import {VueTabs, VTab} from 'vue-nav-tabs'
  import 'vue-nav-tabs/themes/vue-tabs.css'
  import Datepicker from 'vuejs-datepicker'
  import {MOCK_FILTER_DEFINITIONS} from '@/helpers/helpers.js'

  export default{
    name: 'dashboard',
    components: { Report, ReportElement, VueTabs, VTab, 'grid-layout': VueGridLayout.GridLayout, 'grid-item': VueGridLayout.GridItem, Datepicker, AddButton},
    data: function () {
      return {
        selectedReportIdx: 0,
        reports: [],
        gridItems: [],
        layoutList: []
      }
    }, 
    methods: {
      tabChange: function (tabIdx) {
        this.selectedReportIdx = tabIdx
      },
      getElement: function (report, id) {
        for (var i = 0; i < report.elements.length; i++) {
          if (report.elements[i].id === id) {
            return report.elements[i]
          }
        }
      },
      getReports: function () {
        HTTP.get('bi/report/list')
          .then((res) => {
            this.reports = res.data
            this.reports.forEach((report) => {
              //MOCK
              report.filterDefinitions = MOCK_FILTER_DEFINITIONS.get()
              //MOCK END
              report.filters = {}
              report.filterDefinitions.forEach(filterDefinition => {
                report.filters[filterDefinition.name] = filterDefinition.defaultValue
              })
              if (report.layout) {
                this.layoutList.push(JSON.parse(report.layout))
              } else {
                var layout = []
                report.elements.sort((el1, el2) => el1.id > el2.id ? -1 : el1.id < el2.id ? 1 : 0).forEach(element => {
                  layout.push({
                    id: element.id,
                    x: element.left,
                    y: element.top,
                    w: element.width,
                    h: element.height,
                    i: element.id.toString()
                  })
                })
                this.layoutList.push(layout)
              }
            })
          })
          .catch((error) => {
            console.log(error)
          })
      },
      resize: function (idx) {
        this.$refs.reportElement[idx].redrawChart()
      },
      resizeEnd: function (idx) {
        setTimeout(() => {
          this.$refs.reportElement[idx].redrawChart()
        }, 0)
      },
      saveReport: function () {
        this.reports[this.selectedReportIdx].layout = JSON.stringify(this.layoutList[this.selectedReportIdx])
        HTTP.post('bi/report', this.reports[this.selectedReportIdx])
          .then((res) => {
            console.log(res)
          })
      },
      removeTab (index) {
        this.tabs.splice(index, 1)
      },
      addTab () {
        this.tabs.push('New Tab')
      }
    },
    created: function () {
      this.getReports()
    }
  }
</script>

<style>
.highcharts {
  position: absolute;
  width: 100%;
  height: 85%;
  top:15%;
}
.vue-grid-layout > div { background:#fff;box-shadow: 1px 2px 4px 0 rgba(0, 0, 0, 0.12);border:none !important; }
</style>
