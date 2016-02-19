angular.module('main', ['ui.router', 'signin', 'login', 'home', 'call'])
  .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

      $urlRouterProvider.otherwise('login');

      $stateProvider
        .state('login', {
          url: '/',
          templateUrl: '/main/js/login/login.html',
          controller: 'LoginCtrl'
        })
        .state('signin', {
          url: '/signin',
          templateUrl: '/main/js/signin/signin.html',
          controller: 'SigninCtrl'
        })
        .state('home', {
          url: '/home',
          templateUrl: '/main/js/home/home.html',
          controller: 'HomeCtrl'
        })
        .state('call', {
          url: '/call/:callId',
          templateUrl: '/main/js/call/call.html',
          controller: 'CallCtrl'
        });
    }
  ])
  .controller('mainCtrl', ["$scope", "$log", function($scope, $log) {
    $log.info("mainCtrl initialized...");
  }]);
