var logger = require('bunyan').createLogger({
    name: 'routes.Call'
  }),
  ioCtrl = require('./../controllers/SocketIoController'),
  authCtrl = require('./../controllers/AuthController'),
  calls = require('./../models/Calls');


// expose the routes to our app with module.exports
module.exports = function(app) {

  app.post('/call/:callId', authCtrl.ensureAuthenticated, function(req, res) {
    var data = req.body,
      callId = req.params.callId;
    logger.info("/call post from %j", data);

    calls.create({
      callId: callId,
      to: data.to,
      from: req.user.uuid
    });
    data.from = req.user.uuid;

    if (ioCtrl.sendToAll(data.to, data)) {
      res.status(200).send(JSON.stringify(data));
    } else {
      res.status(404).send();
    }

  });

  app.put('/call/:callId', authCtrl.ensureAuthenticated, function(req, res) {
    var data = req.body,
      callId = req.params.callId;
    logger.info("/call post from %j", data);

    if (!calls.get({
        callId: callId
      })) {
      logger.info("call id  not found: %s", callId);
      res.status(404).send();
      return;
    }

    if (ioCtrl.send(data.to, data)) {
      res.status(200).send(JSON.stringify(data));
    } else {
      res.status(404).send();
    }
  });

  app.delete('/call/:callId', authCtrl.ensureAuthenticated, function(req, res) {
    var data = req.body,
      callId = req.params.callId;
    logger.info("/call delete from %j", data);

    calls.delete({
      callId: callId
    });

    if (ioCtrl.send(data.to, data)) {
      res.status(200).send(JSON.stringify(data));
    } else {
      res.status(404).send();
    }

  });

};
