var express = require('express');
var compression = require('compression');
var favicon = require('serve-favicon');
var passport = require('passport');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var flash = require('connect-flash');

require('dotenv').config();

mongoose.connect('mongodb://' + process.env.MONGO_USER + ':' + process.env.MONGO_PASSWORD + process.env.MONGO_URL);

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(compression());
app.use(favicon(__dirname + '/public/favicon.ico'));

// required for passport
app.use(session({
  secret: 'odun-rtc-rdk-session',
  resave: true,
  saveUninitialized: true
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());

console.log("running in " + process.env.PRIV_ENV + " mode");

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// load auth strategies
require('./auth/AuthGithubStrategy');
require('./auth/AuthFacebookStrategy');
require('./auth/AuthTwitterStrategy');
require('./auth/AuthGoogleStrategy');
require('./auth/AuthInstagramStrategy');
require('./auth/AuthLocalLoginStrategy');
require('./auth/AuthLocalSignupStrategy');

// load app routes
require('./routes/Index')(app);
require('./routes/Anonymous')(app);

// load users routes
require('./routes/Users')(app);

// load contacts routes
require('./routes/Contacts')(app);

// load connection routes
require('./routes/Connection')(app);

// load auth routes
require('./routes/AuthGithub')(app);
require('./routes/AuthFacebook')(app);
require('./routes/AuthTwitter')(app);
require('./routes/AuthGoogle')(app);
require('./routes/AuthInstagram')(app);
require('./routes/AuthLocal')(app);

// load contact routes
require('./routes/Contacts')(app);

// Load socket io routes
require('./controllers/SocketIoController')(io);
require('./routes/SocketIo')(io);

// load call routes
require('./routes/Call')(app);
require('./routes/AnonymousCall')(app);

http.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
