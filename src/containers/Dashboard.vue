<template>
<div class="row">
 <!-- <aside class="navbar navbar-bundle col-xs-12 col-md-2 col-lg-2">
    <div class="row">
        <div class="nav-head flex flex-space-between flex-middle">
          <a class="logo" href="/">
              <img src="assets/logo.svg" alt="Corebi Logo">
            </a>
            <a class="btn-menu" href="javascript:void(0);">
              <i  class="icon-hamburger"></i>
            </a>
        </div>


        <div class="admin-settings">
          <i class="icon-settings"></i>
          <span class="text-holder">
            Admin </span>
          <button class="menu-toggler pull-right"><i class="icon-tri-left"></i> </button>
        </div>

      </div>
  </aside>
  <div class="editor-panel content col-xs-12 col-md-10 col-lg-10">
    <div class="tab-headers">
      <vue-tabs type="pills">
        <v-tab v-for="tab in tabs" :key="tab">
          <div slot="title">{{tab}} <span @click.stop="removeTab(index)" class="ti-close tab-close">x</span></div>
          {{tab}}
        </v-tab>
        <v-tab>
          <div slot="title" @click="addTab"><i class="icon-plus" style="color: #5b64fc;"></i></div>
        </v-tab>
      </vue-tabs>
      <ul class="dash-actions col-xs-2 pull-right">
        <li> Fullscreen</li>
        <li> Edit Layout</li>
        <li> Toggle Slide</li>


        <li><i class="icon-refresh"></i><span>Refresh</span></li>
        &lt;!&ndash; <li><i class="icon-export"></i><span>Export</span></li> &ndash;&gt;
        <li ><i class="icon-export"></i><span>Save</span></li>
      </ul>
    </div>
  </div>-->
        <ul class="dash-actions col-xs-2 pull-right">
        <li> Fullscreen</li>
        <li> Edit Layout</li>
        <li> Toggle Slide</li>
        <li><i class="icon-refresh"></i><span>Refresh</span></li>
        <li><i class="icon-export"></i><span>Export</span></li>
        <li @click="saveReport"><i class="icon-export"></i><span>Save</span></li>
      </ul>


      <vue-tabs @tab-change="tabChange">
        <v-tab v-for="(report, reportIdx) in reports" :key="report.id" :title="report.title" style="position: relative;"  :style="{zIndex:report.id}">
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
  import {HTTP} from '@/helpers/http-helper.js'
  import VueGridLayout from 'vue-grid-layout'
  import {VueTabs, VTab} from 'vue-nav-tabs'
  import 'vue-nav-tabs/themes/vue-tabs.css'

  export default{
    name: 'dashboard',
    components: {Report, ReportElement, VueTabs, VTab, 'grid-layout': VueGridLayout.GridLayout, 'grid-item': VueGridLayout.GridItem},
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
              if (report.layout) {
                this.layoutList.push(JSON.parse(report.layout))
              } else {
                var layout = []
                report.elements.sort((el1, el2) => el1.id > el2.id ? -1 : el1.id < el2.id ? 1 : 0).forEach((element) => {
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
    height: 100%;}
</style>
