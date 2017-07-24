const logger = require('./Logger/winston.js')
const config = require('./config.js')[process.env.NODE_ENV]
const apiCall = require('./apiCall.js')

logger.info('Initialising the routes for the server')
logger.info(config)

let internals = {}
let clients = []

internals.serveHomePage = function (request, reply) {
  logger.info('serveHomePage | Serve Home')
  reply.file('views/home.html')
}

internals.serveFavicon = function (request, reply) {
  logger.info('serveFavicon | Serve Favicon')
  reply('success')
}

module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: require('./routeHandlers/home.js')
  },
  // Serve static routes
  {
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: '.',
        redirectToSlash: true,
        index: true
      }
    }
  },
  {
    method: 'GET',
    path: '/favicon.ico',
    handler: internals.serveFavicon
  },
  {
    method: 'POST',
    path: '/callback',
    handler: require('./routeHandlers/callback.js')
  },
  {
    method: 'GET',
    path: '/w/{repoName*}',
    handler: require('./routeHandlers/result.js')
  }
]
