var connections = require('./../models/Connections'),
  sockets = require('./../models/Sockets'),
  socketioJwt = require('socketio-jwt');

module.exports = function(io) {

  io.use(socketioJwt.authorize({
    secret: 'odun-rtc-jwt-session',
    handshake: true
  }));

  io.on('connection', function(socket) {
    console.log('socket.decoded_token %j', socket.decoded_token); // this works
    socket.on('disconnect', function() {
      console.log('user disconnected with id %s', socket.id);
      sockets.remove({
        id: socket.id
      });
    });
  }).on('authenticated', function(socket) {
    //this socket is authenticated, we are good to handle more events from it.
    console.log('hello! ' + socket.decoded_token);
  });

};
