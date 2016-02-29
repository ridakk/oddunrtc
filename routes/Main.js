module.exports = function(app) {

  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================
  app.get('/', function(req, res) {
    res.render('pages/login.ejs'); // load the index.ejs file
  });

  app.get('/home', function(req, res) {
    res.render('pages/home.ejs'); // load the index.ejs file
  });

  // =====================================
  // LOGIN ===============================
  // =====================================
  // show the login form
  app.get('/login', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('pages/login.ejs', {
      message: req.flash('loginMessage')
    });
  });

  // =====================================
  // SIGNUP ==============================
  // =====================================
  // show the signup form
  app.get('/signup', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('pages/signup.ejs', {
      message: req.flash('signupMessage')
    });
  });

  app.get('/logout', function(req, res) {
    console.log('logging out');
    req.logout();
    res.redirect('/');
  });

};
