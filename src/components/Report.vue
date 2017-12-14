<template>
  <div>
    <popup ref="filterPopup" @addFilter="addFilter"></popup>
    <add-button></add-button>
    <button @click="test">Test</button>
    <div class="tabChores">
      <input class="col-xs-4" style="border: none; background-color: #f1f1f1" type="input" v-model="reportData.title">
    </div>
    <div class="col-xs-7 form-group selected-report-options">
      <div
        v-for="filterDefinition in report.elements"
        :key="filterDefinition.name"
        class="form-group col-sm-3">
        <label style="font-size: 12px;margin-bottom: 0;">
          {{filterDefinition.label}}
          <i @click="openEditFilterPopup(filterDefinition)">Edit</i> -
          <i @click="deleteFilter(idx)">Remove</i>
        </label>
        <!--<datepicker v-model="filters[filterDefinition.name]"></datepicker>-->
        <report-filter ref="filters" :definition="filterDefinition" :filters="filters"></report-filter>
      </div>
      <div class="form-group col-sm-1">
        <label class="filterDefinitionLabel">&nbsp;</label>
        <button
          @click="openNewFilterPopup"
          class="btn--add">
          <i class="icon-plus"></i>
        </button>
      </div>
    </div>
    <grid-layout
      v-if="isSelected"
      :layout="layout"
      :col-num="12"
      :row-height="30"
      :is-draggable="true"
      :is-resizable="true"
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
        <report-element ref="reportElements" :element="getElement(item.id)" :filters="filters"></report-element>
      </grid-item>
    </grid-layout>
  </div>
</template>
<script>
  import ReportElement from '@/components/ReportElement'
  import VueGridLayout from 'vue-grid-layout'
  import AddButton from '@/components/AddButton'
  import Popup from '@/components/FilterPopup'
  import {HTTP} from '@/helpers/http-helper.js'
  import ReportFilter from '@/components/ReportFilter'
  import Mustache from 'mustache'

  export default {
    name: 'report',
    components: {
      ReportFilter,
      ReportElement,
      AddButton,
      Popup,
      'grid-layout': VueGridLayout.GridLayout,
      'grid-item': VueGridLayout.GridItem
    },
    data () {
      return {
        reportData: this.report,
        reportIdx: this.index,
        layout: [],
        popupSeen: false,
        filters: {}
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
      }
    },
    computed: {
      filterDefinitions: {
        get: function () {
          const unifiedTokens = []
          this.reportData.elements.forEach(element => {
            const tokens = Mustache.parse(element.query)
            tokens.forEach(token => {
              const type = token[0]
              const value = token[1]
              if (type === 'name' && !unifiedTokens.includes(value)) {
                unifiedTokens.push(value)
              }
            })
          })
          let filterDefinitions = []
          unifiedTokens.forEach(filterToken => {
            let filterDefinition
            /* this.reportData.reportElements.forEach(fd => {
              if (fd.name === filterToken) {
                filterDefinition = fd
              }
            }) */
            if (!filterDefinition) {
              filterDefinition = {
                name: filterToken,
                label: filterToken,
                type: '',
                defaultValue: ''
              }
            }
            filterDefinitions.push(filterDefinition)
          })
          return filterDefinitions
        },
        set: function (newVal) {
          console.log(newVal)
        }
      }
    },
    methods: {
      test: function () {
        HTTP.post('bi/report/filter', {
          name: 'test',
          label: 'Test',
          type: 'text',
          defaultValue: 'test text',
          global: true
        }).then(res => {
          console.log(res.data)
          HTTP.get('bi/report/filter/list').then(res => {
            console.log(res.data)
          })
        })
      },
      getFilterDefinition: function (name) {
        for (let filterDefinition of this.reportData.reportElements) {
          if (filterDefinition.name === name) {
            return filterDefinition
          }
        }
        return {
          name: name,
          label: '',
          type: '',
          defaultValue: ''
        }
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
      },
      openNewFilterPopup: function () {
        this.$refs.filterPopup.open()
      },
      openEditFilterPopup: function (filter) {
        this.$refs.filterPopup.open(filter)
      },
      addFilter: function (filter) {
        this.reportData.reportElements.push(filter)
      },
      deleteFilter: function (name) {
        this.reportData.reportElements.splice(name, 1)
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
    }
  }
</script>

<style>
.vue-grid-layout {
  top: 90px
}
.tabChores {
  margin: 0 0 20px 19px;
  font-size: 20px;
  font-weight: bold;
}
.label.label-primary {
  cursor: pointer
}
.filterDefinitionLabel {
  font-size: 12px;
  margin-bottom: 0;
  display: block
}
</style>
