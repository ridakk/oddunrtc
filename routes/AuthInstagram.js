var logger = require('bunyan').createLogger({
    name: 'routes.AuthInstagram'
  }),
  passport = require('passport');

module.exports = function(app) {

  // we will call this to start the Instagram Login process
  app.get('/auth/instagram', passport.authenticate('instagram'));

  // Instagram will call this URL
  app.get('/auth/instagram/callback', passport.authenticate('instagram', {
      failureRedirect: '/'
    }),
    function(req, res) {
      logger.info("redirect user to home: %j", req.user);
      res.redirect('/home');
    }
  );

};
