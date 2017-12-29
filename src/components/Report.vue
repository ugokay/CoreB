<template>
  <div>
    <!-- outer elements -->
    <element-popup ref="elementPopup" @addElement="addExistingElement"/>
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
          @remove="removeElement">
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
  import {HTTP} from '@/helpers/http-helper.js'
  import {Util} from '@/helpers/helpers.js'
  import ReportFilter from '@/components/ReportFilter'
  import ElementPopup from '@/components/popups/ElementPopup'
  import Icon from 'vue-awesome/components/Icon'
  import { refresh } from 'vue-awesome/icons'

  export default {
    name: 'report',
    components: {
      ReportFilter,
      ReportElement,
      AddButton,
      'grid-layout': VueGridLayout.GridLayout,
      'grid-item': VueGridLayout.GridItem,
      ElementPopup,
      Icon,
      FilterSidebar
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
        globalFilterDefinitions: [],
        isEditing: false,
        filterValues: []
      }
    },
    props: {
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
      filtersChange: function (newFilterValues) {
        this.filterValues = newFilterValues
      },
      toggleEditMode: function() {
        this.isEditing = !this.isEditing
      },
      refresh: function () {
        this.$refs.reportElements.forEach(reportElement => reportElement.executeQuery())
      },
      calculateFilterDefinitions: function () {
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
      removeElement: function (id) {
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
      addExistingElement: function (newElement) {
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
      selectElement: function () {
        this.$refs.elementPopup.open()
      },
      addElement: function () {
        HTTP.post('bi/report/element', {
          title: 'Untitled',
          filterDefinitions: [],
          query: 'SELECT COUNT(*) FROM events'
        }).then(res => {
          const newElement = res.data
          console.log(newElement)
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
      getElement: function (id) {
        for (let i = 0; i < this.reportData.elements.length; i++) {
          if (this.reportData.elements[i].id === id) {
            return this.reportData.elements[i]
          }
        }
      },
      save: function () {
        this.reportData.layout = JSON.stringify(this.layout)
        HTTP.post('bi/report', this.reportData)
          .then((res) => {
            this.reportData = res.data
          })
          .then(() => this.$swal('Success!', 'Changes has been saved!', 'success'))
      },
      resize: function (idx) {
        this.$refs.reportElements[idx].redrawChart()
      },
      resizeEnd: function (idx) {
        setTimeout(() => {
          this.$refs.reportElements[idx].redrawChart()
        }, 0)
        setTimeout(() => {
          this.$refs.reportElements[idx].redrawChart()
        }, 0)
      }
    },
    created: function () {
      this.layout = JSON.parse(this.reportData.layout)
      HTTP.get('bi/report/filter/list').then(res => {
        this.globalFilterDefinitions = res.data
        this.calculateFilterDefinitions()
      })
    }
  }
</script>

<style>
.vue-grid-layout {
  margin-left: 20px
}
.mt20 {
  margin-top: 20px;
}
.tabChores {
  padding: 20px 0 20px 40px;
  font-size: 20px;
  font-weight: bold;
}
.label.label-primary {
  cursor: pointer
}
.filterDefinitionLabel {
  font-size: 12px;
  margin-bottom: 0;
  display: block;
  margin-top: 20px;
}
</style>
