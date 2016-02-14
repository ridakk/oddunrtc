var Q = require("q");

function Sockets() {
  var sockets = {};

  this.add = function(params) {
    if (!sockets[params.user]) {
      sockets[params.user] = [];
    }

    sockets[params.user].push(params.id);
  };

  this.getSocketUrl = function(params) {
    var toSocketUrl, deferred = Q.defer();
    console.log("getSocketUrl %j", params);

    if (!sockets[params.owner] || !sockets[params.owner][0]) {
      deferred.reject();
      return;
    }

    toSocketUrl = "sockets" + sockets[params.owner][0];
    console.log("toSocketUrl %s", toSocketUrl);
    toSocketUrl = toSocketUrl.replace("sockets/", "/sockets");

    deferred.resolve(toSocketUrl);

    console.log("toSocketUrl %s", toSocketUrl);
    return deferred.promise;
  };
}

module.exports = new Sockets();
