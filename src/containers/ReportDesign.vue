<template>
  <div class="row">
    <filter-popup @updateFilter="updateFilter" ref="filterPopup"/>
    <div class="nav-tabs-navigation">
      <div class="nav-tabs-wrapper">
        <ul class="nav nav-tabs pull-left ">
            <li>
              <span  class="button-holder title title_center">
                <router-link to="/">Back to Dashboard</router-link></span>
            </li>
          </ul>
          <ul class="top-related-actions pull-right" style="position:absolute; top:0; right:0">
            <li @click="handleTabs('html')"> <i class="icon-query"></i> HTML</li>
            <li @click="handleTabs('query')"> <i class="icon-query"></i> Query</li>
            <li> <i  class="icon-refresh"></i> Refresh</li>
            <li> <i  class="icon-export"></i> Export</li>
            <li> <a @click.prevent="save"><i  class="icon-export"></i> Save</a></li>
          </ul>
        </div>
    </div>
    <div v-if="element">
      <div v-show="showHtml">
        <editor
          lang="html"
          theme="monokai"
          :options="editorOptions"
          :content="element.html"
          @change="htmlChange">
        </editor>
      </div>
      <div v-show="seenQuery">
        <editor
          lang="sql"
          theme="monokai"
          :options="editorOptions"
          :content="element.query"
          @change="queryChange">
        </editor>
        <div class="col-xs-12 action--area">
          <span style="height:40px; width:30px; background:#24262c"></span>
          <span @click="run" class="action--btn">RUN <i class="icon-arrow-right" style="color:#ffffff"> </i></span>
         </div>
      </div>
      <div class="form-group selected-report-options">
        <div
          v-for="filterDefinition in filterDefinitions"
          class="form-group col-sm-3">
          <label style="font-size: 12px;margin-bottom: 0;">
            {{filterDefinition.label}}
            <i @click="openFilterPopup(filterDefinition)">Edit</i>
          </label>
          <report-filter :definition="filterDefinition" :filters="filters"></report-filter>
        </div>
      </div>
      <br><br>
      <report-element ref="reportElement" :element="element" :filters="filters"></report-element>

      <table class="table" v-if="queryResult"  v-on:click="tableSeen = !tableSeen">
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
  </div>
</template>
<script>
  import {HTTP} from '@/helpers/http-helper.js'
  import FilterPopup from '@/components/FilterPopup'
  import Report from '../components/Report'
  import ReportElement from '../components/ReportElement'
  import ReportFilter from '../components/ReportFilter'
  import {DUMMY_FILTER} from '@/helpers/helpers.js'
  import Editor from 'ace-vue2'
  import 'brace/mode/javascript'
  import 'brace/mode/sql'
  import 'brace/mode/html'
  import 'brace/theme/monokai'
  import Mustache from 'mustache'

  export default {
    components: { ReportElement, Editor, Report, ReportFilter, FilterPopup },
    name: 'report-design',
    data: function () {
      return {
        element: null,
        filterTokens: [],
        globalFilterDefinitions: [],
        filterDefinitions: [],
        filters: DUMMY_FILTER.get(),
        showHtml: false,
        seenQuery: true,
        tableSeen: false,
        queryResult: null,
        htmlContent: '<html>',
        sqlContent: 'sql',
        editorOptions: {
          fontSize: '14pt'
        }
      }
    },
    methods: {
      updateFilter: function (filterDefinition) {
        HTTP.post('bi/report/filter', filterDefinition)
          .then(res => {
            console.log(res.data)
          })
      },
      openFilterPopup: function (filterDefinition) {
        this.$refs.filterPopup.open(filterDefinition)
      },
      getFilterTokens: function () {
        const unifiedTokens = []
        try {
          const tokens = Mustache.parse(this.element.query)
          tokens.forEach(token => {
            const type = token[0]
            const value = token[1]
            if (type === 'name' && !unifiedTokens.includes(value)) {
              unifiedTokens.push(value)
            }
          })
          this.filterTokens = unifiedTokens
          return unifiedTokens
        } catch (e) {}
        return this.filterTokens
      },
      calculateFilterDefinitions: function () {
        let filterDefinitions = []
        let filterTokens = this.getFilterTokens()
        filterTokens.forEach(filterToken => {
          let found = false
          this.globalFilterDefinitions.forEach(globalFilterDefinition => {
            if (globalFilterDefinition.name === filterToken) {
              filterDefinitions.push(globalFilterDefinition)
              found = true
            }
          })
          if (!found) {
            filterDefinitions.push({
              type: '',
              name: filterToken,
              label: filterToken,
              defaultValue: '',
              global: false
            })
          }
        })
        this.filterDefinitions = filterDefinitions
      },
      save: function () {
        HTTP.post('/bi/report/element', this.element)
          .then(res => {
            console.log(res)
          })
      },
      run: function () {
        this.$refs.reportElement.executeQuery()
      },
      queryChange: function (newVal) {
        this.element.query = newVal
        this.calculateFilterDefinitions()
      },
      htmlChange: function (newVal) {
        this.element.html = newVal
      },
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
      HTTP.get('bi/report/element/' + this.$route.params.id)
        .then((res) => {
          this.element = res.data
          this.calculateFilterDefinitions()
        })
      HTTP.get('bi/report/filter/list').then(res => {
        this.globalFilterDefinitions = res.data
        this.calculateFilterDefinitions()
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