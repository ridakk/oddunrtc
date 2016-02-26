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
var ionsp = io.of('/sockets');
var mongoose = require('mongoose');
var User = require('./models/User');
var UserContacts = require('./models/UserContacts');
var uuid = require('node-uuid');

var connections = {};

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
app.use(session({ secret: 'odun-rtc-rdk-session' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

require('./Auth');

// load main app routes
require('./routes/Main')(app);

// load github auth routes
require('./routes/AuthGithub')(app);

// load user routes
require('./routes/Users')(app);

// load contact routes
require('./routes/Contacts')(app);

// Load socket io routes
require('./controllers/SocketIoController')(io, ionsp);
require('./routes/SocketIo')(io, ionsp);

// load call routes
require('./routes/Call')(app);

// load connection routes
require('./routes/Connection')(app);

http.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
