var Q = require("q"),
  sockets = {};

exports.add = function(params) {
  var socketUrl = params.id.replace("/#", "#");
  if (!sockets[params.user]) {
    sockets[params.user] = [];
  }

  console.log("addind %s to owner %s", socketUrl, params.user);
  sockets[params.user].push(socketUrl);
};

exports.remove = function(params) {
  var i, index, toSocketUrl = params.id.replace("/sockets#", "#");
  console.log("socket to remove %s", params.id);

  for (var i in sockets) {
    if (sockets.hasOwnProperty(i)) {
      index = sockets[i].indexOf(toSocketUrl);

      if (index !== -1) {
        console.log("removing %s from owner %s", toSocketUrl, i);
        sockets[i].splice(index, 1);
      }
    }
  }
};

exports.getSocketUrl = function(params) {
  var toSocketUrl, deferred = Q.defer();
  console.log("getSocketUrl %j", params);

  if (!sockets[params.owner] || !sockets[params.owner][0]) {
    return;
  }

  toSocketUrl = "/sockets" + sockets[params.owner][0];

  deferred.resolve(toSocketUrl);

  console.log("toSocketUrl %s", toSocketUrl);
  return deferred.promise;
};
