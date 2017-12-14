export const Util = {
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
