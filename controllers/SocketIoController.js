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

module.exports.sendToAll = function(to, data) {
  var socketUrlList;

  socketUrlList = sockets.getSocketUrlList({
    owner: to
  });

  if (socketUrlList.length === 0) {
    return false;
  }

  for (var i = 0; i < socketUrlList.length; i++) {
    io.to(socketUrlList[i]).emit('message', data);
  }

  return true;
}
