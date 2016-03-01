var logger = require('bunyan').createLogger({
    name: 'routes.AnonymousCall'
  }),
  CallCtrl = require('./../controllers/CallController'),
  User = require('./../models/User'),
  AnonymousUser = require('./../models/AnonymousUser');


// expose the routes to our app with module.exports
module.exports = function(app) {

  app.post('/a/:link/:uuid/call/:callId', function(req, res) {
    var link = req.params.link,
      uuid = req.params.uuid,
      callId = req.params.callId,
      data = req.body;

    logger.info("anonymous /call %s from %s with id %s", link, uuid, callId);

    User.findOne({
      link: link
    }, function(err, user) {
      if (err) {
        logger.info("db error, cannot query link: %s", link);
        res.status(500).send();
        return;
      }

      if (!user) {
        logger.info("user link not found: %s", link);
        res.status(404).send();
        return;
      }

      anonymousUser = AnonymousUser.get({
        uuid: uuid
      });

      if (!anonymousUser) {
        logger.info("anonymous user link not found: %s", link);
        res.status(404).send();
        return;
      }

      CallCtrl.handlePost({
        callId: req.params.callId,
        reqData: req.body,
        reqUser: anonymousUser
      }).then(function(data) {
        res.status(data.httpCode).send();
      }, function(err) {
        res.status(err.httpCode).send(JSON.stringify(err));
      });
    });

  });

  app.put('/a/:link/:uuid/call/:callId', function(req, res) {
    var link = req.params.link,
      uuid = req.params.uuid,
      callId = req.params.callId,
      data = req.body;
    logger.info("/call post from %j", data);

    User.findOne({
      link: link
    }, function(err, user) {
      if (err) {
        logger.info("db error, cannot query link: %s", link);
        res.status(500).send();
        return;
      }

      if (!user) {
        logger.info("user link not found: %s", link);
        res.status(404).send();
        return;
      }

      anonymousUser = AnonymousUser.get({
        uuid: uuid
      });

      if (!anonymousUser) {
        logger.info("anonymous user link not found: %s", link);
        res.status(404).send();
        return;
      }

      CallCtrl.handlePut({
        callId: req.params.callId,
        reqData: req.body,
        reqUser: anonymousUser
      }).then(function(data) {
        res.status(data.httpCode).send();
      }, function(err) {
        res.status(err.httpCode).send(JSON.stringify(err));
      });
    });

  });

  app.delete('/a/:link/:uuid/call/:callId', function(req, res) {
    var link = req.params.link,
      uuid = req.params.uuid,
      callId = req.params.callId,
      data = req.body;
    logger.info("/call delete from %j", data);

    User.findOne({
      link: link
    }, function(err, user) {
      if (err) {
        logger.info("db error, cannot query link: %s", link);
        res.status(500).send();
        return;
      }

      if (!user) {
        logger.info("user link not found: %s", link);
        res.status(404).send();
        return;
      }

      anonymousUser = AnonymousUser.get({
        uuid: uuid
      });

      if (!anonymousUser) {
        logger.info("anonymous user link not found: %s", link);
        res.status(404).send();
        return;
      }

      CallCtrl.handleDelete({
        callId: req.params.callId,
        reqData: req.body,
        reqUser: anonymousUser
      });

      res.status(200).send();
    });
  });

};
