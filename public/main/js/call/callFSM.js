angular.module('call')
  .service('callFSM', ["$log", "$q", "pubsub", "pubsubSubscriber", "pubsubEvent", "pubsubMethods", "taskFactory", "callFsmTasks",
    function($log, $q, pubsub, pubsubSubscriber, pubsubEvent, pubsubMethods, taskFactory, callFsmTasks) {
      var self = this,
        calls = {},
        transitionsHashTable = {};

      // TODO how to publish state change updates ???
      // TODO move transitions to a different module
      // TODO we can also make a service to provide when block to avoid duplication
      transitionsHashTable[pubsubEvent.start_call_gui] = {};
      transitionsHashTable[pubsubEvent.start_call_gui][0] = {
        when: [{
          event: pubsubEvent.start_call_gui,
          performs: [
            callFsmTasks.publish_create_outgoing_call,
            callFsmTasks.publish_location_change_to_call,
            // TODO may be there is a glare condition between url change and permission request
            callFsmTasks.publish_call_state_init,
            callFsmTasks.publish_request_media_permission
          ]
        }],
      };
      transitionsHashTable[pubsubEvent.start_call_gui][1] = {
        when: [{
          event: pubsubEvent.media_permission_rejected,
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.media_permission_granted,
          performs: [callFsmTasks.publish_create_peer]
        }],
      };
      transitionsHashTable[pubsubEvent.start_call_gui][2] = {
        when: [{
          event: pubsubEvent.create_peer_completed,
          performs: [callFsmTasks.publish_create_offer]
        }],
      };
      transitionsHashTable[pubsubEvent.start_call_gui][3] = {
        when: [{
          event: pubsubEvent.end_call_gui,
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.create_offer_failure,
          performs: [
            callFsmTasks.publish_call_state_setup_faiure,
            callFsmTasks.broadcast_clear_resources
          ]
        }, {
          event: pubsubEvent.create_offer_success,
          performs: [callFsmTasks.publish_send_start_call_request]
        }],
      };
      transitionsHashTable[pubsubEvent.start_call_gui][4] = {
        when: [{
          event: pubsubEvent.end_call_gui,
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.send_start_call_request_failure,
          performs: [
            callFsmTasks.publish_call_state_setup_faiure,
            callFsmTasks.broadcast_clear_resources
          ]
        }, {
          event: pubsubEvent.send_start_call_request_success,
          performs: []
        }],
      };
      transitionsHashTable[pubsubEvent.start_call_gui][5] = {
        when: [{
          event: pubsubEvent.end_call_gui,
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.call_timeout_notify,
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.call_end_notify,
          performs: [
            callFsmTasks.publish_call_state_declined,
            callFsmTasks.broadcast_clear_resources
          ]
        }, {
          event: pubsubEvent.call_accepted_notify,
          performs: [callFsmTasks.publish_set_local_offer]
        }],
      };
      transitionsHashTable[pubsubEvent.start_call_gui][6] = {
        when: [{
          event: pubsubEvent.end_call_gui,
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.call_end_notify,
          performs: [
            callFsmTasks.publish_call_state_ended,
            callFsmTasks.broadcast_clear_resources
          ]
        }, {
          event: pubsubEvent.set_local_offer_failure,
          performs: [
            callFsmTasks.publish_call_state_setup_faiure,
            callFsmTasks.broadcast_clear_resources
          ]
        }, {
          event: pubsubEvent.set_local_offer_success,
          performs: []
        }],
      };
      transitionsHashTable[pubsubEvent.start_call_gui][7] = {
        when: [{
          event: pubsubEvent.end_call_gui,
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.call_end_notify,
          performs: [
            callFsmTasks.publish_call_state_ended,
            callFsmTasks.broadcast_clear_resources
          ]
        }, {
          event: pubsubEvent.call_answered_notify,
          performs: [callFsmTasks.publish_set_remote_answer]
        }],
      };
      transitionsHashTable[pubsubEvent.start_call_gui][8] = {
        when: [{
          event: pubsubEvent.end_call_gui,
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.call_end_notify,
          performs: [
            callFsmTasks.publish_call_state_ended,
            callFsmTasks.broadcast_clear_resources
          ]
        }, {
          event: pubsubEvent.set_remote_answer_failure,
          performs: [
            callFsmTasks.publish_call_state_setup_faiure,
            callFsmTasks.broadcast_clear_resources
          ]
        }, {
          event: pubsubEvent.set_remote_answer_success,
          performs: []
        }],
      };
      transitionsHashTable[pubsubEvent.start_call_gui][9] = {
        loop: true,
        when: [{
          event: pubsubEvent.on_ice_connection_failed,
          performs: [
            callFsmTasks.publish_call_state_ice_faiure,
            callFsmTasks.broadcast_clear_resources
          ]
        }, {
          event: pubsubEvent.end_call_gui,
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.call_end_notify,
          performs: [
            callFsmTasks.publish_call_state_ended,
            callFsmTasks.broadcast_clear_resources
          ]
        }],
      };

      transitionsHashTable[pubsubEvent.on_incoming_call_notify] = {};
      transitionsHashTable[pubsubEvent.on_incoming_call_notify][0] = {
        when: [{
          event: pubsubEvent.on_incoming_call_notify,
          performs: [
            callFsmTasks.publish_create_incoming_call,
            callFsmTasks.publish_location_change_to_call,
            callFsmTasks.publish_create_peer
          ]
        }],
      };
      transitionsHashTable[pubsubEvent.on_incoming_call_notify][1] = {
        when: [, {
          event: pubsubEvent.call_end_notify,
          performs: [
            callFsmTasks.publish_call_state_ended,
            callFsmTasks.broadcast_clear_resources
          ]
        }, {
          event: pubsubEvent.create_peer_completed,
          performs: []
        }],
      };
      transitionsHashTable[pubsubEvent.on_incoming_call_notify][2] = {
        when: [{
          event: pubsubEvent.end_call_gui,
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.call_end_notify,
          performs: [
            callFsmTasks.publish_call_state_ended,
            callFsmTasks.broadcast_clear_resources
          ]
        }, {
          event: pubsubEvent.answer_call_gui,
          performs: [callFsmTasks.publish_send_accept_call_request]
        }],
      };
      transitionsHashTable[pubsubEvent.on_incoming_call_notify][3] = {
        when: [{
          event: pubsubEvent.end_call_gui,
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.call_end_notify,
          performs: [
            callFsmTasks.publish_call_state_ended,
            callFsmTasks.broadcast_clear_resources
          ]
        }, {
          event: pubsubEvent.send_accept_call_request_failure,
          performs: [
            callFsmTasks.publish_call_state_setup_faiure,
            callFsmTasks.broadcast_clear_resources
          ]
        }, {
          event: pubsubEvent.send_accept_call_request_success,
          performs: [callFsmTasks.publish_request_media_permission]
        }],
      };
      transitionsHashTable[pubsubEvent.on_incoming_call_notify][4] = {
        when: [{
          event: pubsubEvent.end_call_gui,
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.call_end_notify,
          performs: [
            callFsmTasks.publish_call_state_ended,
            callFsmTasks.broadcast_clear_resources
          ]
        }, {
          event: pubsubEvent.media_permission_rejected,
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.media_permission_granted,
          performs: [
            callFsmTasks.publish_add_local_stream,
            callFsmTasks.publish_set_remote_offer
          ]
        }],
      };
      transitionsHashTable[pubsubEvent.on_incoming_call_notify][5] = {
        when: [{
          event: pubsubEvent.end_call_gui,
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.call_end_notify,
          performs: [
            callFsmTasks.publish_call_state_ended,
            callFsmTasks.broadcast_clear_resources
          ]
        }, {
          event: pubsubEvent.set_remote_offer_failure,
          performs: [callFsmTasks.publish_call_state_setup_faiure,
            callFsmTasks.broadcast_clear_resources
          ]
        }, {
          event: pubsubEvent.set_remote_offer_success,
          performs: [callFsmTasks.publish_create_answer]
        }],
      };
      transitionsHashTable[pubsubEvent.on_incoming_call_notify][6] = {
        when: [{
          event: pubsubEvent.end_call_gui,
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.call_end_notify,
          performs: [
            callFsmTasks.publish_call_state_ended,
            callFsmTasks.broadcast_clear_resources
          ]
        }, {
          event: pubsubEvent.create_answer_failure,
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.create_answer_success,
          performs: [callFsmTasks.publish_send_answer_call_request]
        }],
      };
      transitionsHashTable[pubsubEvent.on_incoming_call_notify][7] = {
        when: [{
          event: pubsubEvent.end_call_gui,
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.call_end_notify,
          performs: [
            callFsmTasks.publish_call_state_ended,
            callFsmTasks.broadcast_clear_resources
          ]
        }, {
          event: pubsubEvent.send_answer_call_request_failure,
          performs: [
            callFsmTasks.publish_call_state_setup_faiure,
            callFsmTasks.broadcast_clear_resources
          ]
        }, {
          event: pubsubEvent.send_answer_call_request_success,
          performs: [callFsmTasks.publish_set_local_answer]
        }],
      };
      transitionsHashTable[pubsubEvent.on_incoming_call_notify][8] = {
        when: [{
          event: pubsubEvent.end_call_gui,
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.call_end_notify,
          performs: [
            callFsmTasks.publish_call_state_ended,
            callFsmTasks.broadcast_clear_resources
          ]
        }, {
          event: pubsubEvent.set_local_answer_failure,
          performs: [
            callFsmTasks.publish_call_state_setup_faiure,
            callFsmTasks.broadcast_clear_resources
          ]
        }, {
          event: pubsubEvent.set_local_answer_success,
          performs: []
        }],
      };
      transitionsHashTable[pubsubEvent.on_incoming_call_notify][9] = {
        loop: true,
        when: [{
          event: pubsubEvent.on_ice_connection_failed,
          performs: [
            callFsmTasks.publish_call_state_ice_faiure,
            callFsmTasks.broadcast_clear_resources
          ]
        }, {
          event: pubsubEvent.end_call_gui,
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.call_end_notify,
          performs: [
            callFsmTasks.publish_call_state_ended,
            callFsmTasks.broadcast_clear_resources
          ]
        }],
      };

      function handleFSMEvent(data) {
        var i, j, k, internalCall, callId,
          whenList, performList, task;

        if (data.msg.callId) {
          callId = data.msg.callId;
        } else {
          callId = UUID.generate();
          data.msg.callId = callId;
        }

        // TODO how to do second transition flow for call
        if (!calls[callId]) {
          calls[callId] = {
            trIndex: 0,
            transition: transitionsHashTable[data.event]
          };
        }

        internalCall = calls[callId];

        whenList = internalCall.transition[internalCall.trIndex].when;

        for (i in whenList) {
          if (whenList.hasOwnProperty(i)) {
            if (whenList[i].event === data.event) {
              performList = whenList[i].performs;

              for (var j in performList) {
                if (performList.hasOwnProperty(j)) {
                  task = taskFactory[performList[j]];

                  for (var k in task.params) {
                    if (task.params.hasOwnProperty(k)) {
                      data.msg[k] = task.params[k];
                    }
                  }

                  pubsub[task.pubsubMethod]({
                    publisher: pubsubSubscriber.call_fsm,
                    subscriber: task.subscriber,
                    event: task.event,
                    msg: data.msg
                  });
                }
              }
            }
          }
        }

        // TODO need to understand current transition is completed
        // TODO need to have an idle state loop back to itself

        // loop:true means transition will loop back to itself
        if (!internalCall.transition[internalCall.trIndex].loop) {
          internalCall.trIndex++;
        }

      };

      pubsub.subscribe({
        subscriber: pubsubSubscriber.call_fsm,
        callback: handleFSMEvent
      });

      pubsub.subscribe({
        subscriber: pubsubSubscriber.global,
        event: pubsubEvent.clear_resources,
        callback: function(data) {
          $log.info("call fsm: deleting call object: " + data.msg.callId);
          delete calls[data.msg.callId];
        }
      });
    }
  ])
  .constant("callFsmTasks", {
    publish_create_outgoing_call: "publish_create_outgoing_call",
    publish_create_incoming_call: "publish_create_incoming_call",
    publish_state_chage: "publish_state_chage",
    publish_request_media_permission: "publish_request_media_permission",
    publish_create_peer: "publish_create_peer",
    publish_create_offer: "publish_create_offer",
    publish_create_answer: "publish_create_answer",
    broadcast_clear_resources: "broadcast_clear_resources",
    publish_send_start_call_request: "publish_send_start_call_request",
    publish_send_answer_call_request: "publish_send_answer_call_request",
    publish_send_accept_call_request: "publish_send_accept_call_request",
    publish_set_local_offer: "publish_set_local_offer",
    publish_set_local_answer: "publish_set_local_answer",
    publish_set_remote_offer: "publish_set_remote_offer",
    publish_set_remote_answer: "publish_set_remote_answer",
    publish_location_change_to_call: "publish_location_change_to_call",
    publish_add_local_stream: "publish_add_local_stream",
    publish_call_state_init: "publish_call_state_init",
    publish_call_state_ringing: "publish_call_state_ringing",
    publish_call_state_in_call: "publish_call_state_in_call",
    publish_call_state_declined: "publish_call_state_declined",
    publish_call_state_ended: "publish_call_state_ended",
    publish_call_state_no_answer: "publish_call_state_no_answer",
    publish_call_state_ice_faiure: "publish_call_state_ice_faiure",
    publish_call_state_setup_faiure: "publish_call_state_setup_faiure"
  })
  .run(['callFSM', function() {}]);
