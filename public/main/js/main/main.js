angular.module('main', ['userHome', 'ui.router', 'call', 'user', 'connection', 'webrtc.mediaService', 'webrtc.peerService', 'missedCall'])
  .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

      $urlRouterProvider.otherwise('/');

      $stateProvider
        .state('home', {
          url: '/',
          params: {
            errorCode: null,
            errorText: null,
            httpCode: null,
            state: null
          },
          templateUrl: '/main/js/home/user_home.html',
          controller: 'userHomeCtrl'
        })
        .state('call', {
          url: '/call',
          params: {
            from: undefined,
            fromPhoto: undefined,
            fromType: undefined,
            callId: undefined
          },
          templateUrl: '/main/js/call/call.html',
          controller: 'CallCtrl'
        });
    }
  ])
  .controller('mainCtrl', ["$scope", "$log", "userService", "connectionService", "missedCallService",
    function($scope, $log, userService, connectionService, missedCallService) {
      $log.info("mainCtrl initialized...");

      $scope.user = userService;
      $scope.missedCalls = [];

      connectionService.getConnection();

      missedCallService.get().then(function(res){
        $scope.missedCalls = res;
      });
    }
  ])
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
