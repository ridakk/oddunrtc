var user = require('./../models/User'),
  uuid = require('node-uuid'),
  authCtrl = require('./../controllers/AuthController'),
  connections = require('./../models/Connections');

module.exports = function(app) {

  app.post('/connections', authCtrl.ensureAuthenticated, function(request, response) {
    var email = request.body.email;

    console.log("/connections post from %s", email);
    user.find({
      email: email
    }, function(err, user) {
      if (err) {
        console.log(err);
        response.sendStatus(403);
        return;
      };

      connections.add(email, uuid.v1());

      // object of the user
      response.json({
        "url": "/sockets",
        "uuid": connections.get(email)
      });
    });
  });

};
