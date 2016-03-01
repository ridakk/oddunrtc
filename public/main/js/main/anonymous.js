angular.module('anonymous', ['anonymousHome', 'ui.router', 'call', 'user', 'connection', 'util.pubsub', 'webrtc.mediaService', 'webrtc.peerService'])
  .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

      $urlRouterProvider.otherwise('/');

      $stateProvider
        .state('home', {
          url: '/home',
          params: {
            callId: undefined
          },
          templateUrl: '/main/js/home/anonymous_home.html',
          controller: 'anonymousHomeCtrl'
        }),
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
  .controller('anonymousCtrl', ["$scope", "$log", "userService", "connectionService", "pubsub", "pubsubSubscriber", "pubsubEvent",
    function($scope, $log, userService, connectionService, pubsub, pubsubSubscriber, pubsubEvent) {
      $log.info("anonymousCtrl initialized...");

      $scope.user = userService;

      connectionService.getConnection().then(function() {
        pubsub.publish({
          publisher: pubsubSubscriber.home_ctrl,
          subscriber: pubsubSubscriber.call_fsm,
          event: pubsubEvent.start_call_gui,
          msg: {
            to: userService.callTo
          }
        });

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
