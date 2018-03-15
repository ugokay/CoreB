<template>
  <div>
    <date-picker
      v-if="definition.type === 'datepicker'"
      lang="en" :confirm="true"
      v-model="value">
    </date-picker>
    <template v-else-if="definition.type === 'daterangepicker'">
      <v-date-picker v-model="value[0]" :landscape="false" :reactive="false"></v-date-picker>
      <v-date-picker v-model="value[1]" :landscape="false" :reactive="false"></v-date-picker>
    </template>
    <input
      v-else-if="definition.type === 'text'"
      v-model="value"
      class="main--input" />
    <v-select v-else-if="definition.type === 'query' && initialValue"
              v-model="value"
              :items="initialValue">
    </v-select>
    <span
      v-else="definition.type === 'text'"
      v-model="value">
      Set Filter Options
    </span>
  </div>
</template>
<script>
  import DatePicker from 'vue2-datepicker'
  import {Util} from '@/helpers/helpers.js'
  import {HTTP} from '@/helpers/http-helper.js'

  export default{
    components: {
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
      if (this.definition.type === 'query'){
        HTTP.post('bi/analyze/execute', {query: this.definition.defaultValue}, {
          params: {
            filterParamsJson: JSON.stringify(this.filters),
            block: true
          }
        }).then((res) => {
          const options = []
          res.data.data.forEach(row => {
            const value = row[0]
            const label = row[1]
            if (value) {
              options.push({
                value: value,
                text : label ? label : value
              })
            }
          })
          this.initialValue = options
        }).catch((error) => {
          console.log(error)
        })
      } else {
        this.initialValue = Util.calculateFilterDefaultValue(this.definition)
      }
      this.value = this.initialValue
      this.filters[this.definition.name] = Util.calculateFilterValue(this.initialValue, this.definition.type)
      this.$emit('loaded')
    },
    watch: {
      value: function (newVal) {
        this.$set(this.filters, this.definition.name, Util.calculateFilterValue(newVal, this.definition.type))
        this.$emit('change',
          {
            name: this.definition.name,
            label: this.definition.label,
            value: Util.parseFilterValue(this.definition, newVal)
          }
        )
      }
    }
  }
</script>
