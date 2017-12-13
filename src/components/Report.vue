<template>
  <div>
    <popup
      @addFilter="addFilter"
      @hidePopup="hidePopup"
      :isVisible="popupSeen">
    </popup>
    <add-button></add-button>
    <div class="tabChores">
      <input class="col-xs-4" style="border: none; background-color: #f1f1f1" type="input" v-model="reportData.title">
    </div>
    <div class="col-xs-7 form-group selected-report-options">
      <div
        v-for="filterDefinition in report.filterDefinitions"
        :key="filterDefinition.name"
        class="form-group col-sm-3">
        <label style="font-size: 12px;margin-bottom: 0;"> {{filterDefinition.label}} </label>
        <datepicker v-model="filters[filterDefinition.name]"></datepicker>
      </div>
      <div class="form-group col-sm-1">
        <label style="margin-bottom: 3px;">&nbsp;</label>
        <button
          @click="showPopup"
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
        <report-element :element="getElement(item.id)" ref="reportElement"></report-element>
      </grid-item>
    </grid-layout>
  </div>
</template>
<script>
  import ReportElement from '@/components/ReportElement'
  import VueGridLayout from 'vue-grid-layout'
  import AddButton from '@/components/AddButton'
  import Popup from '@/components/Popup'
  import Datepicker from 'vuejs-datepicker'
  import {HTTP} from '@/helpers/http-helper.js'

  export default {
    name: 'report',
    components: {
      ReportElement,
      AddButton,
      Popup,
      Datepicker,
      'grid-layout': VueGridLayout.GridLayout,
      'grid-item': VueGridLayout.GridItem
    },
    data() {
      return {
        reportData: this.report,
        reportIdx: this.index,
        layout: [],
        filters: [],
        popupSeen: false
      }
    },
    props: {
      report: {
        type: Object,
        required: true
      },
      index: {
        type: Number,
        required: true
      },
      isSelected: {
        type: Boolean,
        default: true
      }
    },
    methods: {
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
      showPopup: function () {
        this.popupSeen = true
      },
      hidePopup: function() {
        this.popupSeen = false
      },
      addFilter: function (filter) {
        this.reportData.filterDefinitions.push(filter)
      },
      resize: function (idx) {
        this.$refs.reportElement[idx].redrawChart()
      },
      resizeEnd: function (idx) {
        setTimeout(() => {
          this.$refs.reportElement[idx].redrawChart()
        }, 0)
      }
    },
    created: function () {
      this.layout = JSON.parse(this.reportData.layout)
      this.reportData.filterDefinitions.forEach(filterDefinition => {
        this.filters[filterDefinition.name] = filterDefinition.defaultValue
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
</style>
