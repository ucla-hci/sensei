//	........................................................................................................
//
//  demonstrating the video feed from camera
//
//  by xiangchen@acm.org, v1.0 04/2018
//
//  ref: http://blog.teamtreehouse.com/accessing-the-device-camera-with-getusermedia
//
//	........................................................................................................

var SENSEI = SENSEI || {};

SENSEI.visualizations["camera"] = function() {
  if (navigator.getUserMedia) {
    // for this demo, replace canvas tag with video tag
    SENSEI.canvas = $("#canvasVis");
    var positionInfo = SENSEI.canvas[0].getBoundingClientRect();
    var width = positionInfo.width;
    var height = positionInfo.height;
    SENSEI.canvas.remove();
    SENSEI.videoCamera = $("<video autoplay playsinline></video>");
    SENSEI.videoCamera.css("max-width", width);
    SENSEI.videoCamera.css("max-height", height);
    $("#tdDemo").append(SENSEI.videoCamera);

    // request the camera.
    navigator.getUserMedia(
      // constraints
      {
        video: true
      },
      // success Callback
      function(localMediaStream) {
        SENSEI.videoCamera.prop("srcObject", localMediaStream);
      },
      // error Callback
      function(err) {
        console.err(
          "The following error occurred when trying to use getUserMedia: " + err
        );
      }
    );
  } else {
    console.err("browser does not support getUserMedia");
  }
};

SENSEI.clearings["camera"] = function() {
  // restore the canvas
  SENSEI.videoCamera.remove();
  $("#tdDemo").append(SENSEI.canvas);
};
