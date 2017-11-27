<template>
  <div>
    <div>{{element.title}}</div>
    <highcharts :options="options"></highcharts>
  </div>
</template>
<script>
  import Vue from 'vue'
  import VueHighcharts from 'vue-highcharts'

  Vue.use(VueHighcharts)

  export default{
    name: 'report-element',
    props: {
      element: {
        type: Object
      }
    },
    data: function () {
      return {
        chartOptions: {}
      }
    },
    created: function () {
      // Execute report element
    }
  }
</script>
<style></style>
