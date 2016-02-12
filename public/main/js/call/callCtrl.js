angular.module('call')
  .controller('CallCtrl', ["$scope", "$log", "$routeParams", "callService",

    function($scope, $log, $routeParams, callService) {
      $log.info("CallCtrl initialized... target: " + $routeParams.target + " call id: " + $routeParams.callId);

      $scope.target = $routeParams.target;
      $scope.callId = $routeParams.callId;

      callService.onLocalStreamAdded = function(stream){
        $log.info("local stream added: ", stream);
        angular.element("#LocalStream").srcObject = stream;
      };

      callService.onRemoteStreamAdded = function(stream){
        $log.info("remote stream added: ", stream);
        angular.element("#RemoteStream").srcObject = stream;
      };

      if ($scope.callId !== "undefined") {
        callService.answer({
          to: $routeParams.target,
          callId: $scope.callId
        });
      } else {
        callService.start({
          to: $routeParams.target
        }).then(function(params) {
          $scope.callId = params.callId;
        });
      }
    }
  ]);
