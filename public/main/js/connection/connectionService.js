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
          socket.on('message', function(data) {
            $log.info("message received", data);

            if (data.type === "call") {
              if (data.action === "start") {
                pubsub.publish({
                  publisher: pubsubSubscriber.connection_service,
                  subscriber: pubsubSubscriber.call_fsm,
                  event: pubsubEvent.on_incoming_call_notify,
                  msg: {
                    from: data.from,
                    // TODO who is adding second data object in message
                    remoteSdp: data.data.msg.sdp,
                    callId: data.data.msg.callId
                  }
                });
              } else if (data.action === "answer") {
                pubsub.publish({
                  publisher: pubsubSubscriber.connection_service,
                  subscriber: pubsubSubscriber.call_fsm,
                  event: pubsubEvent.call_answered_notify,
                  msg: {
                    from: data.from,
                    // TODO who is adding second data object in message
                    sdp: data.data.msg.sdp,
                    callId: data.data.msg.callId
                  }
                });
              } else if (data.action === "candidate") {
                pubsub.publish({
                  publisher: pubsubSubscriber.connection_service,
                  subscriber: pubsubSubscriber.peer_service,
                  event: pubsubEvent.ice_candidate_notify,
                  msg: {
                    candidate: data.data.msg.candidate,
                    callId: data.data.msg.callId
                  }
                });
              }
            }
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
