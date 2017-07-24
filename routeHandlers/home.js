const logger = require('../Logger/winston.js')

module.exports = function (request, reply) {
  logger.info('serveHomePage | Serve Home')
  reply.file('views/home.html')
}
