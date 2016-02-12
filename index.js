var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ionsp = io.of('/sockets');
var mongoose = require('mongoose');
var User = require('./User');
var UserContacts = require('./UserContacts');
var uuid = require('node-uuid');
var Q = require("q");
var Call = require('./Call');
var Sockets = require('./Sockets');

var connections = {};

require('dotenv').config();

mongoose.connect('mongodb://' + process.env.MONGO_USER + ':' + process.env.MONGO_PASSWORD + process.env.MONGO_URL);

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

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

app.post('/connections', function(request, response) {
  console.log("/connections post from %s", request.body.email);
  User.find({
    email: request.body.email
  }, function(err, user) {
    if (err) {
      console.log(err);
      response.sendStatus(403);
      return;
    };

    if (!connections[request.body.email]) {
      connections[request.body.email] = uuid.v1();
    }

    // object of the user
    response.json({
      "url": "/sockets",
      "uuid": connections[request.body.email]
    });
  });
});

app.post('/call', function(request, response) {
  var msg = request.body;
  console.log("/call post from %j", msg);

  Call.create({
    to: msg.to,
    from: msg.from
  }).then(function(params) {
    msg.callId = params.callId;
    console.log("call success %j", params);

    Sockets.getSocketUrl({
      owner: params.to
    }).then(function(socketUrl) {
      ionsp.to(socketUrl).emit('message', msg);
      response.status(201).send(JSON.stringify({
        callId: params.callId
      }));
    }, function() {
      response.status(404).send();
    });
  });
});

app.put('/call/:id', function(request, response) {
  var msg = request.body;
  console.log("/call/:id put from %j", msg);

  ionsp.to(Sockets.getSocketUrl({
    owner: msg.to
  })).emit('message', msg);

  response.status(200).send();
});

io.use(function(socket, next) {
  var params = JSON.parse(socket.handshake.query.serverparams);

  console.log("connections: %j", connections);
  console.log("io request from user: %s with uuid: %s", params.user, params.uuid);
  if (!params.user || !params.uuid || !connections[params.user] || connections[params.user] !== params.uuid) {
    console.log("not authorized");
    next(new Error('not authorized'));
  } else {
    Sockets.add({
      user: params.user,
      id: socket.id
    })

    next();
  }
});

ionsp.on('connection', function(socket) {
  console.log('a user connected with id %s', socket.id);
  socket.broadcast.emit('hi');
  socket.on('disconnect', function() {
    console.log('user disconnected with id %s', socket.id);
  });

  socket.on('message', function(msg) {
    console.log('message to: %s txt: %s', msg.to, msg.text);
    //ionsp.emit('chat message', msg);

    socket.broadcast.to(Sockets.getSocketUrl({
      owner: msg.to
    })).emit('chat message', msg);
  });
});

http.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
