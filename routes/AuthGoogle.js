var logger = require('bunyan').createLogger({
    name: 'routes.AuthGoogle'
  }),
  passport = require('passport');

module.exports = function(app) {

  // we will call this to start the Google Login process
  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile']
  }));

  // Google will call this URL
  app.get('/auth/google/callback', passport.authenticate('google', {
      failureRedirect: '/'
    }),
    function(req, res) {
      logger.info("redirect user to home: %j", req.user);
      res.redirect('/home');
    }
  );

};
