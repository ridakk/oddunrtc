var ioCtrl = require('./../controllers/SocketIoController'),
  authCtrl = require('./../controllers/AuthController'),
  calls = require('./../models/Calls');


// expose the routes to our app with module.exports
module.exports = function(app) {

  app.post('/a/:link/:uuid/call/:callId', function(req, res) {
    var link = req.params.link,
      uuid = req.params.uuid,
      callId = req.params.callId,
      data = req.body;

    console.log("anonymous /call %s from %s with id %s", link, uuid, callId, data);

    User.findOne({
      link: link
    }, function(err, user) {
      if (err) {
        console.log("db error, cannot query link: %s", link);
        res.status(500).send();
        return;
      }

      if (!user) {
        console.log("user link not found: %s", link);
        res.status(404).send();
        return;
      }

      anonymousUser = AnonymousUser.get({
        uuid: uuid
      });

      if (!anonymousUser) {
        console.log("anonymous user link not found: %s", link);
        res.status(404).send();
        return;
      }

      data.callId = calls.create({
        to: data.to,
        from: uuid
      });

      if (ioCtrl.send(data.to, data)) {
        res.status(200).send(JSON.stringify(data));
      } else {
        res.status(404).send();
      }
    });

  });

  app.put('/a/:link/:uuid/call/:callId', function(req, res) {
    var link = req.params.link,
      uuid = req.params.uuid,
      data = req.body;
    console.log("/call post from %j", data);

    if (ioCtrl.send(data.to, data)) {
      res.status(200).send(JSON.stringify(data));
    } else {
      res.status(404).send();
    }
  });

  app.delete('/a/:link/:uuid/call/:callId', function(req, res) {
    var link = req.params.link,
      uuid = req.params.uuid,
      data = req.body;
    console.log("/call delete from %j", data);

    calls.delete({
      callId: data.data.msg.callId
    });

    if (ioCtrl.send(data.to, data)) {
      res.status(200).send(JSON.stringify(data));
    } else {
      res.status(404).send();
    }

  });

};
