<template>
  <div class="dashboard">
    <div class="dash-actions-wrapper is-in-tab-area ">
      <ul class="dash-actions hidden-xs">
        <li @click="addReport">
          <span class="icon"><icon name="plus"></icon></span>
          <span class="text">Add Report</span>
        </li>
        <li @click="toggleEditable">
          <span class="icon">
            <icon name="pencil-square-o" v-if="!editable"></icon>
            <icon name="eye" v-else></icon>
          </span>
          <span class="text"> {{editable ? 'View' : 'Edit'}} Mode</span>
        </li>
        <li @click="toggleFullscreen">
          <span class="icon"><icon name="expand"></icon></span>
          <span class="text">Fullscreen</span>
        </li>
        <li @click="toggleSlide">
          <span class="icon">
            <icon name="play" v-if="!isSliding"></icon>
            <icon name="pause" v-else></icon>
          </span>
          <span class="text"> {{isSliding ? 'Stop' : 'Start'}} Slide</span>
        </li>
        <li>
          <span class="icon"><icon name="upload"></icon></span>
          <span class="text"><i class="icon-export"></i><span>Export</span></span>
        </li>
        <li @click="saveReport">
          <span class="icon"><icon name="floppy-o"></icon></span>
          <span class="text"><i class="icon-export"></i><span>Save</span></span>
        </li>
      </ul>
    </div>
     <fullscreen ref="fullscreen" :fullscreen.sync="fullscreen">
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
  import {HTTP} from '@/helpers/http-helper.js'
  import Report from '@/components/Report'
  import ReportElement from '@/components/ReportElement'
  import VueGridLayout from 'vue-grid-layout'
  import Icon from 'vue-awesome/components/Icon'
  import { arrows, expand, play, upload, floppyO, plus, eye, pause, pencilSquareO } from 'vue-awesome/icons'
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
      Icon,
      'grid-layout': VueGridLayout.GridLayout,
      'grid-item': VueGridLayout.GridItem
    },
    data: function () {
      return {
        globalFilterDefinitions: [],
        selectedReportIdx: 0,
        reports: [],
        fullscreen: false,
        isSliding: false,
        editable: false
      }
    },
    methods: {
      refresh: function () {
        this.$refs.reports[this.selectedReportIdx].refresh()
      },
      tabChange: function (tabIdx) {
        this.selectedReportIdx = tabIdx
        this.$refs.tabs.$el.childNodes[0].classList.remove('is-open')
      },
      toggleEditable: function () {
        this.editable = !this.editable
        this.$refs.reports.forEach(report => report.toggleEditMode())
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
      addReport: function () {
        this.reports.push({
          title: 'Untitled',
          elements: []
        })
      },
      saveReport: function () {
        this.$refs.reports[this.selectedReportIdx].save()
      },
      removeTab (index) {
        this.tabs.splice(index, 1)
      },
      addTab () {
        this.tabs.push('New Tab')
      },
      toggleFullscreen: function () {
        this.$refs['fullscreen'].toggle()
      },
      toggleSlide: function () {
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
    created: function () {
      HTTP.get('bi/report/filter/list').then(res => {
        this.globalFilterDefinitions = res.data
        this.getReports()
        if (this.$route.hash) {
          const tabIdx = parseInt(this.$route.hash.split('#')[1])
          this.tabChange(tabIdx)
        }
      })
    }
  }
</script>
