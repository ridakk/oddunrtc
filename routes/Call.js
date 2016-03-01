var logger = require('bunyan').createLogger({
    name: 'routes.Call'
  }),
  ioCtrl = require('./../controllers/SocketIoController'),
  authCtrl = require('./../controllers/AuthController'),
  calls = require('./../models/Calls');


// expose the routes to our app with module.exports
module.exports = function(app) {

  app.post('/call/:callId', authCtrl.ensureAuthenticated, function(request, response) {
    var data = request.body;
    logger.debug("/call post from %j", data);

    data.callId = calls.create({
      to: data.to,
      from: request.user.uuid
    });

    if (ioCtrl.sendToAll(data.to, data)) {
      response.status(200).send(JSON.stringify(data));
    } else {
      response.status(404).send();
    }

  });

  app.put('/call/:callId', authCtrl.ensureAuthenticated, function(request, response) {
    var data = request.body;
    logger.debug("/call post from %j", data);

    if (ioCtrl.send(data.to, data)) {
      response.status(200).send(JSON.stringify(data));
    } else {
      response.status(404).send();
    }
  });

  app.delete('/call/:callId', authCtrl.ensureAuthenticated, function(request, response) {
    var data = request.body;
    logger.debug("/call delete from %j", data);

    calls.delete({
      callId: data.data.msg.callId
    });

    if (ioCtrl.send(data.to, data)) {
      response.status(200).send(JSON.stringify(data));
    } else {
      response.status(404).send();
    }

  });

};
