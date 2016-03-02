angular.module('contacts')
  .service('contactsService', ["$q", "httpService", "userService",
    function($q, httpService, userService) {
      var self = this,
        contacts;

      self.getContacts = function() {
        return httpService.get({
          url: window.location.origin + "/contacts"
        });
      };

      self.addContact = function(contact_uuid) {
        return httpService.post({
          url: window.location.origin + "/contacts",
          data: {
            contact_uuid: contact_uuid
          }
        });
      };

      self.getUsers = function(name) {
        var deferred = $q.defer();
        return httpService.get({
          url: window.location.origin + "/users/" + name
        });

      };
    }
  ]);
