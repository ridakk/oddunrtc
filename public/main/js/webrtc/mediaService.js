angular.module('webrtc.mediaService', ['util.pubsub'])
  .service('mediaService', ["$log", "pubsub", "pubsubMainEvents", "pubsubChildEvents",
    function($log, pubsub, pubsubMainEvents, pubsubChildEvents) {
      var self = this;

      pubsub.subscribe({
        mainEvent: pubsubMainEvents.media_service,
        childEvent: pubsubChildEvents.request_media_permission,
        callback: function(data) {
          getUserMedia(data.msg.constraints, function(stream) {
            pubsub.publish({
              mainEvent: pubsubMainEvents.call_fsm,
              childEvent: pubsubChildEvents.media_permission_granted,
              msg: {
                stream: stream,
                callId: data.msg.callId
              }
            });
          }, function(error) {
            pubsub.publish({
              mainEvent: pubsubMainEvents.call_fsm,
              childEvent: pubsubChildEvents.media_permission_rejected,
              msg: {
                error: error,
                callId: data.msg.callId
              }
            });
          });
        }
      });
    }
  ])
  .run(['mediaService', function() {}]);
