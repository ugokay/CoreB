/* eslint-disable no-extend-native */
import Mustache from 'mustache'
import moment from 'moment'

Date.prototype.toJSON = function () {
  function pad (number) {
    if (number < 10) {
      return '0' + number
    }
    return number
  }

  return this.getFullYear() +
    '-' + pad(this.getMonth() + 1) +
    '-' + pad(this.getDate()) +
    'T' + pad(this.getHours()) +
    ':' + pad(this.getMinutes()) +
    ':' + pad(this.getSeconds()) +
    '.' + (this.getMilliseconds() / 1000).toFixed(3).slice(2, 5) +
    'Z'
}

export const Util = {
  dayInMillis: 1000 * 60 * 60 * 24,
  dateFormat: '',
  parseFilterValue: function (definition, value) {
    if (definition.type === 'daterangepicker') {
      return moment(value[0]).format('YYYY-MM-DD') + ' ~ ' + moment(value[1]).format('YYYY-MM-DD')
    }
    return value
  },
  calculateFilterDefaultValue: function (definition) {
    let initialValue
    if (definition.type === 'datepicker') {
      const fixedDates = this.calculateFixedDateStrings()
      switch (definition.defaultValue) {
        case 'today':
          initialValue = fixedDates.today
          break
        case 'yesterday':
          initialValue = fixedDates.yesterday
          break
        case 'tomorrow':
          initialValue = fixedDates.tomorrow
          break
        default:
          initialValue = fixedDates.today
      }
    } else if (definition.type === 'daterangepicker') {
      const fixedDates = this.calculateFixedDateStrings()
      switch (definition.defaultValue) {
        case 'today':
          initialValue = [fixedDates.today, fixedDates.tomorrow]
          break
        case 'yesterday':
          initialValue = [fixedDates.yesterday, fixedDates.today]
          break
        default:
          initialValue = [fixedDates.yesterday, fixedDates.today]
      }
    } else {
      initialValue = definition.defaultValue
    }
    return initialValue
  },
  calculateFilterValue: function (value, type) {
    if (type === 'daterangepicker') {
      return {
        start: value[0] + "T00:00:00.000Z",
        end: value[1] + "T00:00:00.000Z"
      }
    }
    return value
  },
  calculateFixedDateStrings: function () {
    const today = new Date()
    today.setHours(0)
    today.setMinutes(0)
    today.setSeconds(0)
    today.setMilliseconds(0)
    const yesterday = new Date(today.getTime() - this.dayInMillis)
    const tomorrow = new Date(today.getTime() + this.dayInMillis)
    return {
      today : moment(today).format('YYYY-MM-DD'),
      yesterday : moment(yesterday).format('YYYY-MM-DD'),
      tomorrow : moment(tomorrow).format('YYYY-MM-DD')
    }
  },
  calculateFilterDefinitions: function (filterTokens, globalFilterDefinitions) {
    let filterDefinitions = []
    filterTokens.forEach(filterToken => {
      let found = false
      globalFilterDefinitions.forEach(globalFilterDefinition => {
        if (globalFilterDefinition.name === filterToken) {
          filterDefinitions.push(globalFilterDefinition)
          found = true
        }
      })
      if (!found) {
        filterDefinitions.push({
          type: '',
          name: filterToken,
          label: filterToken,
          defaultValue: '',
          global: false
        })
      }
    })
    return filterDefinitions
  },
  getUnifiedMustacheTokens: function (textArr) {
    const unifiedTokens = []
    textArr.forEach(text => {
      try {
        const tokens = Mustache.parse(text)
        tokens.forEach(token => {
          const type = token[0]
          const value = token[1]
          let parsedToken = value.split('.')[0]
          if (type === 'name' && !unifiedTokens.includes(parsedToken)) {
            unifiedTokens.push(parsedToken)
          }
        })
        return unifiedTokens
      } catch (e) {
        return null
      }
    })
    return unifiedTokens
  },
  chartType: function (value) {
    if (typeof value === 'string') {
      switch (value) {
        case 'table':
          return 0
        case 'pie':
          return 1
        case 'bar':
          return 2
        case 'line':
          return 3
        case 'column':
          return 4
        case 'single':
          return 5
        case 'custom':
          return 6
        default:
          return 3
      }
    } else if (typeof value === 'number') {
      switch (value) {
        case 0:
          return 'table'
        case 1:
          return 'pie'
        case 2:
          return 'bar'
        case 3:
          return 'line'
        case 4:
          return 'column'
        case 5:
          return 'single'
        case 6:
          return 'custom'
        default:
          return 'line'
      }
    }
  }
}

export const DUMMY_FILTER = {
  get: function () {
    const dayInMillis = 1000 * 60 * 60 * 24
    const today = new Date()
    today.setHours(3)
    today.setMinutes(0)
    today.setSeconds(0)
    today.setMilliseconds(0)
    const tomorrow = new Date(today.getTime() + dayInMillis)
    const cTomorrow = new Date(today.getTime())
    const cToday = new Date(today.getTime() - (tomorrow.getTime() - today.getTime()))
    return {
      'cDateRange_start': cToday,
      'cDateRange_end': cTomorrow,
      'dateRange_start': today,
      'dateRange_end': tomorrow,
      'dateFormat': '%Y-%m-%dT%H:%i:%s.%fZ'
    }
  }
}

export const MOCK_FILTER_DEFINITIONS = {
  get: function () {
    const dayInMillis = 1000 * 60 * 60 * 24
    const today = new Date()
    today.setHours(3)
    today.setMinutes(0)
    today.setSeconds(0)
    today.setMilliseconds(0)
    const tomorrow = new Date(today.getTime() + dayInMillis)
    // const cTomorrow = new Date(today.getTime())
    const cToday = new Date(today.getTime() - (tomorrow.getTime() - today.getTime()))
    const filterArray = [
      { label: 'cDateRange_start', name: 'cDateRange_start', type: 'datepicker', defaultValue: cToday }
    ]
    return filterArray
  }
}

export const MOCK_MAPPERS = [
  { id: 6320951, name: 'Insights', isEnabled: false },
  { id: 156611, name: 'Mock', isEnabled: true },
  { id: 458567, name: 'Data', isEnabled: false },
  { id: 3737, name: 'Coming', isEnabled: true },
  { id: 579679, name: 'Here', isEnabled: false }
]

export const MOCK_USERS = [
  { id: 148, full_name: 'Ali Korkmaz', email: 'ali@gmail.com', roles: [1] },
  { id: 74182, full_name: 'Veli Korkmaz', email: 'veli@gmail.com', roles: [1,3] },
  { id: 9158, full_name: 'Ahmet Korkmaz', email: 'ahmet@gmail.com', roles: [2] },
  { id: 3875, full_name: 'Mehmet Korkmaz', email: 'mehmet@gmail.com', roles: [1] }
]

export const MOCK_USERS_GROUP = [
  { id: 1, name: 'Admins' },
  { id: 2, name: 'Inspectors' },
  { id: 3, name: '3rd Party Contributors' }
]
