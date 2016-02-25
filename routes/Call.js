var ioCtrl = require('./../controllers/SocketIoController');


// expose the routes to our app with module.exports
module.exports = function(app) {

  app.post('/call/:callId', function(request, response) {
    var data = request.body;
    console.log("/call post from %j", data);

    call.create({
      to: data.to,
      from: data.from
    }).then(function(params) {
      data.callId = params.callId;
      console.log("call success %j", params);

      if(ioCtrl.send(data.to, data)){
        response.status(200).send(JSON.stringify(data));
      }
      else {
        response.status(404).send();
      }
    });
  });

  app.put('/call/:callId', function(request, response) {
    var data = request.body;
    console.log("/call post from %j", data);

    if(ioCtrl.send(data.to, data)){
      response.status(200).send(JSON.stringify(data));
    }
    else {
      response.status(404).send();
    }
  });

  app.delete('/call/:callId', function(request, response) {
    var data = request.body;
    console.log("/call delete from %j", data);

    call.delete({
      callId: data.data.msg.callId
    });

    if(ioCtrl.send(data.to, data)){
      response.status(200).send(JSON.stringify(data));
    }
    else {
      response.status(404).send();
    }

  });

};
