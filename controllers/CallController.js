var logger = require('bunyan').createLogger({
    name: 'controllers.CallController'
  }),
  SocketIoCtrl = require('./../controllers/SocketIoController'),
  Q = require("q"),
  Calls = require('./../models/Calls');

function isCallIdExists(callId) {
  return Calls.get({
    callId: callId
  }) ? true : false;
}

exports.handlePost = function(params) {
  var deferred = Q.defer(),
    retVal,
    reqUserDisplayName;

  if (isCallIdExists(params.callId)) {
    deferred.reject({
      httpCode: 403,
      errorCode: 1001,
      errorText: "call id exists"
    });
    return deferred.promise;
  }

  reqUserDisplayName = params.reqUser.displayName || params.reqUser.username || params.reqUser.email;

  Calls.create({
    callId: params.callId,
    ownerUuid: params.reqUser.uuid,
    ownerDisplayName: reqUserDisplayName,
    ownerSocketId: params.reqData.socketId,
    targetUuid: params.reqData.to,
    targetSocketId: null,
  });

  params.reqData.from = reqUserDisplayName;
  retVal = SocketIoCtrl.sendToAll(params.reqData.to, params.reqData);

  if (retVal) {
    deferred.resolve({
      httpCode: 201
    });
  } else {
    deferred.reject({
      httpCode: 404,
      errorCode: 1002,
      errorText: "target not found"
    });
  }

  return deferred.promise;
};

exports.handlePut = function(params) {
  var deferred = Q.defer(),
    internalCall,
    retVal, socketUrl;

  if (!isCallIdExists(params.callId)) {
    deferred.reject({
      httpCode: 404,
      errorCode: 1003,
      errorText: "call id not found"
    });
    return deferred.promise;
  }

  internalCall = Calls.get({
    callId: params.callId
  });

  if (params.reqData.action === "accept") {
    internalCall.targetSocketId = params.reqData.socketId;
  }

  if (internalCall.ownerUuid === params.reqUser.uuid) {
    socketUrl = internalCall.targetSocketId;
  } else {
    socketUrl = internalCall.ownerSocketId;
  }

  retVal = SocketIoCtrl.sendToSocketUrl(socketUrl, params.reqData);

  if (retVal) {
    deferred.resolve({
      httpCode: 200
    });
  } else {
    deferred.reject({
      httpCode: 404,
      errorCode: 1004,
      errorText: "target not found"
    });
  }

  return deferred.promise;
};

exports.handleDelete = function(params) {
  var internalCall,
    socketUrl;

  if (!isCallIdExists(params.callId)) {
    return;
  }

  internalCall = Calls.get({
    callId: params.callId
  });

  if (internalCall.ownerUuid === params.reqUser.uuid) {
    socketUrl = internalCall.targetSocketId;
  } else {
    socketUrl = internalCall.ownerSocketId;
  }

  SocketIoCtrl.sendToSocketUrl(socketUrl, params.reqData);

  return;
};
