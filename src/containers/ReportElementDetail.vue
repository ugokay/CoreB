<template>
  <div>
    <table class="table" v-if="queryResult.schema">
      <thead>
        <th v-for="field in queryResult.schema.fields">{{field.name}}</th>
      </thead>
      <tbody>
        <tr v-for="row in queryResult.data">
          <td v-for="value in row">{{value}}</td>
        </tr>
      </tbody>
    </table>
    <report-element v-if="queryResult" :queryResult="queryResult"/>
  </div>
</template>
<script>
  import {HTTP} from '@/helpers/http-helper.js'
  import ReportElement from '../components/ReportElement'

  export default{
    components: {ReportElement},
    name: 'report-element-detail',
    data: function () {
      return {
        queryResult: {}
      }
    },
    created: function () {
      const dayInMillis = 1000 * 60 * 60 * 24
      const today = new Date()
      today.setHours(3)
      today.setMinutes(0)
      today.setSeconds(0)
      today.setMilliseconds(0)
      const tomorrow = new Date(today.getTime() + dayInMillis)
      const cTomorrow = new Date(today.getTime())
      const cToday = new Date(today.getTime() - (tomorrow.getTime() - today.getTime()))
      var filters = {
        'cDateRange_start': cToday,
        'cDateRange_end': cTomorrow,
        'dateRange_start': today,
        'dateRange_end': tomorrow,
        'dateFormat': '%Y-%m-%dT%H:%i:%s.%fZ'
      }

      var id = this.$route.params.id
      HTTP.get('bi/analyze/execute/report-element/' + id, {
        params: {
          filterParamsJson: JSON.stringify(filters)
        }
      })
        .then((res) => {
          this.queryResult = res.data
        })
    }
  }
</script>
<style>

</style>
