var logger = require('bunyan').createLogger({
    name: 'controllers.ContactsController'
  }),
  Contacts = require('./../models/Contacts'),
  User = require('./../models/User'),
  Q = require("q");

exports.add = function(params) {
  var deferred = Q.defer(),
    userToAdd;

  User.findOne({
    uuid: params.contact_uuid
  }, function(err, user) {
    if (err) {
      deferred.reject({
        httpCode: 500,
        errorCode: 2001,
        errorText: "db connection error"
      });
      return;
    }

    if (!user) {
      deferred.reject({
        httpCode: 404,
        errorCode: 2002,
        errorText: "user with " + params.contact_uuid + " not found"
      });
      return;
    }

    Contacts.findOne({
      uuid: params.uuid
    }, function(err, contacts) {
      if (err) {
        deferred.reject({
          httpCode: 500,
          errorCode: 2003,
          errorText: "db connection error"
        });
        return;
      }

      userToAdd = {
        uuid: user.uuid,
        photo: user.photo,
        displayName: user.displayName || user.username || user.email,
        type: user.type
      };

      if (!contacts) {
        var newContacts = new Contacts();


        newContacts.uuid = params.uuid;
        newContacts.friends = [userToAdd];

        newContacts.save(function(err) {
          if (err) {
            deferred.reject({
              httpCode: 500,
              errorCode: 2004,
              errorText: "db connection error"
            });
            return;
          }

          deferred.resolve({
            httpCode: 201
          });
        });
      } else {
        if (contacts.isFriendAvailable(params.contact_uuid)) {
          deferred.resolve({
            httpCode: 200
          });
        } else {
          contacts.friends.push(userToAdd);

          contacts.save(function(err) {
            if (err) {
              deferred.reject({
                httpCode: 500,
                errorCode: 2005,
                errorText: "db connection error"
              });
              return;
            }

            deferred.resolve({
              httpCode: 200
            });
          });
        }
      }
    });

  });

  return deferred.promise;
};

exports.get = function(params) {
  var deferred = Q.defer();
  Contacts.findOne({
    uuid: params.uuid
  }, function(err, contacts) {
    if (err) {
      deferred.reject({
        httpCode: 500,
        errorCode: 2006,
        errorText: "db connection error"
      });
      return;
    }


    if (!contacts) {
      deferred.reject({
        httpCode: 404,
        errorCode: 2007,
        errorText: "contacts not found"
      });
      return
    }

    deferred.resolve({
      httpCode: 200,
      result: contacts.friends
    });
  });

  return deferred.promise;
};

exports.delete = function(params) {
  var deferred = Q.defer();
  Contacts.findOne({
    uuid: params.uuid
  }, function(err, contacts) {
    if (err) {
      deferred.reject({
        httpCode: 500,
        errorCode: 2008,
        errorText: "db connection error"
      });
      return;
    }


    if (!contacts) {
      deferred.reject({
        httpCode: 404,
        errorCode: 2009,
        errorText: "contacts not found"
      });
      return
    }

    if (!contacts.isFriendAvailable(params.contact_uuid)) {
      deferred.resolve({
        httpCode: 200
      });
    } else {
      contacts.removeFriend(params.contact_uuid);
      contacts.save(function(err) {
        if (err) {
          deferred.reject({
            httpCode: 500,
            errorCode: 2010,
            errorText: "db connection error"
          });
          return;
        }

        deferred.resolve({
          httpCode: 200
        });
      });

    }
  });

  return deferred.promise;
};
