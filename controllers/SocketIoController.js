var sockets = require('./../models/Sockets'),
  io;

module.exports = function(socket_io, socket_ionsp) {
  io = socket_io;
};

module.exports.send = function(to, data) {
  var socketUrl;

  socketUrl = sockets.getSocketUrl({
    owner: to
  });

  if (!socketUrl) {
    return false;
  }

  io.to(socketUrl).emit('message', data);
  return true;
}
