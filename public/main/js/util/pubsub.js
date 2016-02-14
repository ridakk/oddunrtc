angular.module('util.pubsub', [])
  .service('pubsub', ["$log", "pubsubMainEvents",
    function($log, pubsubMainEvents) {
      var self = this,
        listeners = {};

      self.subscribe = function(params) {
        if (params.mainEvent === pubsubMainEvents.global) {
          if (!listeners[pubsubMainEvents.global]) {
            listeners[pubsubMainEvents.global] = {};
          }

          if (!listeners[pubsubMainEvents.global][params.childEvent]) {
            listeners[pubsubMainEvents.global][params.childEvent] = [];
          }

          listeners[pubsubMainEvents.global][params.childEvent].push(params.callback);
          return;
        }

        listeners[params.mainEvent] = params.callback;
      };

      self.publish = function(params) {
        setTimeout(function() {
          listeners[params.mainEvent](params);
        }, 1);
      };

      self.broadcast = function(params) {
        var i, globalListeners = listeners[pubsubMainEvents.global],
          childListeners;
        if (!globalListeners) {
          return;
        }

        childListeners = globalListeners[params.childEvent];
        if (!childListeners) {
          return;
        }

        for (var i in childListeners) {
          if (childListeners.hasOwnProperty(i)) {
            setTimeout(function() {
              childListeners[i](params);
            }, 1);
          }
        }
      };
    }
  ])
  .constant("pubsubMethods", {
    publish: "publish",
    broadcast: "broadcast"
  })
  .constant("pubsubMainEvents", {
    global: "global",
    call_fsm: "call_fsm",
    call_service: "call_service",
    media_service: "media_service",
    peer_service: "peer_service"
  })
  .constant("pubsubChildEvents", {
    state_change: "state_change",
    start_call_gui: "start_call_gui",
    clear_resources: "clear_resources",
    request_media_permission: "request_media_permission",
    media_permission_granted: "media_permission_granted",
    media_permission_rejected: "media_permission_rejected",
    create_offer: "create_offer"
  });
