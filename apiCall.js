const superagent = require('superagent')
const logger = require('./Logger/winston.js')
const config = require('./config.js')[process.env.NODE_ENV]
const API_BASE_URL = config.API_BASE_URL
const CALLBACK_URL = config.FRONT_URL + '/callback'

let exporter = {}

exporter.getBadges = function (remoteUrl, callback) {
  superagent
    .get(API_BASE_URL + '/badges')
      .query({ download: 'git', remote: remoteUrl, callback: CALLBACK_URL }) // query string
      .end((err, res) => {
        logger.info('POST /badges')
        callback(err, res)
      })
}

module.exports = exporter
