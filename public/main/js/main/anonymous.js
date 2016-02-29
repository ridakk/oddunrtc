angular.module('anonymous', ['ui.router', 'call', 'user', 'connection', 'util.pubsub'])
  .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

      $urlRouterProvider.otherwise('/');

      $stateProvider
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
  .controller('anonymousCtrl', ["$scope", "$log", "userService", "connectionService", "pubsub",
  function($scope, $log, userService, connectionService, pubsub) {
    $log.info("anonymousCtrl initialized...");

    $scope.user = userService;

    connectionService.getConnection().then(function(){

    });

    $scope.startCallTo = function(contact) {
      pubsub.publish({
        publisher: pubsubSubscriber.home_ctrl,
        subscriber: pubsubSubscriber.call_fsm,
        event: pubsubEvent.start_call_gui,
        msg: {
          from: contact
        }
      });
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
