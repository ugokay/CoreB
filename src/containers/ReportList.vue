<template>
  <div class="global-filters">
    <div class="col-sm-12">
      <h2>Reports</h2>
      <ul class="global-filters">
        <li
          v-for="(reportElement, index) in reportElements"
          :key="reportElement.id">
          <span class="label label-default">{{ reportElement.id }}</span>
          <span class="name">{{ reportElement.title }}</span>
          <span class="pull-right">
            <span @click="openDesign(reportElement.id)" class="label label-default" >Design</span>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {HTTP} from '@/helpers/http-helper'

export default {
  name: 'GlobalFilters',
  data () {
    return {
      reportElements: []
    }
  },
  components: {
  },
  methods: {
    openDesign: function (id) {
      this.$router.push('/report-design/' + id)
    }
  },
  created () {
    HTTP.get('bi/report/element/list').then(res => {
      this.reportElements = res.data
    })
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
