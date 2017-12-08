<template>
  <div class="row">
    <popup
      @newFilterItem="newFilterItem"
      :isVisible="popupSeen" />
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
      <v-tab
        v-for="(report, reportIdx) in reports"
        :key="report.id"
        :title="report.title"
        style="position: relative;"
        :style="{zIndex:report.id}">
          <div class="tabChores" style="margin: 0 0 20px 19px;font-size: 20px;font-weight: bold;">
            <input class="col-xs-4" style="border: none; background-color: #f1f1f1" type="input" v-model="report.title">
          </div>
          <div class="col-xs-7 form-group selected-report-options">
            <div
              v-for="filterDefinition in filterDefinitionsList[reportIdx]"
              :key="filterDefinition.name"
              class="form-group col-sm-3">
                <label style="font-size: 12px;margin-bottom: 0;"> {{filterDefinition.label}} </label>
                <datepicker v-model="filtersList[reportIdx][filterDefinition.name]"></datepicker>
            </div>
            <div
              class="form-group col-sm-1">
                <label style="margin-bottom: 3px;">&nbsp;</label>
                <button
                  @click="showPopup"
                  class="btn--add">
                  <i class="icon-plus"></i>
                </button>
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
            <grid-item v-for="(item, elementIdx) in layoutList[reportIdx]" :key="item.i"
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
  import Vue from 'vue'
  import Report from '@/components/Report'
  import ReportElement from '@/components/ReportElement'
  import AddButton from '@/components/AddButton'
  import Popup from '@/components/Popup'
  import {HTTP} from '@/helpers/http-helper.js'
  import VueGridLayout from 'vue-grid-layout'
  import {VueTabs, VTab} from 'vue-nav-tabs'
  import 'vue-nav-tabs/themes/vue-tabs.css'
  import Datepicker from 'vuejs-datepicker'

  export default{
    name: 'dashboard',
    components: {Report, ReportElement, VueTabs, VTab, 'grid-layout': VueGridLayout.GridLayout, 'grid-item': VueGridLayout.GridItem, Datepicker, AddButton, Popup},
    data: function () {
      return {
        selectedReportIdx: 0,
        reports: [],
        gridItems: [],
        layoutList: [],
        popupSeen: false,
        newFilterData: null,
        filterDefinitionsList: [],
        filtersList: []
      }
    },
    computed: {},
    methods: {
      newFilterItem: function (filter) {
        this.filterDefinitionsList[this.selectedReportIdx].push(filter)
        console.log(this.filterDefinitionsList[this.selectedReportIdx])
      },
      showPopup: function () {
        this.popupSeen = !this.popupSeen
      },
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
            var reports = res.data
            reports.forEach((report) => {
              var filterDefinitions = report.filterDefinitions
              var filters = {}
              filterDefinitions.forEach(filterDefinition => {
                filters[filterDefinition.name] = filterDefinition.defaultValue
              })
              this.filtersList.push(filters)
              this.filterDefinitionsList.push(filterDefinitions)
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
            this.reports = reports
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
        this.reports[this.selectedReportIdx].filterDefinitions = this.filterDefinitionsList[this.selectedReportIdx]
        HTTP.post('bi/report', this.reports[this.selectedReportIdx])
          .then((res) => {
            console.log(res.data)
            Vue.set('reports', this.selectedReportIdx, res.data)
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
.vue-grid-layout > div {
  background:#fff;
  box-shadow: 1px 2px 4px 0 rgba(0, 0, 0, 0.12);
  border:none !important;
  position: relative
}

.vdp-datepicker input {
  background: #fff;
  padding: .6em 1em;
  border: 0;
  box-shadow: 1px 1px 2px 0 rgba(0, 0, 0, 0.15);
  margin-top: 6px;
  border-radius: 3px;
  color: rgba(0, 0, 0, 0.7);
  cursor: pointer;
  font-size: 13px;
  width: 100%;
}

.vdp-datepicker::after {
  content: '';
  display: block;
  width: 5px;
  height: 5px;
  position: absolute;
  right: 10px;
  bottom: 10px;
  border: 5px solid transparent;
  border-top-color:#5b64fc
}

.vue-grid-item {
  box-shadow: 1px 2px 4px 0 rgba(0, 0, 0, 0.12)!important;
  border-radius: 2px
}

.selected-report-options {
  width: 65%;
}

.vdp-datepicker__calendar {
  right: 0;
  left: auto
}

</style>
