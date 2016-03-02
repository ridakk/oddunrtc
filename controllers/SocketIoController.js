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

  return this.sendToSocketUrl(socketUrl, data);
};

module.exports.sendToSocketUrl = function(url, data) {
  if (!url) {
    return false;
  }

  logger.info("send to %s", url);
  io.to(url).emit('message', data);
  return true;
};

module.exports.sendToAll = function(to, data) {
  var socketUrlList;

  socketUrlList = sockets.getSocketUrlList({
    owner: to
  });

  if (socketUrlList && socketUrlList.length === 0) {
    return false;
  }

  for (var i = 0; i < socketUrlList.length; i++) {
    io.to(socketUrlList[i]).emit('message', data);
  }

  return true;
};

module.exports.sendToAllExceptOwner = function(to, ownerSocket, data) {
  var socketUrlList;

  socketUrlList = sockets.getSocketUrlList({
    owner: to
  });

  if (socketUrlList.length === 0) {
    return false;
  }

  for (var i = 0; i < socketUrlList.length; i++) {
    if (socketUrlList[i] !== ownerSocket) {
      io.to(socketUrlList[i]).emit('message', data);
    }
  }

  return true;
};
