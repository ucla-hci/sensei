//	........................................................................................................
//
//  demonstrating the video feed from camera
//
//  by xiangchen@acm.org, v1.0 05/2018
//
//  ref: http://blog.teamtreehouse.com/accessing-the-device-camera-with-getusermedia
//
//	........................................................................................................

var SENSEI = SENSEI || {};

SENSEI.visualizations["front camera"] = function() {
  SENSEI.showCameraFeed("user");
};

SENSEI.visualizations["back camera"] = function() {
  SENSEI.showCameraFeed("environment");
};

SENSEI.showCameraFeed = function(facingMode) {
  // detect if brower supports media capture
  if (navigator.getUserMedia == undefined) {
    console.err("browser does not support getUserMedia");
    return;
  }

  // for this demo, replace canvas tag with video tag
  SENSEI.canvas = $("#canvasVis");
  var positionInfo = SENSEI.canvas[0].getBoundingClientRect();
  var width = positionInfo.width;
  var height = positionInfo.height;
  SENSEI.canvas.remove();
  SENSEI.videoCamera = $("<video autoplay playsinline></video>");
  SENSEI.videoCamera.css("width", width);

  $("#tdDemo").append(SENSEI.videoCamera);

  // request the camera.
  navigator.getUserMedia(
    // constraints
    {
      video: { facingMode: { exact: facingMode } }
    },
    // success callback
    function(stream) {
      SENSEI.videoCamera.prop("srcObject", stream);
    },
    // error callback
    function(err) {
      console.error(
        "The following error occurred when trying to use getUserMedia: " + err
      );
    }
  );
};

SENSEI.clearings["front camera"] = SENSEI.clearings[
  "back camera"
] = function() {
  // restore the canvas
  SENSEI.videoCamera.remove();
  $("#tdDemo").append(SENSEI.canvas);
};
