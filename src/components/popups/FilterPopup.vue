<template>
  <div v-if="!hidden" class="popup-area">
    <div class="popup">
      <div class="close-icon" @click="close">
        <div class="icon-plus"></div>
      </div>
      <div class="input-row">
        <label>Type</label>
        <select
          v-model="filterData.type">
          <option value="text">Text</option>
          <option value="datepicker">Datepicker</option>
          <option value="daterangepicker">DateRangePicker</option>
        </select>
        <span class="caret"></span>
      </div>
      <div class="input-row">
        <label>Label</label>
        <input
          v-model="filterData.label"
          type="text">
      </div>
      <div class="input-row">
        <label>Name</label>
        <input
          v-model="filterData.name"
          type="text">
      </div>
      <div class="input-row">
        <label>Default Value</label>
        <input
          v-model="filterData.defaultValue"
          type="text">
      </div>
      <div class="input-row">
        <label class="toggle-checkbox">
          <input
          v-model="filterData.static"
          type="checkbox">
          <span>Is static?</span>
          <span class="box"></span>
        </label>
      </div>
      <div class="input-row">
        <button v-if="isCreate" @click="addNewFilter">Create</button>
        <button v-else @click="updateFilter">Update</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'popup',
    props: {
      filter: {
        type: Object,
        default: function () {
          return {
            label: '',
            name: '',
            type: '',
            defaultValue: '',
            static: true
          }
        }
      }
    },
    data: function () {
      return {
        hidden: true,
        filterData: this.filter,
        isCreate: true
      }
    },
    methods: {
      close: function () {
        this.hidden = true
      },
      updateFilter: function () {
        this.$emit('updateFilter', this.filterData)
        this.close()
      },
      open: function (filter) {
        if (filter) {
          this.filterData = filter
          this.isCreate = false
        } else {
          this.filterData = {
            label: '',
            name: '',
            type: '',
            defaultValue: '',
            static: false
          }
          this.isCreate = true
        }
        this.hidden = false
      },
      addNewFilter () {
        this.$emit('addFilter', this.filterData)
        this.close()
      }
    }
  }
</script>

