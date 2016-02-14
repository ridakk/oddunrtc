var Q = require("q");
var uuid = require('node-uuid');

function Call() {
  this.calls = {};
}

Call.prototype.create = function(params) {
  var deferred = Q.defer(), callId = uuid.v4();

  this.calls[callId] = {
    callId: callId,
    from: params.from,
    to: params.to,
  }

  deferred.resolve(this.calls[callId]);

  return deferred.promise;
};

module.exports = new Call();
