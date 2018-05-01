//	........................................................................................................
//
//
//
//  by xiangchen@acm.org, v1.0 04/2018
//
//
//	........................................................................................................

var SENSEI = SENSEI || {};

SENSEI.visualizations["camera"] = function() {
  // Request the camera.
  navigator.getUserMedia(
    // Constraints
    {
      video: true
    },
    // Success Callback
    function(localMediaStream) {
      // Get a reference to the video element on the page.
      var vid = document.getElementById("camera-stream");

      // Create an object URL for the video stream and use this
      // to set the video source.
      vid.src = window.URL.createObjectURL(localMediaStream);
    },
    // Error Callback
    function(err) {
      // Log the error to the console.
      console.log(
        "The following error occurred when trying to use getUserMedia: " + err
      );
    }
  );
};
