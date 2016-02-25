var sockets = require('./../models/Sockets'),
  io, ionsp;

module.exports = function(socket_io, socket_ionsp) {
  io = socket_io;
  ionsp = socket_ionsp;
};

module.exports.send = function(to, data) {
  var socketUrl;

  socketUrl = sockets.getSocketUrl({
    owner: to
  });

  if(!socketUrl){
    return false;
  }

  ionsp.to(socketUrl).emit('message', data);
  return true;
}
