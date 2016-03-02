angular.module('anonymousHome', [])
  .controller('anonymousHomeCtrl', ["$scope", "$log", "$stateParams",
    function($scope, $log, $stateParams) {
      var call_state_type = "info",
        call_state_text;
      $log.info("anonymousHomeCtrl initialized...");
      $log.info("stateParams errorCode: " + $stateParams.errorCode);
      $log.info("stateParams errorText: " + $stateParams.errorText);
      $log.info("stateParams httpCode: " + $stateParams.httpCode);
      $log.info("stateParams state: " + $stateParams.state);

      if ($stateParams.state) {
        if ($stateParams.errorCode) {
          call_state_type = "warning"
          $stateParams.state += " - " + $stateParams.errorText
        }
        angular.element(".call-state-field").append("<div class='alert alert-" + call_state_type + " alert-dismissible text-center' role='alert'>" +
          "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" +
          $stateParams.state +
          "</div>");
      }
    }
  ]);
