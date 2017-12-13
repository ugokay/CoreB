/**
 * Created by gorkem on 27.11.2017.
 */
export const CHART = {
  cubify: function (queryResult, valueIdx = 2, xAxisIdx = 0, legendIdx = 1) {
    let xAxisData = []
    let legendData = []
    queryResult.data.forEach((row) => {
      if (!xAxisData.includes(row[xAxisIdx])) {
        xAxisData.push(row[xAxisIdx])
      }
      if (!legendData.includes(row[legendIdx])) {
        legendData.push(row[legendIdx])
      }
    })
    let seriesDataList = []
    for (let i = 0; i < legendData.length; i++) {
      let seriesData = []
      let legend = legendData[i]
      for (let j = 0; j < xAxisData.length; j++) {
        let xAxis = xAxisData[j]
        let value = 0
        for (let k = 0; k < queryResult.data.length; k++) {
          let row = queryResult.data[k]
          let l = row[legendIdx]
          let x = row[xAxisIdx]
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
    for (let i = 0; i < seriesDataList.length; i++) {
      seriesList.push({data: seriesDataList[i], name: legendData[i]})
    }
    return {seriesList, xAxisData, schema: queryResult.schema}
  },
  chartify: function (queryResult, valueIdxs, xAxisIdx) {
    let xAxis = []
    let seriesDataList = []
    for (let i = 0; i < valueIdxs.length; i++) {
      seriesDataList[i] = []
    }
    queryResult.data.forEach((row) => {
      if (!xAxis.includes(row[xAxisIdx])) {
        xAxis.push(row[xAxisIdx])
        valueIdxs.forEach((v, i) => {
          seriesDataList[i].push(row[valueIdxs[i]])
        })
      }
    })
    let seriesList = []
    seriesDataList.forEach((seriesData, i) => {
      seriesList.push({data: seriesData, name: queryResult.schema.fields[valueIdxs[i]].name})
    })
    return {seriesList, xAxis, schema: queryResult.schema}
  },
  createChartOptions: function (chartData, reportElementType = 'line') {
    if (reportElementType === 'pie') {
      let pieData = {
        name: chartData.seriesList[0]['name'],
        data: []
      }
      let idx = 0
      chartData.seriesList[0].data.forEach((value) => {
        pieData.data.push({
          y: value,
          name: chartData.xAxis[idx]
        })
        idx++
      })
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
