const logger = require('../Logger/winston.js')

module.exports = function (request, reply) {
  const badges = request.payload.badges
  const remote = request.payload.remote
  const error = request.payload.error

  if (error) {
    logger.error('handleCallback', error)
    reply('Error', error).code(404)
    return
  }

  logger.info('In handleCallback | ', 'Remote: ', remote)

  var nsp = global.io.of('/w/' + remote)
  nsp.once('connection', (socket) => {
    // Socket connected
    logger.info('Socket connected| (New client id=' + socket.id + ').')

    // Send an event once socket is connected
    logger.info('Data emitted: | (New client id=' + socket.id + ').')

    nsp.emit('news', { reqData: badges })
    // Remove the socket on disconnection
    socket.on('disconnect', () => {
      logger.info('Client gone (id=' + socket.id + ').')
    })
  })
  reply('success')
}
