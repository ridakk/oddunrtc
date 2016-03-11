var logger = require('bunyan').createLogger({
    name: 'models.Sockets'
  }),
  Q = require("q"),
  sockets = {};

exports.add = function(params) {
  if (!sockets[params.user]) {
    sockets[params.user] = [];
  }

  logger.info("addind %s to owner %s", params.id, params.user);
  sockets[params.user].push(params.id);
};

exports.remove = function(params) {
  var i, index, toSocketUrl = params.id;
  logger.info("socket to remove %s", params.id);

  for (var i in sockets) {
    if (sockets.hasOwnProperty(i)) {
      index = sockets[i].indexOf(toSocketUrl);

      if (index !== -1) {
        logger.info("removing %s from owner %s", toSocketUrl, i);
        sockets[i].splice(index, 1);
      }
    }
  }
};

exports.getSocketUrl = function(params) {
  var toSocketUrl;
  logger.info("getSocketUrl %j", params);

  if (!sockets[params.owner] || !sockets[params.owner][0]) {
    return;
  }

  toSocketUrl = sockets[params.owner][0];

  logger.info("toSocketUrl %s", toSocketUrl);
  return toSocketUrl;
};

exports.getSocketUrlList = function(params) {
  var toSocketUrlList = [];
  logger.info("getSocketUrlList %j", params);

  if (!sockets[params.owner]) {
    return toSocketUrlList;
  }

  for (var i = 0; i < sockets[params.owner].length; i++) {
    toSocketUrlList[i] = sockets[params.owner][i];
  }

  logger.info("toSocketUrlList %s", toSocketUrlList.toString());
  return toSocketUrlList;
};

exports.getAllExceptOwner = function(params) {
  var toSocketUrlList = exports.getSocketUrlList(params);
  logger.info("getAllExceptOwner %j", params);

  for (var i = 0; i < toSocketUrlList.length; i++) {
    if (toSocketUrlList[i] === params.ownerSocketId) {
      toSocketUrlList.splice(i, 1);
    }
  }
  return toSocketUrlList;
}
