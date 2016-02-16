angular.module('connection')
  .service('connectionService', ["$rootScope", "$log", "httpService", "$location", "pubsub", "pubsubSubscriber", "pubsubEvent",
    function($rootScope, $log, httpService, $location, pubsub, pubsubSubscriber, pubsubEvent) {
      var self = this,
        socket;

      self.openConnection = function(email) {
        return httpService.post({
          url: window.location.origin + "/connections",
          data: {
            email: email
          }
        }).then(function(data) {
          socket = io(data.url, {
            query: 'serverparams=' + JSON.stringify({
              user: email,
              uuid: data.uuid
            })
          });
          socket.on('message', function(msg) {
            $log.info("message received", msg);

            pubsub.publish({
              publisher: pubsubSubscriber.connection_service,
              subscriber: pubsubSubscriber.call_fsm,
              event: pubsubEvent.on_incoming_call_notify,
              msg: {
                target: msg.from,
                remoteSdp: msg.data.sdp,
                callId: msg.callId
              }
            });
          });
        });
      };

      self.sendMessage = function() {
        socket.emit('message', {
          to: "test2@test.com",
          text: "hey you!"
        });
      };
    }
  ]);
