//	.................................................................................................
//
//  demonstrating microphone
//
//  by xac@ucla.edu, v2.0 03/2021
//
//  ref: http://blog.teamtreehouse.com/accessing-the-device-camera-with-getusermedia
//       https://codepen.io/zapplebee/pen/gbNbZE
//
//	.................................................................................................

var SENSEI = SENSEI || {};

SENSEI.visualizations["microphone"] = function () {
  // detect if brower supports media capture
  if (navigator.mediaDevices.getUserMedia == undefined) {
    console.error("browser does not support getUserMedia");
    return;
  }

  // find the audio context object based on browsers
  var AudioContext =
    window.AudioContext || // Default
    window.webkitAudioContext || // Safari and old versions of Chrome
    false;

  // canvas info and setup
  var canvas = $("#canvasVis");
  var positionInfo = canvas[0].getBoundingClientRect();
  var top = positionInfo.top;
  var left = positionInfo.left;
  var width = positionInfo.width;
  var height = positionInfo.height;
  var margin = 10;
  paper.setup(canvas[0]);

  // request microphone
  navigator.mediaDevices.getUserMedia(
    // constraints
    {
      audio: true
    })
    // success callback
    .then(function (stream) {
      window.persistAudioStream = stream;
      var audioContext = new AudioContext();
      var audioStream = audioContext.createMediaStreamSource(stream);
      var analyzer = audioContext.createAnalyser();
      audioStream.connect(analyzer);
      analyzer.fftSize = 1024;
      var frequencyArray = new Uint8Array(analyzer.frequencyBinCount);
      var binWidth = (width - margin * 2) / analyzer.frequencyBinCount;

      // recurring drawing function for the visualization
      var draw = function () {
        SENSEI.requestId = requestAnimationFrame(draw);
        paper.project.activeLayer.removeChildren();
        analyzer.getByteFrequencyData(frequencyArray);
        for (var i = 0; i < frequencyArray.length; i++) {
          var binHeight = frequencyArray[i] * 2;
          var binLeft = margin + i * binWidth;
          var binTop = height - binHeight;
          new paper.Path.Rectangle(
            new paper.Point(binLeft, binTop),
            new paper.Size(binWidth, binHeight)
          ).fillColor =
            "black";
        }
      };

      // initial call
      draw();
    })
    // error callback
    .catch(function (err) {
      console.error(
        "The following error occurred when trying to use getUserMedia: " + err
      );
    });
};

SENSEI.clearings["microphone"] = function () {
  paper.project.activeLayer.removeChildren();
  cancelAnimationFrame(SENSEI.requestId);
};
