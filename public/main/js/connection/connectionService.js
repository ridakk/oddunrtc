angular.module('connection')
  .service('connectionService', ["$log", "httpService", function($log, httpService) {
    var self = this,
      socket;

    self.openConnection = function(email) {
      return httpService.post({
        url: window.location.origin + "/connections",
        data: {
          email: email
        }
      }).then(function(data) {
        socket = io(data.url, {
          query: 'serverparams=' + JSON.stringify({
            user: email,
            uuid: data.uuid
          })
        });
        socket.on('message', function(msg) {
          $log.info("message received", msg);
        });
      });
    };

    self.sendMessage = function() {
      socket.emit('message', {
        to: "test2@test.com",
        text: "hey you!"
      });
    };
  }]);
