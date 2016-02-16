angular.module('util.peerService', ['util.pubsub'])
  .service('peerService', ["$log", "pubsub", "pubsubSubscriber", "pubsubEvent",
    function($log, pubsub, pubsubSubscriber, pubsubEvent) {
      var self = this;
  ])
  .run(['peerService', function() {}]);
