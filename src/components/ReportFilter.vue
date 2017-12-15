<template>
  <div>
    <datepicker 
      v-if="definition.type === 'datepicker'"
      :options="dpOptions"
      v-model="value">
    </datepicker>
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

  export default{
    components: {
      Datepicker
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
        dpOptions: {
          format: 'YYYY-MM-DD'
        }
      }
    },
    methods: {
    },
    created: function () {
      let initialValue
      if (this.definition.type === 'datepicker') {
        const today = new Date()
        today.setHours(3)
        today.setMinutes(0)
        today.setSeconds(0)
        today.setMilliseconds(0)
        switch (this.definition.defaultValue) {
          case 'today':
            initialValue = today
            break
          case 'yesterday':
            const dayInMillis = 1000 * 60 * 60 * 24
            const tomorrow = new Date(today.getTime() - dayInMillis)
            initialValue = tomorrow
            break
          default:
            initialValue = today
        }
      } else {
        initialValue = this.definition.defaultValue
      }
      this.value = initialValue
      this.filters[this.definition.name] = initialValue
    },
    watch: {
      value: function (newVal, oldVal) {
        this.filters[this.definition.name] = newVal
      }
    }
  }
</script>
