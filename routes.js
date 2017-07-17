const superagent = require('superagent')

let internals = {}
let clients = []

internals.serveHomePage = function (request, reply) {
  console.log('serveHomePage | Serve Home')
  reply.file('views/home.html')
}

internals.serveFavicon = function (request, reply) {
  console.log('serveFavicon | Serve Favicon')
  reply('success')
}

internals.serveResultPage = function (request, reply) {
  var repoName = request.params.repoName
  var API_BASE_URL = 'http://34.211.102.93'
  var domain

  if (process.env.NODE_ENV === 'production') {
    console.log('serveResultPage True', ' | ', 'ENV : ', process.env.NODE_ENV)
    domain = 'https://badgeit-front.now.sh'
  } else {
    console.log('serveResultPage False', ' | ', 'ENV : ', process.env.NODE_ENV)
    domain = 'https://9a101710.ngrok.io'
  }
  var CALLBACK_URL = domain + '/callback'

  console.log('serveResultPage', '|', 'callback url:', CALLBACK_URL)

  superagent
    .get(API_BASE_URL + '/badges')
      .query({ download: 'git', remote: repoName, callback: CALLBACK_URL }) // query string
      .end(function (err, res) {
        // Do something
        console.log('POST /badges | ', 'Error: ', err)
        reply.file('views/result.html')
      })
}

internals.handleCallback = function (request, reply) {
  console.log('In handleCallback | ' + request.payload)
  global.io.sockets.on('connection', function (socket) {
    // Socket connected
    console.log('Socket connected| (New client id=' + socket.id + ').')

    // Save the socket id to redis store
    clients.push(socket)

    // Send an event once socket is connected
    console.log('Data emitted: | (New client id=' + socket.id + ').')
    socket.emit('news', { reqData: request.payload })

    // Remove the socket on disconnection
    socket.on('disconnect', function () {
      var socketIndex = clients.indexOf(socket)
      if (socketIndex !== -1) {
        clients.splice(socketIndex, 1)
        console.info('Client gone (id=' + socket.id + ').')
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
