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
        _colors: [],
        elementId: null
      }
    },
    components: {
      'color-picker': Chrome
    },
    methods: {
      close: function () {
        this.hidden = true
      },
      updateValue({hex}, idx) {
        this.colors[idx] = hex
      },
      open: function (chartSettings) {
        const { colors, series, elementId } = chartSettings
        this.hidden = false
        this.series = series
        this.colors = colors
        this.elementId = elementId
      },
      finishEditing: function() {
        const _colors = []
        for (let i = 0; i < this.colors.length; i++) {
          _colors.push(this.colors[i])
        }
        this.$emit('chartEditingFinished', {
          colors: _colors,
          elementId: this.elementId
        })
        this.close()
      }
    }
  }
</script>
