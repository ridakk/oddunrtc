angular.module('home')
  .controller('HomeCtrl', ["$rootScope", "$scope", "$log", "connectionService", "userService", "contactsService", "pubsub", "pubsubSubscriber", "pubsubEvent",
    function($rootScope, $scope, $log, connectionService, userService, contactsService, pubsub, pubsubSubscriber, pubsubEvent) {
      $log.info("HomeCtrl initialized...");

      $scope.user = userService;
      $scope.contacts = [];

      connectionService.getConnection();

      contactsService.get(userService.email).then(function(res) {
        $scope.contacts = res;
      });

      $scope.startCallTo = function(contact) {
        pubsub.publish({
          publisher: pubsubSubscriber.home_ctrl,
          subscriber: pubsubSubscriber.call_fsm,
          event: pubsubEvent.start_call_gui,
          msg: {
            from: contact
          }
        });
      };

    }
  ]);
