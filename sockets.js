function Sockets() {
  var sockets = {};

  this.add = function(params){
    if (!sockets[params.user]) {
      sockets[params.user] = [];
    }

    sockets[params.user].push(params.id);
  };

  this.getSocketUrl = function(params) {
    console.log("getSocketUrl %j", params);
    var toSocketUrl = "sockets" + sockets[params.owner][0];
    console.log("toSocketUrl %s", toSocketUrl);
    toSocketUrl = toSocketUrl.replace("sockets/", "/sockets");
    console.log("toSocketUrl %s", toSocketUrl);
    return toSocketUrl;
  };
}

module.exports = new Sockets();
