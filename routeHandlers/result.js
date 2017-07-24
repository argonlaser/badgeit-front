const logger = require('../Logger/winston.js')
const config = require('../config.js')[process.env.NODE_ENV]
const apiCall = require('../apiCall.js')

module.exports = function (request, reply) {
  const remote = request.params.repoName
  const API_BASE_URL = config.API_BASE_URL
  const CALLBACK_URL = config.FRONT_URL + '/callback'

  const redisClient = request.server.plugins['hapi-redis'].client

  reply.file('views/result.html')

  redisClient.get(remote, function (err, res) {
    if (err) {
      logger.error('Redis Connection failed : ', err)
    }
    if (res === null) {
      logger.warn('Redis Cache missed. ', res)
    }
    logger.info('Data found in cache', res)
  })

  logger.info('serveResultPage', '|', 'callback url:', CALLBACK_URL, 'api base url: ', API_BASE_URL)

  apiCall.getBadges(remote, function (err, res) {
    if (err) {
      logger.error('Could not request API: ', err)
    } else {
      logger.info('Contacted API')
    }
  })
}
