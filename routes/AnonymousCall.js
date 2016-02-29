var ioCtrl = require('./../controllers/SocketIoController'),
  authCtrl = require('./../controllers/AuthController'),
  calls = require('./../models/Calls');


// expose the routes to our app with module.exports
module.exports = function(app) {

  app.post('/a/:link/:uuid/call/:callId', function(request, response) {
    var link = req.params.link,
      uuid = req.params.uuid,
      callId = req.params.callId,
      data = request.body;

    console.log("anonymous /call %s from %s with id %s", link, uuid, callId, data);

    data.callId = calls.create({
      to: data.to,
      from: uuid
    });

    if (ioCtrl.send(data.to, data)) {
      response.status(200).send(JSON.stringify(data));
    } else {
      response.status(404).send();
    }

  });

  app.put('/a/:link/:uuid/call/:callId', function(request, response) {
    var link = req.params.link,
      uuid = req.params.uuid,
      data = request.body;
    console.log("/call post from %j", data);

    if (ioCtrl.send(data.to, data)) {
      response.status(200).send(JSON.stringify(data));
    } else {
      response.status(404).send();
    }
  });

  app.delete('/a/:link/:uuid/call/:callId', function(request, response) {
    var link = req.params.link,
      uuid = req.params.uuid,
      data = request.body;
    console.log("/call delete from %j", data);

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
