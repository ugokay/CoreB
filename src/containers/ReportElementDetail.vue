<template>
  <div class="row">
    <div class="nav-tabs-navigation">
      <div class="nav-tabs-wrapper">
        <ul class="nav nav-tabs pull-left ">
            <li>
              <span  class="button-holder title title_center">
                <a href="../../">Back to Dashboard</a></span>
            </li>
          </ul>
          <ul class="top-related-actions pull-right" style="position:absolute; top:0; right:0">
            <li @click="handleTabs('html')"> <i class="icon-query"></i> HTML</li>
            <li @click="handleTabs('query')"> <i class="icon-query"></i> Query</li>
            <li> <i  class="icon-refresh"></i> Refresh</li>
            <li> <i  class="icon-export"></i> Export</li>
            <li> <i  class="icon-export"></i> Save</li>
          </ul>
        </div>
    </div>
    <div v-show="showHtml">
      <editor
        lang="html"
        theme="monokai"
        :options="editorOptions"
        :content="htmlContent">
      </editor>
      <div class="col-xs-12 action--area">
        <span style="height:40px; width:30px; background:#24262c"> </span>
        <span class="action--btn"> RUN <i class="icon-arrow-right" style="color:#ffffff"> </i></span>
       </div>
    </div>
    <div v-show="seenQuery">
      <editor
        lang="sql"
        theme="monokai"
        :options="editorOptions"
        :content="sqlContent">
      </editor>
      <div class="col-xs-12 action--area">
        <span style="height:40px; width:30px; background:#24262c"></span>
        <span class="action--btn">RENDER <i class="icon-arrow-right" style="color:#ffffff"> </i></span>
       </div>
    </div>

    <!-- <report
      ref="reports"
      :report="queryResult">
    </report> -->

    <table class="table" v-if="queryResult.schema"  v-on:click="tableSeen = !tableSeen">
      <thead>
        <th v-for="field in queryResult.schema.fields">{{field.name}}</th>
        <th style="text-align: right;    position: relative;    padding-right: 20px;">
          <i class="icon-query-hide"></i>
        </th>
      </thead>
      <tbody>
        <tr v-for="row in queryResult.data">
          <td v-for="value in row">{{value}}</td>
        </tr>
      </tbody>
    </table>

  </div>
</template>
<script>
  import {HTTP} from '@/helpers/http-helper.js'
  import Report from '../components/Report'
  import ReportElement from '../components/ReportElement'
  import {DUMMY_FILTER} from '@/helpers/helpers.js'
  import editor from 'ace-vue2'
  import 'brace/mode/javascript'
  import 'brace/mode/sql'
  import 'brace/mode/html'
  import 'brace/theme/monokai'
  // let code = this.$children[0].getValue();

  export default {
    components: { ReportElement, editor, Report },
    name: 'report-element-detail',
    data: function () {
      return {
        showHtml: false,
        seenQuery: false,
        tableSeen: false,
        queryResult: {},
        htmlContent: '<html>',
        sqlContent: 'sql',
        editorOptions: {
          fontSize: '14pt'
        }
      }
    },
    methods: {
      handleTabs (type) {
        if (type === 'html') {
          this.seenQuery = false
          this.showHtml = true
        } else if (type === 'query') {
          this.showHtml = false
          this.seenQuery = true
        }
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

      HTTP.get('bi/report/list', {
        params: {
          filterParamsJson: JSON.stringify(DUMMY_FILTER.get())
        }
      }).then((res) => {
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].elements.filter(item => item.id === this.$route.params.id)
        }
      })
    }
  }
</script>
<style>

thead th { vertical-align: bottom; background: #d3d3d3 !important; border-bottom: 2px solid #ddd; font-size:10px; padding: 8px;}
span.button-holder, .fixed-top-bar ul li span {
    font-size: 13px;
    font-weight: 500;
    text-align: left;
    list-style: none;
    float: left;
    padding: 11px 18px 13px 18px;
    cursor: pointer;
}

.action--area {
  background:#33353e; height:40px
}

.action--btn {
  color:#fff; font-size:13px; margin-top:12px; display:block
}
.top-related-actions li  { list-style: none;
    float: left;
    padding: 11px 18px 13px 18px;
    cursor: pointer;
}
.is-hidden { display:none }
</style>
