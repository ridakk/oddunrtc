angular.module('signin')
  .controller('SigninCtrl', ["$scope", "$log", "$state", "userService", "accountService", "connectionService",
  function($scope, $log, $state, userService, accountService, connectionService) {
    $log.info("SigninCtrl initialized...");

    $scope.createAccount = function() {
      $log.info("SigninCtrl.createAccount clicked...");

      userService.email = $scope.email;
      userService.password = $scope.password;
      userService.firstName = $scope.firstName;
      userService.lastName = $scope.lastName;

      accountService.createAccount(userService).then(function(res) {
        $log.info("account created...", res);
        connectionService.openConnection(userService.email).then(function() {
        $state.go('home');
        });
      }, function(err) {
        $log.info("account create failed", err);
        userService.password = null;
        userService.firstName = null;
        userService.lastName = null;
      });
    };
  }]);
