angular.module('call')
  .service('callService', ["$log", "$q", "httpService", "pubsub", "pubsubMainEvents", "pubsubChildEvents",
    function($log, $q, httpService, pubsub, pubsubMainEvents, pubsubChildEvents) {
      var self = this,
        calls = {};

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
    }
  ])
  .run(['callService', function() {}]);
