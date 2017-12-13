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
        <button @click="addNewFilter">Create</button>
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
            defaultValue: ''
          }
        }
      }
    },
    data: function () {
      return {
        hidden: true,
        filterData: this.filter
      }
    },
    methods: {
      close: function () {
        this.hidden = true
      },
      open: function (filter) {
        if (filter) {
          this.filterData = filter
        } else {
          this.filterData = {
            label: '',
            name: '',
            type: '',
            defaultValue: ''
          }
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

<style>
.popup-area {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 9999999999;
  background: rgba(0,0,0,.3);
  display: flex;
  align-items: center;
  justify-content: center;
  display: flex;
}

.popup {
  padding: 30px 40px;
  background: #fff;
  box-shadow: 1px 2px 4px 0 rgba(0, 0, 0, 0.12);
  border-radius: 3px;
  min-width: 520px;
  position: relative;
}

.close-icon {
  position: absolute;
  right: 0;
  top: 0;
  margin: 10px;
  cursor:pointer;
  transform: rotate(45deg)
}
.input-row {
  display: block;
  margin-bottom: 20px;
  position: relative;
}
.input-row:last-child {
  margin-bottom: 0
}
.input-row label{
  display: block;
  font-size: 13px;
  margin-bottom: 5px
}
.input-row input,.input-row select{
  display: block;
  border: 0;
  width: 100%;
  height: 40px;
  font-size: 15px;
  background-color: #f8f8f8;
  box-shadow: 1px 1px 2px 0 rgba(0, 0, 0, 0.15);
  padding: 0 10px
}
.input-row input {
  background-color: #f0f0f0;
  box-shadow: inset 1px 1px 2px 0 rgba(0, 0, 0, 0.1);
}
.caret {
  display: block;
  width: 5px;
  height: 5px;
  position: absolute;
  right: 10px;
  bottom: 10px;
  border: 5px solid transparent;
  border-top-color:#5b64fc
}

.input-row select {
  appearance: none;
  -moz-appearance: none;
}
.input-row button {
  width: 60%;
  height: 40px;
  border: 0;
  color:#fff;
  text-align: center;
  border-radius: 3px;
  background-color: #5b64fc;
  box-shadow: 2px 2px 3px 0 rgba(91, 100, 252, 0.3);
  margin-left: 20%
}

</style>
