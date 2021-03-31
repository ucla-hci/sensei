//	.................................................................................................
//
//	visualizing device orientation related properties
//
//  by xac@ucla.edu, v2.0 03/2021
//
//  ref: https://developer.mozilla.org/en-US/docs/Web/API/Detecting_device_orientation
//
//	.................................................................................................

var SENSEI = SENSEI || {};

SENSEI.visualizations["orientation"] = function() {
  var canvas = $("#canvasVis");
  var positionInfo = canvas[0].getBoundingClientRect();
  var width = positionInfo.width;
  var height = positionInfo.height;
  var from = new paper.Point(width / 2, height / 2);

  // the range of different device orientations
  const MINBETA = -90;
  const MAXBETA = 90;
  const MINGAMMA = -90;
  const MAXGAMMA = 90;

  paper.setup(canvas[0]);

  // update visuals of a device orientation change
  SENSEI.updateOrientationVis = function(e) {
    paper.project.activeLayer.removeChildren();

    var xNormalized =
      (e.gamma - MINGAMMA) / (MAXGAMMA - MINGAMMA);
    var yNormalized = (e.beta - MINBETA) / (MAXBETA - MINBETA);

    // make the visual more obvious when the values are small
    xNormalized = 0.5 + (xNormalized - 0.5) * (1 + Math.abs(xNormalized - 0.5));
    yNormalized = 0.5 + (yNormalized - 0.5) * (1 + Math.abs(yNormalized - 0.5));

    var x = width * xNormalized;
    var y = height * yNormalized;

    var to = new paper.Point(x, y);
    var path = new paper.Path.Line(from, to);
    path.strokeColor = "black";

    // show info as label
    var marginText = to
      .subtract(from)
      .normalize()
      .multiply(25);
    var text = new paper.PointText(
      new paper.Point(
        Math.max(25, Math.min(x + marginText.x, width)),
        Math.max(25, Math.min(y + marginText.y, height))
      )
    );
    text.justification = "center";
    text.fillColor = "black";
    text.content =
      "beta: " +
      e.beta.toFixed(2) +
      "\ngamma: " +
      e.gamma.toFixed(2);
  };

  // add event handler
  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    DeviceMotionEvent.requestPermission()
      .then(permissionState => {
        if (permissionState === 'granted') {
          window.addEventListener('deviceorientation', SENSEI.updateOrientationVis);
        }
      })
      .catch(console.error);
  } else {
    // handle regular non iOS 13+ devices
  }
};

SENSEI.clearings["orientation"] = function() {
  paper.project.activeLayer.removeChildren();
  window.removeEventListener("deviceorientation", SENSEI.updateOrientationVis);
};
