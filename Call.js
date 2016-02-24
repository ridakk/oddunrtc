var Q = require("q"),
  uuid = require('node-uuid'),
  calls = {};

exports.create = function(params) {
  var deferred = Q.defer(),
    callId = uuid.v4();

  calls[callId] = {
    callId: callId,
    from: params.from,
    to: params.to,
  }

  deferred.resolve(calls[callId]);

  return deferred.promise;
};

exports.delete = function(params) {
  delete calls[params.callId];
};
