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
            from: data.msg.from,
            fromPhoto: data.msg.fromPhoto,
            fromType: data.msg.fromType,
            callId: data.msg.callId
          }
        });
      };

      function handleChangeUrlToHome(data) {
        changeUrlTo({
          to: "home",
          params: {
            errorCode: data.msg.error ? data.msg.error.errorCode : null,
            errorText: data.msg.error ? data.msg.error.errorText : null,
            httpCode: data.msg.error ? data.msg.error.httpCode : null,
            state: data.msg.state
          }
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
