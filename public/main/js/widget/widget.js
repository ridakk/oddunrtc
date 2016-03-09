(function() {
  var button = document.createElement('button');
  button.type = "submit";
  button.id = "odun-rtc-video-widget-button";
  button.innerHTML = 'Need help !!!';
  button.style.cssText = "width: %100;" +
    "height: 30px;" +
    "border: 1px solid transparent;" +
    "border-radius: 6px;" +
    "background-color: #5cb85c;" +
    "border-color: #4cae4c;" +
    "margin: 5px 0px 0px 0px;" +
    "font-size: 18px;" +
    "line-height: 1.3333333;" +
    "color: white;";

  document.getElementById("odun-rtc-video-widget").appendChild(button);

  document.getElementById("odun-rtc-video-widget-button").addEventListener("click", function() {
    window.open('http://localhost:5000/a/c2c_bc7ba9a0-dec6-11e5-8bac-753c65bebdb9', '_blank', 'width=640,height=480');
  });

})();
