<template>
  <div class="row dashboard">
      <ul class="dash-actions col-xs-2 pull-right">
        <li @click="toggle"> Fullscreen</li>
        <!-- <li> Edit Layout</li> -->
        <li> Toggle Slide</li>
        <li><a @click.prevent="refresh"><i class="icon-refresh"></i><span>Refresh</span></a></li>
        <li><i class="icon-export"></i><span>Export</span></li>
        <li @click="saveReport"><i class="icon-export"></i><span>Save</span></li>
      </ul>
     <fullscreen ref="fullscreen" :fullscreen.sync="fullscreen">
        <vue-tabs @tab-change="tabChange" id="tabs">
          <v-tab
            v-for="(report, reportIdx) in reports"
            :key="report.id"
            :title="report.title"
            style="position: relative;"
            :style="{zIndex:report.id}">
              <report
                ref="reports"
                :report="report"
                :index="reportIdx"
                :isSelected="selectedReportIdx === reportIdx">
              </report>
            </v-tab>
          </vue-tabs>
      </fullscreen>
  </div>
</template>

<script>
  import {HTTP} from '@/helpers/http-helper.js'
  import Report from '@/components/Report'
  import ReportElement from '@/components/ReportElement'
  import VueGridLayout from 'vue-grid-layout'
  import {VueTabs, VTab} from 'vue-nav-tabs'
  import 'vue-nav-tabs/themes/vue-tabs.css'

  import fullscreen from 'vue-fullscreen'
  import Vue from 'vue'
  Vue.use(fullscreen)

  export default {
    name: 'dashboard',
    components: {
      Report,
      ReportElement,
      VueTabs,
      VTab,
      'grid-layout': VueGridLayout.GridLayout,
      'grid-item': VueGridLayout.GridItem
    },
    data: function () {
      return {
        selectedReportIdx: 0,
        reports: [],
        fullscreen: false
      }
    },
    methods: {
      refresh: function () {
        this.$refs.reports[this.selectedReportIdx].refresh()
      },
      tabChange: function (tabIdx) {
        this.selectedReportIdx = tabIdx
      },
      getReports: function () {
        HTTP.get('bi/report/list')
          .then((res) => {
            this.reports = res.data
          })
          .catch((error) => {
            console.log(error)
          })
      },
      saveReport: function () {
        this.$refs.reports[this.selectedReportIdx].save()
      },
      goInFullscreen () {
        this.$el.parentNode.requestFullscreen()
      },
      removeTab (index) {
        this.tabs.splice(index, 1)
      },
      addTab () {
        this.tabs.push('New Tab')
      },
      toggle: function () {
        this.$refs['fullscreen'].toggle()
      },
    },
    created: function () {
      this.getReports()
    }
  }
</script>
