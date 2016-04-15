document.addEventListener('DOMContentLoaded', () => {
  var video = document.getElementById('video');
  canvas = document.getElementById('canvas');
  photo = document.getElementById('photo'),
    scores = {
      anger: [],
      contempt: [],
      disgust: [],
      fear: [],
      happiness: [],
      neutral: [],
      sadness: [],
      surprise: [],
    };

  navigator.webkitGetUserMedia({
    audio: false,
    video: true
  }, (stream) => {
    video.src = webkitURL.createObjectURL(stream)
    video.play();
  }, () => {})


  document.getElementsByTagName('button')[0].addEventListener("click", takepicture)

  function takepicture() {
    var context = canvas.getContext('2d');

    canvas.width = 320;
    canvas.height = 240;
    context.drawImage(video, 0, 0, 320, 240);

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

        jQuery.ajax({
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

            if (data[0] && data[0].scores && data[0].scores.anger) {
              scores.anger.push(data[0].scores.anger * 100);
              scores.contempt.push(data[0].scores.contempt * 100);
              scores.disgust.push(data[0].scores.disgust * 100);
              scores.fear.push(data[0].scores.fear * 100);
              scores.happiness.push(data[0].scores.happiness * 100);
              scores.neutral.push(data[0].scores.neutral * 100);
              scores.sadness.push(data[0].scores.sadness * 100);
              scores.surprise.push(data[0].scores.surprise * 100);

              function generateDrawingPoints(inputArray){
                var result = [];
                for (var i=0; i < inputArray.length; i++) {
                  if (inputArray.hasOwnProperty(i)) {
                    result.push([i, inputArray[i]])
                  }
                }
                return result;
              }

              var f = Flotr.draw(
                document.getElementsByClassName("flotr-container")[0], [{
                  data: generateDrawingPoints(scores.anger),
                  label: 'anger'
                }, {
                  data: generateDrawingPoints(scores.contempt),
                  label: 'contempt'
                }, {
                  data: generateDrawingPoints(scores.disgust),
                  label: 'disgust'
                }, {
                  data: generateDrawingPoints(scores.fear),
                  label: 'fear'
                }, {
                  data: generateDrawingPoints(scores.happiness),
                  label: 'happiness'
                }, {
                  data: generateDrawingPoints(scores.neutral),
                  label: 'neutral'
                }, {
                  data: generateDrawingPoints(scores.sadness),
                  label: 'sadness'
                }, {
                  data: generateDrawingPoints(scores.surprise),
                  label: 'surprise'
                }]);

              document.getElementsByClassName("emotion-anger photo")[0].style.width = data[0].scores.anger * 100 + "%";
              document.getElementsByClassName("emotion-contempt photo")[0].style.width = data[0].scores.contempt * 100 + "%";
              document.getElementsByClassName("emotion-disgust photo")[0].style.width = data[0].scores.disgust * 100 + "%";
              document.getElementsByClassName("emotion-fear photo")[0].style.width = data[0].scores.fear * 100 + "%";
              document.getElementsByClassName("emotion-happiness photo")[0].style.width = data[0].scores.happiness * 100 + "%";
              document.getElementsByClassName("emotion-neutral photo")[0].style.width = data[0].scores.neutral * 100 + "%";
              document.getElementsByClassName("emotion-sadness photo")[0].style.width = data[0].scores.sadness * 100 + "%";
              document.getElementsByClassName("emotion-surprise photo")[0].style.width = data[0].scores.surprise * 100 + "%";

              document.getElementsByClassName("emotion-anger")[0].style.width = math.median(scores.anger) + "%";
              document.getElementsByClassName("emotion-contempt")[0].style.width = math.median(scores.contempt) + "%";
              document.getElementsByClassName("emotion-disgust")[0].style.width = math.median(scores.disgust) + "%";
              document.getElementsByClassName("emotion-fear")[0].style.width = math.median(scores.fear) + "%";
              document.getElementsByClassName("emotion-happiness")[0].style.width = math.median(scores.happiness) + "%";
              document.getElementsByClassName("emotion-neutral")[0].style.width = math.median(scores.neutral) + "%";
              document.getElementsByClassName("emotion-sadness")[0].style.width = math.median(scores.sadness) + "%";
              document.getElementsByClassName("emotion-surprise")[0].style.width = math.median(scores.surprise) + "%";
            }
          })
          .fail(function() {
            alert("error");
          });
      };
      fileReader.readAsArrayBuffer(blob);
    });
  }

})
