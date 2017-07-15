const Hapi = require('hapi')
const Inert = require('inert')
const Vision = require('vision')
const Routes = require('./routes')
var sio = require("socket.io");

const Https = {
  register: require('hapi-require-https'),
  options: {}
}

const config = {}
const server = new Hapi.Server(config)

const port = process.env.BADGEIT_FRONT_PORT
const host = process.env.BADGEIT_FRONT_HOST
console.log('START:', port, host)

server.connection({ port: port, host: host })

const io = sio(server.listener)
global.io = io
global.clients = []

let clients = []
//
// global.io.sockets.on('connection', function(socket) {
//     console.log('Socket connected| (New client id=' + socket.id + ').');
//     // Save the socket id to redis store
//     global.clients.push(socket)
//
//     // Send an event once socket is connected
//   socket.on('news', global.newsHandler(socket, data))
// })

// io.on('connection', function (socket) {
//   socket.emit('news', { hello: 'world' });
//   socket.on('my other event', function (data) {
//     console.log(data);
//   });
// });

// In this example we have one master client socket
// that receives messages from others.

// io.sockets.on('connection', function(socket) {
//   console.log('Socket connected| (New client id=' + socket.id + ').');
//   // Save the socket id to redis store
//   clients.push(socket)
//
//   // Remove the socket on disconnection
//   socket.on('disconnect', function() {
//         var socketIndex = clients.indexOf(socket);
//         if (socketIndex != -1) {
//             clients.splice(socketIndex, 1);
//             console.info('Client gone (id=' + socket.id + ').');
//         }
//     });

// });

server.register([Vision, Inert, Https], function (err) {
  if (err) {
    console.error('Failed loading plugins')
    process.exit(1)
  }

  server.route(Routes)

  server.start(function () {
    console.log('Server running at:', server.info.uri)
  })
})

module.exports = server
