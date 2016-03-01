var logger = require('bunyan').createLogger({
    name: 'routes.Anonymous'
  }),
  User = require('./../models/User'),
  AnonymousUser = require('./../models/AnonymousUser'),
  uuid = require('node-uuid');

module.exports = function(app) {

  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================
  app.get('/a/:link/', function(req, res) {
    var link = req.params.link,
      anonymousUser;

    User.findOne({
      link: link
    }, function(err, user) {
      if (err) {
        logger.info("db error, cannot query link: %s", link);
        res.status(500).send();
        return;
      }

      if (!user) {
        console.log("user link not found: %s", link);
        logger.info(404).send();
        return;
      }

      anonymousUser = AnonymousUser.create({
        uuid: uuid.v4(),
        callingTo: user.uuid
      });

      res.render('pages/anonymous_login.ejs', {
        to: user.displayName || user.username || user.email,
        url: '/a/' + req.params.link + '/' + anonymousUser.uuid + '/home'
      });
    });
  });

  app.post('/a/:link/:uuid/home', function(req, res) {
    var link = req.params.link,
      uuid = req.params.uuid;

    User.findOne({
      link: link
    }, function(err, user) {
      if (err) {
        logger.info("db error, cannot query link: %s", link);
        res.status(500).send();
        return;
      }

      if (!user) {
        logger.info("user link not found: %s", link);
        res.status(404).send();
        return;
      }

      anonymousUser = AnonymousUser.get({
        uuid: uuid
      });

      if (!anonymousUser) {
        logger.info("anonymous user link not found: %s", link);
        res.status(404).send();
        return;
      }

      AnonymousUser.setKey({
        uuid: uuid,
        key: "displayName",
        value: req.body.username
      })

      res.render('pages/anonymous_home.ejs');
    });
  });

  app.get('/logout', function(req, res) {
    logger.info('logging out');
    req.logout();
    res.redirect('/');
  });

};
