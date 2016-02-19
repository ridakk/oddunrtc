angular.module('util.location', ['ui.router' ,'util.pubsub'])
  .service('locationService', ["$rootScope", "$state", "pubsub", "pubsubSubscriber", "pubsubEvent",
    function($rootScope, $state, pubsub, pubsubSubscriber, pubsubEvent) {
      var self = this,
        eventHandlers = {};

      self.handleChangeUrlToCall = function(data) {
        $state.go('call', {
          callId: data.msg.callId
        });
      };

      eventHandlers[pubsubEvent.change_url_to_call] = self.handleChangeUrlToCall;

      self.handleLocationServiceEvent = function(data) {
        eventHandlers[data.event](data);
      };

      pubsub.subscribe({
        subscriber: pubsubSubscriber.location_service,
        callback: self.handleLocationServiceEvent
      });
    }
  ])
  .run(['locationService', function() {}]);
