angular.module('call')
  .controller('CallCtrl', ["$scope", "$log", "$routeParams", "callService",
    function($scope, $log, $routeParams, callService) {
      $log.info("CallCtrl initialized..." + $routeParams.to);
      callService.start({
        to: $routeParams.to
      });
    }
  ]);
