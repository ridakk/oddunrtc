angular.module('call')
  .service('callFSM', ["$log", "$q", "pubsub", "pubsubSubscriber", "pubsubEvent", "pubsubMethods", "callFsmTasks",
    function($log, $q, pubsub, pubsubSubscriber, pubsubEvent, pubsubMethods, callFsmTasks) {
      var self = this,
        calls = {},
        transitionsHashTable = {},
        tasks = {};

      tasks[callFsmTasks.publish_location_change_to_call] = {
        pubsubMethod: pubsubMethods.publish,
        subscriber: pubsubSubscriber.location_service,
        event: pubsubEvent.change_url_to_call
      };
      tasks[callFsmTasks.publish_create_outgoing_call] = {
        pubsubMethod: pubsubMethods.publish,
        subscriber: pubsubSubscriber.call_service,
        event: pubsubEvent.create_outgoing_call
      };
      tasks[callFsmTasks.publish_create_incoming_call] = {
        pubsubMethod: pubsubMethods.publish,
        subscriber: pubsubSubscriber.call_service,
        event: pubsubEvent.create_incoming_call
      };
      tasks[callFsmTasks.publish_state_chage] = {
        pubsubMethod: pubsubMethods.publish,
        subscriber: pubsubSubscriber.call_service,
        event: pubsubEvent.state_change
      };
      tasks[callFsmTasks.publish_request_media_permission] = {
        pubsubMethod: pubsubMethods.publish,
        subscriber: pubsubSubscriber.media_service,
        event: pubsubEvent.request_media_permission,
        params: {
          constraints: {
            audio: true,
            video: true
          }
        }
      };
      tasks[callFsmTasks.broadcast_clear_resources] = {
        pubsubMethod: pubsubMethods.broadcast,
        subscriber: pubsubSubscriber.global,
        event: pubsubEvent.clear_resources
      };
      tasks[callFsmTasks.publish_create_peer] = {
        pubsubMethod: pubsubMethods.publish,
        subscriber: pubsubSubscriber.peer_service,
        event: pubsubEvent.create_peer
      };
      tasks[callFsmTasks.publish_create_offer] = {
        pubsubMethod: pubsubMethods.publish,
        subscriber: pubsubSubscriber.peer_service,
        event: pubsubEvent.create_offer,
        params: {
          constraints: {
            "mandatory": {
              "OfferToReceiveAudio": true,
              "OfferToReceiveVideo": true
            }
          }
        }
      };
      tasks[callFsmTasks.publish_create_answer] = {
        pubsubMethod: pubsubMethods.publish,
        subscriber: pubsubSubscriber.peer_service,
        event: pubsubEvent.create_answer,
        params: {
          constraints: {
            "mandatory": {
              "OfferToReceiveAudio": true,
              "OfferToReceiveVideo": true
            }
          }
        }
      };
      tasks[callFsmTasks.publish_set_local_offer] = {
        pubsubMethod: pubsubMethods.publish,
        subscriber: pubsubSubscriber.peer_service,
        event: pubsubEvent.set_local_offer
      };
      tasks[callFsmTasks.publish_set_local_answer] = {
        pubsubMethod: pubsubMethods.publish,
        subscriber: pubsubSubscriber.peer_service,
        event: pubsubEvent.set_local_answer
      };
      tasks[callFsmTasks.publish_set_remote_offer] = {
        pubsubMethod: pubsubMethods.publish,
        subscriber: pubsubSubscriber.peer_service,
        event: pubsubEvent.set_remote_offer
      };
      tasks[callFsmTasks.publish_set_remote_answer] = {
        pubsubMethod: pubsubMethods.publish,
        subscriber: pubsubSubscriber.peer_service,
        event: pubsubEvent.set_remote_answer
      };
      tasks[callFsmTasks.publish_send_start_call_request] = {
        pubsubMethod: pubsubMethods.publish,
        subscriber: pubsubSubscriber.call_service,
        event: pubsubEvent.send_start_call_request
      };
      tasks[callFsmTasks.publish_send_answer_call_request] = {
        pubsubMethod: pubsubMethods.publish,
        subscriber: pubsubSubscriber.call_service,
        event: pubsubEvent.send_answer_call_request
      };
      tasks[callFsmTasks.publish_send_accept_call_request] = {
        pubsubMethod: pubsubMethods.publish,
        subscriber: pubsubSubscriber.call_service,
        event: pubsubEvent.send_accept_call_request
      };
      tasks[callFsmTasks.publish_add_local_stream] = {
        pubsubMethod: pubsubMethods.publish,
        subscriber: pubsubSubscriber.peer_service,
        event: pubsubEvent.add_local_stream
      };

      // TODO how to publish state change updates ???
      // TODO how to handle call end glare condition scenario with pub sub ???
      transitionsHashTable[pubsubEvent.start_call_gui] = {};
      transitionsHashTable[pubsubEvent.start_call_gui][0] = {
        when: [{
          event: pubsubEvent.start_call_gui,
          performs: [
            callFsmTasks.publish_create_outgoing_call,
            callFsmTasks.publish_location_change_to_call,
            // TODO may be there is a glare condition between url change and permission request
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
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.create_offer_success,
          performs: [callFsmTasks.publish_send_start_call_request]
        }],
      };
      transitionsHashTable[pubsubEvent.start_call_gui][4] = {
        when: [{
          event: pubsubEvent.end_call_gui,
          // TODO add send call end request task to perfom list
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.send_start_call_request_failure,
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.send_start_call_request_success,
          performs: []
        }],
      };
      transitionsHashTable[pubsubEvent.start_call_gui][5] = {
        when: [{
          event: pubsubEvent.end_call_gui,
          // TODO add send call end request task to perfom list
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.call_timeout_notify,
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.call_end_notify,
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.call_accepted_notify,
          performs: [callFsmTasks.publish_set_local_offer]
        }],
      };
      transitionsHashTable[pubsubEvent.start_call_gui][6] = {
        when: [{
          event: pubsubEvent.end_call_gui,
          // TODO add send call end request task to perfom list
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.call_end_notify,
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.set_local_offer_failure,
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.set_local_offer_success,
          performs: []
        }],
      };
      transitionsHashTable[pubsubEvent.start_call_gui][7] = {
        when: [{
          event: pubsubEvent.end_call_gui,
          // TODO add send call end request task to perfom list
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.call_end_notify,
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.call_answered_notify,
          performs: [callFsmTasks.publish_set_remote_answer]
        }],
      };
      transitionsHashTable[pubsubEvent.start_call_gui][8] = {
        when: [{
          event: pubsubEvent.end_call_gui,
          // TODO add send call end request task to perfom list
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.call_end_notify,
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.set_remote_answer_failure,
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.set_remote_answer_success,
          performs: []
        }],
      };
      transitionsHashTable[pubsubEvent.start_call_gui][9] = {
        when: [{
          event: pubsubEvent.end_call_gui,
          // TODO add send call end request task to perfom list
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.call_end_notify,
          performs: [callFsmTasks.broadcast_clear_resources]
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
          performs: [callFsmTasks.broadcast_clear_resources]
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
          performs: [callFsmTasks.broadcast_clear_resources]
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
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.send_accept_call_request_failure,
          performs: [callFsmTasks.broadcast_clear_resources]
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
          performs: [callFsmTasks.broadcast_clear_resources]
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
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.set_remote_offer_failure,
          performs: [callFsmTasks.broadcast_clear_resources]
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
          performs: [callFsmTasks.broadcast_clear_resources]
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
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.send_answer_call_request_failure,
          performs: [callFsmTasks.broadcast_clear_resources]
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
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.set_local_answer_failure,
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.set_local_answer_success,
          performs: []
        }],
      };
      transitionsHashTable[pubsubEvent.on_incoming_call_notify][9] = {
        when: [{
          event: pubsubEvent.end_call_gui,
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.call_end_notify,
          performs: [callFsmTasks.broadcast_clear_resources]
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
                  task = tasks[performList[j]];

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
        internalCall.trIndex++;

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
    publish_add_local_stream: "publish_add_local_stream"
  })
  .run(['callFSM', function() {}]);
