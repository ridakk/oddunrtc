angular.module('userHome', ['contacts', 'util.pubsub', 'user'])
  .controller('userHomeCtrl', ["$scope", "$log", "$stateParams", "contactsService", "userService", "pubsub", "pubsubSubscriber", "pubsubEvent",
    function($scope, $log, $stateParams, contactsService, userService, pubsub, pubsubSubscriber, pubsubEvent) {
      var call_state_type = "info",
        call_state_text;
      $log.info("userHomeCtrl initialized...");
      $log.info("stateParams errorCode: " + $stateParams.errorCode);
      $log.info("stateParams errorText: " + $stateParams.errorText);
      $log.info("stateParams httpCode: " + $stateParams.httpCode);
      $log.info("stateParams state: " + $stateParams.state);

      //TODO: all controllers should also wait for /connection response

      if ($stateParams.state) {
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
      $scope.user = userService;

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
        if ($scope.searchInput &&
          $scope.searchInput.trim().length > 2) {
          contactsService.getUsers($scope.searchInput).then(function(res) {
            $scope.userList = res;
          });
        }
      };

      $scope.addToContacts = function(user) {
        var i, userExists = false;

        for (var i in $scope.contacts) {
          if ($scope.contacts.hasOwnProperty(i)) {
            if ($scope.contacts[i].uuid === user.uuid) {
              userExists = true;
            }
          }
        }

        if (!userExists) {
          contactsService.addContact(user.uuid).then(function(res) {
            $scope.contacts.push({
              uuid: user.uuid,
              photo: user.photo,
              displayName: user.displayName || user.username || user.email,
              type: user.type
            });
          });
        }

        $scope.userList = null;
        $scope.searchInput = "";
      };

    }
  ]);
