angular.module('login')
  .controller('LoginCtrl', ["$scope", "$log", "$state", "userService", "connectionService",
  function($scope, $log, $state, userService, connectionService) {
    $log.info("loginCtrl initialized...");

    $scope.login = function() {
      $log.info("loginCtrl.login clicked...");

      userService.email = $scope.email;
      userService.password = $scope.password;

      connectionService.openConnection(userService.email).then(function() {
        $state.go('home');
      });
    };
  }]);
