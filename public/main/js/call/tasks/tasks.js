angular.module('tasks', ['util.pubsub'])
  .factory('taskFactory', ["pubsubMethods", "pubsubSubscriber", "pubsubEvent",
    function(pubsubMethods, pubsubSubscriber, pubsubEvent) {
      return {
        publish_location_change_to_call: {
          pubsubMethod: pubsubMethods.publish,
          subscriber: pubsubSubscriber.location_service,
          event: pubsubEvent.change_url_to_call
        },
        publish_create_outgoing_call: {
          pubsubMethod: pubsubMethods.publish,
          subscriber: pubsubSubscriber.call_service,
          event: pubsubEvent.create_outgoing_call
        },
        publish_create_incoming_call: {
          pubsubMethod: pubsubMethods.publish,
          subscriber: pubsubSubscriber.call_service,
          event: pubsubEvent.create_incoming_call
        },
        publish_state_chage: {
          pubsubMethod: pubsubMethods.publish,
          subscriber: pubsubSubscriber.call_service,
          event: pubsubEvent.state_change
        },
        publish_request_media_permission: {
          pubsubMethod: pubsubMethods.publish,
          subscriber: pubsubSubscriber.media_service,
          event: pubsubEvent.request_media_permission,
          params: {
            constraints: {
              audio: true,
              video: true
            }
          }
        },
        broadcast_clear_resources: {
          pubsubMethod: pubsubMethods.broadcast,
          subscriber: pubsubSubscriber.global,
          event: pubsubEvent.clear_resources
        },
        publish_create_peer: {
          pubsubMethod: pubsubMethods.publish,
          subscriber: pubsubSubscriber.peer_service,
          event: pubsubEvent.create_peer
        },
        publish_create_offer: {
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
        },
        publish_create_answer: {
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
        },
        publish_set_local_offer: {
          pubsubMethod: pubsubMethods.publish,
          subscriber: pubsubSubscriber.peer_service,
          event: pubsubEvent.set_local_offer
        },
        publish_set_local_answer: {
          pubsubMethod: pubsubMethods.publish,
          subscriber: pubsubSubscriber.peer_service,
          event: pubsubEvent.set_local_answer
        },
        publish_set_remote_offer: {
          pubsubMethod: pubsubMethods.publish,
          subscriber: pubsubSubscriber.peer_service,
          event: pubsubEvent.set_remote_offer
        },
        publish_set_remote_answer: {
          pubsubMethod: pubsubMethods.publish,
          subscriber: pubsubSubscriber.peer_service,
          event: pubsubEvent.set_remote_answer
        },
        publish_send_start_call_request: {
          pubsubMethod: pubsubMethods.publish,
          subscriber: pubsubSubscriber.call_service,
          event: pubsubEvent.send_start_call_request
        },
        publish_send_answer_call_request: {
          pubsubMethod: pubsubMethods.publish,
          subscriber: pubsubSubscriber.call_service,
          event: pubsubEvent.send_answer_call_request
        },
        publish_send_accept_call_request: {
          pubsubMethod: pubsubMethods.publish,
          subscriber: pubsubSubscriber.call_service,
          event: pubsubEvent.send_accept_call_request
        },
        publish_add_local_stream: {
          pubsubMethod: pubsubMethods.publish,
          subscriber: pubsubSubscriber.peer_service,
          event: pubsubEvent.add_local_stream
        }
      };
    }
  ]);
