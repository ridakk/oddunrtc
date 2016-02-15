angular.module('call')
  .service('callService', ["$log", "$q", "userService", "httpService", "pubsub", "pubsubSubscriber", "pubsubEvent",
    function($log, $q, userService, httpService, pubsub, pubsubSubscriber, pubsubEvent) {
      var self = this,
        calls = {},
        eventHandlers = {};

      self.onLocalStreamAdded = function() {};
      self.onRemoteStreamAdded = function() {};

      self.start = function(params) {
        var internallCallId = UUID.generate();
        calls[internallCallId] = {
          target: params.to
        };

        pubsub.publish({
          publisher: pubsubSubscriber.call_service,
          subscriber: pubsubSubscriber.call_fsm,
          event: pubsubEvent.start_call_gui,
          msg: {
            callId: internallCallId
          }
        });
      };

      pubsub.subscribe({
        subscriber: pubsubSubscriber.global,
        event: pubsubEvent.clear_resources,
        callback: function(data) {
          $log.info("call service: deleting call object: " + data.msg.callId);

          delete calls[data.msg.callId];
        }
      });

      self.handleOnLocalStream = function(data) {
        self.onLocalStreamAdded(data.msg.stream);
      };

      self.handleOnRemoteStream = function(data) {
        self.onLocalRemoteAdded(data.msg.stream);
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
          timeout: 5000, 
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

      eventHandlers[pubsubEvent.on_local_stream] = self.handleOnLocalStream;
      eventHandlers[pubsubEvent.on_remote_stream] = self.handleOnRemoteStream;
      eventHandlers[pubsubEvent.on_ice_canditate] = self.handleOnIceCandidate;
      eventHandlers[pubsubEvent.send_call_request] = self.handleSendCallRequest;

      self.handleCallServiceEvent = function(data) {
        eventHandlers[data.event](data);
      };

      pubsub.subscribe({
        subscriber: pubsubSubscriber.call_service,
        callback: self.handleCallServiceEvent
      });
    }
  ])
  .run(['callService', function() {}]);
