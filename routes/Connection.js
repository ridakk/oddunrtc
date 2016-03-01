var logger = require('bunyan').createLogger({
    name: 'routes.Connection'
  }),
  authCtrl = require('./../controllers/AuthController'),
  User = require('./../models/User'),
  AnonymousUser = require('./../models/AnonymousUser'),
  jwt = require('jsonwebtoken');

module.exports = function(app) {

  app.get('/connection', authCtrl.ensureAuthenticated, function(request, response) {
    // we are sending the profile in the token
    var token = jwt.sign(request.user, "odun-rtc-jwt-session", {
      expiresIn: 60 * 1000 * 5
    });

    response.json({
      token: token,
      uuid: request.user.uuid,
      type: request.user.type,
      link: request.user.link,
      displayName: request.user.displayName,
      username: request.user.username,
      email: request.user.email,
      photo: request.user.photo
    });
  });

  app.get('/a/:link/:uuid/connection', function(req, res) {
    var link = req.params.link,
      uuid = req.params.uuid,
      anonymousUser,
      token;

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

      logger.debug("anonymous user: %j", anonymousUser);

      token = jwt.sign(anonymousUser, "odun-rtc-jwt-session", {
        expiresIn: 60 * 1000 * 5
      });

      res.json({
        token: token,
        uuid: anonymousUser.uuid,
        type: anonymousUser.type,
        displayName: anonymousUser.displayName,
        callTo: anonymousUser.callingTo
      });
    });
  });

};
