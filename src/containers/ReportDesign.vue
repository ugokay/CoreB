<template>
  <div v-hotkey="keymap" class="row report--design">
    <filter-popup
      @updateFilter="updateFilter"
      ref="filterPopup" />
    <div class="nav-tabs-navigation">
      <div class="nav-tabs-wrapper">
        <ul class="nav nav-tabs pull-left">
            <li>
              <span class="button-holder title title_center">
                <router-link to="/">Back to Dashboard</router-link>
              </span>
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
      <div class="form-group selected-report-options row mb-0">
        <div
          v-for="filterDefinition in filterDefinitions"
          v-if="!filterDefinition.static"
          class="form-group col-sm-3 col-lg-2">
          <label class="filterDefinitionLabel">
            {{filterDefinition.label}}
            <span
              class="label label-default"
              @click="openFilterPopup(filterDefinition)">
              Edit
            </span>
          </label>
          <report-filter :definition="filterDefinition" :filters="filters"></report-filter>
        </div>
      </div>
      <div class="clearfix"></div>

      <report-element
        v-if="filtersLoaded"
        ref="reportElement"
        :element="element"
        :filters="filters">
      </report-element>

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
  import {HTTP} from '@/helpers/http-helper'
  import FilterPopup from '@/components/FilterPopup'
  import Report from '../components/Report'
  import ReportElement from '../components/ReportElement'
  import ReportFilter from '../components/ReportFilter'
  import {Util} from '@/helpers/helpers'
  import Editor from 'ace-vue2'
  import 'brace/mode/javascript'
  import 'brace/mode/sql'
  import 'brace/mode/html'
  import 'brace/theme/monokai'

  export default {
    components: { ReportElement, Editor, Report, ReportFilter, FilterPopup },
    name: 'report-design',
    data: function () {
      return {
        element: null,
        globalFilterDefinitions: [],
        filterDefinitions: [],
        filters: {},
        filtersLoaded: false,
        showHtml: false,
        seenQuery: true,
        tableSeen: false,
        queryResult: null,
        htmlContent: '<html>',
        sqlContent: 'sql',
        editorOptions: {
          fontSize: '11pt'
        }
      }
    },
    computed: {
      keymap () {
        return {
          // 'esc+ctrl' is OK.
          'ctrl+shift+s': this.save
        }
      }
    },
    methods: {
      updateFilter: function (filterDefinition) {
        HTTP.post('bi/report/filter', filterDefinition)
          .then(res => {
            this.$swal('Success!', 'Filter has been updated successfully!', 'success')
          })
      },
      openFilterPopup: function (filterDefinition) {
        this.$refs.filterPopup.open(filterDefinition)
      },
      calculateFilterDefinitions: function () {
        let filterTokens = Util.getUnifiedMustacheTokens([this.element.query])
        if (filterTokens.length > 0) {
          this.filterDefinitions = Util.calculateFilterDefinitions(filterTokens, this.globalFilterDefinitions)
          /* this.filterDefinitions.forEach(filterDefinition => {
            if (!this.filters[filterDefinition.name]) {
              this.filters.push(filterDefinition.defaultValue)
            }
          }) */
        }
      },
      save: function () {
        HTTP.post('/bi/report/element', this.element)
          .then(res => {
            console.log('Element Saved ' + this.element.id)
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
          HTTP.get('bi/report/filter/list').then(res => {
            this.globalFilterDefinitions = res.data
            this.globalFilterDefinitions.forEach(filterDef => {
              if (filterDef.static) {
                this.filters[filterDef.name] = filterDef.defaultValue
              }
            })
            this.calculateFilterDefinitions()
            this.filtersLoaded = true
          })
        })
    }
  }
</script>
