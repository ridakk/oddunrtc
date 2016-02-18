angular.module('call')
  .service('callService', ["$log", "$q", "userService", "httpService", "httpRequestType", "pubsub", "pubsubSubscriber", "pubsubEvent", "callType",
    function($log, $q, userService, httpService, httpRequestType, pubsub, pubsubSubscriber, pubsubEvent, callType) {
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

      self.isIncomingCall = function(data) {
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

      self.end = function(data) {
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

      self.sendCallRequest = function(data) {
        var internalCall = calls[data.msg.callId];

        return httpService[data.method]({
          url: window.location.origin + "/call/" + data.msg.callId,
          //timeout: 30000,
          data: {
            type: data.type,
            action: data.action,
            from: userService.email,
            to: internalCall.from,
            data: {
              msg: data.msg
            }
          }
        }).then(function(res) {
          pubsub.publish({
            publisher: pubsubSubscriber.call_service,
            subscriber: pubsubSubscriber.call_fsm,
            event: data.successEvent,
            msg: {
              callId: data.msg.callId
            }
          });
        }, function(error) {
          pubsub.publish({
            publisher: pubsubSubscriber.call_service,
            subscriber: pubsubSubscriber.call_fsm,
            event: data.failureEvent,
            msg: {
              error: error,
              callId: data.msg.callId
            }
          });
        });
      };

      self.handleSendStartCallRequest = function(data) {
        data.method = httpRequestType.post;
        data.type = "call";
        data.action = "start";
        data.successEvent = pubsubEvent.send_start_call_request_success;
        data.failureEvent = pubsubEvent.send_start_call_request_failure;
        self.sendCallRequest(data);
      };

      self.handleSendAnswerCallRequest = function(data) {
        data.method = httpRequestType.put;
        data.type = "call";
        data.action = "answer";
        data.successEvent = pubsubEvent.send_answer_call_request_success;
        data.failureEvent = pubsubEvent.send_answer_call_request_failure;
        self.sendCallRequest(data);
      };

      self.handleSendAcceptCallRequest = function(data) {
        data.method = httpRequestType.put;
        data.type = "call";
        data.action = "accept";
        data.successEvent = pubsubEvent.send_accept_call_request_success;
        data.failureEvent = pubsubEvent.send_accept_call_request_failure;
        self.sendCallRequest(data);
      };

      self.handleOnIceCandidate = function(data) {
        var internalCall = calls[data.msg.callId];

        httpService.put({
          url: window.location.origin + "/call/" + data.msg.callId,
          //timeout: 30000,
          data: {
            type: "call",
            action: "candidate",
            from: userService.email,
            to: internalCall.from,
            data: {
              msg: data.msg
            }
          }
        })
      };

      self.handleCreateCall = function(data) {
        calls[data.msg.callId] = {
          type: data.msg.type,
          from: data.msg.from
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
      eventHandlers[pubsubEvent.send_start_call_request] = self.handleSendStartCallRequest;
      eventHandlers[pubsubEvent.send_answer_call_request] = self.handleSendAnswerCallRequest;
      eventHandlers[pubsubEvent.send_accept_call_request] = self.handleSendAcceptCallRequest;
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
