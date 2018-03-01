<template>
  <v-flex class="mt-5 mb-5" xs12 offset-lg3 lg6>
    <h2 class="mb-3 display-1">Reports</h2>
    <v-expansion-panel popout>
      <v-expansion-panel-content v-for="reportElement in reportElements" :key="reportElement.id">
        <div slot="header">{{ reportElement.title }}</div>
        <v-card>
          <v-card-text class="grey lighten-4" @click="deleteElement(reportElement.id)"> 
            <v-btn color="red" dark>
              <v-icon small>delete</v-icon>
              DELETE
            </v-btn>
            <v-btn color="info" dark @click="viewDesign(reportElement.id)">
              <v-icon small>subdirectory_arrow_right</v-icon>
              VIEW DESIGN
            </v-btn>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-flex>
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
    viewDesign: function (id) {
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
