angular.module('call')
  .service('callService', ["$log", "$q", "httpService", "pubsub", "pubsubMainEvents", "pubsubChildEvents",
    function($log, $q, httpService, pubsub, pubsubMainEvents, pubsubChildEvents) {
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
          mainEvent: pubsubMainEvents.call_fsm,
          childEvent: pubsubChildEvents.start_call_gui,
          msg: {
            callId: internallCallId
          }
        });
      };

      pubsub.subscribe({
        mainEvent: pubsubMainEvents.global,
        childEvent: pubsubChildEvents.clear_resources,
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

      eventHandlers[pubsubChildEvents.on_local_stream] = self.handleOnLocalStream;
      eventHandlers[pubsubChildEvents.on_remote_stream] = self.handleOnRemoteStream;
      eventHandlers[pubsubChildEvents.on_ice_canditate] = self.handleOnIceCandidate;

      self.handleCallServiceEvent = function() {
        eventHandlers[data.childEvent](data);
      };

      pubsub.subscribe({
        mainEvent: pubsubMainEvents.call_service,
        callback: self.handleCallServiceEvent
      });
    }
  ])
  .run(['callService', function() {}]);
