angular.module('home')
.controller('HomeCtrl', ["$scope", "$log", "userService", "contactsService", function ($scope, $log, userService, contactsService) {
  $log.info("HomeCtrl initialized...");

  $scope.user = userService;
  $scope.contacts = [];

  contactsService.get(userService.email).then(function(res){
    $scope.contacts = res;
  });

}]);
