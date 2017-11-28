<template>
  <div class="row">
    <div class="nav-tabs-navigation">
      <div class="nav-tabs-wrapper">
        <ul class="nav nav-tabs pull-left ">
            <li>
              <span class="button-holder title title_center">Back to Dashboard</span></a>
            </li>
          </ul>

            <ul  class="top-related-actions pull-right" style="position:absolute; top:0; right:0">
              <li> <i  class="icon-query"></i> Query</li>
              <li> <i  class="icon-refresh"></i> Refresh</li>
              <li> <i  class="icon-export"></i> Export</li>
              <li> <i  class="icon-export"></i> Save</li>
            </ul>
        </div>
      </div>

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
span.button-holder, .fixed-top-bar ul li span {
    font-size: 13px;
    font-weight: 500;
    text-align: left;
        list-style: none;
    float: left;
    padding: 11px 18px 13px 18px;
    cursor: pointer;
}

.top-related-actions li  { list-style: none;
    float: left;
    padding: 11px 18px 13px 18px;
    cursor: pointer;}
</style>
