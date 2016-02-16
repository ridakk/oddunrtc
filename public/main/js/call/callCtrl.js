angular.module('call')
  .controller('CallCtrl', ["$scope", "$log", "$routeParams", "callService", "userService",
    function($scope, $log, $routeParams, callService, userService) {
      $log.info("CallCtrl initialized... callId: " + $routeParams.callId);

      $scope.callId = $routeParams.callId;

      $scope.answer = function(){
        $log.info("answer is clicked ");
        callService.answer({
          callId: $routeParams.callId
        });
        $('#incomingCallModal').modal('hide');
      };

      $scope.end = function(){
        $log.info("decline is clicked ");
        callService.end({
          callId: $routeParams.callId
        });
        $('#incomingCallModal').modal('hide');
      };

      callService.onLocalStreamAdded = function(stream) {
        $log.info("local stream added: ", stream);
        angular.element("#localStream")[0].srcObject = stream;
      };

      callService.onRemoteStreamAdded = function(stream) {
        $log.info("remote stream added: ", stream);
        angular.element("#remoteStream")[0].srcObject = stream;
      };

      if (callService.isIncomingCall({
        callId: $routeParams.callId
      })) {
        $("#incomingCallModal").modal();
      }
    }
  ]);
