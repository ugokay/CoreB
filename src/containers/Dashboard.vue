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
  import Report from '@/components/Report'
  import ReportElement from '@/components/ReportElement'
  import VueGridLayout from 'vue-grid-layout'
  import {VueTabs, VTab} from 'vue-nav-tabs'
  import 'vue-nav-tabs/themes/vue-tabs.css'

  export default{
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
          })
          .catch((error) => {
            console.log(error)
          })
      },
      saveReport: function () {
        this.$refs.reports[this.selectedReportIdx].save()
      },
      goInFullscreen (element) {
        window.requestFullscreen()
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
  border-radius: 2px;
}

.selected-report-options {
  width: 65%;
}

.vdp-datepicker__calendar {
  right: 0;
  left: auto
}

</style>
