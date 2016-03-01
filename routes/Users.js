var logger = require('bunyan').createLogger({
    name: 'routes.Users'
  }),
  User = require('./../models/User');

module.exports = function(app) {
  app.get('/users/:name', function(req, res) {
    User.find().and([{
        $or: [{
          username: {
            $regex: ".*" + req.params.name + ".*"
          }
        }, {
          displayName: {
            $regex: ".*" + req.params.name + ".*"
          }
        }, {
          email: {
            $regex: ".*" + req.params.name + ".*"
          }
        }]
      }])
      .exec(function(err, users) {
        if (err) {
          logger.info("db error, cannot query user: %s", req.params.name);
          res.status(500).send();
          return;
        }

        if (!users) {
          logger.info("user not found: %s", req.params.name);
          res.error(404).send();
          return;
        }

        res.status(200).send(JSON.stringify(users));
      });
  });
};
