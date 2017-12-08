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
  get: function() {
    const dayInMillis = 1000 * 60 * 60 * 24
    const today = new Date()
    today.setHours(3)
    today.setMinutes(0)
    today.setSeconds(0)
    today.setMilliseconds(0)
    const tomorrow = new Date(today.getTime() + dayInMillis)
    const cTomorrow = new Date(today.getTime())
    const cToday = new Date(today.getTime() - (tomorrow.getTime() - today.getTime()))
    const filterArray = [
      { label: 'cDateRange_start', name: 'cDateRange_start', type: 'datepicker', defaultValue: cToday }
    ]
    
    return filterArray
  }
}
