angular.module('main', ['ui.router', 'home', 'call', 'user', 'util.location'])
  .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

      $urlRouterProvider.otherwise('/');

      $stateProvider
        .state('home', {
          url: '/',
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
  .controller('mainCtrl', ["$scope", "$log", function($scope, $log, userService) {
    $log.info("mainCtrl initialized...");

    $scope.getPhoto = function(){
      return userService.photo;
    };
  }])
  .run(["$rootScope", "$state", "userService", "locationService", function($rootScope, $state, userService, locationService) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
      /*if ((toState.url === "/home" || toState.url === "/call") && !userService.connected) {
        event.preventDefault();

        locationService.toLogin();
      }*/

      if (toState.url === '/call' &&
          !toParams.callId) {
        event.preventDefault();
      }
    });
  }]);
