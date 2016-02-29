var userContacts = require('./../models/UserContacts'),
  authCtrl = require('./../controllers/AuthController'),
  user = require('./../models/User');

module.exports = function(app) {

  app.post('/contacts', authCtrl.ensureAuthenticated, function(request, response) {
    var email = request.user.uuid;
    console.log("NOT IMPLEMENTED: /contacts post from %s", uuid);

    response.status(200).send();
  });

  app.get('/contacts/:uuid', authCtrl.ensureAuthenticated, function(request, response) {
    var contacts = [],
      uuid = request.user.uuid;
    console.log("NOT IMPLEMENTED: /contacts get from %s", uuid);

    response.status(200).send(JSON.stringify(contacts));

  });

};
