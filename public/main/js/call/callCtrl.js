angular.module('call')
  .controller('CallCtrl', ["$scope", "$log", "$stateParams", "callService", "userService",
    function($scope, $log, $stateParams, callService, userService) {
      $log.info("CallCtrl initialized... callId: " + $stateParams.callId);

      $scope.callId = $stateParams.callId;
      $scope.muteState = "mute";

      $scope.answer = function() {
        $log.info("answer is clicked ");
        callService.answer({
          callId: $stateParams.callId
        });
        $('#incomingCallModal').modal('hide');
      };

      $scope.end = function() {
        $log.info("decline is clicked ");
        callService.end({
          callId: $stateParams.callId
        });
        $('#incomingCallModal').modal('hide');
      };

      $scope.mute = function(){
        $log.info("mute is clicked : " + $scope.muteState);
        callService.mute({
          callId: $stateParams.callId,
          mute: $scope.muteState === "mute" ? true : false
        });

        if ($scope.muteState === "mute") {
          $scope.muteState = "unmute";
        }
        else {
          $scope.muteState = "mute";
        }
      }

      callService.onLocalStreamAdded = function(stream) {
        $log.info("local stream added: ", stream);
        angular.element("#localStream")[0].srcObject = stream;
      };

      callService.onRemoteStreamAdded = function(stream) {
        $log.info("remote stream added: ", stream);
        angular.element("#remoteStream")[0].srcObject = stream;
      };

      if (callService.isIncomingCall({
          callId: $stateParams.callId
        })) {
        $("#incomingCallModal").modal();
      }

      $scope.$on("$destroy", function() {
        $('#incomingCallModal').remove();
        $('.modal-backdrop').remove();
      });
    }
  ]);
