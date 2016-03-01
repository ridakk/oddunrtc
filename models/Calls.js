var calls = {};

exports.create = function(params) {
  calls[params.callId] = {
    callId: params.callId,
    from: params.from,
    to: params.to,
  };

  return params.callId;
};

exports.delete = function(params) {
  delete calls[params.callId];
};

exports.get = function(params) {
  return calls[params.callId];
};
