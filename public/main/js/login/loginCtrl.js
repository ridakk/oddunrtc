angular.module('login')
  .controller('LoginCtrl', ["$scope", "$log", "$state", "userService", "connectionService",
  function($scope, $log, $state, userService, connectionService) {
    $log.info("loginCtrl initialized...");

    $scope.user = userService;

    $scope.login = function() {
      $log.info("loginCtrl.login clicked...");
      $log.info("SigninCtrl.createAccount $scope.email: " + userService.email);

      connectionService.openConnection(userService.email).then(function() {
        $state.go('home');
      });
    };
  }]);
