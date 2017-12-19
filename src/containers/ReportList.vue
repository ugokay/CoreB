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
import { HTTP } from '@/helpers/http-helper'

export default {
  name: 'GlobalFilters',
  data () {
    return {
      reportElements: []
    }
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
