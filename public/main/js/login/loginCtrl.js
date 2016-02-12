angular.module('login')
  .controller('LoginCtrl', ["$scope", "$log", "$location", "userService", "connectionService", function($scope, $log, $location, userService, connectionService) {
    $log.info("loginCtrl initialized...");

    $scope.user = userService;

    $scope.login = function() {
      $log.info("loginCtrl.login clicked...");
      $log.info("SigninCtrl.createAccount $scope.email: " + userService.email);

      connectionService.openConnection(userService.email).then(function() {
        $location.url('/home');
      });
    };
  }]);
