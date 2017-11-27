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
  export default{
    name: 'dashboard',
    components: {Report},
    data: function () {
      return {
        reports: []
      }
    },
    methods: {
      getReports: function () {
        HTTP.get('bi/report/list').then((res) => {
          this.reports = res.data
        })
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
</style>
