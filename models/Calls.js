var calls = {};

exports.create = function(params) {
  calls[params.callId] = {};

  for (var i in params) {
    if (params.hasOwnProperty(i)) {
      calls[params.callId][i] = params[i];
    }
  }

  return params.callId;
};

exports.delete = function(params) {
  delete calls[params.callId];
};

exports.get = function(params) {
  return calls[params.callId];
};
