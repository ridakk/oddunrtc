var logger = require('bunyan').createLogger({
    name: 'routes.AuthTwitter'
  }),
  passport = require('passport');

module.exports = function(app) {

  // we will call this to start the twitter Login process
  app.get('/auth/twitter', passport.authenticate('twitter'));

  // twitter will call this URL
  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
      failureRedirect: '/'
    }),
    function(req, res) {
      logger.info("redirect user to home: %j", req.user);
      res.redirect('/home');
    }
  );

};
