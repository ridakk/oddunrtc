var user = require('./../models/User');

module.exports = function(app) {

  app.post('/users', function(request, response) {
    var email = request.body.email;
    console.log("/users post from %s", email);
    user.findOne({
      email: email
    }, function(err, user) {
      if (err) {
        console.log("%s user query error: %j", email, err);
      };

      if (!user) {
        console.log("%s user is NOT found, creating user", email);
        var newUser = new user(request.body);
        newUser.save(function(err) {
          if (err) {
            console.log(err);
            response.sendStatus(500);
            return;
          };

          console.log("%s user is created: %j", email, newUser);
          response.sendStatus(201);
          return
        });
        return;
      }

      console.log("%s user is found: %j", email, user);
      response.status(400).send(JSON.stringify({
        status: 400,
        errorCode: 1000,
        reasonText: email + " exists"
      }));
    });
  });

};
