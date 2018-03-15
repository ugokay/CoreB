<template>
  <div v-hotkey="keymap" class="report--design">
    <!-- outer elements -->
    <image-popup ref="imagePopup" />
    <filter-popup  @updateFilter="updateFilter" ref="filterPopup" />
    <chart-helper-popup ref="chartPopup"  @chartEditingFinished="chartEditingFinished" />
    <!-- content -->
      <div class="nav-tabs-wrapper is-design-nav-wrapper">
        <v-toolbar flat="flat" color="white">
          <v-btn @click="goBack" flat>
            <v-icon>keyboard_arrow_left</v-icon>
            BACK
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn medium @click="handleTabs('html')" class="mr-0" color="blue-grey darken-1" dark :flat="!showHtml ? true : false">
            <v-icon class="mr-2">code</v-icon>
            HTML
          </v-btn>
          <v-btn medium @click="handleTabs('query')" class="mr-0" color="blue-grey darken-1" dark :flat="!seenQuery ? true : false">
            <v-icon class="mr-2">whatshot</v-icon>
            Query
          </v-btn>
          <v-btn medium class="mr-0" color="blue-grey darken-1" dark flat>
            <v-icon class="mr-2">refresh</v-icon>
            Refresh
          </v-btn>
          <v-btn medium class="mr-0" color="blue-grey darken-1" dark flat>
            <v-icon class="mr-2">import_export</v-icon>
            Export
          </v-btn>
          <v-btn medium @click.prevent="save" class="mr-0" color="blue-grey darken-1" dark flat>
            <v-icon class="mr-2">save</v-icon>
            Save
          </v-btn>
        </v-toolbar>
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
      <div class="report-element-details-wrapper">
        <report-filter-list
          v-if="globalFilterDefinitions && element"
          :filters="filters"
          :report="{elements: [element]}"
          :global-filter-definitions="globalFilterDefinitions"
          @loaded="filtersLoaded"></report-filter-list>

        <div class="clearfix"></div>
        <!-- report element -->
        <report-element
          v-if="isFiltersLoaded"
          ref="reportElement"
          :element="element"
          :filters="filters"
          :isDesignMode="true"
          @executed="executed"
          @editChart="editChart"
          @getCanvas="getCanvas" />
        <table class="table" v-if="queryResult"  v-on:click="tableSeen = !tableSeen">
          <thead>
            <th v-for="field in queryResult.schema.fields">{{field.name}}</th>
            <th style="text-align: right; position: relative; padding-right: 20px;">
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
  </div>
</template>

<script>
  import { HTTP } from '@/helpers/http-helper'
  import FilterPopup from '@/components/popups/FilterPopup'
  import Report from '@/components/Report'
  import ReportElement from '@/components/ReportElement'
  import ReportFilter from '@/components/ReportFilter'
  import ReportFilterList from '@/components/ReportFilterList'
  import ChartHelperPopup from '@/components/popups/ChartHelperPopup'
  import ImagePopup from '@/components/popups/ImagePopup'
  import {Util} from '@/helpers/helpers'
  import Editor from 'ace-vue2'
  import Icon from 'vue-awesome/components/Icon'
  import { chevronLeft } from 'vue-awesome/icons'
  import 'brace/mode/javascript'
  import 'brace/mode/sql'
  import 'brace/mode/html'
  import 'brace/theme/monokai'

  export default {
    components: { ReportFilterList, ReportElement, Editor, Report, ReportFilter, FilterPopup, Icon, ImagePopup, ChartHelperPopup  },
    name: 'report-design',
    data() {
      return {
        element: null,
        globalFilterDefinitions: null,
        filterDefinitions: [],
        filters: {},
        isFiltersLoaded: false,
        showHtml: JSON.parse(window.localStorage.getItem('UI_Options')).showHTML,
        seenQuery: JSON.parse(window.localStorage.getItem('UI_Options')).showQUERY,
        tableSeen: false,
        queryResult: null,
        htmlContent: '<html>',
        sqlContent: 'sql',
        editorOptions: {
          fontSize: '12pt'
        }
      }
    },
    computed: {
      keymap () {
        return {
          'ctrl+shift+s': this.save
        }
      }
    },
    methods: {
      filtersLoaded: function () {
        this.isFiltersLoaded = true
      },
      goBack() {
        this.$router.back()
      },
      chartEditingFinished(updates) {
        const { elementId } = updates
        this.$refs.reportElements.forEach(reportElement => {
          if (reportElement.elementData.id === elementId) {
            return reportElement.setUpdates(updates)
          } else {
            return false
          }
        })
      },
      editChart(chartOptions) {
        this.$refs.chartPopup.open(chartOptions)
      },
      getCanvas(canvas) {
        this.$refs.imagePopup.open(canvas)
      },
      executed: function (queryResult) {
        this.queryResult = queryResult
      },
      updateFilter: function (filterDefinition) {
        HTTP.post('bi/report/filter', filterDefinition)
          .then(res => {
            this.$swal('Success!', 'Filter has been updated successfully!', 'success')
          })
      },
      openFilterPopup: function (filterDefinition) {
        this.$refs.filterPopup.open(filterDefinition)
      },
      async save() {
        const response = await HTTP.post('/bi/report/element', this.element)
        console.log('Element Saved ' + this.element.id)
      },
      run() {
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
          this.showHtml = this.showHtml ? !this.showHtml : true
        } else if (type === 'query') {
          this.showHtml = false
          this.seenQuery = this.seenQuery ? !this.seenQuery : true
        }
        // save changes to localstorage
        if (window.localStorage.getItem('UI_Options')) {
          const tempStorage = JSON.parse(window.localStorage.getItem('UI_Options'))
          tempStorage.showHTML = this.showHtml
          tempStorage.showQUERY = this.seenQuery
          window.localStorage.setItem('UI_Options', JSON.stringify(tempStorage))
        } else {
          const uiOptions = {
            showHTML: this.showHtml,
            showQUERY: this.seenQuery
          }
          window.localStorage.setItem('UI_Options', JSON.stringify(uiOptions))
        }
      }
    },
    created() {
      HTTP.get('bi/report/element/' + this.$route.params.id)
        .then((res) => {
          this.element = res.data
          HTTP.get('bi/report/filter/list').then(fres => {
            this.globalFilterDefinitions = fres.data
          })
        })
    }
  }
</script>
