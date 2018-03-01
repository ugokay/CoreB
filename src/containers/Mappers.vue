<template>
  <v-flex class="mt-5 mb-5" xs12 offset-lg2 lg8>
    <div class="global-filters">
      <filter-popup ref="filterPopup" />
      <a class="btn--add is-fixed" >
        <i class="icon-plus" />
        Add
      </a>
      <div class="col-sm-12">
        <h2>Mappers</h2>
        <ul class="global-filters is-pointer">
          <span class="title">Enabled Mappers</span>
          <router-link
            v-for="mapper in mappers"
            :to="/mapper/ + mapper.id"
            :key="mapper.name"
            :class="isDisabled"
            v-if="!mapper.isEnabled"
            tag="li">
            <span class="name">{{ mapper.name }}</span>
            <span class="flex-spacer"></span>
            <v-btn color="primary" small>Edit</v-btn>
          </router-link>
          <span class="title">Disabled Mappers</span>
          <router-link
            v-for="mapper in mappers"
            :to="/mapper/ + mapper.id"
            :key="mapper.name"
            :class="isDisabled"
            v-if="!mapper.isEnabled"
            class="is-passive"
            tag="li">
            <span class="name">{{ mapper.name }}</span>
            <span class="flex-spacer"></span>
            <v-btn color="primary" small>Edit</v-btn>
          </router-link>
        </ul>
      </div>
    </div>
  </v-flex>
</template>

<script>
import FilterPopup from '@/components/popups/FilterPopup'
import { MOCK_MAPPERS } from '@/helpers/helpers'

export default {
  name: 'Mappers',
  components: {
    FilterPopup
  },
  data () {
    return {
      mappers: MOCK_MAPPERS
    }
  },
  methods: {
    openFilter () {
      this.$refs.filterPopup.open()
    }
  },
  computed: {
    isDisabled () {

    }
  }
}
</script>
