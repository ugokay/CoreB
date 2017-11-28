/**
 * Created by gorkem on 27.11.2017.
 */
export const CHART = {
  cubify: function (queryResult, valueIdx = 2, xAxisIdx = 0, legendIdx = 1) {
    var xAxisData = []
    var legendData = []
    queryResult.data.forEach((row) => {
      if (!xAxisData.includes(row[xAxisIdx])) {
        xAxisData.push(row[xAxisIdx].toString())
      }
      if (!legendData.includes(row[legendIdx])) {
        legendData.push(row[legendIdx].toString())
      }
    })
    var seriesDataList = []
    for (var i = 0; i < legendData.length; i++) {
      var seriesData = []
      var legend = legendData[i]
      for (var j = 0; j < xAxisData.length; j++) {
        var xAxis = xAxisData[j]
        var value = 0
        for (var row in queryResult.data) {
          var l = row[legendIdx].toString()
          var x = row[xAxisIdx].toString()
          if (l === legend && x === xAxis) {
            value = row[valueIdx]
            break
          }
        }
        seriesData.push(value)
      }
      seriesDataList.push(seriesData)
    }
    const seriesList = []
    for (let i = 0; i < seriesList.length; i++) {
      seriesList.push({data: seriesList[i], name: legendData[i]})
    }
    return {seriesList, xAxisData, schema: queryResult.schema}
  },
  chartify: function (queryResult, valueIdxs, xAxisIdx) {
    var xAxis = []
    var seriesList = []
    for (var i = 0; i < valueIdxs.length; i++) {
      seriesList[i] = []
    }
    console.log(queryResult.data)
    queryResult.data.forEach((row) => {
      if (!xAxis.includes(row[xAxisIdx])) {
        xAxis.push(row[xAxisIdx])
        valueIdxs.forEach((v, i) => {
          seriesList[i].push(row[valueIdxs[i]])
        })
      }
    })
    console.log(seriesList)
    seriesList.forEach((series, i) => {
      seriesList.push({data: seriesList[i], name: queryResult.schema.fields[valueIdxs[i]].name})
    })
    return {seriesList, xAxis, schema: queryResult.schema}
  },
  createChartOptions: function (chartData, reportElementType = 'line') {
    if (reportElementType === 'pie') {
      var pieData = {
        name: chartData.seriesList[0]['name'],
        data: []
      }
      var idx = 0
      for (var value in chartData.seriesList[0]['data']) {
        pieData.data.push({
          y: value,
          name: chartData.xAxis[idx]
        })
        idx++
      }
      return {
        title: '',
        reflow: true,
        chart: {type: 'pie'},
        series: [pieData],
        yAxis: {title: {text: chartData.schema.fields[chartData.schema.fields.length - 1].name}}
      }
    }
    return {
      title: '',
      reflow: true,
      plotOptions: {line: {marker: {enabled: false}}},
      chart: {type: 'line'},
      xAxis: {categories: chartData.xAxis},
      series: chartData.seriesList,
      yAxis: {title: {text: chartData.schema.fields[chartData.schema.fields.length - 1].name}}
    }
  }
}
