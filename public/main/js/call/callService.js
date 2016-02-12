angular.module('call')
  .service('callService', ["$q", "httpService", "userService", function($q, httpService, userService) {
    var self = this;

    self.start = function(params) {
      return httpService.post({
        url: window.location.origin + "/call",
        data: {
          from: userService.email,
          to: params.to,
          action: "start",
          data: "test"
        }
      });
    };
  }]);
