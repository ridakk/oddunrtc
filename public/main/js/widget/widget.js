(function(window, document){

window.console.log("widget.js is loaded");

var div = document.createElement('div');
div.id = 'rdkkkk';
div.textContent = "First div";

document.getElementById("odun-rtc-video-widget").appendChild(div);

document.getElementById("rdkkkk").addEventListener("click", function(){
    div.innerHTML = Date().toString();
});

})(window, document);
