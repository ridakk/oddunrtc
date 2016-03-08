var logger = require('bunyan').createLogger({
    name: 'routes.MissedCalls'
  }),
  MissedCallsCtrl = require('./../controllers/MissedCallsController'),
  AuthCtrl = require('./../controllers/AuthController');

module.exports = function(app) {

  //TODO how to remove a missed call
  //TODO should we remove all missed call once /get is called

  app.get('/missedCalls', AuthCtrl.ensureAuthenticated, function(req, res) {
    MissedCallsCtrl.get({
      uuid: req.user.uuid
    }).then(function(data) {
      res.status(data.httpCode).send(JSON.stringify(data.result));
    }, function(err) {
      res.status(err.httpCode).send(JSON.stringify(err));
    });
  });

};
