var logger = require('bunyan').createLogger({
    name: 'routes.Users'
  }),
  User = require('./models/User');

  exports.findUsers = function(params) {
    User.find( { username: {$regex : ".*params.name.*"}},
  function(err, users) {
    if (err) {
      logger.info("db error, cannot query user: %s", params.name);
      response.status(500).send();
      return;
    }

    if (!users) {
      console.log("user not found: %s", params.name);
      logger.error(404).send();
      return;
    }

    return users;
  }
);
  };
