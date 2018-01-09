<template>
  <div class="col-md-12">
    <schema-popup
      ref="schemaPopup"
      @newScheme="newScheme"
      :schemes="schemas" />
    <a class="btn--add is-fixed" @click="openPopup">
      <i class="icon-plus mr-5" /> Add
    </a>
    <div class="row">
      <div class="nav-tabs-navigation">
        <div class="nav-tabs-wrapper">
          <ul class="nav nav-tabs">
            <li>
              <span class="button-holder title title_center">
                <router-link to="/" class="headToBack">
                  <icon name="chevron-left"></icon>
                  Back to Dashboard
                </router-link>
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div
        v-for="scheme in schemas"
        :key="scheme.name.table"
        class="col-md-6 col-xs-12 mb-3">
        <ul class="global-filters">
          <span class="title capitalizeFirstLetter"> {{ scheme.name.table }} </span>
          <li class="is-list-item item-header">
            <h6>
              <span class="title"> Name </span>
            </h6>
            <div class="labels">
                <span class="text">Dope</span>
                <span class="text">Pope</span>
                <span class="text">Xope</span>
            </div>
          </li>
          <schema-item
            v-for="field in scheme.fields"
            :key="field.name"
            :field="field" />
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import Icon from 'vue-awesome/components/Icon'
  import { Database } from 'vue-awesome/icons'
  import {HTTP} from '@/helpers/http-helper'

  import SchemaItem from '@/components/SchemaItem'
  import SchemaPopup from '@/components/popups/SchemaPopup'

  export default {
    name: 'Schemes',
    data() {
      return {
        schemas: ''
      }
    },
    components: {
      SchemaItem,
      SchemaPopup,
      Icon
    },
    methods: {
      openPopup: function () {
        this.$refs.schemaPopup.open()
      },
      newScheme: function (scheme) {
        const { scheme_title, scheme_table } = scheme
        const schemeToPush = this.schemas.filter(scheme => scheme.name.table === scheme_table)
        schemeToPush[0].fields.push({
          name: scheme_title
        })
        this.closePopup()
      },
      closePopup: function () {
        this.$refs.schemePopup.close()
      }
    },
    created() {
      HTTP.get('bi/analyze/schema')
        .then(res => this.schemas = res.data)
        .then(() => console.log(this.schemas))
    }
  }
</script>
