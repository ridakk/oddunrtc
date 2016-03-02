angular.module('userHome', ['contacts', 'util.pubsub'])
  .controller('userHomeCtrl', ["$scope", "$log", "$stateParams", "contactsService", "pubsub", "pubsubSubscriber", "pubsubEvent",
    function($scope, $log, $stateParams, contactsService, pubsub, pubsubSubscriber, pubsubEvent) {
      var call_state_type = "info", call_state_text;
      $log.info("userHomeCtrl initialized...");
      $log.info("stateParams errorCode: " + $stateParams.errorCode);
      $log.info("stateParams errorText: " + $stateParams.errorText);
      $log.info("stateParams httpCode: " + $stateParams.httpCode);
      $log.info("stateParams state: " + $stateParams.state);

      if($stateParams.state) {
        if ($stateParams.errorCode) {
          call_state_type = "warning"
          $stateParams.state += " - " + $stateParams.errorText
        }
        angular.element(".call-state-field").append("<div class='alert alert-" + call_state_type + " alert-dismissible text-center' role='alert'>" +
          "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" +
          $stateParams.state +
          "</div>");
      }

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
            displayName: user.displayName || user.username || user.email,
            type: user.type
          });
        });
      };

    }
  ]);
