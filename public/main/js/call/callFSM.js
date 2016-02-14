angular.module('call')
  .service('callFSM', ["$log", "$q", "pubsub", "pubsubMainEvents", "pubsubChildEvents", "pubsubMethods", "callFsmStates", "callFsmTasks",
    function($log, $q, pubsub, pubsubMainEvents, pubsubChildEvents, pubsubMethods, callFsmStates, callFsmTasks) {
      var self = this,
        calls = {},
        transitionsHashTable = {},
        tasks = {};

      tasks[callFsmTasks.publish_state_chage] = {
        pubsubMethod: pubsubMethods.publish,
        mainEvent: pubsubMainEvents.call_service,
        childEvent: pubsubChildEvents.state_change
      };
      tasks[callFsmTasks.publish_request_media_permission] = {
        pubsubMethod: pubsubMethods.publish,
        mainEvent: pubsubMainEvents.media_service,
        childEvent: pubsubChildEvents.request_media_permission,
        params: {
          constraints: {
            audio: true,
            video: true
          }
        }
      };
      tasks[callFsmTasks.broadcast_clear_resources] = {
        pubsubMethod: pubsubMethods.broadcast,
        mainEvent: pubsubMainEvents.global,
        childEvent: pubsubChildEvents.clear_resources
      };
      tasks[callFsmTasks.publish_create_offer] = {
        pubsubMethod: pubsubMethods.publish,
        mainEvent: pubsubMainEvents.peer_service,
        childEvent: pubsubChildEvents.create_offer
        params: {
          createOfferConstraints: {
            offerToReceiveAudio: 1,
            offerToReceiveVideo: 1
          }
        }
      };


      //TODO how to publish state change updates ???
      transitionsHashTable[pubsubChildEvents.start_call_gui] = {};
      transitionsHashTable[pubsubChildEvents.start_call_gui][0] = {
        when: [{
          childEvent: pubsubChildEvents.start_call_gui,
          performs: [callFsmTasks.publish_request_media_permission]
        }],
      };
      transitionsHashTable[pubsubChildEvents.start_call_gui][1] = {
        when: [{
          childEvent: pubsubChildEvents.media_permission_rejected,
          performs: [callFsmTasks.broadcast_clear_resources]
        }, {
          childEvent: pubsubChildEvents.media_permission_granted,
          performs: [callFsmTasks.publish_create_offer]
        }],
      };

      function handleFSMEvent(data) {
        var i, j, k, internalCall, callId = data.msg.callId,
          whenList, performList, task;
        // TODO how to do second transition flow for call
        if (!calls[callId]) {
          calls[callId] = {
            trIndex: 0,
            transition: transitionsHashTable[data.childEvent]
          };
        }

        internalCall = calls[callId];

        whenList = internalCall.transition[internalCall.trIndex].when;

        for (i in whenList) {
          if (whenList.hasOwnProperty(i)) {
            if (whenList[i].childEvent === data.childEvent) {
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
                    mainEvent: task.mainEvent,
                    childEvent: task.childEvent,
                    msg: data.msg
                  });
                }
              }
            }
          }
        }

        // TODO need to understand current transition is completed
        internalCall.trIndex++;

        if (!performList) {
          throw new Error("nothing to perform, soemthing is wrong...");
        }
      };

      pubsub.subscribe({
        mainEvent: pubsubMainEvents.call_fsm,
        callback: handleFSMEvent
      });

      pubsub.subscribe({
        mainEvent: pubsubMainEvents.global,
        childEvent: pubsubChildEvents.clear_resources,
        callback: function(data) {
          $log.info("call fsm: deleting call object: " + data.msg.callId);
          delete calls[data.msg.callId];
        }
      });
    }
  ])
  .constant("callFsmStates", {
    init: "init",
    request_media_permission: "request_media_permission",
    create_offer: "create_offer"
  })
  .constant("callFsmTasks", {
    publish_state_chage: 0,
    publish_request_media_permission: 1,
    publish_create_offer: 2,
    broadcast_clear_resources: 3
  })
  .run(['callFSM', function() {}]);
