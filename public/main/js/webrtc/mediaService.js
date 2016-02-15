angular.module('webrtc.mediaService', ['util.pubsub'])
  .service('mediaService', ["$log", "pubsub", "pubsubSubscriber", "pubsubEvent",
    function($log, pubsub, pubsubSubscriber, pubsubMessage) {
      var self = this;

      pubsub.subscribe({
        subscriber: pubsubSubscriber.media_service,
        event: pubsubMessage.request_media_permission,
        callback: function(data) {
          getUserMedia(data.msg.constraints, function(stream) {
            pubsub.publish({
              publisher: pubsubSubscriber.media_service,
              subscriber: pubsubSubscriber.call_fsm,
              event: pubsubMessage.media_permission_granted,
              msg: {
                stream: stream,
                callId: data.msg.callId
              }
            });
          }, function(error) {
            pubsub.publish({
              publisher: pubsubSubscriber.media_service,
              subscriber: pubsubSubscriber.call_fsm,
              event: pubsubMessage.media_permission_rejected,
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
