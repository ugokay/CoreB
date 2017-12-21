'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"test"',
  API_URL: '"http://52.164.225.245:8081/rest-api/v1/"'
})
