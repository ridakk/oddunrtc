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
var UserContacts = require('./UserContacts');
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

app.get('/', function(request, response) {
  response.render('pages/index')
});

app.post('/users', function(request, response) {
  console.log("/users post from %s", request.body.email);
  User.findOne({
    email: request.body.email
  }, function(err, user) {
    if (err) {
      console.log("%s user query error: %j", request.body.email, err);
    };

    if (!user) {
      console.log("%s user is NOT found, creating user", request.body.email);
      var newUser = new User(request.body);
      newUser.save(function(err) {
        if (err) {
          console.log(err);
          response.sendStatus(500);
          return;
        };

        console.log("%s user is created: %j", request.body.email, newUser);
        response.sendStatus(201);
        return
      });
      return;
    }

    console.log("%s user is found: %j", request.body.email, user);
    response.status(400).send(JSON.stringify({
      status: 400,
      errorCode: 1000,
      reasonText: request.body.email + " exists"
    }));
  });
});

app.post('/contacts', function(request, response) {
  console.log("/contacts post from %s", request.body.email);
  UserContacts.findOne({
    email: request.body.email
  }, function(err, userContacts) {
    if (err) {
      console.log("%s contacts is NOT found", request.body.email);
      var newUserContacts = new UserContacts({
        email: request.body.email,
        contacts: [request.body.contact]
      });
      newUserContacts.save(function(err) {
        if (err) {
          console.log(err);
          response.sendStatus(500);
          return;
        };

        console.log("%s contacts is created", request.body.email);
        response.sendStatus(201);
        return
      });

      return;
    };

    console.log("%s user is found: %j", request.body.email, userContacts);
    if (userContacts.contacts.indexOf("request.body.contact") !== -1) {
      console.log("%s contact exits", request.body.email);
      response.sendStatus(200);
      return
    }

    userContacts.contacts.push(request.body.contact);

    userContacts.save(function(err) {
      if (err) {
        console.log(err);
        response.sendStatus(500);
        return;
      };

      console.log("%s contacts is updated", request.body.email);
      response.sendStatus(200);
      return
    });
  });
});

app.get('/contacts/:email', function(request, response) {
  var contacts = [];
  console.log("/contacts get from %j", request.params);

  if (!request.params.email) {
    response.status(200).send(JSON.stringify(contacts));
    return
  }

  UserContacts.findOne({
    email: request.params.email
  }, function(err, userContacts) {
    if (err) {
      console.log("%s contacts not found", request.params.email);
      response.status(200).send(JSON.stringify(contacts));
      return
    };

    if (!userContacts ||
      !userContacts.contacts ||
      !userContacts.contacts.length === 0) {
      response.status(200).send(JSON.stringify(contacts));
      return
    }

    User.find({
      $or: [{
        "email": {
          "$in": userContacts.contacts
        }
      }]
    }, function(err, users) {
      if (err) {
        console.log("RDK FAILED", err);
        return
      };

      console.log("RDK SUCC %j", users);
    });

    console.log("%s contacts found %s", userContacts.contacts);
    response.status(200).send(JSON.stringify(userContacts.contacts));
  });
});

// Load socket io routes
require('./controllers/SocketIoController')(io, ionsp);
require('./routes/SocketIo')(io, ionsp);

// load call routes
require('./routes/Call')(app);





http.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
