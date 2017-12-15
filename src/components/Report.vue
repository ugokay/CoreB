<template>
  <div>
    <add-button></add-button>
    <div class="tabChores">
      <input class="col-xs-4" style="border: none; background-color: #f1f1f1" type="input" v-model="reportData.title">
    </div>
    <div class="col-xs-9 form-group selected-report-options">
      <div
        v-for="filterDefinition in filterDefinitions"
        :key="filterDefinition.name"
        class="form-group col-sm-3">
        <label style="font-size: 12px;margin-bottom: 0;">{{filterDefinition.label}}</label>
        <report-filter :definition="filterDefinition" :filters="filters"></report-filter>
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
  import {HTTP} from '@/helpers/http-helper.js'
  import {Util} from '@/helpers/helpers.js'
  import ReportFilter from '@/components/ReportFilter'

  export default {
    name: 'report',
    components: {
      ReportFilter,
      ReportElement,
      AddButton,
      'grid-layout': VueGridLayout.GridLayout,
      'grid-item': VueGridLayout.GridItem
    },
    data () {
      return {
        reportData: this.report,
        reportIdx: this.index,
        layout: [],
        popupSeen: false,
        filters: {},
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
      }
    },
    computed: {
    },
    methods: {
      calculateFilterDefinitions: function () {
        let queries = []
        this.reportData.elements.forEach(element => {
          queries.push(element.query)
        })
        let filterTokens = Util.getUnifiedMustacheTokens(queries)
        if (filterTokens.length > 0) {
          this.filterDefinitions = Util.calculateFilterDefinitions(filterTokens, this.globalFilterDefinitions)
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
