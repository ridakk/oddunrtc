var logger = require('bunyan').createLogger({
    name: 'routes.SocketIo'
  }),
  connections = require('./../models/Connections'),
  sockets = require('./../models/Sockets'),
  socketioJwt = require('socketio-jwt');

module.exports = function(io) {

  io.use(socketioJwt.authorize({
    secret: 'odun-rtc-jwt-session',
    handshake: true
  }));

  io.on('connection', function(socket) {
    logger.info('socket.decoded_token %j', socket.decoded_token); // this works
    sockets.add({
      user: socket.decoded_token.uuid,
      id: socket.id
    });
    socket.on('disconnect', function() {
      logger.info('user disconnected with id %s', socket.id);
      sockets.remove({
        id: socket.id
      });
    });
  }).on('authenticated', function(socket) {
    //this socket is authenticated, we are good to handle more events from it.
    logger.info('hello! ' + socket.decoded_token);
  });

};
