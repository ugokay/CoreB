<template>
  <div class="global-filters">
    <popup @addFilter="addFilter" ref="filterPopup"  />
    <a class="btn--add is-fixed" @click="openFilter">
      <i class="icon-plus" />
      Add
    </a>
    <div class="col-sm-12">
      <h2>Global Filters</h2>
      <ul class="global-filters">
        <li
          v-for="(filterDefinition, index) in filterDefinitions"
          :key="filterDefinition.name">
          <span class="name">{{ filterDefinition.name }}</span>
          <span class="_label">{{ filterDefinition.label }}</span>
          <span class="label label-default">{{ filterDefinition.type }}</span>
          <span class="pull-right">
            <span class="label label-default">{{ filterDefinition.defaultValue }}</span>
            <span @click="openEditFilterPopup(index)" class="label label-default" >Edit</span>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Popup from '@/components/Popup'
import AddButton from '@/components/AddButton'

export default {
  name: 'GlobalFilters',
  data() {
    return {
      filterDefinitions: []
    }
  },
  components: {
    AddButton,
    Popup
  },
  methods: {
    openFilter() {
      this.$refs.filterPopup.open()
    },
    addFilter(filter) {
      this.filterDefinitions.push(filter)
    },
    openEditFilterPopup: function (index) {
      this.$refs.filterPopup.open(this.filterDefinitions[index])
    },
  }
}
</script>

<style>
.global-filters li{
  padding: 1em;
  height: 50px;
  background-color: #ffffff;
  box-shadow: 1px 2px 4px 0 rgba(0, 0, 0, 0.12);
  margin-bottom: 1px
}
.global-filters li .name {
  font-size: 15px;
  color:#000;
}
.global-filters li ._label {
  font-size: 13px;
  color:#000;
}
</style>
