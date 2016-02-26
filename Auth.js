var passport = require('passport'),
  GithubStrategy = require('passport-github').Strategy;

passport.use(new GithubStrategy({
    clientID: "211bb79a90de4749b7e0",
    clientSecret: "aea9cfa37ca4e06a71963820e3d695d1b04fa9aa",
    callbackURL: "http://localhost:5000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

passport.serializeUser(function(user, done) {
  // placeholder for custom user serialization
  // null is for errors
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  // placeholder for custom user deserialization.
  // maybe you are going to get the user from mongo by id?
  // null is for errors
  done(null, user);
});
