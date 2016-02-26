module.exports = function(app) {

  app.get('/', function(request, response) {
    response.render('pages/index')
  });

  app.get('/logout', function(req, res) {
    console.log('logging out');
    req.logout();
    res.redirect('/');
  });

};
