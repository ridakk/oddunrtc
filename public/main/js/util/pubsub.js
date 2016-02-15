angular.module('util.pubsub', [])
  .service('pubsub', ["$log", "pubsubSubscriber",
    function($log, pubsubSubscriber) {
      var self = this,
        listeners = {};

      self.subscribe = function(params) {
        if (params.subscriber === pubsubSubscriber.global) {
          if (!listeners[pubsubSubscriber.global]) {
            listeners[pubsubSubscriber.global] = {};
          }

          if (!listeners[pubsubSubscriber.global][params.event]) {
            listeners[pubsubSubscriber.global][params.event] = [];
          }

          listeners[pubsubSubscriber.global][params.event].push(params.callback);
          return;
        }

        listeners[params.subscriber] = params.callback;
      };

      self.publish = function(params) {
        setTimeout(function() {
          $log.info(params.publisher + "->" + params.subscriber + ": " + params.event /*, params*/ );
          listeners[params.subscriber](params);
        }, 1);
      };

      self.broadcast = function(params) {
        var i, globalListeners = listeners[pubsubSubscriber.global],
          childListeners;
        if (!globalListeners) {
          return;
        }

        childListeners = globalListeners[params.event];
        if (!childListeners) {
          return;
        }

        function fireEvent(listener, params) {
          setTimeout(function() {
            listener(params);
          }, 1);
        }

        $log.info("broadcasting event: " + params.event, params);
        for (var i in childListeners) {
          if (childListeners.hasOwnProperty(i)) {
            fireEvent(childListeners[i], params);
          }
        }
      };
    }
  ])
  .constant("pubsubMethods", {
    publish: "publish",
    broadcast: "broadcast"
  })
  .constant("pubsubSubscriber", {
    global: "global",
    call_fsm: "call_fsm",
    call_service: "call_service",
    media_service: "media_service",
    peer_service: "peer_service"
  })
  .constant("pubsubEvent", {
    state_change: "state_change",
    start_call_gui: "start_call_gui",
    clear_resources: "clear_resources",
    request_media_permission: "request_media_permission",
    media_permission_granted: "media_permission_granted",
    media_permission_rejected: "media_permission_rejected",
    create_offer: "create_offer",
    create_offer_success: "create_offer_success",
    create_offer_failure: "create_offer_failure",
    on_ice_canditate: "on_ice_canditate",
    on_local_stream: "on_local_stream",
    on_remote_stream: "on_remote_stream",
    send_call_request: "send_call_request",
    send_call_request_success: "send_call_request_success",
    send_call_request_failure: "send_call_request_failure"
  });
