<template>
  <div ref="report">
    <!-- outer elements -->
    <element-popup
      ref="elementPopup"
      @addElement="addExistingElement" />
    <image-popup
      ref="imagePopup" />
    <chart-helper-popup
      ref="chartPopup"
      @chartEditingFinished="chartEditingFinished" />
    <div class="btn--add has-multiple is-fixed">
      <a @click.prevent="addElement"><i class="icon-plus" /> Add</a>
      <a @click.prevent="selectElement">Select</a>
    </div>
    <div v-if="filterDefinitions.length > 0">
      <filter-sidebar
        ref="filterSidebar"
        v-if="isFiltersLoaded"
        :filterDefinitions="filterDefinitions"
        :filters="filters"
        @apply="refresh"
        @change="filtersChange">
      </filter-sidebar>
    </div>
    <!-- #outer elements end -->
    <!-- report header -->
    <div class="report-header">
      <div class="title-area">
        <input v-if="isEditing" v-model="reportData.title">
        <p v-else v-html="reportData.title" />
      </div>
      <div class="filterValues">
        <div
          class="filterValue"
          v-for="filterValue in filterValues">
          <label class="label label-default">{{ filterValue.label }}</label>
          <span>{{ filterValue.value }}</span>
        </div>
      </div>
    </div>
    <grid-layout
      ref="gridLayout"
      id="grid"
      v-if="isSelected && isFiltersLoaded"
      :layout="layout"
      :col-num="12"
      :row-height="30"
      :is-draggable="editable"
      :is-resizable="editable"
      :margin="[10, 10]"
      :vertical-compact="false"
      :use-css-transforms="true">
      <grid-item
        v-for="(item, elementIdx) in layout"
        ref="gridItem"
        :key="item.i"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        @resized="resizeEnd(elementIdx)"
        @resize="resize(elementIdx)">
        <report-element
          ref="reportElements"
          :element="getElement(item.id)"
          :filters="filters"
          :isEditingMode="isEditing"
          @remove="removeElement"
          @getCanvas="getCanvas"
          @editChart="editChart">
        </report-element>
      </grid-item>
    </grid-layout>
  </div>
</template>
<script>
  import ReportElement from '@/components/ReportElement'
  import VueGridLayout from 'vue-grid-layout'
  import AddButton from '@/components/AddButton'
  import FilterSidebar from '@/components/FilterSidebar'
  import { HTTP } from '@/helpers/http-helper.js'
  import { Util } from '@/helpers/helpers.js'
  import { refresh } from 'vue-awesome/icons'
  import html2canvas from 'html2canvas'
  import ReportFilter from '@/components/ReportFilter'
  import ElementPopup from '@/components/popups/ElementPopup'
  import ImagePopup from '@/components/popups/ImagePopup'
  import ChartHelperPopup from '@/components/popups/ChartHelperPopup'
  import Icon from 'vue-awesome/components/Icon'

  export default {
    name: 'report',
    components: {
      ReportFilter,
      ReportElement,
      AddButton,
      'grid-layout': VueGridLayout.GridLayout,
      'grid-item': VueGridLayout.GridItem,
      ElementPopup,
      ImagePopup,
      Icon,
      FilterSidebar,
      ChartHelperPopup
    },
    data () {
      return {
        reportData: this.report,
        reportIdx: this.index,
        layout: [],
        popupSeen: false,
        npm : {},
        isFiltersLoaded: false,
        allFilters: false,
        filters: {},
        filterDefinitions: [],
        isEditing: false,
        filterValues: []
      }
    },
    props: {
      globalFilterDefinitions: {
        type: Array,
        required: true
      },
      report: {
        type: Object,
        required: true
      },
      index: {
        type: Number,
        required: false
      },
      isSelected: {
        type: Boolean,
        default: true
      },
      editable: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      exportReportAsPng(){
        html2canvas(this.$refs.report)
          .then(canvas => {
            const imgData = canvas.toDataURL('image/png')
            this.getCanvas(imgData)
          })
      },
      chartEditingFinished(updates) {
        const { elementId } = updates
        this.$refs.reportElements.forEach(reportElement => {
          if (reportElement.elementData.id === elementId) {
            reportElement.setUpdates(updates)
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
      filtersChange(newFilterValues) {
        this.filterValues = newFilterValues
      },
      toggleEditMode: function() {
        this.isEditing = !this.isEditing
      },
      refresh() {
        this.$refs.reportElements.forEach(reportElement => reportElement.executeQuery())
      },
      calculateFilterDefinitions() {
        let queries = []
        let filterDefinitions = []
        this.reportData.elements.forEach(element => {
          queries.push(element.query)
        })
        let filterTokens = Util.getUnifiedMustacheTokens(queries)
        if (filterTokens.length > 0) {
          filterDefinitions = Util.calculateFilterDefinitions(filterTokens, this.globalFilterDefinitions)
        }
        filterDefinitions.forEach(filterDefinition => {
          if (filterDefinition.static) {
            this.filters[filterDefinition.name] = filterDefinition.defaultValue
          }
        })
        this.filterDefinitions = filterDefinitions
        this.isFiltersLoaded = true
      },
      removeElement(id) {
        for (let i = 0; i < this.reportData.elements.length; i++) {
          if (this.reportData.elements[i].id === id) {
            this.reportData.elements.splice(i, 1)
            break
          }
        }
        for (let i = 0; i < this.layout.length; i++) {
          if (this.layout[i].id === id) {
            this.layout.splice(i, 1)
            break
          }
        }
      },
      addExistingElement(newElement) {
        let maxY = 0
        let maxI = 0
        this.layout.forEach(lay => {
          maxY = Math.max(maxY, lay.y)
          maxI = Math.max(maxI, lay.i)
        })
        this.layout.push({
          id: newElement.id, x: 0, y: maxY, w: 2, h: 6, i: (maxI + 1).toString()
        })
        this.reportData.elements.push(newElement)
        this.calculateFilterDefinitions()
      },
      selectElement() {
        this.$refs.elementPopup.open()
      },
      addElement() {
        HTTP.post('bi/report/element', {
          title: 'Untitled',
          filterDefinitions: [],
          query: 'SELECT COUNT(*) FROM events'
        }).then(res => {
          const newElement = res.data
          let maxY = 0
          let maxI = 0
          this.layout.forEach(lay => {
            maxY = Math.max(maxY, lay.y)
            maxI = Math.max(maxI, lay.i)
          })
          this.layout.push({
             id: newElement.id, x: 0, y: maxY, w: 2, h: 6, i: (maxI + 1).toString()
          })
          this.reportData.elements.push(newElement)
        })
      },
      getElement(id) {
        for (let i = 0; i < this.reportData.elements.length; i++) {
          if (this.reportData.elements[i].id === id) {
            return this.reportData.elements[i]
          }
        }
      },
      save() {
        this.reportData.layout = JSON.stringify(this.layout)
        HTTP.post('bi/report', this.reportData)
          .then((res) => {
            this.reportData = res.data
          })
          .then(() => this.$swal('Success!', 'Changes has been saved!', 'success'))
      },
      resize(idx) {
        this.$refs.reportElements[idx].redrawChart()
      },
      resizeEnd(idx) {
        setTimeout(() => {
          this.$refs.reportElements[idx].redrawChart()
        }, 0)
        setTimeout(() => {
          this.$refs.reportElements[idx].redrawChart()
        }, 0)
      }
    },
    created() {
      this.layout = JSON.parse(this.reportData.layout)
      this.calculateFilterDefinitions()
    }
  }
</script>
