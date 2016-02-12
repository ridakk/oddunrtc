angular.module('signin')
.controller('SigninCtrl', ["$scope", "$log", "$location", "userService", "accountService", "connectionService", function ($scope, $log, $location, userService, accountService, connectionService) {
  $log.info("SigninCtrl initialized...");

  $scope.user = userService;

  $scope.createAccount = function(){
    $log.info("SigninCtrl.createAccount clicked...");
    $log.info("SigninCtrl.createAccount $scope.email: " + userService.email);
    accountService.createAccount(userService).then(function(res){
      $log.info("account created...", res);
      connectionService.openConnection(userService.email).then(function(){
        $location.url('/home');
      });
    }, function(err){
      $log.info("account create failed", err);
      userService.password = null;
      userService.firstName = null;
      userService.lastName = null;
    });
  };
}]);
