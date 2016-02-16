angular.module('call')
  .service('callService', ["$log", "$q", "userService", "httpService", "pubsub", "pubsubSubscriber", "pubsubEvent", "callType",
    function($log, $q, userService, httpService, pubsub, pubsubSubscriber, pubsubEvent, callType) {
      var self = this,
        calls = {},
        eventHandlers = {};

      self.onLocalStreamAdded = function() {};
      self.onRemoteStreamAdded = function() {};

      pubsub.subscribe({
        subscriber: pubsubSubscriber.global,
        event: pubsubEvent.clear_resources,
        callback: function(data) {
          $log.info("call service: deleting call object: " + data.msg.callId);

          delete calls[data.msg.callId];
        }
      });

      self.isIncomingCall = function(data){
        return calls[data.callId].type === callType.incoming;
      };

      self.answer = function(data) {
        pubsub.publish({
          publisher: pubsubSubscriber.call_service,
          subscriber: pubsubSubscriber.call_fsm,
          event: pubsubEvent.answer_call_gui,
          msg: {
            callId: data.callId
          }
        });
      };

      self.end = function (data) {
        pubsub.publish({
          publisher: pubsubSubscriber.call_service,
          subscriber: pubsubSubscriber.call_fsm,
          event: pubsubEvent.end_call_gui,
          msg: {
            callId: data.callId
          }
        });
      };

      self.handleOnLocalStream = function(data) {
        self.onLocalStreamAdded(data.msg.stream);
      };

      self.handleOnRemoteStream = function(data) {
        self.onRemoteStreamAdded(data.msg.stream);
      };

      self.handleOnIceCandidate = function(data) {
        // TODO implement callHttpService
        // TODO send candidate to remote party
      };

      self.handleSendCallRequest = function(data) {
        var internalCall = calls[data.msg.callId];
        // TODO send call request to server
        httpService.post({
          url: window.location.origin + "/call",
          //timeout: 30000,
          data: {
            type: "call",
            from: userService.email,
            to: internalCall.target,
            action: "start",
            data: {
              sdp: data.msg.sdp
            }
          }
        }).then(function(res) {
          internalCall.serverCallId = res.callId;
          pubsub.publish({
            publisher: pubsubSubscriber.call_service,
            subscriber: pubsubSubscriber.call_fsm,
            event: pubsubEvent.send_call_request_success,
            msg: {
              callId: data.msg.callId
            }
          });
        }, function(error) {
          pubsub.publish({
            publisher: pubsubSubscriber.call_service,
            subscriber: pubsubSubscriber.call_fsm,
            event: pubsubEvent.send_call_request_failure,
            msg: {
              error: error,
              callId: data.msg.callId
            }
          });
        });
      };

      self.handleCreateCall = function(data) {
        calls[data.msg.callId] = {
          type: data.msg.type,
          serverCallId: data.msg.serverCallId,
          target: data.msg.target
        };
      };

      self.handleCreateOutgoingCall = function(data) {
        data.msg.type = callType.outgoing;
        self.handleCreateCall(data);
      };

      self.handleCreateIncomingCall = function(data) {
        data.msg.type = callType.incoming;
        self.handleCreateCall(data);
      };

      eventHandlers[pubsubEvent.on_local_stream] = self.handleOnLocalStream;
      eventHandlers[pubsubEvent.on_remote_stream] = self.handleOnRemoteStream;
      eventHandlers[pubsubEvent.on_ice_canditate] = self.handleOnIceCandidate;
      eventHandlers[pubsubEvent.send_call_request] = self.handleSendCallRequest;
      eventHandlers[pubsubEvent.create_outgoing_call] = self.handleCreateOutgoingCall;
      eventHandlers[pubsubEvent.create_incoming_call] = self.handleCreateIncomingCall;

      self.handleCallServiceEvent = function(data) {
        eventHandlers[data.event](data);
      };

      pubsub.subscribe({
        subscriber: pubsubSubscriber.call_service,
        callback: self.handleCallServiceEvent
      });
    }
  ])
  .constant("callType", {
    outgoing: "outgoing",
    incoming: "incoming"
  })
  .run(['callService', function() {}]);
