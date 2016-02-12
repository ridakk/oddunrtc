angular.module('account')
.service('accountService', ["httpService", function(httpService){
   var self = this;

   self.createAccount = function(user){
     return httpService.post({
       url: window.location.origin + "/users",
       data: user
     });
   };
}]);
