angular.module('call')
  .service('callFSM', ["$log", "$q", "pubsub", "pubsubSubscriber", "pubsubEvent", "pubsubMethods", "callFsmTasks",
    function($log, $q, pubsub, pubsubSubscriber, pubsubEvent, pubsubMethods, callFsmTasks) {
      var self = this,
        calls = {},
        transitionsHashTable = {},
        tasks = {};

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
      tasks[callFsmTasks.publish_create_offer] = {
        pubsubMethod: pubsubMethods.publish,
        subscriber: pubsubSubscriber.peer_service,
        event: pubsubEvent.create_offer,
        params: {
          createOfferConstraints: {
            offerToReceiveAudio: 1,
            offerToReceiveVideo: 1
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
      tasks[callFsmTasks.publish_send_call_request] = {
        pubsubMethod: pubsubMethods.publish,
        subscriber: pubsubSubscriber.call_service,
        event: pubsubEvent.send_call_request
      };
      // TODO add send end call request to tasks


      // TODO how to publish state change updates ???
      // TODO how to handle call end glare condition scenario with pub sub ???
      transitionsHashTable[pubsubEvent.start_call_gui] = {};
      transitionsHashTable[pubsubEvent.start_call_gui][0] = {
        when: [{
          event: pubsubEvent.start_call_gui,
          performs: [callFsmTasks.publish_request_media_permission]
        }],
      };
      transitionsHashTable[pubsubEvent.start_call_gui][1] = {
        when: [{
          event: pubsubEvent.media_permission_rejected,
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.media_permission_granted,
          performs: [callFsmTasks.publish_create_offer]
        }],
      };
      transitionsHashTable[pubsubEvent.start_call_gui][2] = {
        when: [{
          event: pubsubEvent.end_call_gui,
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.create_offer_failure,
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.create_offer_success,
          performs: [callFsmTasks.publish_send_call_request]
        }],
      };
      transitionsHashTable[pubsubEvent.start_call_gui][3] = {
        when: [{
          event: pubsubEvent.end_call_gui,
          // TODO add send call end request task to perfom list
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.send_call_request_failure,
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.send_call_request_success,
          performs: []
        }],
      };
      transitionsHashTable[pubsubEvent.start_call_gui][4] = {
        when: [{
          event: pubsubEvent.end_call_gui,
          // TODO add send call end request task to perfom list
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.call_timeout_notify,
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.call_ended_notify,
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.call_accepted_notify,
          performs: [callFsmTasks.publish_set_local_offer]
        }],
      };
      transitionsHashTable[pubsubEvent.start_call_gui][5] = {
        when: [{
          event: pubsubEvent.end_call_gui,
          // TODO add send call end request task to perfom list
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.call_ended_notify,
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.set_local_offer_failure,
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.set_local_offer_success,
          performs: []
        }],
      };
      transitionsHashTable[pubsubEvent.start_call_gui][6] = {
        when: [{
          event: pubsubEvent.end_call_gui,
          // TODO add send call end request task to perfom list
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.call_ended_notify,
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.call_answered_notify,
          performs: [callFsmTasks.publish_set_remote_answer]
        }],
      };
      transitionsHashTable[pubsubEvent.start_call_gui][7] = {
        when: [{
          event: pubsubEvent.end_call_gui,
          // TODO add send call end request task to perfom list
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.call_ended_notify,
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.set_remote_answer_failure,
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          event: pubsubEvent.set_remote_answer_success,
          performs: []
        }],
      };

      function handleFSMEvent(data) {
        var i, j, k, internalCall, callId = data.msg.callId,
          whenList, performList, task;
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
    publish_state_chage: 0,
    publish_request_media_permission: 1,
    publish_create_offer: 2,
    broadcast_clear_resources: 3,
    publish_send_call_request: 4,
    publish_set_local_offer: 5,
    publish_set_local_answer: 6,
    publish_set_remote_offer: 7,
    publish_set_remote_answer: 8
  })
  .run(['callFSM', function() {}]);
