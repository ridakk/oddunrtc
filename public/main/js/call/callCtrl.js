angular.module('call')
  .controller('CallCtrl', ["$scope", "$log", "$routeParams", "callService", "userService",
    function($scope, $log, $routeParams, callService, userService) {
      $log.info("CallCtrl initialized... from: " + $routeParams.from + " to: " + $routeParams.to);

      $scope.callId = $routeParams.callId;

      callService.onLocalStreamAdded = function(stream) {
        $log.info("local stream added: ", stream);
        angular.element("#localStream")[0].srcObject = stream;
      };

      callService.onRemoteStreamAdded = function(stream) {
        $log.info("remote stream added: ", stream);
        angular.element("#remoteStream")[0].srcObject = stream;
      };

      if ($routeParams.from !== userService.email) {
        callService.answer({
          to: $routeParams.to,
          callId: $scope.callId
        });
      } else {
        callService.start({
          to: $routeParams.to
        });
      }
    }
  ]);
