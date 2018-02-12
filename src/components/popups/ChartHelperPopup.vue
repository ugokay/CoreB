<template>
  <div v-if="!hidden" class="popup-area">
    <div class="popup">
      <div class="close-icon" @click="close">
        <div class="icon-plus"></div>
      </div>
      <div class="input-row">
        <label>Edit Chart</label>
      </div>
      <div class="input-row line-color-set" v-for="(serie, idx) in series">
        <label>{{ serie.name }} Line Color</label>
        <label class="picker-area">
          <input type="checkbox">
          <div class="picker">
            <a :style="{background: colors[idx]}"> {{colors[idx]}} </a>
            <div class="color-picker-area">
              <color-picker :value="colors[idx]" @input="updateValue($event, idx)" />
            </div>
          </div>
        </label>
      </div>
      <div class="input-row">
        <button @click="finishEditing">Finish Editing</button>
      </div>
    </div>
  </div>
</template>

<script>
  import { Chrome } from 'vue-color'

  export default {
    name: 'ChartHelperPopup',
    data() {
      return {
        hidden: true,
        fileName: 'untitled',
        series: [],
        colors: [],
        elementId: null,
        chartType: null
      }
    },
    components: {
      'color-picker': Chrome
    },
    methods: {
      close() {
        this.hidden = true
      },
      updateValue({hex}, idx) {
        this.colors[idx] = hex
      },
      open: function (chartSettings) {
        const { colors, elementId, chartOptions } = chartSettings
        this.chartType = chartOptions.chart.type

        let _colors
        let _series
        if (this.chartType == 'pie') {
          _colors = chartOptions.plotOptions.pie.colors
          _series = chartOptions.series[0].data
        } else {
          const { series } = chartOptions
          _colors = colors
          _series = series
        }

        this.elementId = elementId
        this.colors = _colors
        this.series = _series
        this.hidden = false
      },
      finishEditing() {
        const _colors = []
        for (let i = 0; i < this.colors.length; i++) {
          _colors.push(this.colors[i])
        }
        this.$emit('chartEditingFinished', {
          colors: _colors,
          elementId: this.elementId,
          type: this.chartType
        })
        this.close()
      }
    }
  }
</script>
