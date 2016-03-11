var logger = require('bunyan').createLogger({
    name: 'controllers.CallController'
  }),
  SocketIoCtrl = require('./../controllers/SocketIoController'),
  MissedCallsCtrl = require('./../controllers/MissedCallsController'),
  Q = require("q"),
  Sockets = require('./../models/Sockets'),
  Calls = require('./../models/Calls');

function isCallIdExists(callId) {
  return Calls.get({
    callId: callId
  }) ? true : false;
}

//TODO need to figure out a proper way of colleting call metrics
//TODO answered call count, declined call count etc...

exports.handlePost = function(params) {
  var deferred = Q.defer(),
    retVal,
    reqUserDisplayName,
    socketListForPost = Sockets.getSocketUrlList({owner: params.reqData.to}),
    socketListForDelete = Sockets.getSocketUrlList({owner: params.reqData.to});

  socketListForDelete[socketListForDelete.length] = params.reqData.socketId;

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
    ownerPhoto: params.reqUser.photo,
    ownerType: params.reqUser.type,
    ownerSocketId: params.reqData.socketId,
    targetUuid: params.reqData.to,
    targetSocketId: null,
    sendCancelTimeout: setTimeout(function() {
      MissedCallsCtrl.add({
        uuid: params.reqData.to,
        missedCall: {
          fromUuid: params.reqUser.uuid,
          fromDisplayName: reqUserDisplayName,
          fromPhoto: params.reqUser.photo,
          fromType: params.reqUser.type,
          date: Date(),
          reason: 1002
        }
      });

      exports.handleDelete({
        callId: params.callId,
        reqData: {
          type: "call",
          action: "end",
          to: params.reqData.to,
          data: {
            msg: {
              callId: params.callId
            }
          }
        },
        socketUrlList: socketListForDelete,
        serverCancel: true
      });
    }, 120000, MissedCallsCtrl, exports.handleDelete, params)
  });

  //TODO do we need to check is reqData.to exists in db or not?

  params.reqData.from = reqUserDisplayName;
  params.reqData.fromPhoto = params.reqUser.photo;
  params.reqData.fromType = params.reqUser.type;
  retVal = SocketIoCtrl.sendToList(socketListForPost, params.reqData);

  if (retVal) {
    deferred.resolve({
      httpCode: 201
    });
  } else {
    MissedCallsCtrl.add({
      uuid: params.reqData.to,
      missedCall: {
        fromUuid: params.reqUser.uuid,
        fromDisplayName: reqUserDisplayName,
        fromPhoto: params.reqUser.photo,
        fromType: params.reqUser.type,
        date: Date(),
        reason: 1002
      }
    });

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

  //TODO check is owner of call object and reqUser is same, send 405 otherwise
  //TODO how to authorize put requests from target ?
  //TODO validating with owner or target uuid will lead other instance of same
  //TODO user to interact with call that is running on a different instance
  //TODO if ok, this can be considered a way of call grab?

  if (params.reqData.action === "accept") {
    clearTimeout(internalCall.sendCancelTimeout);
    internalCall.targetSocketId = params.reqData.socketId;
    exports.handleDelete({
      callId: params.callId,
      socketUrlList: Sockets.getAllExceptOwner({
        owner: internalCall.targetUuid,
        ownerSocketId: internalCall.targetSocketId
      }),
      serverCancel: true
    });
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
  var internalCall, i = 0;
      socketUrlList = [];

  if (!isCallIdExists(params.callId)) {
    return;
  }

  internalCall = Calls.get({
    callId: params.callId
  });
  //TODO check is owner of call object and reqUser is same, send 405 otherwise
  //TODO how to authorize put requests from target ?
  //TODO validating with owner or target uuid will lead other instance of same
  //TODO user to end a call that is running on a different instance

  if (params.serverCancel) {
    socketUrlList = params.socketUrlList;
  } else {
    //TODO duplicate lines in handle
    if (internalCall.ownerUuid === params.reqUser.uuid) {
      socketUrlList[i] = internalCall.targetSocketId;
    } else {
      socketUrlList[i] = internalCall.ownerSocketId;
    }
  }
  SocketIoCtrl.sendToList(socketUrlList, params.reqData);

  return;
};
