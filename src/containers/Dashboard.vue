<template>
<span>
  <aside class="navbar navbar-bundle col-xs-12 col-md-2 col-lg-2">
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
        <!-- <li><i class="icon-export"></i><span>Export</span></li> -->
        <li ><i class="icon-export"></i><span>Save</span></li>
      </ul>


      <section role="tabpanel" class="tab-container" style="">
          <div class="row reports-area">
            <div style="margin: 0 0 20px 19px;font-size: 20px;font-weight: bold;">
              <input class="col-xs-4 ng-pristine ng-valid ng-touched"  style="border: none; background-color: #f1f1f1" value="Segmentation">
              <div class="col-xs-6 form-group selected-report-options">
            
                <div class="form-group  col-sm-3">
                  <label> LEYBIL </label>
                  <input class="form-control" type="text" value="20.05.05">
                </div>
              </div>
          </div>


<!-- <div id="dashboard-reports" style="height: 1000px; left:0px !important; top:150px;"></div> -->



          </div>
        </section>
    </div>
  </div>
</span>
<!--   
  <div>
    <button @click="getReports">Get Reports</button>
    <report v-for="report in reports" :key="report.id" :report="report"/>
  </div> -->



</template>
<script>
  import Report from '@/components/Report'
  import {HTTP} from '@/helpers/http-helper.js'
  import {VueTabs, VTab} from 'vue-nav-tabs'
  import 'vue-nav-tabs/themes/vue-tabs.css'

  export default{
    name: 'dashboard',
    components: {Report, VueTabs, VTab},
    data: function () {
      return {
        reports: [],
        tabs: ['First tab', 'Second tab', 'Third tab']

      }
    },

    methods: {
      getReports: function () {
        HTTP.get('bi/report/list').then((res) => {
          this.reports = res.data
        })
      },
      removeTab (index) {
        this.tabs.splice(index, 1)
      },
      addTab () {
        this.tabs.push('New Tab')
      }
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

.nav-pills li.tab a {     margin-right: 0;    line-height: auto;    border: none;    border-radius: 0 0 0 0 !important;
    font-size: 13px;    color: #000;    line-height: 1.42857143; position: relative;    display: block;    padding: 10px 15px;}
</style>
