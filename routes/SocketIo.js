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

    // store socket via user uuid
    sockets.add({
      user: socket.decoded_token.uuid,
      id: socket.id
    });

    // bounce back socket id to socket owner
    socket.emit('session', { id: socket.id });

    socket.on('disconnect', function() {
      logger.info('user disconnected with id %s', socket.id);
      sockets.remove({
        id: socket.id
      });
    });
  });

};
