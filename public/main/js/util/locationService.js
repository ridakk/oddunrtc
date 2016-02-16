angular.module('util.location', ['util.pubsub'])
  .service('locationService', ["$rootScope", "$location", "pubsub", "pubsubSubscriber", "pubsubEvent",
    function($rootScope, $location, pubsub, pubsubSubscriber, pubsubEvent) {
      var self = this,
        eventHandlers = {};

      self.handleChangeUrlToCall = function(data) {
        $rootScope.$apply(function() {
          $location.url('/call/' + data.msg.callId);
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
