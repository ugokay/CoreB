<template>
  <div class="col-md-12">
    <scheme-popup />
    <a class="btn--add is-fixed" >
      <i class="icon-plus" /> Add
    </a>
    <div class="row">
      <div class="nav-tabs-navigation">
        <div class="nav-tabs-wrapper">
          <ul class="nav nav-tabs pull-left">
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
        v-for="scheme in schemes"
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
          <scheme-item v-for="field in scheme.fields" :field="field" />
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import Icon from 'vue-awesome/components/Icon'
  import { Database } from 'vue-awesome/icons'
  import {HTTP} from '@/helpers/http-helper'

  import SchemeItem from '@/components/SchemeItem'
  import SchemePopup from '@/components/Popups/SchemePopup'

  export default {
    name: 'Schemes',
    data() {
      return {
        schemes: ''
      }
    },
    components: {
      SchemeItem,
      SchemePopup,
      Icon
    },
    created() {
      HTTP.get('bi/analyze/schema')
        .then(res => this.schemes = res.data)
    }
  }
</script>
