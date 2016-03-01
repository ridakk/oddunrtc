var logger = require('bunyan').createLogger({
    name: 'routes.AnonymousCall'
  }),
  ioCtrl = require('./../controllers/SocketIoController'),
  authCtrl = require('./../controllers/AuthController'),
  calls = require('./../models/Calls'),
  User = require('./../models/User'),
  AnonymousUser = require('./../models/AnonymousUser');


// expose the routes to our app with module.exports
module.exports = function(app) {

  app.post('/a/:link/:uuid/call/:callId', function(req, res) {
    var link = req.params.link,
      uuid = req.params.uuid,
      callId = req.params.callId,
      data = req.body;

    logger.debug("anonymous /call %s from %s with id %s", link, uuid, callId);

    User.findOne({
      link: link
    }, function(err, user) {
      if (err) {
        logger.fatal("db error, cannot query link: %s", link);
        res.status(500).send();
        return;
      }

      if (!user) {
        logger.error("user link not found: %s", link);
        res.status(404).send();
        return;
      }

      anonymousUser = AnonymousUser.get({
        uuid: uuid
      });

      if (!anonymousUser) {
        logger.error("anonymous user link not found: %s", link);
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
        logger.error("can not locate soclet to send: %s", data.to);
        res.status(404).send();
      }
    });

  });

  app.put('/a/:link/:uuid/call/:callId', function(req, res) {
    var link = req.params.link,
      uuid = req.params.uuid,
      data = req.body;
    logger.debug("/call post from %j", data);

    if (ioCtrl.send(data.to, data)) {
      res.status(200).send(JSON.stringify(data));
    } else {
      logger.error("can not locate soclet to send: %s", data.to);
      res.status(404).send();
    }
  });

  app.delete('/a/:link/:uuid/call/:callId', function(req, res) {
    var link = req.params.link,
      uuid = req.params.uuid,
      data = req.body;
    logger.debug("/call delete from %j", data);

    calls.delete({
      callId: data.data.msg.callId
    });

    if (ioCtrl.send(data.to, data)) {
      res.status(200).send(JSON.stringify(data));
    } else {
      logger.error("can not locate soclet to send: %s", data.to);
      res.status(404).send();
    }

  });

};
