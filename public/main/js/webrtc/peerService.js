angular.module('webrtc.peerService', ['util.pubsub'])
  .service('peerService', ["$log", "pubsub", "pubsubMainEvents", "pubsubChildEvents",
    function($log, pubsub, pubsubMainEvents, pubsubChildEvents) {
      var self = this,
        calls = {};

      // TODO how to pass ice servers, dtls etc...
      self.createPeer = function(data) {
        var pc = new RTCPeerConnection( /*data.config, data.pcConstraints*/ );

        pc.onaddstream = function(e) {
          pubsub.publish({
            mainEvent: pubsubMainEvents.call_service,
            childEvent: pubsubChildEvents.on_remote_stream,
            msg: {
              callId: data.msg.callId,
              stream: e.stream
            }
          });
        };

        pc.onicecandidate = function(e) {
          pubsub.publish({
            mainEvent: pubsubMainEvents.call_service,
            childEvent: pubsubChildEvents.on_ice_canditate,
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
          //   mainEvent: pubsubMainEvents.call_fsm,
          //   childEvent: pubsubChildEvents.on_ice_connection_state,
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

        pc.addStream(data.msg.stream);
        pubsub.publish({
          mainEvent: pubsubMainEvents.call_service,
          childEvent: pubsubChildEvents.on_local_stream,
          msg: {
            callId: data.msg.callId,
            stream: data.msg.stream
          }
        });

        internalCall.pc.createOffer(function(desc) {
            internalCall.createOfferSdp = desc.sdp;
            pubsub.publish({
              mainEvent: pubsubMainEvents.call_fsm,
              childEvent: pubsubChildEvents.create_offer_success,
              msg: {
                callId: callId,
                sdp: desc.sdp
              }
            });
          }, function(error) {
            pubsub.publish({
              mainEvent: pubsubMainEvents.call_fsm,
              childEvent: pubsubChildEvents.create_offer_failure,
              msg: {
                callId: callId,
                error: error
              }
            });
          },
          data.msg.createOfferConstraints);
      };

      pubsub.subscribe({
        mainEvent: pubsubMainEvents.peerService,
        childEvent: pubsubChildEvents.create_offer,
        callback: self.handleCreateOffer
      });

      pubsub.subscribe({
        mainEvent: pubsubMainEvents.global,
        childEvent: pubsubChildEvents.clear_resources,
        callback: function(data) {
          $log.info("peer service: deleting call object: " + data.msg.callId);
          calls[data.msg.callId].pc.onicecandidate = null;
          calls[data.msg.callId].pc.oniceconnectionstatechange = null;
          calls[data.msg.callId].pc.onaddstream = null;

          // TODO release local stream if peer has one

          calls[data.msg.callId].pc.close();
          calls[data.msg.callId].pc = null;

          delete calls[data.msg.callId];
        }
      });
    }
  ])
  .run(['peerService', function() {}]);
