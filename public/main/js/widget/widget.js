(function(window, document) {

  window.console.log("widget.js is loaded");

  var styleTag = document.createElement("link");
  styleTag.rel = "stylesheet";
  styleTag.type = "text/css";
  styleTag.href = "http://localhost:5000/css/call.css";
  styleTag.media = "all";
  document.getElementsByTagName('head')[0].appendChild(styleTag);


  var styleTag = document.createElement("link");
  styleTag.rel = "stylesheet";
  styleTag.type = "text/css";
  styleTag.href = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css";
  styleTag.media = "all";
  document.getElementsByTagName('head')[0].appendChild(styleTag);


  var styleTag = document.createElement("link");
  styleTag.rel = "stylesheet";
  styleTag.type = "text/css";
  styleTag.href = "https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css";
  styleTag.media = "all";
  document.getElementsByTagName('head')[0].appendChild(styleTag);


  var div = document.createElement('div');
  div.id = 'rdkkkk';
  div.textContent = "First div";
  document.getElementById("odun-rtc-video-widget").appendChild(div);

  var form = document.createElement("form");
  form.setAttribute('method', "post");
  form.setAttribute('action', "http://localhost:5000/a/c2c_bc7ba9a0-dec6-11e5-8bac-753c65bebdb9");

  var fInputGroupDiv = document.createElement('div');
  fInputGroupDiv.className = "form-group input-group margin-bottom-sm";

  var span = document.createElement('span');
  span.className = "input-group-addon";
  var itag = document.createElement('i');
  itag.className = "fa fa-user-secret fa-fw";
  span.appendChild(itag);

  var input = document.createElement('input');
  input.type = "text";
  input.className = "form-control";
  input.name = "username";

  fInputGroupDiv.appendChild(span);
  fInputGroupDiv.appendChild(input);

  var button = document.createElement('button');
  button.type = "submit";
  button.className = "btn btn-warning btn-lg btn-block";

  form.appendChild(fInputGroupDiv);
  form.appendChild(button);

  document.getElementById("odun-rtc-video-widget").appendChild(form);

  document.getElementById("rdkkkk").addEventListener("click", function() {
    div.innerHTML = Date().toString();
  });

})(window, document);
