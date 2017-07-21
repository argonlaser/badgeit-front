const Hapi = require('hapi')
const Inert = require('inert')
const Vision = require('vision')
const Routes = require('./routes')
const logger = require('./Logger/winston.js')
const Https = {
  register: require('hapi-require-https'),
  options: {}
}

const config = {}
const server = new Hapi.Server(config)

const port = process.env.BADGEIT_FRONT_PORT
const host = process.env.BADGEIT_FRONT_HOST
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
