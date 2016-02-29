angular.module('contacts')
  .service('contactsService', ["$q", "httpService", "userService",
  function($q, httpService, userService) {
    var self = this,
      contacts;

    self.get = function(email) {

      if (contacts) {
        var deferred = $q.defer();
        deferred.resolve(contacts);
        return deferred.promise;
      }

      return httpService.get({
        url: window.location.origin + "/contacts/" + userService.uuid
      });
    };
  }]);
