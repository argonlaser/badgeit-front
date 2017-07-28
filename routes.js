const logger = require('./Logger/winston.js')
const config = require('./config.js')[process.env.NODE_ENV]

logger.info('Initialising the routes for the server')
logger.info(config)

let internals = {}

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
  },
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
  }
]
