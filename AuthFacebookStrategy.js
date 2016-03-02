var logger = require('bunyan').createLogger({
    name: 'AuthFacebookStrategy'
  }),
  passport = require('passport'),
  User = require('./models/User'),
  uuid = require('node-uuid'),
  FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: process.env.FACEBOOK_CLIENT_CALLBACKURL,
    profileFields: ['id', 'displayName', 'photos'],
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, done) {
    logger.info("facebook profile: %j", profile);

    // check if the user is already logged in
    if (!req.user) {

      // find the user in the database based on their facebook id
      User.findOne({
        'id': profile.id
      }, function(err, user) {

        // if there is an error, stop everything and return that
        // ie an error connecting to the database
        if (err)
          return done(err);

        // if the user is found, then log them in
        if (user) {
          return done(null, user); // user found, return that user
        } else {
          // if there is no user found with that github id
          var newUser = new User();

          newUser.uuid = uuid.v1();
          newUser.id = profile.id;
          newUser.link = "c2c_" + uuid.v1();
          newUser.type = "facebook";
          newUser.token = accessToken;
          newUser.username = profile.username;
          newUser.displayName = profile.displayName;
          newUser.photo = profile.photos[0].value;

          // save our user to the database
          newUser.save(function(err) {
            if (err)
              throw err;

            // if successful, return the new user
            return done(null, newUser);
          });
        }

      });

    } else {
      // user already exists and is logged in

      done(null, req.user);
    }

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
