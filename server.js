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
