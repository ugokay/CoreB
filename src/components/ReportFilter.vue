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
        value: null
      }
    },
    methods: {
      confirm: function (value) {}
    },
    created: function () {
      let initialValue
      if (this.definition.type === 'datepicker') {
        const fixedDates = Util.calculateFixedDates()
        switch (this.definition.defaultValue) {
          case 'today':
            initialValue = fixedDates.today
            break
          case 'yesterday':
            initialValue = fixedDates.yesterday
            break
          case 'tomorrow':
            initialValue = fixedDates.tomorrow
            break
          default:
            initialValue = fixedDates.today
        }
      } else if (this.definition.type === 'daterangepicker') {
        const fixedDates = Util.calculateFixedDates()
        switch (this.definition.defaultValue) {
          case 'today':
            initialValue = [fixedDates.today, fixedDates.tomorrow]
            break
          case 'yesterday':
            initialValue = [fixedDates.yesterday, fixedDates.today]
            break
          default:
            initialValue = [fixedDates.yesterday, fixedDates.today]
        }
      } else {
        initialValue = this.definition.defaultValue
      }
      this.value = initialValue
      this.filters[this.definition.name] = Util.calculateFilterValue(initialValue, this.definition.type)
    },
    watch: {
      value: function (newVal) {
        this.filters[this.definition.name] = Util.calculateFilterValue(newVal, this.definition.type)
      }
    }
  }
</script>
