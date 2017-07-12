const superagent = require('superagent')

let internals = {}

internals.serveHomePage = function (request, reply) {
  reply.file('views/home.html')
}

internals.serveFavicon = function (request, reply) {
  reply('success')
}

internals.serveResultPage = function (request, reply) {
  var repoName = request.params.repoName
  var API_BASE_URL = 'http://34.211.102.93'
  var CALLBACK_URL = 'http://d521c8cd.ngrok.io/callback'

  superagent
    .get(API_BASE_URL + '/badges')
      .query({ download: 'git', remote: repoName, callback: CALLBACK_URL }) // query string
      .end(function (err, res) {
        // Do something
        console.log('Error', err, 'Res', res.body)
        reply.file('views/result.html')
      })
}

internals.handleCallback = function (request, reply) {
  console.log('Trying to connect to socket')
    // global.io.on('connection', function (socket) {
    //   console.log('Connection to socket done');
    //   socket.emit('news', { reqData: request.payload });
    // });
  global.io.sockets.emit('news', { reqData: request.payload })

  reply('success')
}

module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: internals.serveHomePage
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
