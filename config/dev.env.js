'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://192.168.3.120:8000/v0.10"',
  // BASE_API: '"http://192.168.3.111:8080/v0.10"',
})
