var logger = require('bunyan').createLogger({
    name: 'routes.Call'
  }),
  authCtrl = require('./../controllers/AuthController'),
  CallCtrl = require('./../controllers/CallController');


// expose the routes to our app with module.exports
module.exports = function(app) {

  app.post('/call/:callId', authCtrl.ensureAuthenticated, function(req, res) {
    CallCtrl.handlePost({
      callId: req.params.callId,
      reqData: req.body,
      reqUser: req.user
    }).then(function(data) {
      res.status(data.httpCode).send();
    }, function(err) {
      res.status(err.httpCode).send(JSON.stringify(err));
    });
  });

  app.put('/call/:callId', authCtrl.ensureAuthenticated, function(req, res) {
    CallCtrl.handlePut({
      callId: req.params.callId,
      reqData: req.body,
      reqUser: req.user
    }).then(function(data) {
      res.status(data.httpCode).send();
    }, function(err) {
      res.status(err.httpCode).send(JSON.stringify(err));
    });
  });

  app.delete('/call/:callId', authCtrl.ensureAuthenticated, function(req, res) {
    CallCtrl.handleDelete({
      callId: req.params.callId,
      reqData: req.body,
      reqUser: req.user
    });

    res.status(200).send();
  });

};
