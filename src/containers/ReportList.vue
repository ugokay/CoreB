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
            <span @click="deleteElement(reportElement.id)" class="label label-default" >Delete</span>
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
    },
    deleteElement: function (id) {
      this.$swal({
        title: 'Are you sure?',
        text: 'You will not be able to recover this imaginary file!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it'
      }).then(res => {
        if (res.value) {
          HTTP.delete('bi/report/element/' + id)
            .then(res => {
              this.$swal('Deleted')
              for (let i = 0; i < this.reportElements.length; i++) {
                if (this.reportElements[i].id === id) {
                  this.reportElements.splice(i, 1)
                  break
                }
              }
            })
        }
      })
    }
  },
  created () {
    HTTP.get('bi/report/element/list').then(res => {
      this.reportElements = res.data
    })
  }
}
</script>
