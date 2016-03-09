angular.module('user')
  .controller("userCtrl", ["$scope", "$log", "userService", "connectionService", function($scope, $log, userService) {
    $log.info("userCtrl initialized...");

    $scope.user = userService;

  }]);
