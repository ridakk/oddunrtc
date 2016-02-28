exports.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    // req.user is available for use here
    return next();
  }

  // denied. redirect to login
  console.log("auth failure... %s", req.url);
  res.redirect('/')
};
