angular.module('userHome', ['contacts', 'util.pubsub'])
  .controller('userHomeCtrl', ["$scope", "$log", "contactsService", "pubsub", "pubsubSubscriber", "pubsubEvent",
    function($scope, $log, contactsService, pubsub, pubsubSubscriber, pubsubEvent) {
      $log.info("userHomeCtrl initialized...");

      $scope.userList = null;

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

      $scope.searchInputChange = function() {
        contactsService.getUsers($scope.searchInput).then(function(res) {
          $scope.userList = res;
        });
      };

    }
  ]);
