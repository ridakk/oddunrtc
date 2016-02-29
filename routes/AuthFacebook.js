var passport = require('passport');

module.exports = function(app) {

  // we will call this to start the Facebook Login process
  app.get('/auth/facebook', passport.authenticate('facebook'));

  // GitHub will call this URL
  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
      failureRedirect: '/'
    }),
    function(req, res) {
      console.log("redirect user to home: %j", req.user);
      res.redirect('/home');
    }
  );

};
