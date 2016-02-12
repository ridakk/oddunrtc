angular.module('call')
  .service('callService', ["$rootScope", "$log", "$q", "$location", "httpService", "userService", "notificationService",
    function($rootScope, $log, $q, $location, httpService, userService, notificationService) {
      var self = this,
        calls = {},
        callIdHashTable = {};

      self.onLocalStreamAdded = function() {};
      self.onRemoteStreamAdded = function() {};

      notificationService.subscribe({
        type: "call",
        callback: function(msg) {
          $log.info("call msg received...");

          switch (msg.action) {
            case "start":
              $log.info("call start request received...");
              calls[msg.callId] = {
                internallCallId: UUID.generate(),
                from: msg.from,
                to: msg.to,
                offerDesc: msg.data
              };
              callIdHashTable[calls[msg.callId].internallCallId] = msg.callId;

              $rootScope.$apply(function() {
                $location.url('/call/' + msg.from + '/' + msg.callId);
              });
              //$location.path('#/call/' + msg.from + '/' + msg.callId);
              break;
            default:
              $log.info("unhandled call request !!!");
          }
        }
      });

      self.start = function(params) {
        var pc, deferred = $q.defer(),
          internallCallId = UUID.generate();
        getUserMedia({
          audio: true,
          video: true
        }, function(stream) {
          $log.info("retrieved stream: ", stream);
          pc = new RTCPeerConnection();
          pc.addStream(stream);
          pc.createOffer(function(desc) {
            $log.info("create offer succ", desc);

            httpService.post({
              url: window.location.origin + "/call",
              data: {
                type: "call",
                from: userService.email,
                to: params.to,
                action: "start",
                data: desc
              }
            }).then(function(postRes) {
              calls[postRes.callId] = {
                internallCallId: internallCallId,
                from: userService.email,
                to: params.to,
                offerDesc: desc
              }
              callIdHashTable[internallCallId] = postRes.callId;

              self.onLocalStreamAdded(stream);

              pc.setLocalDescription(desc, function() {
                $log.info("set local description succ");
              }, function() {
                $log.info("set local description fail");
              });

              pc.onicecandidate = function(evt) {
                httpService.put({
                  url: window.location.origin + "/call/" + postRes.callId,
                  data: {
                    type: "call",
                    from: userService.email,
                    to: params.to,
                    action: "canditate",
                    data: evt.candidate
                  }
                })
              };

              pc.onaddstream = function(evt) {
                self.onRemoteStreamAdded(evt.stream);
              };

              deferred.resolve(postRes);
            });

          }, function() {
            $log.info("create offer fail");
            deferred.reject();
          }, {
            offerToReceiveAudio: 1,
            offerToReceiveVideo: 1,
            voiceActivityDetection: false
          });
        }, function(stream) {
          $log.info("failed to retrieve stream");
          deferred.reject();
        });

        return deferred.promise;
      };

      self.answer = function(params) {
        var pc, deferred = $q.defer(),
          internalCallObj = calls[params.callId];

        if (!internalCallObj) {
          deferred.reject();
        };

        getUserMedia({
              audio: true,
              video: true
            }, function(stream) {
              $log.info("retrieved stream: ", stream);
              pc = new RTCPeerConnection();
              pc.addStream(stream);

              pc.setRemoteDescription(new RTCSessionDescription({
                  type: "offer",
                  sdp: internalCallObj.offerDesc.sdp
                }),
                function() {
                  $log.info("set remote description succ");
                  pc.createAnswer(function(desc) {
                    $log.info("create answer succ");
                    httpService.put({
                      url: window.location.origin + "/call/" + params.callId,
                      data: {
                        type: "call",
                        from: userService.email,
                        to: internalCallObj.from,
                        action: "answer",
                        data: desc.sdp
                      }
                    }).then(function() {
                      self.onLocalStreamAdded(stream);

                      pc.setLocalDescription(desc, function() {
                        $log.info("set local description succ");
                      }, function() {
                        $log.info("set local description fail");
                      });

                      pc.onicecandidate = function(evt) {
                        httpService.put({
                          url: window.location.origin + "/call/" + postRes.callId,
                          data: {
                            type: "call",
                            from: userService.email,
                            to: internalCallObj.from,
                            action: "canditate",
                            data: evt.candidate
                          }
                        })
                      };

                      pc.onaddstream = function(evt) {
                        self.onRemoteStreamAdded(evt.stream);
                      };

                      deferred.resolve();
                    });
                  }, function() {
                    $log.info("create answer fail");
                    deferred.reject();
                  })
                },
                function() {
                  $log.info("set remote description fail");
                  deferred.reject();
                });
          },
          function(stream) {
            $log.info("failed to retrieve stream");
            deferred.reject();
          });

      return deferred.promise;
    };
  }]);
