<template>
  <div>
    <date-picker
      v-if="definition.type === 'datepicker'"
      lang="en" :confirm="true"
      v-model="value">
    </date-picker>
    <date-picker
      v-else-if="definition.type === 'daterangepicker'"
      range lang="en" :confirm="true" @confirm="confirm"
      v-model="value">
    </date-picker>
    <input
      v-else-if="definition.type === 'text'"
      v-model="value"
      class="main--input" />
    <span
      v-else="definition.type === 'text'"
      v-model="value">
      Set Filter Options
    </span>
  </div>
</template>
<script>
  import Datepicker from 'vuejs-datepicker'
  import DatePicker from 'vue2-datepicker'
  import {Util} from '@/helpers/helpers.js'

  export default{
    components: {
      Datepicker,
      DatePicker
    },
    name: 'report-filter',
    props: {
      definition: {
        type: Object,
        required: true
      },
      filters: {
        type: Object,
        default: {}
      }
    },
    data: function () {
      return {
        value: null,
        initialValue: null
      }
    },
    methods: {
      confirm: function (value) {}
    },
    created: function () {
      this.initialValue = Util.calculateFilterDefaultValue(this.definition)
      this.value = this.initialValue
      this.filters[this.definition.name] = Util.calculateFilterValue(this.initialValue, this.definition.type)
    },
    watch: {
      value: function (newVal) {
        this.$set(this.filters, this.definition.name, Util.calculateFilterValue(newVal, this.definition.type))
        if (newVal === this.initialValue) {
          this.$emit('change', {name: this.definition.name, label: this.definition.label, value: null})
        } else {
          this.$emit('change', {name: this.definition.name, label: this.definition.label, value: newVal})
        }
      }
    }
  }
</script>
