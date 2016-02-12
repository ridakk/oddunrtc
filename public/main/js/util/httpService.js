angular.module('util.http', [])
  .service('httpService', ["$http", "$q", function($http, $q) {
    var self = this;

    self.request = function(params) {
      var deferred = $q.defer();
      $http(params).
      then(function(response) {
        deferred.resolve(response.data);
      }, function(response) {
        deferred.reject(response.data);
      });
      return deferred.promise;
    };

    self.post = function(params) {
      params.method = "POST";
      return self.request(params);
    };

    self.put = function(params) {
      params.method = "PUT";
      return self.request(params);
    };

    self.get = function(params) {
      params.method = "GET";
      return self.request(params);
    };

    self.delete = function(params) {
      params.method = "DELETE";
      return self.request(params);
    };
  }]);
