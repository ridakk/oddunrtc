angular.module('userHome', ['contacts', 'util.pubsub'])
  .controller('userHomeCtrl', ["$scope", "$log", "contactsService", "pubsub", "pubsubSubscriber", "pubsubEvent",
    function($scope, $log, contactsService, pubsub, pubsubSubscriber, pubsubEvent) {
      $log.info("userHomeCtrl initialized...");

      $scope.userList = null;
      $scope.contacts = [];

      contactsService.getContacts().then(function(res) {
        if (res.length > 0) {
          $scope.contacts = res;
        }
      });

      $scope.startCallTo = function(contact) {
        pubsub.publish({
          publisher: pubsubSubscriber.home_ctrl,
          subscriber: pubsubSubscriber.call_fsm,
          event: pubsubEvent.start_call_gui,
          msg: {
            to: contact.uuid
          }
        });
      };

      $scope.searchInputChange = function() {
        contactsService.getUsers($scope.searchInput).then(function(res) {
          $scope.userList = res;
        });
      };

      $scope.addToContacts = function(user) {
        contactsService.addContact(user.uuid).then(function(res) {
          $scope.contacts.push({
            uuid: user.uuid,
            photo: user.photo,
            displayName: user.displayName || user.username || user.email
          });
        });
      };

    }
  ]);
