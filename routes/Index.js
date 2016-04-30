module.exports = function(app) {

  // =====================================
  // EMOTION TEST PAGE ========
  // =====================================
  app.get('/emotion', function(req, res) {
    res.render('pages/emotion.ejs');
  });

  app.get('/odd_test', function(req, res) {
    res.render('pages/odd_test.ejs');
  });

  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================
  app.get('/', function(req, res) {
    res.render('pages/login.ejs', {
      message: req.flash('loginMessage')
    });
  });

  app.get('/home', function(req, res) {
    res.render('pages/home_' + process.env.PRIV_ENV + '.ejs');
  });

  // =====================================
  // LOGIN ===============================
  // =====================================
  app.get('/login', function(req, res) {
    res.render('pages/login.ejs', {
      message: req.flash('loginMessage')
    });
  });

  // =====================================
  // SIGNUP ==============================
  // =====================================
  // show the signup form
  app.get('/signup', function(req, res) {
    res.render('pages/signup.ejs', {
      message: req.flash('signupMessage')
    });
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

};
