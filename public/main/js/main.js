angular.module('main', ['ui.router', 'signin', 'login', 'home', 'call', 'user', 'util.location'])
  .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

      $urlRouterProvider.otherwise('/');

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
          url: '/call',
          params: {
            callId: undefined
          },
          templateUrl: '/main/js/call/call.html',
          controller: 'CallCtrl'
        });
    }
  ])
  .controller('mainCtrl', ["$scope", "$log", function($scope, $log) {
    $log.info("mainCtrl initialized...");
  }])
  .run(function($rootScope, $state, userService, locationService) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
      if ((toState.url === "/home" || toState.url === "/call") && !userService.connected) {
        event.preventDefault();

        locationService.toLogin();
      }

      if (toState.url === '/call' &&
          !toParams.callId) {
        event.preventDefault();
      }
    });
  });
