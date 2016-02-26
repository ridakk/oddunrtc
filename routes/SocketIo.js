var connections = require('./../models/Connections'),
  sockets = require('./../models/Sockets');

module.exports = function(io, ionsp) {
  io.use(function(socket, next) {
    var params = JSON.parse(socket.handshake.query.serverparams),
      conn = connections.get(params.user);

    console.log("connections: %s", conn);
    console.log("io request from user: %s with uuid: %s", params.user, params.uuid);
    if (!params.user || !params.uuid || !conn || conn !== params.uuid) {
      console.log("not authorized");
      next(new Error('not authorized'));
    } else {
      sockets.add({
        user: params.user,
        id: socket.id
      })

      next();
    }
  });

  ionsp.on('connection', function(socket) {
    console.log('a user connected with id %s', socket.id);
    socket.on('disconnect', function() {
      console.log('user disconnected with id %s', socket.id);
      sockets.remove({
        id: socket.id
      });
    });
  });

};
