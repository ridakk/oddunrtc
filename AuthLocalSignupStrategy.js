var passport = require('passport'),
  User = require('./models/User'),
  uuid = require('node-uuid'),
  LocalStrategy = require('passport-local').Strategy;

passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
  },
  function(req, email, password, done) {
    // we are checking to see if the user trying to login already exists
    User.findOne({
      'email': email
    }, function(err, user) {
      // if there are any errors, return the error
      if (err)
        return done(err);

      // check to see if theres already a user with that email
      if (user) {
        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
      } else {

        // if there is no user with that email
        // create the user
        var newUser = new User();

        // set the user's local credentials
        newUser.uuid = uuid.v1();
        newUser.email = email;
        newUser.password = newUser.generateHash(password);

        // save the user
        newUser.save(function(err) {
          if (err)
            throw err;
          return done(null, newUser);
        });
      }
    });
  }));

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
