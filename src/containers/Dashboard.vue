<template>
  <div>
    <button @click="getReports">Get Reports</button>
    <report v-for="report in reports" :key="report.id" :report="report"/>
  </div>
</template>
<script>
  import Report from '@/components/Report'
  import {HTTP} from '../helpers/http-helper.js'
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

</style>
