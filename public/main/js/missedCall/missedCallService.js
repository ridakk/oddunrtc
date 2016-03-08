angular.module('missedCall', ['util.http'])
    .service('missedCallService', ["$log", "$q", "httpService",
      function($log, $q, httpService) {
        var self = this;

        self.get = function() {
          return httpService.get({
            url: window.location.origin + "/missedCalls"
            //timeout: 30000,
          });
        };
      }
    ]);
