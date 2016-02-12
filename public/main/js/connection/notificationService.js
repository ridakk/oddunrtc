angular.module('connection')
  .service('notificationService', ["$log", function($log) {
    var self = this,
      listeners = {};

    self.subscribe = function(params) {
      listeners[params.type] = params.callback;
    };

    self.publish = function(params) {
      listeners[params.type](params.msg);
    };

  }]);
