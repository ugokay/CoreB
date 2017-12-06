<template>
  <div>
    <report-element
      v-for="element in report.elements"
      :key="element.id"
      :element="element"/>
  </div>
</template>
<script>
  import ReportElement from '@/components/ReportElement'
  export default {
    name: 'report',
    components: { ReportElement },
    props: {
      report: {
        type: Object,
        default: []
      }
    },
    created: function () {}
  }
</script>
<style>

</style>
