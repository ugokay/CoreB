import HTTP from '@/services'

const state = {
  mock_filter_definitions: [
    { label: 'cDateRange_start', name: 'cDateRange_start', type: 'datepicker', defaultValue: new Date() }
  ]
}

const getters = { }

const mutations = {
  addFilter(state, newFilterObject) {
    state.mock_filter_definitions.push(newFilterObject)
  }
}

const actions = {
  addFilter(context, filterObject) {
    return context.commit('addFilter', filterObject)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
