var logger = require('bunyan').createLogger({
    name: 'models.Sockets'
  }),
  Q = require("q"),
  sockets = {};

exports.add = function(params) {
  var socketUrl = params.id.replace("/#", "#");
  if (!sockets[params.user]) {
    sockets[params.user] = [];
  }

  logger.debug("addind %s to owner %s", socketUrl, params.user);
  sockets[params.user].push(socketUrl);
};

exports.remove = function(params) {
  var i, index, toSocketUrl = params.id.replace("/sockets#", "#");
  logger.debug("socket to remove %s", params.id);

  for (var i in sockets) {
    if (sockets.hasOwnProperty(i)) {
      index = sockets[i].indexOf(toSocketUrl);

      if (index !== -1) {
        logger.trace("removing %s from owner %s", toSocketUrl, i);
        sockets[i].splice(index, 1);
      }
    }
  }
};

exports.getSocketUrl = function(params) {
  var toSocketUrl, deferred = Q.defer();
  logger.debug("getSocketUrl %j", params);

  if (!sockets[params.owner] || !sockets[params.owner][0]) {
    return;
  }

  toSocketUrl = "/sockets" + sockets[params.owner][0];

  deferred.resolve(toSocketUrl);

  logger.trace("toSocketUrl %s", toSocketUrl);
  return deferred.promise;
};

exports.getSocketUrlList = function(params) {
  var toSocketUrlList = [],
    deferred = Q.defer();
  logger.debug("getSocketUrlList %j", params);

  if (!sockets[params.owner]) {
    return;
  }

  for (var i = 0; i < sockets[params.owner].length; i++) {
    toSocketUrlList[i] = "/sockets" + sockets[params.owner][i];
  }

  deferred.resolve(toSocketUrlList);

  logger.trace("toSocketUrlList %s", toSocketUrlList.toString());
  return deferred.promise;
};
