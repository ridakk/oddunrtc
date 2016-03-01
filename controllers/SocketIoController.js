var logger = require('bunyan').createLogger({
    name: 'controllers.SocketIoController'
  }),
  sockets = require('./../models/Sockets'),
  io;

module.exports = function(socket_io) {
  io = socket_io;
};

module.exports.send = function(to, data) {
  var socketUrl;

  logger.info("send to %s", to);
  socketUrl = sockets.getSocketUrl({
    owner: to
  });

  if (!socketUrl) {
    return false;
  }

  logger.info("OOONNUUUUUURRRRR %s", socketUrl);
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
