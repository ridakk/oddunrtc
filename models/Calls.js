var uuid = require('node-uuid'),
  calls = {};

exports.create = function(params) {
  var callId = uuid.v4();

  calls[callId] = {
    callId: callId,
    from: params.from,
    to: params.to,
  }

  return callId;
};

exports.delete = function(params) {
  delete calls[params.callId];
};
