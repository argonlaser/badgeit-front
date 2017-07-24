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

internals.serveResultPage = function (request, reply) {
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

internals.handleCallback = function (request, reply) {
  const badges = request.payload.badges
  const remote = request.payload.remote
  const error = request.payload.error
  const redisClient = request.server.plugins['hapi-redis'].client

  redisClient.set(remote, badges, function (err, res) {
    if (err) {
      logger.warn('Redis connection screwed', err)
    }
    if (res === 'OK') {
      logger.info('Successfully cached for remote: ', remote)
    }
  })

  logger.info('In handleCallback | ', 'Remote: ', remote)

  if (error) {
    logger.error('handleCallback', error)
    reply('Error', error).code(404)
    return
  }

  global.io.sockets.on('connection', function (socket) {
    // Socket connected
    logger.info('Socket connected| (New client id=' + socket.id + ').')

    // Save the socket id to redis store
    clients.push(socket)

    // Send an event once socket is connected
    logger.info('Data emitted: | (New client id=' + socket.id + ').')

    socket.emit('news', { reqData: badges })
    // Remove the socket on disconnection
    socket.on('disconnect', function () {
      var socketIndex = clients.indexOf(socket)
      if (socketIndex !== -1) {
        clients.splice(socketIndex, 1)
        logger.info('Client gone (id=' + socket.id + ').')
      }
    })
  })
  reply('success')
}

module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: internals.serveHomePage
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
    handler: internals.handleCallback
  },
  {
    method: 'GET',
    path: '/w/{repoName*}',
    handler: internals.serveResultPage
  }
]
