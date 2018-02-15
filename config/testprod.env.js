'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"test"',
  API_URL: '"https://app.corebi.com/rest-api/v1/"',
  WS_ENDPOINT: '"ws://app.corebi.com/web-socket/v1/general/"'
})
