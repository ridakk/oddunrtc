angular.module('webrtc.peerService', ['util.pubsub'])
  .service('peerService', ["$log", "pubsub", "pubsubSubscriber", "pubsubEvent",
    function($log, pubsub, pubsubSubscriber, pubsubEvent) {
      var self = this,
        calls = {},
        eventHandlers = {};

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
          if (e.candidate === null) {
            return;
          }

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

      self.handleAddLocalStream = function(data) {
        var callId = data.msg.callId,
          internalCall = calls[callId];

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
      };

      self.handleCreatePeer = function(data) {
        var callId = data.msg.callId,
          internalCall;
        if (!calls[callId]) {
          calls[callId] = {};
        }

        internalCall = calls[callId];
        internalCall.remoteSdp = data.msg.remoteSdp;

        internalCall.pc = self.createPeer(data);

        if (data.msg.stream) {
          self.handleAddLocalStream(data);
        }

        pubsub.publish({
          publisher: pubsubSubscriber.peer_service,
          subscriber: pubsubSubscriber.call_fsm,
          event: pubsubEvent.create_peer_completed,
          msg: {
            callId: data.msg.callId
          }
        });
      };

      self.handleCreate = function(data) {
        data.call.pc[data.method](function(desc) {
            data.call.localSdp = desc.sdp;
            pubsub.publish({
              publisher: pubsubSubscriber.peer_service,
              subscriber: pubsubSubscriber.call_fsm,
              event: data.successEvent,
              msg: {
                callId: data.callId,
                sdp: desc.sdp
              }
            });
          }, function(error) {
            pubsub.publish({
              publisher: pubsubSubscriber.peer_service,
              subscriber: pubsubSubscriber.call_fsm,
              event: data.failureEvent,
              msg: {
                callId: data.callId,
                error: error
              }
            });
          },
          data.constraints);
      };

      self.handleCreateOffer = function(data) {
        var callId = data.msg.callId,
          internalCall = calls[callId];
        self.handleCreate({
          call: internalCall,
          method: "createOffer",
          callId: data.msg.callId,
          constraints: data.msg.constraints,
          successEvent: pubsubEvent.create_offer_success,
          failureEvent: pubsubEvent.create_offer_failure
        });
      };

      self.handleCreateAnswer = function(data) {
        var callId = data.msg.callId,
          internalCall = calls[callId];
        self.handleCreate({
          call: internalCall,
          method: "createAnswer",
          callId: data.msg.callId,
          constraints: data.msg.constraints,
          successEvent: pubsubEvent.create_answer_success,
          failureEvent: pubsubEvent.create_answer_failure
        });
      };

      self.setDescription = function(data) {
        data.pc[data.method](new RTCSessionDescription({
          type: data.sdpType,
          sdp: data.sdp
        }), function() {
          pubsub.publish({
            publisher: pubsubSubscriber.peer_service,
            subscriber: pubsubSubscriber.call_fsm,
            event: data.successEvent,
            msg: {
              callId: data.callId
            }
          });
        }, function(error) {
          pubsub.publish({
            publisher: pubsubSubscriber.peer_service,
            subscriber: pubsubSubscriber.call_fsm,
            event: data.failureEvent,
            msg: {
              callId: data.callId,
              error: error
            }
          });
        });
      };

      self.handleSetLocalOffer = function(data) {
        var callId = data.msg.callId,
          internalCall = calls[callId];
        self.setDescription({
          pc: internalCall.pc,
          method: "setLocalDescription",
          callId: data.msg.callId,
          sdpType: "offer",
          sdp: internalCall.localSdp,
          successEvent: pubsubEvent.set_local_offer_success,
          failureEvent: pubsubEvent.set_local_offer_failure
        });
      };

      self.handleSetLocalAnswer = function(data) {
        var callId = data.msg.callId,
          internalCall = calls[callId];
        self.setDescription({
          pc: internalCall.pc,
          method: "setLocalDescription",
          callId: data.msg.callId,
          sdpType: "answer",
          sdp: internalCall.localSdp,
          successEvent: pubsubEvent.set_local_answer_success,
          failureEvent: pubsubEvent.set_local_answer_failure
        });
      };

      self.handleSetRemoteOffer = function(data) {
        var callId = data.msg.callId,
          internalCall = calls[callId];
        self.setDescription({
          pc: internalCall.pc,
          method: "setRemoteDescription",
          callId: data.msg.callId,
          sdpType: "offer",
          sdp: internalCall.remoteSdp,
          successEvent: pubsubEvent.set_remote_offer_success,
          failureEvent: pubsubEvent.set_remote_offer_failure
        });
      };

      self.handleSetRemoteAnswer = function(data) {
        var callId = data.msg.callId,
          internalCall = calls[callId];
        self.setDescription({
          pc: internalCall.pc,
          method: "setRemoteDescription",
          callId: data.msg.callId,
          sdpType: "answer",
          sdp: data.msg.sdp,
          successEvent: pubsubEvent.set_remote_answer_success,
          failureEvent: pubsubEvent.set_remote_answer_failure
        });
      };

      self.handleIceCandidateNotify = function(data) {
        var callId = data.msg.callId,
          internalCall = calls[callId];

        internalCall.pc.addIceCandidate(new RTCIceCandidate(data.msg.candidate),
          function() {

          },
          function(err) {

          }
        );
      };

      eventHandlers[pubsubEvent.create_peer] = self.handleCreatePeer;
      eventHandlers[pubsubEvent.create_offer] = self.handleCreateOffer;
      eventHandlers[pubsubEvent.create_answer] = self.handleCreateAnswer;
      eventHandlers[pubsubEvent.set_local_offer] = self.handleSetLocalOffer;
      eventHandlers[pubsubEvent.set_local_answer] = self.handleSetLocalAnswer;
      eventHandlers[pubsubEvent.set_remote_offer] = self.handleSetRemoteOffer;
      eventHandlers[pubsubEvent.set_remote_answer] = self.handleSetRemoteAnswer;
      eventHandlers[pubsubEvent.add_local_stream] = self.handleAddLocalStream;
      eventHandlers[pubsubEvent.ice_candidate_notify] = self.handleIceCandidateNotify;

      self.handlePeerServiceEvent = function(data) {
        eventHandlers[data.event](data);
      };

      pubsub.subscribe({
        subscriber: pubsubSubscriber.peer_service,
        callback: self.handlePeerServiceEvent
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
