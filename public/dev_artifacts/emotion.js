document.addEventListener('DOMContentLoaded', () => {
  var video = document.getElementById('video');
  canvas = document.getElementById('canvas');
  photo = document.getElementById('photo');

  navigator.webkitGetUserMedia({
    audio: false,
    video: true
  }, (stream) => {
    video.src = webkitURL.createObjectURL(stream)
  }, () => {})

  video.play();

  video.addEventListener('canplay', () => {
    setTimeout(()=>{
      takepicture()
    }, 500)
  });

  function takepicture() {
    var context = canvas.getContext('2d');
    canvas.width = 640;
    canvas.height = 480;
    context.drawImage(video, 0, 0, 640, 480);

    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);

    canvas.toBlob(function(blob) {
      var arrayBuffer;
      var fileReader = new FileReader();
      fileReader.onload = function() {

        function blobToFile(theBlob, fileName) {
          //A Blob() is almost a File() - it's just missing the two properties below which we will add
          theBlob.lastModifiedDate = new Date();
          theBlob.name = fileName;
          return theBlob;
        }

        file = blobToFile(this.result, 'screenshot');

        $.ajax({
            url: "https://api.projectoxford.ai/emotion/v1.0/recognize",
            beforeSend: function(xhrObj) {
              // Request headers
              xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
              xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "aa64048390bf4b53aff405263d099283");
            },
            type: "POST",
            // Request body
            data: file,
            processData: false
          })
          .done(function(data) {
            console.log(data);
            document.getElementsByClassName("emotion-anger")[0].style.width = data[0].scores.anger*100 + "%";
            document.getElementsByClassName("emotion-contempt")[0].style.width = data[0].scores.contempt*100 + "%";
            document.getElementsByClassName("emotion-disgust")[0].style.width = data[0].scores.disgust*100 + "%";
            document.getElementsByClassName("emotion-fear")[0].style.width = data[0].scores.fear*100 + "%";
            document.getElementsByClassName("emotion-happiness")[0].style.width = data[0].scores.happiness*100 + "%";
            document.getElementsByClassName("emotion-neutral")[0].style.width = data[0].scores.neutral*100 + "%";
            document.getElementsByClassName("emotion-sadness")[0].style.width = data[0].scores.sadness*100 + "%";
            document.getElementsByClassName("emotion-surprise")[0].style.width = data[0].scores.surprise*100 + "%";

            document.getElementsByClassName("fa")[0].style.display = "none"
          })
          .fail(function() {
            alert("error");
          });
      };
      fileReader.readAsArrayBuffer(blob);
    });
  }

})
