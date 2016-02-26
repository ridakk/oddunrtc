var passport = require('passport');

module.exports = function(app) {

  // we will call this to start the GitHub Login process
  app.get('/auth/github', passport.authenticate('github'));

  // GitHub will call this URL
  app.get('/auth/github/callback', passport.authenticate('github', {
      failureRedirect: '/'
    }),
    function(req, res) {
      res.redirect('/#/home');
    }
  );

};
