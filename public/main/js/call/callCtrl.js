angular.module('call')
.controller('CallCtrl', ["$scope", "$log", "$routeParams", function ($scope, $log, $routeParams) {
  $log.info("CallCtrl initialized..." + $routeParams.to);

}]);
