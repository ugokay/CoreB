<template>
  <div>
    <element-popup ref="elementPopup" @addElement="addExistingElement"/>
    <div class="btn--add has-multiple is-fixed">
      <a @click.prevent="addElement"><i class="icon-plus" /> Add</a>
      <a @click.prevent="selectElement">Select</a>
    </div>
    <div class="row mt20">
      <div class="tabChores col-xs-3">
        <input style="border: none; background-color: #f1f1f1" type="input" v-model="reportData.title">
      </div>
      <div class="col-xs-8 form-group selected-report-options">
        <div
          v-for="filterDefinition in filterDefinitions"
          :key="filterDefinition.name"
          v-if="!filterDefinition.static"
          class="form-group col-sm-3">
          <label style="font-size: 12px;margin-bottom: 0;display: block">{{filterDefinition.label}}</label>
          <report-filter :definition="filterDefinition" :filters="filters"></report-filter>
        </div>
        <div
          class="form-group col-sm-1">
          <label style="font-size: 12px;margin-bottom: 0;display:block">&nbsp;</label>
          <button
            class="btn--add is-gray no-shadow"
            @click="refresh">
            <icon name="refresh"></icon>
          </button>
        </div>
      </div>
    </div>
    <grid-layout
      id="grid"
      v-if="isSelected && filtersLoaded"
      :layout="layout"
      :col-num="12"
      :row-height="30"
      :is-draggable="editable"
      :is-resizable="editable"
      :margin="[10, 10]"
      :vertical-compact="false"
      :use-css-transforms="true">
      <grid-item v-for="(item, elementIdx) in layout" :key="item.i"
                 :x="item.x"
                 :y="item.y"
                 :w="item.w"
                 :h="item.h"
                 :i="item.i"
                 @resized="resizeEnd(elementIdx)"
                 @resize="resize(elementIdx)">
        <report-element ref="reportElements" :element="getElement(item.id)" :filters="filters" @remove="removeElement"></report-element>
      </grid-item>
    </grid-layout>
  </div>
</template>
<script>
  import ReportElement from '@/components/ReportElement'
  import VueGridLayout from 'vue-grid-layout'
  import AddButton from '@/components/AddButton'
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
      Icon
    },
    data () {
      return {
        reportData: this.report,
        reportIdx: this.index,
        layout: [],
        popupSeen: false,
        filters: {},
        filtersLoaded: false,
        filterDefinitions: [],
        globalFilterDefinitions: []
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
      refresh: function () {
        this.$refs.reportElements.forEach(reportElement => {
          reportElement.executeQuery()
        })
      },
      calculateFilterDefinitions: function () {
        let queries = []
        this.reportData.elements.forEach(element => {
          queries.push(element.query)
        })
        let filterTokens = Util.getUnifiedMustacheTokens(queries)
        if (filterTokens.length > 0) {
          this.filterDefinitions = Util.calculateFilterDefinitions(filterTokens, this.globalFilterDefinitions)
        }
        this.filterDefinitions.forEach(filterDefinition => {
          if (filterDefinition.static) {
            this.filters[filterDefinition.name] = filterDefinition.defaultValue
          }
        })
      },
      removeElement: function (id) {
        console.log(id)
        for (let i = 0; i < this.reportData.elements.length; i++) {
          console.log(this.reportData.elements[i].id)
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
        this.filtersLoaded = true
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
  margin: 20px;
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
