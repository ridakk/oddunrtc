var logger = require('bunyan').createLogger({
    name: 'controllers.MissedCallsController'
  }),
  Q = require("q"),
  MissedCalls = require('./../models/MissedCalls');

exports.add = function(params) {
  var deferred = Q.defer(),
    newMissedCalls;
  MissedCalls.findOne({
    uuid: params.uuid
  }, function(err, missedCalls) {
    if (err) {
      deferred.reject({
        httpCode: 500,
        errorCode: 3001,
        errorText: "db connection error"
      });

      if (missedCalls) {
        missedCalls.missed.push(params.missedCall);

        missedCalls.save(function(err) {
          if (err) {
            deferred.reject({
              httpCode: 500,
              errorCode: 3002,
              errorText: "db connection error"
            });
            return;
          }

          deferred.resolve();
        });
      } else {
        var newMissedCalls = new MissedCalls();

        newMissedCalls.uuid = params.uuid;
        newMissedCalls.missed = [params.missedCall];

        newMissedCalls.save(function(err) {
          if (err) {
            deferred.reject({
              httpCode: 500,
              errorCode: 3003,
              errorText: "db connection error"
            });
            return;
          }

          deferred.resolve();
        });
      }
    }
  });

  return deferred.promise;
};

exports.get = function(params) {
  var deferred = Q.defer(),
    result = [];
  MissedCalls.findOne({
    uuid: params.uuid
  }, function(err, missedCalls) {
    if (err) {
      deferred.reject({
        httpCode: 500,
        errorCode: 3004,
        errorText: "db connection error"
      });
      return deferred.promise;
    }

    if (missedCalls) {
      result = missedCalls.missed;
    }

    // missedCalls.missed = [];
    // missedCalls.save();

    deferred.resolve({
      httpCode: 200,
      result: result
    });
  });

  return deferred.promise;
};
