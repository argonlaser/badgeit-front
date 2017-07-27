const Hapi = require('hapi')
const Inert = require('inert')
const Vision = require('vision')
const Routes = require('./routes')
const logger = require('./Logger/winston.js')
const config = require('./config.js')[process.env.NODE_ENV]

const Https = {
  register: require('hapi-require-https'),
  options: {}
}

logger.info('Initialising the routes for the server')
const serverConfig = {}
const server = new Hapi.Server(serverConfig)

const hapiPort = config.SERVER.port
const hapiHost = config.SERVER.host

server.connection({ port: hapiPort, host: hapiHost })

const io = require('socket.io')(server.listener)
global.io = io

server.register([Vision, Inert, Https], (err) => {
  if (err) {
    logger.error('Failed loading plugins: ', err)
    process.exit(1)
  }
  logger.info('Initialising the routes for the server')
  server.route(Routes)

  server.start(() => {
    logger.info('Server running at:', server.info.uri)
  })
})

module.exports = server
