$( document ).ready(function() {
  var email;
    console.log( "ready!" );

    $('#login #submit_button').on("click",function(){
        console.log("clıcked");
        $.post( window.location.origin + "/users", {
          email:$('#login #email').val(),
          password: $('#login #password').val()})
          .done(function(){
            console.log( "login ok!" );

            $("#login").hide();
            $("#content").show();
            email = $('#login #email').val();

            $.post( window.location.origin +"/connections", {email:email})
              .done(function(data){

                var socket = io(data.url, {
                    query: 'serverparams=' + JSON.stringify({
                      user: email,
                      uuid: data.uuid
                    })
                });
                $('#content button').on("click",function(){
                  socket.emit('chat message', "test2@test.com",$('#m').val());
                  $('#m').val('');
                  return false;
                });
                socket.on('chat message', function(msg){
                  $('#messages').append($('<li>').text(msg));
                });
              });
          }).fail(function(){
            console.log( "login failed!" );
          });
      });
});
