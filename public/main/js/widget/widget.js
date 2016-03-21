(function(window, document) {
  var button = document.createElement('button');
  button.type = "submit";
  button.id = "odun-rtc-video-widget-button";
  button.innerHTML = 'Bizi Arayın!!!';
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
    window.open('http://young-tundra-62254.herokuapp.com/a/c2c_d4b1dd30-eed1-11e5-9790-d3dd181bee66', '_blank', 'width=640,height=480');
  });

})(window, document);
