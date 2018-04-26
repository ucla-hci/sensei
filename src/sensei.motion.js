//	........................................................................................................
//
//	visualizing device motion related properties
//
//  by xiangchen@acm.org, v1.0 04/2018
//
//  ref: https://developer.mozilla.org/en-US/docs/Web/API/Detecting_device_orientation
//
//	........................................................................................................

var SENSEI = SENSEI || {};

SENSEI.MAXNUMSAMPLES = 128;
SENSEI.pointerSample = 0;

SENSEI.accelXs = [];
SENSEI.accelYs = [];
SENSEI.accelZs = [];

SENSEI.rotAlphas = [];
SENSEI.rotBetas = [];
SENSEI.rotGammas = [];

SENSEI.visualizations["motion"] = function() {
  var canvas = $("#canvasVis");
  var positionInfo = canvas[0].getBoundingClientRect();
  var top = positionInfo.top;
  var left = positionInfo.left;
  var width = positionInfo.width;

  const MAXACCELERATION = 9.8;
  const MAXROTATIONRATE = 180;
  const MARGIN = 5;
  const MAXY = Math.min(positionInfo.height / 12 - MARGIN, 32);

  paper.setup(canvas[0]);

  // recurring routine to draw line chart
  var drawLineChart = function(name, data, ptr, y0, color, maxVal) {
    var x0 = MARGIN;
    var dx = width / SENSEI.MAXNUMSAMPLES;

    var text = new paper.PointText(new paper.Point(x0 + MARGIN, y0 - MAXY));
    text.justification = "left";
    text.fillColor = color;
    text.content = name + ": " + data[(ptr + 1) % data.length].toFixed(2);

    var segments = [];
    for (var i = 0; i < data.length - 1; i++) {
      var idx = (ptr + i) % data.length;
      segments.push(
        new paper.Point(x0 + i * dx, y0 - data[idx] / maxVal * MAXY)
      );
    }

    new paper.Path(segments).strokeColor = color;
  };

  // storing samples into arrays
  var storeSamples = function(sample, storage, pointer) {
    if (pointer >= storage.length) storage.push(sample);
    else storage[pointer] = sample;
  };

  // update motion vis
  SENSEI.updateMotionVis = function(e) {
    var acceleration = e.originalEvent.acceleration;
    storeSamples(acceleration.x, SENSEI.accelXs, SENSEI.pointerSample);
    storeSamples(acceleration.y, SENSEI.accelYs, SENSEI.pointerSample);
    storeSamples(acceleration.z, SENSEI.accelZs, SENSEI.pointerSample);

    var rotationRate = e.originalEvent.rotationRate;
    storeSamples(rotationRate.alpha, SENSEI.rotAlphas, SENSEI.pointerSample);
    storeSamples(rotationRate.beta, SENSEI.rotBetas, SENSEI.pointerSample);
    storeSamples(rotationRate.gamma, SENSEI.rotGammas, SENSEI.pointerSample);

    SENSEI.pointerSample = (SENSEI.pointerSample + 1) % SENSEI.MAXNUMSAMPLES;

    // update vis
    paper.project.activeLayer.removeChildren();

    drawLineChart(
      "x",
      SENSEI.accelXs,
      SENSEI.pointerSample,
      MAXY + MARGIN * 2,
      "red",
      MAXACCELERATION
    );

    drawLineChart(
      "y",
      SENSEI.accelYs,
      SENSEI.pointerSample,
      MAXY * 3 + MARGIN * 3,
      "green",
      MAXACCELERATION
    );

    drawLineChart(
      "z",
      SENSEI.accelZs,
      SENSEI.pointerSample,
      MAXY * 5 + MARGIN * 4,
      "blue",
      MAXACCELERATION
    );

    drawLineChart(
      "alpha",
      SENSEI.rotAlphas,
      SENSEI.pointerSample,
      MAXY * 7 + MARGIN * 5,
      "cyan",
      MAXROTATIONRATE
    );

    drawLineChart(
      "beta",
      SENSEI.rotBetas,
      SENSEI.pointerSample,
      MAXY * 9 + MARGIN * 6,
      "purple",
      MAXROTATIONRATE
    );

    drawLineChart(
      "gamma",
      SENSEI.rotGammas,
      SENSEI.pointerSample,
      MAXY * 11 + MARGIN * 7,
      "orange",
      MAXROTATIONRATE
    );
  };
  // add event handler
  $(window).on("devicemotion", SENSEI.updateMotionVis);
};

SENSEI.clearings["motion"] = function() {
  paper.project.activeLayer.removeChildren();
  $(window).off("devicemotion", SENSEI.updateMotionVis);
};
