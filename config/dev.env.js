'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_URL: '"http://localhost:8081/rest-api/v1/"',
  WS_ENPOINT: '"ws://localhost:8081/web-socket/v1/general/"'
})
