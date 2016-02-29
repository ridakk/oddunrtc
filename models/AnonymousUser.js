var anonymousUsers = {};

exports.create = function(params) {
  anonymousUsers[params.uuid] = {
    uuid: params.uuid,
    displayName: params.displayName,
    callingTo: params.callingTo,
    type: "user-secret"
  }

  return anonymousUsers[params.uuid];
};

exports.get = function(params) {
  return anonymousUsers[params.uuid];
};

exports.setKey = function(params) {
  if (anonymousUsers[params.uuid]) {
    anonymousUsers[params.uuid][params.key] = params.value;
  }
};
