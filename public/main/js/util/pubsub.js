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
    peer_service: "peer_service",
    connection_service: "connection_service",
    location_service: "location_service",
    home_ctrl: "home_ctrl"
  })
  .constant("pubsubEvent", {
    create_outgoing_call: "create_outgoing_call",
    create_incoming_call: "create_incoming_call",
    state_change: "state_change",
    start_call_gui: "start_call_gui",
    end_call_gui: "end_call_gui",
    answer_call_gui: "answer_call_gui",
    clear_resources: "clear_resources",
    request_media_permission: "request_media_permission",
    media_permission_granted: "media_permission_granted",
    media_permission_rejected: "media_permission_rejected",
    create_peer: "create_peer",
    create_peer_completed: "create_peer_completed",
    create_offer: "create_offer",
    create_offer_success: "create_offer_success",
    create_offer_failure: "create_offer_failure",
    create_answer: "create_answer",
    create_answer_success: "create_answer_success",
    create_answer_failure: "create_answer_failure",
    set_local_offer: "set_local_offer",
    set_local_offer_success: "set_local_offer_success",
    set_local_offer_failure: "set_local_offer_failure",
    set_local_answer: "set_local_answer",
    set_local_answer_success: "set_local_offer_success",
    set_local_answer_failure: "set_local_offer_failure",
    set_remote_answer: "set_remote_answer",
    set_remote_answer_success: "set_remote_answer_success",
    set_remote_answer_success: "set_remote_answer_success",
    set_remote_offer: "set_remote_offer",
    set_remote_offer_success: "set_remote_offer_success",
    set_remote_offer_success: "set_remote_offer_success",
    on_ice_canditate: "on_ice_canditate",
    on_local_stream: "on_local_stream",
    on_remote_stream: "on_remote_stream",
    send_start_call_request: "send_start_call_request",
    send_start_call_request_success: "send_start_call_request_success",
    send_start_call_request_failure: "send_start_call_request_failure",
    send_answer_call_request: "send_answer_call_request",
    send_answer_call_request_success: "send_answer_call_request_success",
    send_answer_call_request_failure: "send_answer_call_request_failure",
    send_accept_call_request: "send_accept_call_request",
    send_accept_call_request_success: "send_accept_call_request_success",
    send_accept_call_request_failure: "send_accept_call_request_failure",
    call_timeout_notify: "call_timeout_notify",
    call_end_notify: "call_end_notify",
    call_accepted_notify: "call_accepted_notify",
    call_answered_notify: "call_answered_notify",
    on_incoming_call_notify: "on_incoming_call_notify",
    ice_candidate_notify: "ice_candidate_notify",
    change_url_to_call: "change_url_to_call",
    add_local_stream: "add_local_stream"
  });
