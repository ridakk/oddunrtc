var userContacts = require('./../models/UserContacts'),
  authCtrl = require('./../controllers/AuthController'),
  user = require('./../models/User');

module.exports = function(app) {

  app.post('/contacts', authCtrl.ensureAuthenticated, function(request, response) {
    var email = request.body.email;
    console.log("/contacts post from %s", email);
    userContacts.findOne({
      email: email
    }, function(err, userContacts) {
      if (err) {
        console.log("%s contacts is NOT found", email);
        var newUserContacts = new userContacts({
          email: email,
          contacts: [request.body.contact]
        });
        newUserContacts.save(function(err) {
          if (err) {
            console.log(err);
            response.sendStatus(500);
            return;
          };

          console.log("%s contacts is created", email);
          response.sendStatus(201);
          return
        });

        return;
      };

      console.log("%s user is found: %j", email, userContacts);
      if (userContacts.contacts.indexOf("request.body.contact") !== -1) {
        console.log("%s contact exits", email);
        response.sendStatus(200);
        return
      }

      userContacts.contacts.push(request.body.contact);

      userContacts.save(function(err) {
        if (err) {
          console.log(err);
          response.sendStatus(500);
          return;
        };

        console.log("%s contacts is updated", email);
        response.sendStatus(200);
        return
      });
    });
  });

  app.get('/contacts/:email', authCtrl.ensureAuthenticated, function(request, response) {
    var contacts = [],
      email = request.body.email;
    console.log("/contacts get from %j", request.params);

    if (!email) {
      response.status(200).send(JSON.stringify(contacts));
      return
    }

    userContacts.findOne({
      email: email
    }, function(err, userContacts) {
      if (err) {
        console.log("%s contacts not found", email);
        response.status(200).send(JSON.stringify(contacts));
        return
      };

      if (!userContacts ||
        !userContacts.contacts ||
        !userContacts.contacts.length === 0) {
        response.status(200).send(JSON.stringify(contacts));
        return
      }

      user.find({
        $or: [{
          "email": {
            "$in": userContacts.contacts
          }
        }]
      }, function(err, users) {
        if (err) {
          console.log("RDK FAILED", err);
          return
        };

        console.log("RDK SUCC %j", users);
      });

      console.log("%s contacts found %s", userContacts.contacts);
      response.status(200).send(JSON.stringify(userContacts.contacts));
    });
  });

};
