//	.................................................................................................
//
//  demonstrating the video feed from camera
//
//  by xac@ucla.edu, v2.0 03/2021
//
//  ref: http://blog.teamtreehouse.com/accessing-the-device-camera-with-getusermedia
//
//	.................................................................................................

var SENSEI = SENSEI || {};

SENSEI.visualizations["front camera"] = function () {
  SENSEI.showCameraFeed("user");
};

SENSEI.visualizations["back camera"] = function () {
  SENSEI.showCameraFeed("environment");
};

SENSEI.showCameraFeed = function (facingMode) {
  // detect if brower supports media capture
  if (navigator.mediaDevices.getUserMedia == undefined) {
    console.error("browser does not support getUserMedia");
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

  // request the camera
  navigator.mediaDevices.getUserMedia(
    // constraints
    {
      video: { facingMode: { exact: facingMode } }
    })
    .then(function (stream) {
      /* use the stream */
      SENSEI.videoCamera.prop("srcObject", stream);
    })
    .catch(function (err) {
      /* handle the error */
      console.error(
        "The following error occurred when trying to use getUserMedia: " + err
      );
    });
};

SENSEI.clearings["front camera"] = SENSEI.clearings[
  "back camera"
] = function () {
  // restore the canvas
  SENSEI.videoCamera.remove();
  $("#tdDemo").append(SENSEI.canvas);
};
