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
    <template v-else-if="definition.type === 'query'">
      <select v-model="value" class="form-control">
        <option
          v-for="row in initialValue"
          :value="row.value">
          {{row.label ? row.label : row.value}}
        </option>
      </select>
    </template>
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
  import {HTTP} from '@/helpers/http-helper.js'

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
      if (this.definition.type === 'query'){
        HTTP.post('bi/analyze/execute', {query: this.definition.defaultValue}, {
          params: {
            filterParamsJson: JSON.stringify(this.filters)
          }
        }).then((res) => {
          const options = []
          res.data.data.forEach(row => {
            const value = row[0]
            const label = row[1]
            if (value) {
              options.push({
                value: value,
                label : label
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
