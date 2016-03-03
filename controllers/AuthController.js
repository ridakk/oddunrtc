var logger = require('bunyan').createLogger({
    name: 'controllers.AuthController'
  });

exports.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    // req.user is available for use here
    return next();
  }

  // denied. redirect to login
  logger.info("auth failure... %s", req.url);
  res.status(401).send();
};
