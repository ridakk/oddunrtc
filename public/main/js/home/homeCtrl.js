angular.module('home')
  .controller('HomeCtrl', ["$scope", "$log", "userService", "contactsService", "callService",
    function($scope, $log, userService, contactsService, callService) {
      $log.info("HomeCtrl initialized...");

      $scope.user = userService;
      $scope.contacts = [];

      contactsService.get(userService.email).then(function(res) {
        $scope.contacts = res;
      });

    }
  ]);
