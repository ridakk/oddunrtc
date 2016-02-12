angular.module('main', ['ngRoute', 'signin', 'login', 'home', 'call'])
  .config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/', {
          templateUrl: '/main/js/signin/signin.html',
          controller: 'SigninCtrl'
        })
        .when('/login', {
          templateUrl: '/main/js/login/login.html',
          controller: 'LoginCtrl'
        })
        .when('/home', {
          templateUrl: '/main/js/home/home.html',
          controller: 'HomeCtrl'
        })
        .when('/call/:target/:callId', {
          templateUrl: '/main/js/call/call.html',
          controller: 'CallCtrl'
        });
    }
  ])
  .controller('mainCtrl', ["$scope", "$log", function($scope, $log) {
    $log.info("mainCtrl initialized...");

  }]);
