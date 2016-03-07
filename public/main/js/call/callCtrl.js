angular.module('call')
  .controller('CallCtrl', ["$scope", "$log", "$stateParams", "callService", "userService",
    function($scope, $log, $stateParams, callService, userService) {
      $log.info("CallCtrl initialized... callId: " + $stateParams.callId);

      $scope.callId = $stateParams.callId;
      $scope.muteState = "mute";
      $scope.callState;
      $scope.from;
      $scope.fromPhoto;
      $scope.fromType;
      $scope.showCallButtons = false;

      $scope.answer = function() {
        $log.info("answer is clicked ");
        callService.answer({
          callId: $stateParams.callId
        });
        $scope.showCallButtons = true;
        $('#incomingCallModal').modal('hide');
      };

      $scope.end = function() {
        $log.info("end is clicked ");
        callService.end({
          callId: $stateParams.callId
        });
        $('#incomingCallModal').modal('hide');
      };

      $scope.mute = function() {
        $log.info("mute is clicked : " + $scope.muteState);
        callService.mute({
          callId: $stateParams.callId,
          mute: $scope.muteState === "mute" ? false : true
        });

        if ($scope.muteState === "mute") {
          $scope.muteState = "unmute";
        } else {
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

      callService.onStateChange = function(state) {
        $scope.callState = state;
      };

      if (callService.isIncomingCall({
          callId: $stateParams.callId
        })) {
        $scope.from = $stateParams.from;
        $scope.fromPhoto = $stateParams.fromPhoto;
        $scope.fromType = $stateParams.fromType;
        $scope.showCallButtons = false;
        $("#incomingCallModal").modal();
      }

      $scope.$on("$destroy", function() {
        $('#incomingCallModal').remove();
        $('.modal-backdrop').remove();
      });
    }
  ]);
