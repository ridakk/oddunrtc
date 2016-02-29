var authCtrl = require('./../controllers/AuthController'),
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
      displayName: request.user.displayName,
      username: request.user.username,
      email: request.user.email,
      photo: request.user.photo
    });
  });

};
