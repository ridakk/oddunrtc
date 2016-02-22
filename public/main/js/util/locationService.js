angular.module('util.location', ['ui.router', 'util.pubsub'])
  .service('locationService', ["$rootScope", "$state", "pubsub", "pubsubSubscriber", "pubsubEvent",
    function($rootScope, $state, pubsub, pubsubSubscriber, pubsubEvent) {
      var self = this,
        eventHandlers = {};

      function changeUrlTo(data) {
        $state.go(data.to, data.params);
      }

      function handleChangeUrlToCall(data) {
        changeUrlTo({
          to: "call",
          params: {
            callId: data.msg.callId
          }
        });
      };

      function handleChangeUrlToHome() {
        changeUrlTo({
          to: "home"
        });
      };

      function handleChangeUrlToLogin() {
        changeUrlTo({
          to: "login"
        });
      };

      self.toHome = handleChangeUrlToHome;
      self.toLogin = handleChangeUrlToLogin;

      eventHandlers[pubsubEvent.change_url_to_call] = handleChangeUrlToCall;
      pubsub.subscribe({
        subscriber: pubsubSubscriber.location_service,
        callback: function(data) {
          eventHandlers[data.event](data);
        }
      });
    }
  ])
  .run(['locationService', function() {}]);
