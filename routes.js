const superagent = require('superagent')
const logger = require('./Logger/winston.js')
const config = require('./config.js')[process.env.NODE_ENV]

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
  const repoName = request.params.repoName
  const API_BASE_URL = config.API_BASE_URL
  const CALLBACK_URL = config.FRONT_URL + '/callback'

  logger.info('serveResultPage', '|', 'callback url:', CALLBACK_URL, 'api base url: ', API_BASE_URL)

  superagent
    .get(API_BASE_URL + '/badges')
      .query({ download: 'git', remote: repoName, callback: CALLBACK_URL }) // query string
      .end(function (err, res) {
        // Do something
        if (err) {
          const errorMsg = 'Error in posting to API: '
          logger.error(errorMsg, err)
          reply(errorMsg).code(404)
        }
        logger.info('POST /badges')
        reply.file('views/result.html')
      })
}

internals.handleCallback = function (request, reply) {
  const badges = request.payload.badges
  const remote = request.payload.remote
  const error = request.payload.error

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
