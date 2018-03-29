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
            <v-list-tile v-for="report in reports" :key="report.id" @click="loadReport(report.id)">
              <v-list-tile-title>{{ report.title }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <v-toolbar-title v-if="report"><input class="report-title" type="text" v-model="report.title"></v-toolbar-title>
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
          <v-btn icon="icon" slot="activator" @click="refresh">
            <v-icon color="blue-grey darken-3">refresh</v-icon>
          </v-btn><span>Refresh</span>
        </v-tooltip>
        <v-tooltip bottom="bottom">
          <v-btn icon="icon" slot="activator" @click="saveReport">
            <v-icon color="blue-grey darken-3">save</v-icon>
          </v-btn><span>Save Report</span>
        </v-tooltip>
      </v-toolbar>
      <report
        v-if="report"
        ref="report"
        :editable="editable"
        :report="report"
        :globalFilterDefinitions="globalFilterDefinitions">
      </report>
      <div v-else>
        No Report
      </div>
    </fullscreen>

    <v-dialog v-model="isAddReportDialogOpen" max-width="500px">
      <v-card>
        <v-card-title>
          Add Report
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newReportName"
            label="Report Name"
            value="Untitled"
          ></v-text-field>
          <v-btn color="primary" dark @click.stop="createReport">Create</v-btn>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" flat @click.stop="isAddReportDialogOpen=false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
        selectedReportId: null,
        reports: [],
        reportIds: [],
        report: null,
        routeReportId: 0,
        fullscreen: false,
        isSliding: false,
        editable: false,
        isBlinking: false,
        isAddReportDialogOpen: false,
        newReportName: null,
      }
    },
    methods: {
      viewReport(id) {
        this.$router.push('/#' + id)
      },
      exportReportAsPng: function() {
        this.$refs.report.exportReportAsPng()
      },
      refresh() {
        this.$refs.report.refresh()
      },
      tabChange(tabIdx) {
        console.log(tabIdx)
        //this.selectedReportId = tabIdx
        //this.$refs.tabs.$el.childNodes[0].classList.remove('is-open')
        //setTimeout(() => window.location.hash = '#/#' + tabIdx, 200)
      },
      toggleEditable() {
        this.editable = !this.editable
      },
      getReports(initialTabIdx) {
        HTTP.get('bi/report/list')
          .then((res) => {
            this.reports = res.data
            // setTimeout(() => this.$refs.tabs.navigateToTab(initialTabIdx), 0)
          })
          .catch((error) => {
            console.log(error)
          })
      },
      loadReportIds() {
        HTTP.get('bi/report/list')
          .then((res) => {
            this.reports = res.data
            this.reports.forEach(report => this.reportIds.push({id: report.id, title: report.title}))
            if (this.reportIds.includes(reportId => reportId.id === this.routeReportId)) {
              this.loadReport(this.routeReportId)
            } else if (this.reportIds.length > 0){
              this.loadReport(this.reportIds[0].id)
            }
          })
          .catch((error) => {
            console.log(error)
          })
      },
      gotoReport: function (reportId) {
        this.$router.push('/' + reportId)
      },
      loadReport: function (reportId) {
        HTTP.get('bi/report/'+reportId).then(res => {
          this.report = res.data
        })
      },
      addReport() {
        this.isAddReportDialogOpen = true
      },
      createReport: function () {
        HTTP.post('bi/report', {id: null, title: this.newReportName, elements: [], layout: '[]'})
          .then((res) => {
            this.reports.push(res.data)
          })
          .then(() => {
            this.$swal('Success!', 'Changes has been saved!', 'success')
            this.isAddReportDialogOpen = false
          })
      },
      saveReport() {
        this.$refs.report.save()
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
      selectedReportIdx: function () {
        console.log(this.selectedReportId)
        console.log(this.reports.findIndex(report => report.id === this.selectedReportId))
        return this.reports.findIndex(report => report.id === this.selectedReportId)
      },
      reportTitle() {
        if (this.reports) {
          return this.reports[this.selectedReportIdx].title
        }
        return 'Loading...'
      }
    },
    created() {
      HTTP.get('bi/report/filter/list')
        .then(res => {
          this.globalFilterDefinitions = res.data
          if (this.$route.params.reportId) {
            this.routeReportId = this.$route.params.reportId
          }
          this.loadReportIds()
        })
    },
    watch: {
      $route (to, from){
        const id = to.hash.split('#')[1]
        this.getReports(Number(id))
      }
    }
  }
</script>
