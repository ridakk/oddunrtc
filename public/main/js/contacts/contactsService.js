angular.module('contacts')
  .service('contactsService', ["$q", "httpService", function($q, httpService) {
    var self = this,
      contacts;

    self.get = function(email) {

      if (contacts) {
        var deferred = $q.defer();
        deferred.resolve(contacts);
        return deferred.promise;
      }

      return httpService.get({
        url: window.location.origin + "/contacts/" + email
      });
    };
  }]);
