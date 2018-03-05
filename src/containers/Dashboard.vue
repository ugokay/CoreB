<template>
  <div class="dashboard">
    <fullscreen ref="fullscreen" :fullscreen.sync="fullscreen">
      <v-toolbar flat="flat" color="white">
        <v-menu transition="slide-y-transition" bottom="bottom" class="report-title-dropdown">
          <v-btn icon="icon" slot="activator" style="position: relative">
            <v-icon>menu</v-icon>
            <span class="blinking" v-if="isBlinking"></span>
          </v-btn>
          <v-list>
            <v-list-tile v-for="(report, idx) in reports" :key="report.id" @click="viewReport(idx)">
              <v-list-tile-title>{{ report.title }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <v-toolbar-title>{{ reportTitle }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-tooltip bottom="bottom">
          <v-btn icon="icon" slot="activator" @click="addReport">
            <v-icon color="blue-grey darken-3">playlist_add</v-icon>
          </v-btn><span>Add Report</span>
        </v-tooltip>
        <v-tooltip bottom="bottom">
          <v-btn icon="icon" slot="activator" @click="toggleEditable">
            <v-icon color="blue-grey darken-3" v-if="!editable">format_shapes</v-icon>
            <v-icon color="blue-grey darken-3" v-else>remove_red_eye</v-icon>
          </v-btn><span>{{editable ? 'View' : 'Edit'}}</span>
        </v-tooltip>
        <v-tooltip bottom="bottom">
          <v-btn icon="icon" slot="activator" @click="toggleFullscreen">
            <v-icon color="blue-grey darken-3">fullscreen</v-icon>
          </v-btn><span>Fullscreen</span>
        </v-tooltip>
        <v-tooltip bottom="bottom">
          <v-btn icon="icon" slot="activator" @click="toggleSlide">
            <v-icon color="blue-grey darken-3" v-if="!isSliding">play_arrow</v-icon>
            <v-icon color="blue-grey darken-3" v-else>pause</v-icon>
          </v-btn><span>{{ isSliding ? 'Stop' : 'Start' }} Slide</span>
        </v-tooltip>
        <v-tooltip bottom="bottom">
          <v-btn icon="icon" slot="activator" @click="exportReportAsPng">
            <v-icon color="blue-grey darken-3">file_upload</v-icon>
          </v-btn><span>Export</span>
        </v-tooltip>
        <v-tooltip bottom="bottom">
          <v-btn icon="icon" slot="activator" @click="saveReport">
            <v-icon color="blue-grey darken-3">save</v-icon>
          </v-btn><span>Save Report</span>
        </v-tooltip>
      </v-toolbar>
      <vue-tabs @tab-change="tabChange" id="tabs" ref="tabs">
        <v-tab
          v-for="(report, reportIdx) in reports"
          :key="report.id"
          :title="report.title"
          style="position: relative;"
          :style="{zIndex:report.id}">
            <report
              ref="reports"
              :editable="editable"
              :report="report"
              :globalFilterDefinitions="globalFilterDefinitions"
              :index="reportIdx"
              :isSelected="selectedReportIdx === reportIdx">
            </report>
          </v-tab>
        </vue-tabs>
    </fullscreen>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Report from '@/components/Report'
  import ReportElement from '@/components/ReportElement'
  import VueGridLayout from 'vue-grid-layout'
  import Icon from 'vue-awesome/components/Icon'
  import { VueTabs, VTab } from 'vue-nav-tabs'
  import fullscreen from 'vue-fullscreen'
  import { HTTP } from '@/helpers/http-helper.js'
  import { arrows, expand, play, upload, floppyO, plus, eye, pause, pencilSquareO } from 'vue-awesome/icons'
  import 'vue-nav-tabs/themes/vue-tabs.css'

  Vue.use(fullscreen)

  export default {
    name: 'dashboard',
    components: {
      Report,
      ReportElement,
      VueTabs,
      VTab,
      Icon,
      'grid-layout': VueGridLayout.GridLayout,
      'grid-item': VueGridLayout.GridItem
    },
    data() {
      return {
        globalFilterDefinitions: [],
        selectedReportIdx: 0,
        reports: [],
        fullscreen: false,
        isSliding: false,
        editable: false,
        isBlinking: false
      }
    },
    methods: {
      viewReport(id) {
        this.$router.push('/#' + id)
      },
      exportReportAsPng: function() {
        this.$refs.reports[this.selectedReportIdx].exportReportAsPng()
      },
      refresh() {
        this.$refs.reports[this.selectedReportIdx].refresh()
      },
      tabChange(tabIdx) {
        this.selectedReportIdx = tabIdx
        this.$refs.tabs.$el.childNodes[0].classList.remove('is-open')
        setTimeout(() => window.location.hash = '#/#' + tabIdx, 200)
      },
      toggleEditable() {
        this.editable = !this.editable
        this.$refs.reports.forEach(report => report.toggleEditMode())
      },
      getReports(initialTabIdx) {

        HTTP.get('bi/report/list')
          .then((res) => {
            this.reports = res.data
            setTimeout(() => this.$refs.tabs.navigateToTab(initialTabIdx), 0)
          })
          .catch((error) => {
            console.log(error)
          })
      },
      addReport() {
        this.isBlinking = true 
        setTimeout(() => {
          this.isBlinking = false
        }, 2000)
        this.reports.push({
          title: 'Untitled',
          elements: []
        })
      },
      saveReport() {
        this.$refs.reports[this.selectedReportIdx].save()
      },
      removeTab (index) {
        this.tabs.splice(index, 1)
      },
      addTab () {
        this.tabs.push('New Tab')
      },
      toggleFullscreen() {
        this.$refs['fullscreen'].toggle()
      },
      toggleSlide() {
        if (!this.isSliding) {
          this.isSliding = true
          const self = this
          const changeTab = function (tabIdx) {
            if (self.isSliding) {
              self.$refs.tabs.navigateToTab(tabIdx)
              let nextTabIdx = tabIdx + 1
              if (nextTabIdx >= self.reports.length) {
                nextTabIdx = 0
              }
              setTimeout(function () {
                changeTab(nextTabIdx)
              }, 10000)
            }
          }
          changeTab(0)
        } else {
          this.isSliding = false
        }
      }
    },
    computed: {
      reportTitle() {
        return this.reports[this.selectedReportIdx].title
      }
    },
    created() {
      HTTP.get('bi/report/filter/list')
        .then(res => {
          this.globalFilterDefinitions = res.data
        })
      if (this.$route.hash) {
        const hashIdx = this.$route.hash.split('#')[1]
        this.getReports(Number(hashIdx))
      } else {
        this.getReports(0)
      }
    },
    watch: {
      $route (to, from){
        const id = to.hash.split('#')[1]
        this.getReports(Number(id))
      }
    } 
  }
</script>
