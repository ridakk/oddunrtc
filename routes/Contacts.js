var logger = require('bunyan').createLogger({
    name: 'routes.Contacts'
  }),
  Contacts = require('./../models/Contacts'),
  ContactsCtrl = require('./../controllers/ContactsController'),
  AuthCtrl = require('./../controllers/AuthController'),
  User = require('./../models/User');

module.exports = function(app) {

  app.post('/contacts', AuthCtrl.ensureAuthenticated, function(req, res) {
    ContactsCtrl.add({
      uuid: req.user.uuid,
      contact_uuid: req.body.contact_uuid
    }).then(function(data) {
      res.status(data.httpCode).send();
    }, function(err) {
      res.status(err.httpCode).send(JSON.stringify(err));
    });
  });

  app.get('/contacts', AuthCtrl.ensureAuthenticated, function(req, res) {
    ContactsCtrl.get({
      uuid: req.user.uuid
    }).then(function(data) {
      res.status(data.httpCode).send(JSON.stringify(data.result));
    }, function(err) {
      res.status(err.httpCode).send(JSON.stringify(err));
    });
  });

  app.delete('/contacts', AuthCtrl.ensureAuthenticated, function(req, res) {
    ContactsCtrl.delete({
      uuid: req.user.uuid,
      contact_uuid: req.body.contact_uuid
    }).then(function(data) {
      res.status(data.httpCode).send();
    }, function(err) {
      res.status(err.httpCode).send(JSON.stringify(err));
    });
  });

};
