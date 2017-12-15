<template>
  <div class="row">
    <ul class="dash-actions col-xs-2 pull-right">
      <li @click="goInFullscreen"> Fullscreen</li>
      <!-- <li> Edit Layout</li> -->
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
          <report
            ref="reports"
            :report="report"
            :index="reportIdx"
            :isSelected="selectedReportIdx === reportIdx">
          </report>
        </v-tab>
      </vue-tabs>
  </div>
</template>

<script>
  import {HTTP} from '@/helpers/http-helper.js'
  import {Util} from '@/helpers/helpers.js'
  import Report from '@/components/Report'
  import ReportElement from '@/components/ReportElement'
  import VueGridLayout from 'vue-grid-layout'
  import {VueTabs, VTab} from 'vue-nav-tabs'
  import 'vue-nav-tabs/themes/vue-tabs.css'

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
        reports: []
      }
    },
    methods: {
      tabChange: function (tabIdx) {
        this.selectedReportIdx = tabIdx
      },
      getReports: function () {
        HTTP.get('bi/report/list')
          .then((res) => {
            this.reports = res.data
            Util.getUnifiedMustacheTokens([this.element.query])
            HTTP.get('bi/report/filter/list').then(res => {
              this.globalFilterDefinitions = res.data
            })
          })
          .catch((error) => {
            console.log(error)
          })
      },
      saveReport: function () {
        this.$refs.reports[this.selectedReportIdx].save()
      },
      goInFullscreen () {},
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
