<template>
<span>
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
  <vue-tabs>
        <v-tab v-for="(report, idx) in reports" :key="report.id" :title="report.title">
          <button @click="saveReport(idx)">Save</button>
          <grid-layout
            :layout="layoutList[idx]"
            :col-num="12"
            :row-height="30"
            :is-draggable="true"
            :is-resizable="true"
            :margin="[10, 10]"
            :vertical-compact="false"
            :use-css-transforms="true">
                <grid-item v-for="(item, idx) in layoutList[idx]" :key="item.i" style="border: 1px solid"
                           :x="item.x"
                           :y="item.y"
                           :w="item.w"
                           :h="item.h"
                           :i="item.i">
                    {{item.i}}
                </grid-item>
          </grid-layout>
        </v-tab>
      </vue-tabs>
</span>

</template>
<script>
  import Report from '@/components/Report'
  import {HTTP} from '@/helpers/http-helper.js'
  import VueGridLayout from 'vue-grid-layout'
  import {VueTabs, VTab} from 'vue-nav-tabs'
  import 'vue-nav-tabs/themes/vue-tabs.css'

  export default{
    name: 'dashboard',
    components: {Report, VueTabs, VTab, 'grid-layout': VueGridLayout.GridLayout, 'grid-item': VueGridLayout.GridItem},
    data: function () {
      return {
        selectedReportIdx: 0,
        reports: [],
        gridItems: [],
        layoutList: []
      }
    },
    methods: {
      getReports: function () {
        HTTP.get('bi/report/list').then((res) => {
          this.reports = res.data
          this.reports.forEach((report) => {
            if (report.layout) {
              this.layoutList.push(JSON.parse(report.layout))
            } else {
              var layout = []
              report.elements.forEach((element) => {
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
      },
      saveReport: function (idx) {
        this.reports[idx].layout = JSON.stringify(this.layoutList[idx])
        HTTP.post('bi/report', this.reports[idx])
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
.navbar {    background-color: #3a3c46;    border-radius: 0 0 0 0;    position: relative;
    min-height: 50px;margin-bottom: 20px;border: 1px solid transparent;}

.navbar .nav-head { padding: 12px 15px}

aside { height:100vh}
.navbar .nav-head .logo{max-width: 70%;}
.admin-settings .menu-toggler {     background: none;    border: 0}
.admin-settings {    height: 50px;    padding: 16px 20px;    color: #fff; }
.tab-headers { border-bottom:1px solid #ddd; height:40px; background:#fff; box-shadow : 1px 1px 2px 0 rgba(0, 0, 0, 0.12)}
.editor-panel {     height: 100vh;    overflow-y: scroll;    overflow-x: hidden;    padding: 0;}

.vue-tabs .nav-pills > li.active > a, .vue-tabs .nav-pills > li.active > a:hover, .vue-tabs .nav-pills > li.active > a:focus,
.nav-pills li.tab a:hover,
.nav-pills li.tab a.active_tab {  border-radius:0px;  box-shadow: inset 0 3px 0 0 #5b64fc;    background: #f5f5f5;    color: #5b64fc;}



.vue-tabs .nav-pills > li + li { margin-left:0}

.nav-pills li.tab a {     margin-right: 0;    line-height: inherit;    border: none;    border-radius: 0 0 0 0 !important;
    font-size: 13px;    color: #000;    line-height: 1.42857143; position: relative;    display: block;    padding: 10px 15px;}
</style>
