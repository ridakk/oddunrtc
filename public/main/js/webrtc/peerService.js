angular.module('webrtc.peerService', ['util.pubsub'])
  .service('peerService', ["$log", "pubsub", "pubsubSubscriber", "pubsubEvent",
    function($log, pubsub, pubsubSubscriber, pubsubEvent) {
      var self = this,
        calls = {};

      // TODO how to pass ice servers, dtls etc...
      self.createPeer = function(data) {
        var pc = new RTCPeerConnection( /*data.config, data.pcConstraints*/ );

        pc.onaddstream = function(e) {
          pubsub.publish({
            publisher: pubsubSubscriber.peer_service,
            subscriber: pubsubSubscriber.call_service,
            event: pubsubEvent.on_remote_stream,
            msg: {
              callId: data.msg.callId,
              stream: e.stream
            }
          });
        };

        pc.onicecandidate = function(e) {
          pubsub.publish({
            publisher: pubsubSubscriber.peer_service,
            subscriber: pubsubSubscriber.call_service,
            event: pubsubEvent.on_ice_canditate,
            msg: {
              callId: data.msg.callId,
              candidate: e.candidate
            }
          });
        };

        pc.oniceconnectionstatechange = function(e) {
          $log.info("ice connection state: " + pc.iceConnectionState);
          // TODO ice connection state should be handled by fsm, it indicates audio path success/failure
          // pubsub.publish({
          //   publisher: pubsubSubscriber.peer_service,
          //   subscriber: pubsubSubscriber.call_fsm,
          //  event: pubsubEvent.on_ice_connection_state,
          //   msg: {
          //     callId: data.msg.callId,
          //     state: pc.iceConnectionState
          //   }
          // });
        };
        return pc;
      };

      self.handleCreateOffer = function(data) {
        var callId = data.msg.callId,
          internalCall;
        if (!calls[callId]) {
          calls[callId] = {};
        }

        internalCall = calls[callId];

        internalCall.pc = self.createPeer();

        internalCall.pc.addStream(data.msg.stream);
        pubsub.publish({
          publisher: pubsubSubscriber.peer_service,
          subscriber: pubsubSubscriber.call_service,
          event: pubsubEvent.on_local_stream,
          msg: {
            callId: data.msg.callId,
            stream: data.msg.stream
          }
        });

        internalCall.pc.createOffer(function(desc) {
            internalCall.localSdp = desc.sdp;
            pubsub.publish({
              publisher: pubsubSubscriber.peer_service,
              subscriber: pubsubSubscriber.call_fsm,
              event: pubsubEvent.create_offer_success,
              msg: {
                callId: callId,
                sdp: desc.sdp
              }
            });
          }, function(error) {
            pubsub.publish({
              publisher: pubsubSubscriber.peer_service,
              subscriber: pubsubSubscriber.call_fsm,
              event: pubsubEvent.create_offer_failure,
              msg: {
                callId: callId,
                error: error
              }
            });
          },
          data.msg.createOfferConstraints);
      };

      pubsub.subscribe({
        subscriber: pubsubSubscriber.peer_service,
        event: pubsubEvent.create_offer,
        callback: self.handleCreateOffer
      });

      pubsub.subscribe({
        subscriber: pubsubSubscriber.global,
        event: pubsubEvent.clear_resources,
        callback: function(data) {
          $log.info("peer service: deleting call object: " + data.msg.callId);
          calls[data.msg.callId].pc.onicecandidate = null;
          calls[data.msg.callId].pc.oniceconnectionstatechange = null;
          calls[data.msg.callId].pc.onaddstream = null;

          // TODO release local stream if peer has one
          // adaptor shim does not handle media stop
          calls[data.msg.callId].pc.getLocalStreams()[0].getTracks()[0].stop();
          calls[data.msg.callId].pc.getLocalStreams()[0].getTracks()[1].stop();

          calls[data.msg.callId].pc.close();
          calls[data.msg.callId].pc = null;

          delete calls[data.msg.callId];
        }
      });
    }
  ])
  .run(['peerService', function() {}]);
