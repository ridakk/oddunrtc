angular.module('main', ['ui.router', 'call', 'user', 'connection', 'contacts', 'util.pubsub', 'webrtc.mediaService', 'webrtc.peerService'])
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
  .controller('mainCtrl', ["$scope", "$log", "userService", "connectionService", "contactsService", "pubsub",
    function($scope, $log, userService, connectionService, contactsService, pubsub) {
      $log.info("mainCtrl initialized...");

      $scope.user = userService;
      $scope.contacts = [];

      connectionService.getConnection().then(function() {
        contactsService.get().then(function(res) {
          $scope.contacts = res;
        });
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

      $scope.searchInputChange = function() {
        contactsService.getUsers($scope.searchInput).then(function(res) {
          $scope.userList = res;
        });
      };


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
