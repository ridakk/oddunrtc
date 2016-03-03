angular.module('util.http', [])
  .service('httpService', ["$http", "$q", "$log",function($http, $q, $log) {
    var self = this;

    self.request = function(params) {
      var deferred = $q.defer();
      params.headers = {
        'Content-Type': 'application/json'
      };
      $http(params).
      then(function(response) {
        deferred.resolve(response.data);
      }, function(response) {

        if(response.status ===  401) {
          $log.info("Unauthorized, hard restarting client...");
          window.location.href = ".";
          return;
        }

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
  }])
  .constant("httpRequestType", {
    get: "get",
    post: "post",
    put: "put",
    delete: "delete"
  })
