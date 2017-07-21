const Hapi = require('hapi')
const Inert = require('inert')
const Vision = require('vision')
const Routes = require('./routes')
const logger = require('./Logger/winston.js')
const config = require('./config.js')

const Https = {
  register: require('hapi-require-https'),
  options: {}
}

const serverConfig = {}
const server = new Hapi.Server(serverConfig)

const port = config.SERVER.port
const host = config.SERVER.host
logger.info('START:', port, host)

server.connection({ port: port, host: host })

const io = require('socket.io')(server.listener)
global.io = io

server.register([Vision, Inert, Https], function (err) {
  if (err) {
    logger.error('Failed loading plugins')
    process.exit(1)
  }
  logger.info('Initialising the routes for the server')
  server.route(Routes)

  server.start(function () {
    logger.info('Server running at:', server.info.uri)
  })
})

module.exports = server
